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

  const isCrypt = visualTheme.includes('crypt');
  const isCyber = visualTheme.includes('cyber') || visualTheme.includes('vault');
  const isShip = visualTheme.includes('ship');
  const isBalcony = visualTheme.includes('balcony');

  // 1. Base Wall & Ambient Palette (Rich, vibrant atmospheric tones - NEVER pure black)
  if (isUv) {
    // UV Forensic Ultraviolet Mode
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1e0b36');
    grad.addColorStop(0.4, '#2e1065');
    grad.addColorStop(0.65, '#3b0764');
    grad.addColorStop(1, '#1e0838');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else if (isCyber) {
    // Cyberpunk Mainframe / Laser Vault
    const cyberGrad = ctx.createLinearGradient(0, 0, 0, h);
    cyberGrad.addColorStop(0, '#020617');
    cyberGrad.addColorStop(0.3, '#082f49');
    cyberGrad.addColorStop(0.65, '#0f172a');
    cyberGrad.addColorStop(1, '#020617');
    ctx.fillStyle = cyberGrad;
    ctx.fillRect(0, 0, w, h);
  } else if (isCrypt) {
    // Ancient Underground Crypt / Altar / Catacombs
    const cryptGrad = ctx.createLinearGradient(0, 0, 0, h);
    cryptGrad.addColorStop(0, '#1c1917');
    cryptGrad.addColorStop(0.35, '#292524');
    cryptGrad.addColorStop(0.7, '#1c1917');
    cryptGrad.addColorStop(1, '#0c0a09');
    ctx.fillStyle = cryptGrad;
    ctx.fillRect(0, 0, w, h);
  } else if (isShip) {
    // Maritime Freighter Wheelhouse / Engine Room / Hold
    const shipGrad = ctx.createLinearGradient(0, 0, 0, h);
    shipGrad.addColorStop(0, '#0f172a');
    shipGrad.addColorStop(0.4, '#1e293b');
    shipGrad.addColorStop(0.7, '#334155');
    shipGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = shipGrad;
    ctx.fillRect(0, 0, w, h);
  } else if (isBalcony) {
    // Stormy Balcony / Rain Cliff / Rooftop
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#0a192f');
    skyGrad.addColorStop(0.4, '#172554');
    skyGrad.addColorStop(0.7, '#1e3a8a');
    skyGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);
  } else {
    // Victorian Manor Study / Detective Office
    const roomGrad = ctx.createLinearGradient(0, 0, 0, h);
    roomGrad.addColorStop(0, '#381212');
    roomGrad.addColorStop(0.3, '#4f1a1a');
    roomGrad.addColorStop(0.65, '#5c1d1d');
    roomGrad.addColorStop(0.7, '#3b1212');
    roomGrad.addColorStop(1, '#2a0c0c');
    ctx.fillStyle = roomGrad;
    ctx.fillRect(0, 0, w, h);
  }

  // 2. Flooring Layer
  const floorTop = h * 0.62;
  const floorGrad = ctx.createLinearGradient(0, floorTop, 0, h);

  if (isCyber) {
    // Neon grid glass floor
    floorGrad.addColorStop(0, '#0c4a6e');
    floorGrad.addColorStop(0.5, '#075985');
    floorGrad.addColorStop(1, '#0369a1');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorTop, w, h - floorTop);

    // Glowing Cyan Circuit Grids
    ctx.strokeStyle = isUv ? 'rgba(192, 132, 252, 0.4)' : 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2;
    for (let x = 0; x < w; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, floorTop);
      ctx.lineTo(x + (x - w / 2) * 1.1, h);
      ctx.stroke();
    }
    for (let y = floorTop; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  } else if (isCrypt) {
    // Ancient stone catacomb pavers
    floorGrad.addColorStop(0, '#292524');
    floorGrad.addColorStop(0.5, '#1c1917');
    floorGrad.addColorStop(1, '#0c0a09');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorTop, w, h - floorTop);

    ctx.strokeStyle = isUv ? 'rgba(192, 132, 252, 0.3)' : 'rgba(168, 162, 158, 0.25)';
    ctx.lineWidth = 3;
    for (let x = 0; x < w; x += 110) {
      ctx.beginPath();
      ctx.moveTo(x, floorTop);
      ctx.lineTo(x + (x - w / 2) * 0.9, h);
      ctx.stroke();
    }
  } else if (isShip) {
    // Riveted industrial steel deck plates
    floorGrad.addColorStop(0, '#334155');
    floorGrad.addColorStop(0.5, '#1e293b');
    floorGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorTop, w, h - floorTop);

    ctx.strokeStyle = isUv ? 'rgba(192, 132, 252, 0.35)' : 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 3;
    for (let x = 0; x < w; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x, floorTop);
      ctx.lineTo(x + (x - w / 2) * 0.9, h);
      ctx.stroke();
    }
  } else {
    // Hardwood Parquet Floor with Warm Mahogany Planks
    floorGrad.addColorStop(0, isUv ? '#2a0845' : '#5c1d1d');
    floorGrad.addColorStop(0.4, isUv ? '#1e0638' : '#4a1515');
    floorGrad.addColorStop(1, isUv ? '#260640' : '#381010');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorTop, w, h - floorTop);

    ctx.strokeStyle = isUv ? 'rgba(192, 132, 252, 0.35)' : 'rgba(248, 113, 113, 0.35)';
    ctx.lineWidth = 3;
    for (let x = 0; x < w; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, floorTop);
      ctx.lineTo(x + (x - w / 2) * 0.9, h);
      ctx.stroke();
    }
  }

  // 3. Wall Features & Atmospheric Details
  if (isCyber) {
    // Towering Supercomputer Blades with Blinking LEDs
    for (let x = 40; x < w; x += 220) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x, h * 0.28, 170, h * 0.33);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, h * 0.28, 170, h * 0.33);

      // Blinking status LEDs (cyan, amber, magenta)
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 5; c++) {
          const ledColor = (r + c) % 3 === 0 ? '#38bdf8' : (r + c) % 3 === 1 ? '#f59e0b' : '#ec4899';
          ctx.fillStyle = ledColor;
          ctx.fillRect(x + 20 + c * 28, h * 0.32 + r * 38, 8, 8);
        }
      }
    }
  } else if (isCrypt) {
    // Gothic Vault Arches & Torch Glows
    for (let x = 60; x < w; x += 320) {
      // Arched alcoves
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + 90, h * 0.32, 70, Math.PI, 0, false);
      ctx.rect(x + 20, h * 0.32, 140, 200);
      ctx.fillStyle = '#1c1917';
      ctx.fill();
      ctx.strokeStyle = '#78716c';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      // Flickering Wall Torches
      const torchGlow = ctx.createRadialGradient(x + 90, h * 0.38, 5, x + 90, h * 0.38, 90);
      torchGlow.addColorStop(0, 'rgba(251, 191, 36, 0.9)');
      torchGlow.addColorStop(0.5, 'rgba(249, 115, 22, 0.4)');
      torchGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = torchGlow;
      ctx.beginPath();
      ctx.arc(x + 90, h * 0.38, 90, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (isShip) {
    // Portholes looking into stormy dark sea
    for (let x = 120; x < w; x += 380) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, h * 0.38, 75, 0, Math.PI * 2);
      ctx.fillStyle = '#0c4a6e';
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Cold rain spray reflection
      const spray = ctx.createRadialGradient(x, h * 0.38, 10, x, h * 0.38, 70);
      spray.addColorStop(0, 'rgba(224, 242, 254, 0.8)');
      spray.addColorStop(1, 'rgba(14, 116, 144, 0.3)');
      ctx.fillStyle = spray;
      ctx.fill();
      ctx.restore();
    }
  } else {
    // Ornate Victorian Gothic Wall Panels & Windows
    ctx.fillStyle = isUv ? 'rgba(126, 34, 206, 0.35)' : 'rgba(127, 29, 29, 0.45)';
    for (let x = 30; x < w; x += 200) {
      ctx.fillRect(x, h * 0.32, 160, h * 0.28);
      ctx.strokeStyle = isUv ? 'rgba(216, 180, 254, 0.4)' : 'rgba(252, 165, 165, 0.4)';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, h * 0.32, 160, h * 0.28);
    }

    const windowCenters = [w * 0.2, w * 0.8];
    windowCenters.forEach((cx) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, h * 0.28, 110, Math.PI, 0, false);
      ctx.rect(cx - 110, h * 0.28, 220, 190);
      ctx.fillStyle = isUv ? '#2e1065' : '#1e3a8a';
      ctx.fill();

      const moonGlow = ctx.createRadialGradient(cx, h * 0.33, 10, cx, h * 0.33, 150);
      moonGlow.addColorStop(0, isUv ? 'rgba(216, 180, 254, 0.85)' : 'rgba(191, 219, 254, 0.85)');
      moonGlow.addColorStop(0.7, isUv ? 'rgba(147, 51, 234, 0.3)' : 'rgba(59, 130, 246, 0.25)');
      moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = moonGlow;
      ctx.fill();

      ctx.strokeStyle = isUv ? '#4c1d95' : '#172554';
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, h * 0.17);
      ctx.lineTo(cx, h * 0.47);
      ctx.moveTo(cx - 110, h * 0.32);
      ctx.lineTo(cx + 110, h * 0.32);
      ctx.stroke();
      ctx.restore();
    });
  }

  // 4. Central Focal Station (Desk / Altar / Mainframe Terminal / Navigation Helm)
  const deskX = w * 0.5 - 320;
  const deskY = h * 0.54;
  const rugX = deskX - 100;
  const rugY = floorTop + 20;

  if (isCyber) {
    // Holographic Terminal Platform
    ctx.fillStyle = '#082f49';
    ctx.fillRect(deskX, deskY, 640, 120);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.strokeRect(deskX, deskY, 640, 120);

    // Glowing cyan holographic interface
    const holoGlow = ctx.createRadialGradient(deskX + 320, deskY - 30, 10, deskX + 320, deskY - 30, 180);
    holoGlow.addColorStop(0, 'rgba(56, 189, 248, 0.8)');
    holoGlow.addColorStop(0.6, 'rgba(14, 165, 233, 0.2)');
    holoGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = holoGlow;
    ctx.beginPath();
    ctx.arc(deskX + 320, deskY - 30, 180, 0, Math.PI * 2);
    ctx.fill();
  } else if (isCrypt) {
    // Obsidian Sacrificial Dais / Altar Slab
    ctx.fillStyle = '#18181b';
    ctx.fillRect(deskX - 40, deskY, 720, 130);
    ctx.strokeStyle = '#a1a1aa';
    ctx.lineWidth = 5;
    ctx.strokeRect(deskX - 40, deskY, 720, 130);

    // Occult Runes / Candle Clusters
    const altarGlow = ctx.createRadialGradient(deskX + 320, deskY + 20, 10, deskX + 320, deskY + 20, 160);
    altarGlow.addColorStop(0, 'rgba(251, 146, 60, 0.7)');
    altarGlow.addColorStop(0.5, 'rgba(239, 68, 68, 0.3)');
    altarGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = altarGlow;
    ctx.beginPath();
    ctx.arc(deskX + 320, deskY + 20, 160, 0, Math.PI * 2);
    ctx.fill();
  } else if (isShip) {
    // Ship Steering Station & Brass Binnacle
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(deskX, deskY, 640, 120);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 4;
    ctx.strokeRect(deskX, deskY, 640, 120);

    // Brass compass binnacle glow
    const helmGlow = ctx.createRadialGradient(deskX + 320, deskY + 10, 10, deskX + 320, deskY + 10, 150);
    helmGlow.addColorStop(0, 'rgba(253, 224, 71, 0.8)');
    helmGlow.addColorStop(0.5, 'rgba(202, 138, 4, 0.3)');
    helmGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = helmGlow;
    ctx.beginPath();
    ctx.arc(deskX + 320, deskY + 10, 150, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Grand Mahogany Study Desk & Persian Rug
    ctx.fillStyle = isUv ? '#3b0764' : '#831843';
    ctx.fillRect(rugX, rugY, 840, 260);
    ctx.strokeStyle = isUv ? '#c084fc' : '#f59e0b';
    ctx.lineWidth = 8;
    ctx.strokeRect(rugX, rugY, 840, 260);

    ctx.fillStyle = isUv ? '#240638' : '#7f1d1d';
    ctx.fillRect(deskX, deskY, 640, 130);
    ctx.strokeStyle = isUv ? '#c084fc' : '#dc2626';
    ctx.lineWidth = 4;
    ctx.strokeRect(deskX, deskY, 640, 130);

    const lampX = deskX + 80;
    const lampY = deskY + 20;
    const lampGlow = ctx.createRadialGradient(lampX, lampY, 5, lampX, lampY, 140);
    lampGlow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
    lampGlow.addColorStop(0.4, 'rgba(245, 158, 11, 0.45)');
    lampGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = lampGlow;
    ctx.beginPath();
    ctx.arc(lampX, lampY, 140, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Forensic Evidence Placards (Yellow Placards #1, #2, #3)
  const placards = [
    { x: deskX + 150, y: deskY + 45, num: '01' },
    { x: deskX + 320, y: deskY + 55, num: '02' },
    { x: rugX + 220, y: rugY + 120, num: '03' },
  ];
  placards.forEach((p) => {
    ctx.fillStyle = '#facc15';
    ctx.fillRect(p.x, p.y, 28, 22);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(p.x, p.y, 28, 22);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(p.num, p.x + 6, p.y + 16);
  });

  // 6. Police Caution Tape
  ctx.save();
  ctx.translate(deskX - 70, deskY + 145);
  ctx.rotate(-0.04);
  ctx.fillStyle = isUv ? '#a855f7' : '#eab308';
  ctx.fillRect(0, 0, 780, 24);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('CRIME SCENE // DO NOT CROSS // FORENSIC EVIDENCE // CIB UNIT 09', 24, 17);
  ctx.restore();

  // 7. UV Mode Special Glowing Revelations
  if (isUv) {
    ctx.fillStyle = '#f0abfc';
    ctx.shadowColor = '#d946ef';
    ctx.shadowBlur = 18;

    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.ellipse(rugX + 80 + i * 85, rugY + 50 + i * 25, 16, 26, 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let j = 0; j < 15; j++) {
      ctx.beginPath();
      ctx.arc(deskX + 240 + (j * 19) % 150, deskY + 35 + (j * 23) % 55, 5 + (j % 5), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = 'bold 18px monospace';
    ctx.fillText('⚠ FORENSIC RESIDUE DETECTED // BIOLOGICAL MARKERS', deskX + 100, deskY - 15);
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
  const canvasMountRef = useRef<HTMLDivElement>(null);
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
    if (!canvasMountRef.current) return;
    const mount = canvasMountRef.current;
    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 500;

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
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);
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
      if (!canvasMountRef.current || !renderer || !camera) return;
      const w = canvasMountRef.current.clientWidth;
      const h = canvasMountRef.current.clientHeight;
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
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
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
      {/* Dedicated Three.js WebGL Canvas Container - React virtual DOM will NEVER touch this element */}
      <div ref={canvasMountRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />

      {/* Cinematic Forensic Flashlight Beam Vignette */}
      <div
        className={`absolute inset-0 pointer-events-none z-10 transition-colors duration-500 ${
          isUvMode
            ? 'bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12)_0%,rgba(59,7,100,0.4)_55%,rgba(15,5,29,0.85)_100%)]'
            : isNightVisionOn
            ? 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0.1)_60%,rgba(0,0,0,0.3)_100%)]'
            : 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0.15)_50%,rgba(0,0,0,0.45)_100%)]'
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
