import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeInterrogationCellProps {
  stressLevel: number;
  polygraphSpike: boolean;
}

export const ThreeInterrogationCell: React.FC<ThreeInterrogationCellProps> = ({
  stressLevel,
  polygraphSpike,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lampGroupRef = useRef<THREE.Group | null>(null);
  const suspectGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050101, 0.045);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.5);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Ambient Dim Red Light
    const ambientLight = new THREE.AmbientLight(0x1a0505, 0.25);
    scene.add(ambientLight);

    // 5. Swinging 3D Overhead Interrogation Lamp Group
    const lampGroup = new THREE.Group();
    lampGroup.position.set(0, 4.0, 0);

    // Lamp Cord
    const cordGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.5, 8);
    const cordMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const cord = new THREE.Mesh(cordGeo, cordMat);
    cord.position.y = -1.25;
    lampGroup.add(cord);

    // Lamp Shade
    const shadeGeo = new THREE.ConeGeometry(0.7, 0.6, 16, 1, true);
    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0x1a0505,
      metalness: 0.9,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.y = -2.5;
    lampGroup.add(shade);

    // Bulb Light Source
    const spotLight = new THREE.SpotLight(0xffedd5, 7.0);
    spotLight.position.set(0, -2.5, 0);
    spotLight.angle = Math.PI / 3.8;
    spotLight.penumbra = 0.5;
    spotLight.decay = 1.4;
    spotLight.distance = 25;
    spotLight.castShadow = true;
    lampGroup.add(spotLight);

    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(0, -5, 0);
    lampGroup.add(lightTarget);
    spotLight.target = lightTarget;

    scene.add(lampGroup);
    lampGroupRef.current = lampGroup;

    // 6. Room Geometry (Concrete Walls & Floor)
    const roomGeo = new THREE.BoxGeometry(16, 10, 16);
    const roomMat = new THREE.MeshStandardMaterial({
      color: 0x0f0303,
      roughness: 0.9,
      side: THREE.BackSide,
    });
    const room = new THREE.Mesh(roomGeo, roomMat);
    room.receiveShadow = true;
    scene.add(room);

    // Metal Interrogation Table
    const tableGeo = new THREE.BoxGeometry(4.5, 0.2, 2.8);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      metalness: 0.8,
      roughness: 0.3,
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, -1.0, 0);
    table.castShadow = true;
    table.receiveShadow = true;
    scene.add(table);

    // Table Legs
    for (let x of [-1.9, 1.9]) {
      for (let z of [-1.1, 1.1]) {
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.0, 8);
        const leg = new THREE.Mesh(legGeo, tableMat);
        leg.position.set(x, -2.0, z);
        leg.castShadow = true;
        scene.add(leg);
      }
    }

    // 7. 3D Suspect Silhouette & Avatar Figure Seated Across the Table
    const suspectGroup = new THREE.Group();
    suspectGroup.position.set(0, -0.9, -1.2);

    const suitMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.8,
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xa1a1aa,
      roughness: 0.5,
    });

    // Torso
    const torsoGeo = new THREE.CylinderGeometry(0.5, 0.45, 1.6, 12);
    const torso = new THREE.Mesh(torsoGeo, suitMat);
    torso.position.y = 0.8;
    torso.castShadow = true;
    suspectGroup.add(torso);

    // Head
    const headGeo = new THREE.SphereGeometry(0.38, 16, 16);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.9;
    head.castShadow = true;
    suspectGroup.add(head);

    // Arms on Table
    const armGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 8);
    const leftArm = new THREE.Mesh(armGeo, suitMat);
    leftArm.position.set(-0.6, 0.5, 0.5);
    leftArm.rotation.x = Math.PI / 3;
    leftArm.rotation.z = -Math.PI / 6;
    suspectGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, suitMat);
    rightArm.position.set(0.6, 0.5, 0.5);
    rightArm.rotation.x = Math.PI / 3;
    rightArm.rotation.z = Math.PI / 6;
    suspectGroup.add(rightArm);

    scene.add(suspectGroup);
    suspectGroupRef.current = suspectGroup;

    // 8. Animation Loop
    let animId: number;
    let time = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.02;

      // Swinging overhead lamp physics
      if (lampGroupRef.current) {
        const swingSpeed = polygraphSpike ? 2.5 : 1.0;
        const swingAngle = polygraphSpike ? 0.35 : 0.12;
        lampGroupRef.current.rotation.z = Math.sin(time * swingSpeed) * swingAngle;
        lampGroupRef.current.rotation.x = Math.cos(time * swingSpeed * 0.7) * (swingAngle * 0.5);
      }

      // Suspect breathing & nervous twitch animation
      if (suspectGroupRef.current) {
        const breathRate = (stressLevel / 100) * 4 + 1.2;
        suspectGroupRef.current.position.y = -0.9 + Math.sin(time * breathRate) * 0.03;

        if (polygraphSpike) {
          suspectGroupRef.current.position.x = (Math.random() - 0.5) * 0.04;
          suspectGroupRef.current.rotation.z = (Math.random() - 0.5) * 0.03;
        } else {
          suspectGroupRef.current.position.x = 0;
          suspectGroupRef.current.rotation.z = 0;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      scene.clear();
    };
  }, [stressLevel, polygraphSpike]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-75">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
