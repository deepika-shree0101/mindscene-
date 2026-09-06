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

// Generate rich 360-degree forensic equirectangular environment texture
const generate360Panorama = (visualTheme: string, isUv: boolean): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const w = canvas.width;
  const h = canvas.height;

  // 1. Base Wall & Ambient Palette
  if (isUv) {
    // UV Forensic Ultraviolet Mode
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0f051d');
    grad.addColorStop(0.5, '#1e0b36');
    grad.addColorStop(0.7, '#120424');
    grad.addColorStop(1, '#080112');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else if (visualTheme.includes('balcony')) {
    // Stormy Balcony / Rain Cliff
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#050c1a');
    skyGrad.addColorStop(0.4, '#0f172a');
    skyGrad.addColorStop(0.7, '#1e293b');
    skyGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);
  } else {
    // Victorian Manor Study / Detective Office
    const roomGrad = ctx.createLinearGradient(0, 0, 0, h);
    roomGrad.addColorStop(0, '#1c0a0a');
    roomGrad.addColorStop(0.3, '#2d1111');
    roomGrad.addColorStop(0.65, '#3b1818');
    roomGrad.addColorStop(0.7, '#1a0909');
    roomGrad.addColorStop(1, '#0e0404');
    ctx.fillStyle = roomGrad;
    ctx.fillRect(0, 0, w, h);
  }

  // 2. Hardwood / Stone Floor with Perspective Planks
  const floorTop = h * 0.65;
  const floorGrad = ctx.createLinearGradient(0, floorTop, 0, h);
  floorGrad.addColorStop(0, isUv ? '#130421' : '#220b0b');
  floorGrad.addColorStop(1, isUv ? '#07010e' : '#110303');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, floorTop, w, h - floorTop);

  // Floor Planks / Tiles
  ctx.strokeStyle = isUv ? 'rgba(168, 85, 247, 0.15)' : 'rgba(185, 28, 28, 0.2)';
  ctx.lineWidth = 2;
  for (let x = 0; x < w; x += 120) {
    ctx.beginPath();
    ctx.moveTo(x, floorTop);
    ctx.lineTo(x + (x - w / 2) * 0.8, h);
    ctx.stroke();
  }

  // 3. Ornate Gothic Wall Panels & Wainscoting
  ctx.fillStyle = isUv ? 'rgba(88, 28, 135, 0.25)' : 'rgba(69, 10, 10, 0.4)';
  for (let x = 40; x < w; x += 220) {
    ctx.fillRect(x, h * 0.35, 180, h * 0.28);
    ctx.strokeStyle = isUv ? 'rgba(192, 132, 252, 0.3)' : 'rgba(239, 68, 68, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, h * 0.35, 180, h * 0.28);
  }

  // 4. Large Gothic Arched Windows (Cold Blue Moonlight & Rain)
  const windowCenters = [w * 0.2, w * 0.8];
  windowCenters.forEach((cx) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, h * 0.3, 110, Math.PI, 0, false);
    ctx.rect(cx - 110, h * 0.3, 220, 180);
    ctx.fillStyle = isUv ? '#1e1b4b' : '#0f2b48';
    ctx.fill();

    // Window Glass Moonlight Glow
    const moonGlow = ctx.createRadialGradient(cx, h * 0.35, 10, cx, h * 0.35, 140);
    moonGlow.addColorStop(0, isUv ? 'rgba(192, 132, 252, 0.6)' : 'rgba(147, 197, 253, 0.55)');
    moonGlow.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = moonGlow;
    ctx.fill();

    // Window Grids & Rain Streaks
    ctx.strokeStyle = isUv ? '#312e81' : '#1e3a5f';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.19);
    ctx.lineTo(cx, h * 0.48);
    ctx.moveTo(cx - 110, h * 0.34);
    ctx.lineTo(cx + 110, h * 0.34);
    ctx.stroke();
    ctx.restore();
  });

  // 5. Grand Study Desk & Bookshelf Centerpiece (Center Vision)
  const deskX = w * 0.5 - 280;
  const deskY = h * 0.58;
  // Desk Body
  ctx.fillStyle = isUv ? '#1e0d36' : '#3f1212';
  ctx.fillRect(deskX, deskY, 560, 110);
  ctx.strokeStyle = isUv ? '#a855f7' : '#991b1b';
  ctx.lineWidth = 3;
  ctx.strokeRect(deskX, deskY, 560, 110);

  // Desk Desk-Mat & Spilled Wine / Evidence Area
  ctx.fillStyle = isUv ? '#2e1065' : '#581c1c';
  ctx.fillRect(deskX + 120, deskY + 10, 320, 75);

  // 6. Warm Fireplace / Ambient Hearth (Left wall)
  const fireX = w * 0.05;
  const fireY = h * 0.45;
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(fireX, fireY, 180, 160);
  const fireGlow = ctx.createRadialGradient(fireX + 90, fireY + 120, 10, fireX + 90, fireY + 120, 100);
  fireGlow.addColorStop(0, isUv ? 'rgba(168, 85, 247, 0.8)' : 'rgba(249, 115, 22, 0.85)');
  fireGlow.addColorStop(0.5, isUv ? 'rgba(126, 34, 206, 0.4)' : 'rgba(234, 88, 12, 0.4)');
  fireGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = fireGlow;
  ctx.fillRect(fireX, fireY, 180, 160);

  // 7. Police Caution Tape Stripes
  ctx.save();
  ctx.translate(deskX - 50, deskY + 120);
  ctx.rotate(-0.06);
  ctx.fillStyle = isUv ? 'rgba(168, 85, 247, 0.9)' : '#eab308';
  ctx.fillRect(0, 0, 680, 22);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('CRIME SCENE // DO NOT CROSS // FORENSIC EVIDENCE // CIB UNIT 09', 20, 16);
  ctx.restore();

  // 8. UV Mode Special Hidden Forensic Revelations
  if (isUv) {
    // Fluorescent glowing latent fingerprints & footprints
    ctx.fillStyle = '#c084fc';
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 15;

    // Glowing footprints on the floor
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.ellipse(deskX + 60 + i * 70, floorTop + 60 + i * 35, 14, 24, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glowing latent chemical splatter near the desk
    for (let j = 0; j < 12; j++) {
      ctx.beginPath();
      ctx.arc(deskX + 220 + (j * 17) % 120, deskY + 40 + (j * 23) % 40, 4 + (j % 5), 0, Math.PI * 2);
      ctx.fill();
    }

    // Hidden secret symbols on wall
    ctx.font = 'bold 18px monospace';
    ctx.fillText('⚠ DOSE 2.5mg — DR. V.', deskX + 160, deskY - 30);
    ctx.shadowBlur = 0;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.needsUpdate = true;
  return texture;
};

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

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const hotspotMeshesRef = useRef<{ mesh: THREE.Group; hotspot: Hotspot }[]>([]);
  const currentHoveredIdRef = useRef<string | null>(null);

  // Props refs to avoid stale closures in animation loop
  const onHotspotClickRef = useRef(onHotspotClick);
  onHotspotClickRef.current = onHotspotClick;
  const onProximityChangeRef = useRef(onProximityChange);
  onProximityChangeRef.current = onProximityChange;

  // First-person rotation refs
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lonRef = useRef<number>(0);
  const latRef = useRef<number>(0);
  const targetLonRef = useRef<number>(0);
  const targetLatRef = useRef<number>(0);

  // 1. Initial Scene Setup (Runs once)
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // A. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // B. First-Person Camera
    const camera = new THREE.PerspectiveCamera(72, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);
    camera.rotation.order = 'YXZ';
    cameraRef.current = camera;
    scene.add(camera);

    // C. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0202, 1.0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // D. 360° Equirectangular Panoramic Skybox Environment (Native Three.js Background)
    const initialTexture = generate360Panorama(activeScene.visualTheme || 'manor-study', isUvMode);
    initialTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = initialTexture;

    // Double-sided spherical backup mesh (guarantees 100% visibility even if shader background glitches)
    const sphereGeo = new THREE.SphereGeometry(200, 60, 40);
    const sphereMat = new THREE.MeshBasicMaterial({
      map: initialTexture,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);
    sphereMeshRef.current = sphereMesh;

    // E. Stable Ambient Light & Point Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const cameraPointLight = new THREE.PointLight(0xffedd5, 1.5, 50);
    cameraPointLight.position.set(0, 0, 0);
    camera.add(cameraPointLight);

    // F. Floating Atmospheric Dust Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 40;
      particlePositions[i + 1] = (Math.random() - 0.5) * 20;
      particlePositions[i + 2] = (Math.random() - 0.5) * 40;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfca5a5,
      size: 0.12,
      transparent: true,
      opacity: 0.6,
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
      lonRef.current += (targetLonRef.current - lonRef.current) * 0.18;
      latRef.current += (targetLatRef.current - latRef.current) * 0.18;
      latRef.current = Math.max(-85, Math.min(85, latRef.current));

      // Euler YXZ rotation completely eliminates Gimbal Lock singularities
      camera.rotation.y = THREE.MathUtils.degToRad(-lonRef.current);
      camera.rotation.x = THREE.MathUtils.degToRad(latRef.current);
      camera.rotation.z = 0;

      // Animate 3D Hotspot beacons using Quaternion copying (100% stable, zero gimbal lock)
      const now = Date.now();
      hotspotMeshesRef.current.forEach(({ mesh }) => {
        mesh.quaternion.copy(camera.quaternion);
        const pulse = 1 + Math.sin(now * 0.006) * 0.18;
        mesh.scale.set(pulse, pulse, pulse);
      });

      // Drift dust particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.012;
        if (positions[i] < -10) positions[i] = 10;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Proximity & Target acquisition raycasting
      raycaster.setFromCamera(centerScreen, camera);
      let closestDist = 999;
      let foundHover: Hotspot | null = null;

      hotspotMeshesRef.current.forEach((item) => {
        const rayDist = raycaster.ray.distanceToPoint(item.mesh.position);
        if (rayDist < 4.5 && rayDist < closestDist) {
          closestDist = rayDist;
          foundHover = item.hotspot;
        }
      });

      const newHoverId: string | null = foundHover ? (foundHover as Hotspot).id : null;
      if (newHoverId !== currentHoveredIdRef.current) {
        currentHoveredIdRef.current = newHoverId;
        setHoveredHotspot(foundHover);
      }

      if (onProximityChangeRef.current) {
        onProximityChangeRef.current(closestDist);
      }

      renderer.render(scene, camera);
    };

    animate();

    // H. Responsive Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      if (w === 0 || h === 0) return;
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
  }, []);

  // 2. Global Window Pointer Drag Listeners (smooth, impossible to stick or jump)
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetLonRef.current += deltaX * 0.22;
      targetLatRef.current += deltaY * 0.22;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  // 3. Update Texture on Theme / UV mode change
  useEffect(() => {
    if (!sceneRef.current) return;
    const newTexture = generate360Panorama(activeScene.visualTheme || 'manor-study', isUvMode);
    newTexture.mapping = THREE.EquirectangularReflectionMapping;
    sceneRef.current.background = newTexture;

    if (sphereMeshRef.current) {
      const mat = sphereMeshRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        if (mat.map) mat.map.dispose();
        mat.map = newTexture;
        mat.needsUpdate = true;
      }
    }
  }, [activeScene, isUvMode, isNightVisionOn]);

  // 4. Build 3D Evidence Hotspots in World Space
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove old hotspots
    hotspotMeshesRef.current.forEach(({ mesh }) => scene.remove(mesh));
    hotspotMeshesRef.current = [];

    // Spawn 3D Evidence Hotspots
    activeScene.hotspots.forEach((hs) => {
      const group = new THREE.Group();

      // Convert 2D percent coordinates to 3D spherical positions around the player
      const phi = THREE.MathUtils.degToRad((hs.yPercent / 100) * 120 + 30);
      const theta = THREE.MathUtils.degToRad((hs.xPercent / 100 - 0.5) * 140);
      const radius = 18;

      const posX = radius * Math.sin(phi) * Math.sin(theta);
      const posY = radius * Math.cos(phi) - 2;
      const posZ = -radius * Math.sin(phi) * Math.cos(theta);

      group.position.set(posX, posY, posZ);

      const isDiscovered = hs.linkedClueId && discoveredClueIds.includes(hs.linkedClueId);

      // Core Glowing Marker Sphere
      const sphereGeo = new THREE.SphereGeometry(0.55, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: isDiscovered ? 0x22c55e : isUvMode ? 0xc084fc : 0xef4444,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);

      // Pulsing Outer Reticle Ring
      const ringGeo = new THREE.RingGeometry(0.75, 0.95, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isDiscovered ? 0x4ade80 : isUvMode ? 0xe879f9 : 0xf87171,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      group.add(ring);

      scene.add(group);
      hotspotMeshesRef.current.push({ mesh: group, hotspot: hs });
    });
  }, [activeScene, discoveredClueIds, isUvMode]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
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
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden bg-black touch-none"
    >
      {/* Cinematic Forensic Flashlight Beam Vignette */}
      <div
        className={`absolute inset-0 pointer-events-none z-10 transition-colors duration-500 ${
          isUvMode
            ? 'bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12)_0%,rgba(59,7,100,0.4)_55%,rgba(15,5,29,0.85)_100%)]'
            : isNightVisionOn
            ? 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.15)_60%,rgba(0,0,0,0.45)_100%)]'
            : 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0.35)_45%,rgba(0,0,0,0.85)_100%)] mix-blend-multiply'
        }`}
      />

      {/* 3D Crosshair Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex items-center justify-center">
        <div
          className={`w-8 h-8 rounded-full border border-dashed transition-all duration-300 ${
            hoveredHotspot
              ? 'border-red-400 scale-125 animate-ping'
              : isUvMode
              ? 'border-purple-400/70'
              : 'border-red-500/60'
          }`}
        />
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            hoveredHotspot ? 'bg-red-400' : isUvMode ? 'bg-purple-300' : 'bg-white/90'
          }`}
        />
      </div>

      {/* Target Focus HUD Card */}
      {hoveredHotspot && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none bg-black/90 border-2 border-red-500/80 p-3.5 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.5)] text-center animate-in fade-in zoom-in-95 duration-150">
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
      <div className="absolute top-4 right-4 z-20 pointer-events-none bg-black/80 border border-red-900/70 px-3 py-1.5 rounded-xl text-[10px] font-mono text-red-300 backdrop-blur-sm shadow-md">
        <span>🎮 360° PANORAMIC 3D ROOM // DRAG TO LOOK // CLICK BEACONS</span>
      </div>
    </div>
  );
};
