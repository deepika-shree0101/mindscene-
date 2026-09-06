import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Clue } from '../types';
import { sound } from '../utils/soundEngine';
import { RotateCcw, ZoomIn, ZoomOut, Zap } from 'lucide-react';

interface ThreeEvidenceViewerProps {
  clue: Clue;
  isUvMode?: boolean;
}

export const ThreeEvidenceViewer: React.FC<ThreeEvidenceViewerProps> = ({ clue, isUvMode = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [localUv, setLocalUv] = useState<boolean>(isUvMode);
  const autoRotate = true;

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);

  // Mouse rotation tracking
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, localUv ? 0.3 : 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(localUv ? 0xa855f7 : 0xffffff, localUv ? 2.5 : 2.0);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(localUv ? 0xec4899 : 0xef4444, 1.2);
    rimLight.position.set(-5, -5, -3);
    scene.add(rimLight);

    // 5. Procedural 3D Evidence Model Generation
    const modelGroup = new THREE.Group();
    const clueTitle = clue.title.toLowerCase();

    if (clueTitle.includes('goblet') || clueTitle.includes('glass') || clueTitle.includes('wine')) {
      // 3D Crystal Wine Goblet
      const points = [];
      points.push(new THREE.Vector2(1.2, 0));
      points.push(new THREE.Vector2(1.1, 0.2));
      points.push(new THREE.Vector2(0.2, 0.2));
      points.push(new THREE.Vector2(0.18, 1.8));
      points.push(new THREE.Vector2(0.8, 2.0));
      points.push(new THREE.Vector2(1.4, 3.0));
      points.push(new THREE.Vector2(1.35, 3.8));
      points.push(new THREE.Vector2(1.1, 3.8));
      points.push(new THREE.Vector2(0.7, 2.3));
      points.push(new THREE.Vector2(0.15, 1.8));

      const glassGeo = new THREE.LatheGeometry(points, 32);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: localUv ? 0x9333ea : 0xe2e8f0,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        transparent: true,
        opacity: 0.75,
      });
      const glassMesh = new THREE.Mesh(glassGeo, glassMat);
      glassMesh.position.y = -1.8;
      modelGroup.add(glassMesh);

      // Poison / White Residue rim
      const residueGeo = new THREE.TorusGeometry(1.25, 0.08, 16, 32);
      const residueMat = new THREE.MeshStandardMaterial({
        color: localUv ? 0x22c55e : 0xffffff,
        emissive: localUv ? 0x22c55e : 0x444444,
        emissiveIntensity: localUv ? 0.9 : 0.2,
      });
      const residueMesh = new THREE.Mesh(residueGeo, residueMat);
      residueMesh.position.set(0, 1.9, 0);
      residueMesh.rotation.x = Math.PI / 2;
      modelGroup.add(residueMesh);

    } else if (clueTitle.includes('key') || clueTitle.includes('passage') || clueTitle.includes('mechanism')) {
      // 3D Vintage Brass Key
      const keyMat = new THREE.MeshStandardMaterial({
        color: localUv ? 0xa855f7 : 0xd97706,
        metalness: 0.8,
        roughness: 0.25,
      });

      // Key Ring
      const ringGeo = new THREE.TorusGeometry(0.8, 0.18, 16, 32);
      const ringMesh = new THREE.Mesh(ringGeo, keyMat);
      ringMesh.position.y = 1.6;
      modelGroup.add(ringMesh);

      // Key Shaft
      const shaftGeo = new THREE.CylinderGeometry(0.16, 0.16, 3.2, 16);
      const shaftMesh = new THREE.Mesh(shaftGeo, keyMat);
      shaftMesh.position.y = -0.4;
      modelGroup.add(shaftMesh);

      // Key Teeth
      const toothGeo1 = new THREE.BoxGeometry(0.6, 0.25, 0.15);
      const tooth1 = new THREE.Mesh(toothGeo1, keyMat);
      tooth1.position.set(0.3, -1.5, 0);
      modelGroup.add(tooth1);

      const toothGeo2 = new THREE.BoxGeometry(0.8, 0.25, 0.15);
      const tooth2 = new THREE.Mesh(toothGeo2, keyMat);
      tooth2.position.set(0.4, -1.8, 0);
      modelGroup.add(tooth2);

    } else if (clueTitle.includes('letter') || clueTitle.includes('note') || clueTitle.includes('document')) {
      // 3D Parchment / Document with burnt corner
      const paperGeo = new THREE.BoxGeometry(3.0, 4.0, 0.04);
      const paperMat = new THREE.MeshStandardMaterial({
        color: localUv ? 0x3b0764 : 0xfeeeea,
        roughness: 0.8,
      });
      const paperMesh = new THREE.Mesh(paperGeo, paperMat);
      modelGroup.add(paperMesh);

      // Glowing UV latent fingerprint
      const printGeo = new THREE.CircleGeometry(0.4, 16);
      const printMat = new THREE.MeshBasicMaterial({
        color: 0x4ade80,
        transparent: true,
        opacity: localUv ? 0.85 : 0.05,
      });
      const printMesh = new THREE.Mesh(printGeo, printMat);
      printMesh.position.set(0.6, -0.8, 0.03);
      modelGroup.add(printMesh);

    } else {
      // 3D Forensic Evidence Capsule / Vial
      const vialGeo = new THREE.CylinderGeometry(0.9, 0.9, 3.5, 32);
      const vialMat = new THREE.MeshPhysicalMaterial({
        color: localUv ? 0x9333ea : 0xffffff,
        transmission: 0.8,
        roughness: 0.2,
      });
      const vialMesh = new THREE.Mesh(vialGeo, vialMat);
      modelGroup.add(vialMesh);

      const capGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.6, 32);
      const capMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8 });
      const capMesh = new THREE.Mesh(capGeo, capMat);
      capMesh.position.y = 2.0;
      modelGroup.add(capMesh);
    }

    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 6. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotate && modelGroupRef.current && !isDraggingRef.current) {
        modelGroupRef.current.rotation.y += 0.012;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      scene.clear();
    };
  }, [clue, localUv, autoRotate]);

  // Drag-to-rotate 3D Object
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !modelGroupRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    modelGroupRef.current.rotation.y += deltaX * 0.015;
    modelGroupRef.current.rotation.x += deltaY * 0.015;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    sound.playKeyClick();
    const factor = direction === 'in' ? -0.8 : 0.8;
    cameraRef.current.position.z = Math.max(3.5, Math.min(11, cameraRef.current.position.z + factor));
  };

  const handleReset = () => {
    sound.playKeyClick();
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.set(0, 0, 0);
    }
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 7);
    }
  };

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-black/95 border-2 border-red-900/60 shadow-inner select-none">
      
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top 3D Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-black/80 border border-red-800 text-red-300 shadow-md">
          🔬 3D FORENSIC LAB INSPECTION // 360° ORBIT
        </span>
      </div>

      {/* Control Buttons (Zoom, UV Toggle, Reset) */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-black/80 border border-red-900/60 p-1.5 rounded-xl shadow-lg">
        <button
          onClick={() => handleZoom('in')}
          title="Zoom In"
          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleZoom('out')}
          title="Zoom Out"
          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleReset}
          title="Reset Orientation"
          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            sound.playFlashlightClick();
            setLocalUv(!localUv);
          }}
          title={localUv ? "UV Mode Active (Stains Revealed)" : "Enable UV Forensic Surface Scan"}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
            localUv 
              ? 'bg-purple-900 border border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
              : 'bg-black border border-red-900 text-red-400'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{localUv ? 'UV SCAN ON' : 'UV SCAN'}</span>
        </button>
      </div>

      {/* Interaction Hint */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none text-[10px] font-mono text-red-400/70">
        <span>🖱️ DRAG TO ROTATE 360°</span>
      </div>

    </div>
  );
};
