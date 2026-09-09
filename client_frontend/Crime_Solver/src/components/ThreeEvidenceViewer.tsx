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
    const width = container.clientWidth || 420;
    const height = container.clientHeight || 280;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / (height || 1), 0.1, 100);
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

    // 5. Procedural 3D Evidence Model Generation (Authentic 3D Models for ALL Cases)
    const modelGroup = new THREE.Group();
    const clueText = `${clue.id} ${clue.title}`.toLowerCase();

    if (clueText.includes('wrench')) {
      // 1. Heavy Industrial Plumber's Pipe Wrench (Blood-Encrusted)
      const handleGeo = new THREE.BoxGeometry(0.36, 3.0, 0.24);
      const handleMat = new THREE.MeshStandardMaterial({
        color: localUv ? 0x7c2d12 : 0xc2410c, // Cast iron red
        metalness: 0.65,
        roughness: 0.35,
      });
      const handleMesh = new THREE.Mesh(handleGeo, handleMat);
      handleMesh.position.y = -0.5;
      modelGroup.add(handleMesh);

      const gripGeo = new THREE.BoxGeometry(0.4, 1.4, 0.28);
      const gripMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
      const gripMesh = new THREE.Mesh(gripGeo, gripMat);
      gripMesh.position.y = -1.2;
      modelGroup.add(gripMesh);

      const steelMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.92, roughness: 0.2 });
      const upperHook = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.5, 0.28), steelMat);
      upperHook.position.set(0.25, 1.35, 0);
      modelGroup.add(upperHook);

      const lowerJaw = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.26), steelMat);
      lowerJaw.position.set(0.18, 0.85, 0);
      modelGroup.add(lowerJaw);

      const knurledNut = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.3, 16), steelMat);
      knurledNut.position.set(0, 0.55, 0);
      modelGroup.add(knurledNut);

      // Dried Blood Encrustation
      const bloodMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 12, 12),
        new THREE.MeshStandardMaterial({
          color: localUv ? 0x22c55e : 0x7f1d1d,
          emissive: localUv ? 0x22c55e : 0x450a0a,
          emissiveIntensity: localUv ? 1.0 : 0.2,
          roughness: 0.2,
        })
      );
      bloodMesh.scale.set(1, 1.8, 0.3);
      bloodMesh.position.set(0.35, 1.25, 0.15);
      modelGroup.add(bloodMesh);

    } else if (clueText.includes('crowbar')) {
      // 2. Heavy Hexagonal Steel Crowbar (Blood-Stained Altar Crowbar)
      const steelBarMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.3 });
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.2, 6), steelBarMat);
      modelGroup.add(shaft);

      const hookTorus = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.12, 8, 16, Math.PI * 0.7), steelBarMat);
      hookTorus.position.set(0.4, 1.45, 0);
      hookTorus.rotation.z = Math.PI * 0.35;
      modelGroup.add(hookTorus);

      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 4), steelBarMat);
      claw.position.set(0.75, 1.7, 0);
      claw.rotation.z = -Math.PI * 0.4;
      modelGroup.add(claw);

      const chisel = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.4, 0.08), steelBarMat);
      chisel.position.set(0, -1.7, 0);
      modelGroup.add(chisel);

      const bloodClaw = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.6, 0.2),
        new THREE.MeshStandardMaterial({
          color: localUv ? 0x22c55e : 0x5a0808,
          emissive: localUv ? 0x22c55e : 0x000000,
          emissiveIntensity: localUv ? 0.9 : 0,
        })
      );
      bloodClaw.position.set(0.6, 1.55, 0);
      modelGroup.add(bloodClaw);

    } else if (clueText.includes('zippo') || clueText.includes('lighter')) {
      // 3. First Mate Duncan’s Silver Zippo Lighter
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 });
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 });

      const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.7, 0.55), chromeMat);
      body.position.y = -0.6;
      modelGroup.add(body);

      const anchor = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.05, 8, 16, Math.PI), brassMat);
      anchor.position.set(0, -0.6, 0.29);
      modelGroup.add(anchor);

      const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.7, 0.42), chromeMat);
      chimney.position.set(-0.1, 0.5, 0);
      modelGroup.add(chimney);

      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16), new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 }));
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(0.35, 0.75, 0);
      modelGroup.add(wheel);

      const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.25, 8), new THREE.MeshBasicMaterial({ color: 0x111111 }));
      wick.position.set(-0.1, 0.9, 0);
      modelGroup.add(wick);

      const lid = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 0.56), chromeMat);
      lid.position.set(0.9, 0.8, 0);
      lid.rotation.z = -1.1; // flipped open
      modelGroup.add(lid);

    } else if (clueText.includes('syringe') || clueText.includes('hypo')) {
      // 4. Neuro-Paralytic Medical Hypodermic Syringe
      const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 2.8, 24),
        new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.92, roughness: 0.1, transparent: true, opacity: 0.8 })
      );
      modelGroup.add(barrel);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.35, 16), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
      hub.position.y = 1.5;
      modelGroup.add(hub);

      const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8), new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 1.0, roughness: 0.1 }));
      needle.position.y = 2.35;
      modelGroup.add(needle);

      const stopper = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.3, 16), new THREE.MeshStandardMaterial({ color: localUv ? 0x22c55e : 0x1f2937 }));
      stopper.position.y = -0.4;
      modelGroup.add(stopper);

      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.8, 8), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 }));
      rod.position.y = -1.4;
      modelGroup.add(rod);

      const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
      flange.position.y = -2.3;
      modelGroup.add(flange);

      if (localUv) {
        const drop = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 1 }));
        drop.position.y = 3.05;
        modelGroup.add(drop);
      }

    } else if (clueText.includes('chalice')) {
      // 5. Venom-Laced Medieval Silver Chalice
      const chalicePoints = [
        new THREE.Vector2(1.1, 0),
        new THREE.Vector2(1.05, 0.2),
        new THREE.Vector2(0.3, 0.35),
        new THREE.Vector2(0.22, 1.2),
        new THREE.Vector2(0.5, 1.35),
        new THREE.Vector2(0.22, 1.5),
        new THREE.Vector2(0.4, 1.8),
        new THREE.Vector2(1.25, 3.2),
        new THREE.Vector2(1.3, 3.4),
        new THREE.Vector2(1.18, 3.4),
        new THREE.Vector2(0.4, 2.0),
        new THREE.Vector2(0.18, 1.8)
      ];
      const chaliceMat = new THREE.MeshStandardMaterial({ color: localUv ? 0x9333ea : 0xc0c8d0, metalness: 0.9, roughness: 0.25 });
      const chaliceMesh = new THREE.Mesh(new THREE.LatheGeometry(chalicePoints, 32), chaliceMat);
      chaliceMesh.position.y = -1.7;
      modelGroup.add(chaliceMesh);

      const poison = new THREE.Mesh(
        new THREE.CircleGeometry(1.05, 32),
        new THREE.MeshStandardMaterial({
          color: localUv ? 0x22c55e : 0x064e3b,
          emissive: localUv ? 0x22c55e : 0x022c22,
          emissiveIntensity: localUv ? 1.0 : 0.3,
        })
      );
      poison.rotation.x = -Math.PI / 2;
      poison.position.y = 1.2;
      modelGroup.add(poison);

    } else if (clueText.includes('goblet') || clueText.includes('glass') || clueText.includes('wine')) {
      // 6. Crystal Wine Goblet with Tranquilizer Residue
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

      const glassMat = new THREE.MeshPhysicalMaterial({
        color: localUv ? 0x9333ea : 0xe2e8f0,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        transparent: true,
        opacity: 0.75,
      });
      const glassMesh = new THREE.Mesh(new THREE.LatheGeometry(points, 32), glassMat);
      glassMesh.position.y = -1.8;
      modelGroup.add(glassMesh);

      const residue = new THREE.Mesh(
        new THREE.TorusGeometry(1.25, 0.08, 16, 32),
        new THREE.MeshStandardMaterial({
          color: localUv ? 0x22c55e : 0xffffff,
          emissive: localUv ? 0x22c55e : 0x444444,
          emissiveIntensity: localUv ? 0.9 : 0.2,
        })
      );
      residue.position.set(0, 1.9, 0);
      residue.rotation.x = Math.PI / 2;
      modelGroup.add(residue);

    } else if (clueText.includes('whiskey') || clueText.includes('tumbler')) {
      // 7. Sedative-Laced Heavy Lowball Whiskey Glass
      const tPoints = [
        new THREE.Vector2(1.1, 0),
        new THREE.Vector2(1.1, 0.6),
        new THREE.Vector2(1.25, 2.4),
        new THREE.Vector2(1.15, 2.4),
        new THREE.Vector2(0.95, 0.6),
        new THREE.Vector2(0.0, 0.6)
      ];
      const tumbler = new THREE.Mesh(new THREE.LatheGeometry(tPoints, 16), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, roughness: 0.1 }));
      tumbler.position.y = -1.2;
      modelGroup.add(tumbler);

      const whiskey = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 0.92, 0.8, 16), new THREE.MeshPhysicalMaterial({ color: localUv ? 0xa855f7 : 0xd97706, transmission: 0.7, roughness: 0.2 }));
      whiskey.position.y = -0.3;
      modelGroup.add(whiskey);

      const ice = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.95, roughness: 0.05 }));
      ice.position.set(0.2, -0.1, 0.1);
      ice.rotation.set(0.3, 0.4, 0.2);
      modelGroup.add(ice);

    } else if (clueText.includes('duffel') || clueText.includes('satchel') || clueText.includes('bag')) {
      // 8. Surgical Duffel / Leather Courier Satchel
      const leatherMat = new THREE.MeshStandardMaterial({ color: localUv ? 0x581c87 : 0x1c1917, roughness: 0.8 });
      const brassAcc = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.3 });

      const bagBody = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 3.2, 24), leatherMat);
      bagBody.rotation.z = Math.PI / 2;
      modelGroup.add(bagBody);

      const zip = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 0.15), brassAcc);
      zip.position.y = 1.0;
      modelGroup.add(zip);

      const handles = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.08, 8, 24, Math.PI), leatherMat);
      handles.position.set(0, 1.2, 0);
      modelGroup.add(handles);

      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.04), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
      crossH.position.set(0, 0, 1.02);
      modelGroup.add(crossH);
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.04), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
      crossV.position.set(0, 0, 1.02);
      modelGroup.add(crossV);

    } else if (clueText.includes('keycard') || clueText.includes('pass') || clueText.includes('nfc')) {
      // 9. Cloned Master NFC Security Pass
      const card = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.1, 0.06), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 }));
      modelGroup.add(card);

      const chip = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.08), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 }));
      chip.position.set(-0.9, 0.1, 0.01);
      modelGroup.add(chip);

      const stripe = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.45, 0.02), new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.9 }));
      stripe.position.set(0, 0.4, -0.03);
      modelGroup.add(stripe);

      const holo = new THREE.Mesh(new THREE.CircleGeometry(0.45, 24), new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: localUv ? 0.9 : 0.15 }));
      holo.position.set(0.6, -0.2, 0.04);
      modelGroup.add(holo);

    } else if (clueText.includes('transceiver') || clueText.includes('dongle') || clueText.includes('device')) {
      // 10. Tactical Rogue Network Transceiver
      const tacticalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.3 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.7), tacticalMat);
      modelGroup.add(body);

      const ant1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      ant1.position.set(-0.45, 1.8, 0);
      modelGroup.add(ant1);
      const ant2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      ant2.position.set(0.45, 1.8, 0);
      modelGroup.add(ant2);

      const port = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.2), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
      port.position.set(0, -1.25, 0);
      modelGroup.add(port);

      const ledG = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
      ledG.position.set(-0.4, 0.6, 0.38);
      modelGroup.add(ledG);
      const ledR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      ledR.position.set(0.4, 0.6, 0.38);
      modelGroup.add(ledR);

    } else if (clueText.includes('degausser')) {
      // 11. Shinwa EMP Degausser Weapon
      const empMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.3 });
      const empBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 2.2), empMat);
      modelGroup.add(empBody);

      for (let i = 0; i < 4; i++) {
        const coil = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.08, 12, 24), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 }));
        coil.position.set(0, 0, 0.4 + i * 0.45);
        modelGroup.add(coil);
      }

      const gripE = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.4, 0.6), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }));
      gripE.position.set(0, -1.3, -0.4);
      gripE.rotation.x = -0.3;
      modelGroup.add(gripE);

    } else if (clueText.includes('caddy') || clueText.includes('quantum')) {
      // 12. Tampered Quantum Core Caddy
      const caddyFrame = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3.0, 6), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 }));
      modelGroup.add(caddyFrame);

      const coreChamber = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.4, 16), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, roughness: 0.1 }));
      modelGroup.add(coreChamber);

      const coreSphere = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 24), new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 1.5 }));
      modelGroup.add(coreSphere);

      const qRing = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.04, 8, 32), new THREE.MeshBasicMaterial({ color: localUv ? 0xa855f7 : 0x38bdf8 }));
      qRing.rotation.x = Math.PI / 3;
      modelGroup.add(qRing);

    } else if (clueText.includes('jumper') || clueText.includes('optical') || clueText.includes('payload') || clueText.includes('jack')) {
      // 13. Neural Hardware Jack / Fiber Optic Jumper
      const board = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 0.15), new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.6 }));
      modelGroup.add(board);

      const chipA = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.2), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 }));
      chipA.position.set(-0.5, 0.2, 0.1);
      modelGroup.add(chipA);

      const goldPins = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, 0.1), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95 }));
      goldPins.position.set(0, -0.9, 0);
      modelGroup.add(goldPins);

      const fiber = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.06, 8, 24, Math.PI), new THREE.MeshBasicMaterial({ color: localUv ? 0xa855f7 : 0x06b6d4 }));
      fiber.position.set(0.3, 0.3, 0.2);
      modelGroup.add(fiber);

    } else if (clueText.includes('book') || clueText.includes('log') || clueText.includes('codex')) {
      // 14. Hardcover Captain's Nautical Log / Ancient Leather Codex
      const bookMat = new THREE.MeshStandardMaterial({ color: localUv ? 0x4a044e : 0x451a03, roughness: 0.7 });
      const pagesMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.9 });

      const front = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.4, 0.08), bookMat);
      front.position.z = 0.4;
      modelGroup.add(front);
      const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.4, 0.08), bookMat);
      back.position.z = -0.4;
      modelGroup.add(back);
      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.4, 0.88), bookMat);
      spine.position.x = -1.2;
      modelGroup.add(spine);

      const pages = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.2, 0.75), pagesMat);
      pages.position.x = 0.05;
      modelGroup.add(pages);

      const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.2, 0.02), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
      ribbon.position.set(0.3, -1.8, 0);
      modelGroup.add(ribbon);

      const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.9), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85 }));
      clasp.position.x = 1.2;
      modelGroup.add(clasp);

    } else if (clueText.includes('note') || clueText.includes('prescription') || clueText.includes('manifest') || clueText.includes('contract') || clueText.includes('document')) {
      // 15. Forensic Document / Torn Prescription Note
      const paper = new THREE.Mesh(
        new THREE.BoxGeometry(3.0, 4.0, 0.04),
        new THREE.MeshStandardMaterial({ color: localUv ? 0x3b0764 : 0xfeeeea, roughness: 0.8 })
      );
      modelGroup.add(paper);

      // Latent fingerprint whorl
      const print = new THREE.Mesh(
        new THREE.CircleGeometry(0.4, 16),
        new THREE.MeshBasicMaterial({ color: 0x4ade80, transparent: true, opacity: localUv ? 0.9 : 0.08 })
      );
      print.position.set(0.6, -0.8, 0.03);
      modelGroup.add(print);

      // Printed text lines
      for (let i = -1.2; i <= 1.2; i += 0.4) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.06, 0.01), new THREE.MeshBasicMaterial({ color: 0x1e293b }));
        line.position.set(0, i, 0.03);
        modelGroup.add(line);
      }

    } else if (clueText.includes('shoe') || clueText.includes('boot') || clueText.includes('sandal') || clueText.includes('tread')) {
      // 16. Orthopedic Boot / Sandal Footwear Tread
      const soleMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
      const sole = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 3.6), soleMat);
      modelGroup.add(sole);

      const heel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 1.2), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 }));
      heel.position.set(0, 0.35, -1.1);
      modelGroup.add(heel);

      for (let i = -1.4; i <= 1.4; i += 0.45) {
        const lug = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 0.2), soleMat);
        lug.position.set(0, -0.22, i);
        modelGroup.add(lug);
      }

      if (localUv) {
        const mudUV = new THREE.Mesh(new THREE.CircleGeometry(0.4, 16), new THREE.MeshBasicMaterial({ color: 0x4ade80, transparent: true, opacity: 0.8 }));
        mudUV.rotation.x = -Math.PI / 2;
        mudUV.position.set(0.2, 0.2, 0.4);
        modelGroup.add(mudUV);
      }

    } else if (clueText.includes('seacock') || clueText.includes('valve')) {
      // 17. Jammed Seacock Scuttle Valve
      const ironMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.5 });
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 2.6, 24), ironMat);
      modelGroup.add(pipe);

      const flange1 = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.25, 24), ironMat);
      flange1.position.y = 1.2;
      modelGroup.add(flange1);
      const flange2 = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.25, 24), ironMat);
      flange2.position.y = -1.2;
      modelGroup.add(flange2);

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.6, 16), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
      stem.rotation.z = Math.PI / 2;
      stem.position.set(0.8, 0, 0);
      modelGroup.add(stem);

      const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.12, 12, 24), new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 }));
      wheel.rotation.y = Math.PI / 2;
      wheel.position.set(1.6, 0, 0);
      modelGroup.add(wheel);

      const spoke1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.7, 8), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
      spoke1.position.set(1.6, 0, 0);
      modelGroup.add(spoke1);
      const spoke2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.7, 8), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
      spoke2.rotation.x = Math.PI / 2;
      spoke2.position.set(1.6, 0, 0);
      modelGroup.add(spoke2);

      const jamBolt = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.8, 0.18), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 }));
      jamBolt.position.set(1.6, 0.4, 0.3);
      jamBolt.rotation.z = 0.5;
      modelGroup.add(jamBolt);

    } else if (clueText.includes('lock') || clueText.includes('latch') || clueText.includes('key')) {
      // 18. Internally Cut Balcony Latch / Tampered Mechanism
      const lockBrass = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.3 });
      const shackleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 });

      const lockBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 0.6), lockBrass);
      modelGroup.add(lockBody);

      const cutShackle = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.15, 12, 24, Math.PI * 0.75), shackleMat);
      cutShackle.position.set(0, 1.0, 0);
      modelGroup.add(cutShackle);

      const cutMark = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.32), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0 }));
      cutMark.position.set(0.55, 1.45, 0);
      modelGroup.add(cutMark);

    } else if (clueText.includes('rosary') || clueText.includes('cross') || clueText.includes('crucifix')) {
      // 19. Severed Monogrammed Ebony Rosary
      const beadMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.3, metalness: 0.2 });
      const silverMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });

      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 1.75;
        const x = Math.cos(angle) * 1.3;
        const y = Math.sin(angle) * 1.3 + 0.3;
        const bead = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), beadMat);
        bead.position.set(x, y, 0);
        modelGroup.add(bead);
      }

      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.4, 0.08), silverMat);
      crossV.position.set(0, -1.4, 0);
      modelGroup.add(crossV);
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.18, 0.08), silverMat);
      crossH.position.set(0, -1.2, 0);
      modelGroup.add(crossH);

    } else if (clueText.includes('habit') || clueText.includes('cloth') || clueText.includes('fiber') || clueText.includes('harness') || clueText.includes('rig')) {
      // 20. Torn Monastic Habit / Rappelling Rig Harness
      const fabricMat = new THREE.MeshStandardMaterial({ color: localUv ? 0x581c87 : 0x292524, roughness: 0.9 });
      const swatch = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 0.08), fabricMat);
      modelGroup.add(swatch);

      for (let i = 0; i < 6; i++) {
        const fringe = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.01, 0.5, 6), fabricMat);
        fringe.position.set(-1.0 + i * 0.4, -1.5, 0);
        modelGroup.add(fringe);
      }

      const stain = new THREE.Mesh(
        new THREE.CircleGeometry(0.4, 16),
        new THREE.MeshStandardMaterial({ color: localUv ? 0x22c55e : 0x7f1d1d, emissive: localUv ? 0x22c55e : 0x000000 })
      );
      stain.position.set(0.4, 0.3, 0.05);
      modelGroup.add(stain);

    } else if (clueText.includes('rope') || clueText.includes('mooring') || clueText.includes('line') || clueText.includes('cable')) {
      // 21. Severed Mooring Line / Radio VHF Cable
      const isVHF = clueText.includes('vhf') || clueText.includes('cable') || clueText.includes('radio');
      const ropeMat = new THREE.MeshStandardMaterial({ color: isVHF ? 0x0284c7 : 0x78350f, roughness: 0.9 });

      for (let i = 0; i < 3; i++) {
        const strand = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.2, 12), ropeMat);
        strand.position.set(Math.cos(i * 2.1) * 0.15, 0, Math.sin(i * 2.1) * 0.15);
        strand.rotation.y = i * 0.8;
        modelGroup.add(strand);
      }

      for (let j = 0; j < 8; j++) {
        const fray = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.6, 6), ropeMat);
        fray.position.set((Math.random() - 0.5) * 0.4, 1.7 + Math.random() * 0.2, (Math.random() - 0.5) * 0.4);
        modelGroup.add(fray);
      }

    } else if (clueText.includes('tungsten') || clueText.includes('weight')) {
      // 22. Calibrated Tungsten Counterweight Ingot
      const tMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.95, roughness: 0.2 });
      const ingot = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 1.6), tMat);
      modelGroup.add(ingot);

      const eyeBolt = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.1, 12, 24), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
      eyeBolt.position.y = 1.05;
      modelGroup.add(eyeBolt);

      const stamp = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.02), new THREE.MeshBasicMaterial({ color: localUv ? 0x38bdf8 : 0x0f172a }));
      stamp.position.set(0, 0, 0.82);
      modelGroup.add(stamp);

    } else if (clueText.includes('safe') || clueText.includes('bullion')) {
      // 23. Acetylene-Torched Bullion Safe Container
      const safeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.4 });
      const safeBox = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.8, 2.4), safeMat);
      modelGroup.add(safeBox);

      const doorPlate = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.4, 0.2), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 }));
      doorPlate.position.z = 1.25;
      modelGroup.add(doorPlate);

      const torchHole = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.3, 24), new THREE.MeshBasicMaterial({ color: 0x020617 }));
      torchHole.rotation.x = Math.PI / 2;
      torchHole.position.set(0.3, 0.2, 1.3);
      modelGroup.add(torchHole);

      const slagRing = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.08, 8, 24), new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.8, emissive: 0x431407 }));
      slagRing.position.set(0.3, 0.2, 1.36);
      modelGroup.add(slagRing);

    } else if (clueText.includes('binnacle') || clueText.includes('compass')) {
      // 24. Arterial Blood on Wheelhouse Binnacle
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.25 });
      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.1, 2.4, 24), brassMat);
      modelGroup.add(pedestal);

      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.78, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
        new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, roughness: 0.1 })
      );
      dome.position.y = 1.2;
      modelGroup.add(dome);

      const rose = new THREE.Mesh(new THREE.CircleGeometry(0.72, 32), new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.6 }));
      rose.rotation.x = -Math.PI / 2;
      rose.position.y = 1.22;
      modelGroup.add(rose);

      const bloodDrip = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 1.2, 0.06),
        new THREE.MeshStandardMaterial({
          color: localUv ? 0x22c55e : 0x7f1d1d,
          emissive: localUv ? 0x22c55e : 0x450a0a,
          emissiveIntensity: localUv ? 1.0 : 0.2
        })
      );
      bloodDrip.position.set(0.65, 0.4, 0.5);
      bloodDrip.rotation.y = 0.6;
      modelGroup.add(bloodDrip);

    } else {
      // 25. Authentic Forensic Surgical Scalpel / Evidence Dagger
      const steelBladeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95, roughness: 0.1 });
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.4, 0.04), steelBladeMat);
      blade.position.y = 0.8;
      modelGroup.add(blade);

      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.6, 4), steelBladeMat);
      tip.position.y = 2.3;
      modelGroup.add(tip);

      const handleK = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.6, 0.15), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 }));
      handleK.position.y = -1.0;
      modelGroup.add(handleK);
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

    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth || 420;
      const h = containerRef.current.clientHeight || 280;
      camera.aspect = w / (h || 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    const resizeTimer = setTimeout(handleResize, 150);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
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
