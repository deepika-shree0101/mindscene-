import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { CrimeScene, Hotspot } from '../types';
import { sound } from '../utils/soundEngine';

interface ThreeSceneRoomProps {
  activeScene: CrimeScene;
  discoveredClueIds: string[];
  isNightVisionOn: boolean;
  isUvMode: boolean;
  onHotspotClick: (hotspot: Hotspot) => void;
  onProximityChange?: (closestDist: number) => void;
}

export const ThreeSceneRoom: React.FC<ThreeSceneRoomProps> = ({
  activeScene,
  discoveredClueIds,
  isNightVisionOn,
  isUvMode,
  onHotspotClick,
  onProximityChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot | null>(null);

  // References to keep mutable Three.js objects across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const hotspotMeshesRef = useRef<{ mesh: THREE.Group; hotspot: Hotspot }[]>([]);

  // Drag-to-look rotation angles (Spherical coordinates)
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lonRef = useRef<number>(0);
  const latRef = useRef<number>(0);
  const targetLonRef = useRef<number>(0);
  const targetLatRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040101, 0.035);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0); // Investigator standing at room center
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x1a0505, isNightVisionOn ? 1.2 : 0.08);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // 3D Volumetric Spotlight (Investigator's Flashlight)
    const spotLight = new THREE.SpotLight(
      isUvMode ? 0xa855f7 : 0xffffff,
      isUvMode ? 8.0 : 5.5
    );
    spotLight.position.set(0, 0, 0);
    spotLight.angle = Math.PI / 5.5;
    spotLight.penumbra = 0.6;
    spotLight.decay = 1.5;
    spotLight.distance = 45;
    spotLight.castShadow = true;
    scene.add(spotLight);
    spotLightRef.current = spotLight;

    // Flashlight target
    const lightTarget = new THREE.Object3D();
    scene.add(lightTarget);
    spotLight.target = lightTarget;

    // 5. Build 3D Room Geometry (Inverted Box Room)
    const roomGeo = new THREE.BoxGeometry(30, 18, 30);
    // Invert faces so texture/color is on the inside
    const roomMat = new THREE.MeshStandardMaterial({
      color: 0x110404,
      roughness: 0.85,
      metalness: 0.15,
      side: THREE.BackSide,
    });
    const roomMesh = new THREE.Mesh(roomGeo, roomMat);
    roomMesh.receiveShadow = true;
    scene.add(roomMesh);

    // Floor Rug / Hardwood Pattern
    const floorGeo = new THREE.PlaneGeometry(28, 28);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x180606,
      roughness: 0.7,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -8.9;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // 3D Mahogany Study Desk / Table
    const deskGeo = new THREE.BoxGeometry(10, 4.5, 5);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x220505,
      roughness: 0.6,
      metalness: 0.3,
    });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, -6.6, -9);
    desk.castShadow = true;
    desk.receiveShadow = true;
    scene.add(desk);

    // Bookshelf Structure
    const shelfGeo = new THREE.BoxGeometry(12, 14, 2.5);
    const shelfMat = new THREE.MeshStandardMaterial({
      color: 0x1a0404,
      roughness: 0.9,
    });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(11, -1.8, 0);
    shelf.rotation.y = -Math.PI / 2;
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    scene.add(shelf);

    // Gothic Window with Rain
    const windowGeo = new THREE.PlaneGeometry(8, 10);
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x050d1a,
      emissive: 0x0a1c36,
      emissiveIntensity: 0.25,
      roughness: 0.1,
      metalness: 0.8,
    });
    const gothicWindow = new THREE.Mesh(windowGeo, windowMat);
    gothicWindow.position.set(-14.8, 1, 0);
    gothicWindow.rotation.y = Math.PI / 2;
    scene.add(gothicWindow);

    // 6. Floating 3D Dust Particles
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 26;
      particlePositions[i + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i + 2] = (Math.random() - 0.5) * 26;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: isUvMode ? 0xc084fc : 0xfca5a5,
      size: 0.08,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Place 3D Interactive Hotspot Markers
    hotspotMeshesRef.current = [];
    activeScene.hotspots.forEach((hs) => {
      // Map 2D percentage coordinates to 3D room coordinates
      const normX = (hs.xPercent / 100 - 0.5) * 20;
      const normY = -(hs.yPercent / 100 - 0.5) * 10 - 2;
      const normZ = -10 + Math.sin(hs.xPercent) * 4;

      const group = new THREE.Group();
      group.position.set(normX, normY, normZ);

      // Core pulsating marker sphere
      const isDiscovered = hs.linkedClueId && discoveredClueIds.includes(hs.linkedClueId);
      const sphereGeo = new THREE.SphereGeometry(0.4, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: isDiscovered ? 0x22c55e : isUvMode ? 0xc084fc : 0xef4444,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);

      // Outer pulsing halo ring
      const ringGeo = new THREE.RingGeometry(0.6, 0.75, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isDiscovered ? 0x4ade80 : isUvMode ? 0xe879f9 : 0xf87171,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      group.add(ring);

      scene.add(group);
      hotspotMeshesRef.current.push({ mesh: group, hotspot: hs });
    });

    // 8. Animation & Render Loop
    let animationId: number;
    const raycaster = new THREE.Raycaster();
    const centerScreen = new THREE.Vector2(0, 0);

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Smooth inertia rotation
      lonRef.current += (targetLonRef.current - lonRef.current) * 0.1;
      latRef.current += (targetLatRef.current - latRef.current) * 0.1;
      latRef.current = Math.max(-80, Math.min(80, latRef.current));

      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      const targetX = 50 * Math.sin(phi) * Math.cos(theta);
      const targetY = 50 * Math.cos(phi);
      const targetZ = 50 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetX, targetY, targetZ);
      lightTarget.position.set(targetX, targetY, targetZ);

      // Rotate and pulse 3D Hotspot markers
      hotspotMeshesRef.current.forEach(({ mesh }) => {
        mesh.lookAt(camera.position);
        mesh.rotation.z += 0.02;
        const scale = 1 + Math.sin(Date.now() * 0.005) * 0.15;
        mesh.scale.set(scale, scale, scale);
      });

      // Slowly drift dust particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.01;
        if (positions[i] < -7) positions[i] = 7;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Proximity & Raycast check from center of crosshair / flashlight
      raycaster.setFromCamera(centerScreen, camera);
      let closestDistance = 999;
      let foundHover: Hotspot | null = null;

      hotspotMeshesRef.current.forEach(({ mesh, hotspot }) => {
        const rayDist = raycaster.ray.distanceToPoint(mesh.position);
        if (rayDist < 3.5 && rayDist < closestDistance) {
          closestDistance = rayDist;
          foundHover = hotspot;
        }
      });

      setHoveredHotspot(foundHover);
      if (onProximityChange) {
        onProximityChange(closestDistance);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [activeScene, isNightVisionOn, isUvMode, discoveredClueIds]);

  // Mouse Drag / Touch Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    targetLonRef.current += deltaX * 0.25;
    targetLatRef.current += deltaY * 0.25;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const clickableObjects = hotspotMeshesRef.current.map((item) => item.mesh.children[0]);
    const intersects = raycaster.intersectObjects(clickableObjects);

    if (intersects.length > 0) {
      const clickedMeshGroup = intersects[0].object.parent;
      const targetItem = hotspotMeshesRef.current.find((item) => item.mesh === clickedMeshGroup);
      if (targetItem) {
        sound.playFlashlightClick();
        onHotspotClick(targetItem.hotspot);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden"
    >
      {/* 3D Crosshair Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
        <div className={`w-8 h-8 rounded-full border border-dashed transition-all duration-300 ${
          hoveredHotspot 
            ? 'border-red-400 scale-125 animate-ping' 
            : isUvMode ? 'border-purple-500/50' : 'border-red-500/40'
        }`} />
        <div className={`w-1.5 h-1.5 rounded-full ${hoveredHotspot ? 'bg-red-400' : 'bg-white/80'}`} />
      </div>

      {/* Target Focus HUD Card */}
      {hoveredHotspot && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-black/90 border-2 border-red-500/80 p-3.5 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.5)] text-center animate-in fade-in zoom-in-95 duration-150">
          <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest block mb-0.5">
            🎯 3D FORENSIC TARGET ACQUIRED
          </span>
          <h4 className="text-sm font-creepster font-bold text-white tracking-wide">
            {hoveredHotspot.title}
          </h4>
          <span className="text-[11px] font-mono text-slate-300 mt-1 block">
            CLICK TO EXAMINE // {hoveredHotspot.description}
          </span>
        </div>
      )}

      {/* 3D Drag Navigation Helper Tag */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none bg-black/70 border border-red-900/60 px-3 py-1.5 rounded-xl text-[10px] font-mono text-red-300/80 backdrop-blur-sm">
        <span>🎮 360° DRAG TO LOOK // CLICK 3D MARKERS</span>
      </div>
    </div>
  );
};
