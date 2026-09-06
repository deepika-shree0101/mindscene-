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

  // References for Three.js instance
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const hotspotMeshesRef = useRef<{ mesh: THREE.Group; hotspot: Hotspot }[]>([]);
  const currentHoveredIdRef = useRef<string | null>(null);

  // Mutable callbacks/props
  const onHotspotClickRef = useRef(onHotspotClick);
  onHotspotClickRef.current = onHotspotClick;
  const onProximityChangeRef = useRef(onProximityChange);
  onProximityChangeRef.current = onProximityChange;

  // Drag-to-look rotation
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lonRef = useRef<number>(0);
  const latRef = useRef<number>(0);
  const targetLonRef = useRef<number>(0);
  const targetLatRef = useRef<number>(0);

  // 1. Initial Scene Setup (runs ONCE on mount)
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // A. Scene & Soft Eerie Atmospheric Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0202, 0.012);
    sceneRef.current = scene;

    // B. Camera
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;
    scene.add(camera);

    // C. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // D. Lighting
    const ambientLight = new THREE.AmbientLight(0x2a0808, 0.45);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Camera Point Light (ensures nearby evidence is never pitch black)
    const cameraPointLight = new THREE.PointLight(0xffedd5, 1.2, 35);
    cameraPointLight.position.set(0, 0, 0);
    camera.add(cameraPointLight);
    pointLightRef.current = cameraPointLight;

    // 3D Volumetric Spotlight (Investigator's Flashlight)
    const spotLight = new THREE.SpotLight(0xffffff, 6.0);
    spotLight.position.set(0, 0, 0);
    spotLight.angle = Math.PI / 4.5;
    spotLight.penumbra = 0.5;
    spotLight.decay = 1.2;
    spotLight.distance = 50;
    spotLight.castShadow = true;
    scene.add(spotLight);
    spotLightRef.current = spotLight;

    const lightTarget = new THREE.Object3D();
    scene.add(lightTarget);
    spotLight.target = lightTarget;

    // E. Build 3D Room Box
    const roomGeo = new THREE.BoxGeometry(32, 20, 32);
    const roomMat = new THREE.MeshStandardMaterial({
      color: 0x160404,
      roughness: 0.8,
      metalness: 0.2,
      side: THREE.BackSide,
    });
    const roomMesh = new THREE.Mesh(roomGeo, roomMat);
    roomMesh.receiveShadow = true;
    scene.add(roomMesh);

    // Hardwood Floor
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1f0707,
      roughness: 0.6,
      metalness: 0.3,
      side: THREE.DoubleSide,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -9.9;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // 3D Mahogany Study Desk
    const deskGeo = new THREE.BoxGeometry(10, 4.8, 5);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x2e0808,
      roughness: 0.5,
      metalness: 0.4,
    });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, -7.5, -9);
    desk.castShadow = true;
    desk.receiveShadow = true;
    scene.add(desk);

    // 3D Bookshelf Structure
    const shelfGeo = new THREE.BoxGeometry(12, 16, 2.5);
    const shelfMat = new THREE.MeshStandardMaterial({
      color: 0x240606,
      roughness: 0.85,
    });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(12, -1.8, 0);
    shelf.rotation.y = -Math.PI / 2;
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    scene.add(shelf);

    // 3D Gothic Window with Rainy Moonlight
    const windowGeo = new THREE.PlaneGeometry(8, 12);
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x0a1c36,
      emissive: 0x0f2b54,
      emissiveIntensity: 0.35,
      roughness: 0.1,
      metalness: 0.8,
    });
    const gothicWindow = new THREE.Mesh(windowGeo, windowMat);
    gothicWindow.position.set(-15.8, 1, 0);
    gothicWindow.rotation.y = Math.PI / 2;
    scene.add(gothicWindow);

    // F. Floating 3D Dust Particles
    const particleCount = 350;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 28;
      particlePositions[i + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i + 2] = (Math.random() - 0.5) * 28;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfca5a5,
      size: 0.09,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // G. Animation Loop
    let animationId: number;
    const raycaster = new THREE.Raycaster();
    const centerScreen = new THREE.Vector2(0, 0);

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Smooth inertia rotation
      lonRef.current += (targetLonRef.current - lonRef.current) * 0.12;
      latRef.current += (targetLatRef.current - latRef.current) * 0.12;
      latRef.current = Math.max(-80, Math.min(80, latRef.current));

      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      const targetX = 50 * Math.sin(phi) * Math.cos(theta);
      const targetY = 50 * Math.cos(phi);
      const targetZ = 50 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetX, targetY, targetZ);
      lightTarget.position.set(targetX, targetY, targetZ);

      // Rotate 3D Hotspot markers
      hotspotMeshesRef.current.forEach(({ mesh }) => {
        mesh.lookAt(camera.position);
        mesh.rotation.z += 0.02;
        const scale = 1 + Math.sin(Date.now() * 0.005) * 0.15;
        mesh.scale.set(scale, scale, scale);
      });

      // Drift dust particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.01;
        if (positions[i] < -8) positions[i] = 8;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Raycast proximity check
      raycaster.setFromCamera(centerScreen, camera);
      let closestDist = 999;
      let foundHover: any = null;

      hotspotMeshesRef.current.forEach(({ mesh, hotspot }) => {
        const rayDist = raycaster.ray.distanceToPoint(mesh.position);
        if (rayDist < 3.8 && rayDist < closestDist) {
          closestDist = rayDist;
          foundHover = hotspot;
        }
      });

      // Only update state when hovered target actually changes (prevents 60fps React re-renders)
      const newHoverId = foundHover ? (foundHover as Hotspot).id : null;
      if (newHoverId !== currentHoveredIdRef.current) {
        currentHoveredIdRef.current = newHoverId;
        setHoveredHotspot(foundHover as Hotspot | null);
      }

      if (onProximityChangeRef.current) {
        onProximityChangeRef.current(closestDist);
      }

      renderer.render(scene, camera);
    };

    animate();

    // H. Resize Handler
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
  }, []); // Run once!

  // 2. Light Updates (Night Vision & UV Mode)
  useEffect(() => {
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = isNightVisionOn ? 1.4 : 0.45;
      ambientLightRef.current.color.setHex(isUvMode ? 0x3b0764 : 0x2a0808);
    }

    if (spotLightRef.current) {
      spotLightRef.current.color.setHex(isUvMode ? 0xa855f7 : 0xffffff);
      spotLightRef.current.intensity = isUvMode ? 8.5 : 6.0;
    }

    if (pointLightRef.current) {
      pointLightRef.current.color.setHex(isUvMode ? 0xc084fc : 0xffedd5);
    }
  }, [isNightVisionOn, isUvMode]);

  // 3. Hotspot Markers Generation on Scene / Clue changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Clear old markers
    hotspotMeshesRef.current.forEach(({ mesh }) => {
      scene.remove(mesh);
    });
    hotspotMeshesRef.current = [];

    // Spawn new 3D Hotspot markers
    activeScene.hotspots.forEach((hs) => {
      const normX = (hs.xPercent / 100 - 0.5) * 22;
      const normY = -(hs.yPercent / 100 - 0.5) * 12 - 1.5;
      const normZ = -11 + Math.sin(hs.xPercent * 0.1) * 3;

      const group = new THREE.Group();
      group.position.set(normX, normY, normZ);

      const isDiscovered = hs.linkedClueId && discoveredClueIds.includes(hs.linkedClueId);

      // Core sphere
      const sphereGeo = new THREE.SphereGeometry(0.45, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: isDiscovered ? 0x22c55e : isUvMode ? 0xc084fc : 0xef4444,
        emissive: isDiscovered ? 0x15803d : isUvMode ? 0x9333ea : 0xb91c1c,
        emissiveIntensity: 0.6,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);

      // Pulsing outer ring
      const ringGeo = new THREE.RingGeometry(0.65, 0.85, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isDiscovered ? 0x4ade80 : isUvMode ? 0xe879f9 : 0xf87171,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      group.add(ring);

      scene.add(group);
      hotspotMeshesRef.current.push({ mesh: group, hotspot: hs });
    });
  }, [activeScene, discoveredClueIds, isUvMode]);

  // Mouse Drag Look Handlers
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
        onHotspotClickRef.current(targetItem.hotspot);
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
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden bg-black"
    >
      {/* 3D Crosshair Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
        <div className={`w-8 h-8 rounded-full border border-dashed transition-all duration-300 ${
          hoveredHotspot 
            ? 'border-red-400 scale-125 animate-ping' 
            : isUvMode ? 'border-purple-500/60' : 'border-red-500/50'
        }`} />
        <div className={`w-1.5 h-1.5 rounded-full ${hoveredHotspot ? 'bg-red-400' : 'bg-white/90'}`} />
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
      <div className="absolute top-4 right-4 z-10 pointer-events-none bg-black/75 border border-red-900/70 px-3 py-1.5 rounded-xl text-[10px] font-mono text-red-300 backdrop-blur-sm shadow-md">
        <span>🎮 360° DRAG TO LOOK // CLICK 3D MARKERS</span>
      </div>
    </div>
  );
};
