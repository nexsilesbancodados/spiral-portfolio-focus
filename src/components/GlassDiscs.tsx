import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const allSkills = [
  "React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "shadcn/ui",
  "Node.js", "Supabase", "PostgreSQL", "Edge Functions", "REST APIs", "Python",
  "Git", "Docker", "Vercel", "AWS", "CI/CD", "Figma",
];

interface DiscData {
  position: [number, number, number];
  rotation: [number, number, number];
  floatSpeed: number;
  floatOffset: number;
  spinSpeed: number;
  initY: number;
}

function GlassDisc({ data }: { data: DiscData }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y =
      data.initY + Math.sin(t * data.floatSpeed * 2 + data.floatOffset) * 0.8;
    meshRef.current.rotation.x += data.spinSpeed;
    meshRef.current.rotation.y += data.spinSpeed * 0.7;
  });

  return (
    <mesh
      ref={meshRef}
      position={data.position}
      rotation={data.rotation}
      scale={[1, 1, 0.15]}
    >
      <sphereGeometry args={[1.8, 48, 48]} />
      <meshPhysicalMaterial
        color="#4488ff"
        metalness={0.1}
        roughness={0.05}
        transmission={0.92}
        ior={1.5}
        thickness={2.0}
        envMapIntensity={1.5}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        emissive="#1a0044"
        emissiveIntensity={0.4}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

export function GlassDiscs() {
  const groupRef = useRef<THREE.Group>(null);

  const discsData = useMemo<DiscData[]>(() => {
    const seeded = (seed: number) => {
      const x = Math.sin(seed * 9301 + 49297) * 233280;
      return x - Math.floor(x);
    };

    return allSkills.map((_, i) => {
      const angle = (i / allSkills.length) * Math.PI * 2;
      const radiusX = 7 + seeded(i * 3) * 2;
      const radiusY = 4.5 + seeded(i * 5) * 2;
      const posX = Math.cos(angle) * radiusX;
      const posY = Math.sin(angle) * radiusY;
      const posZ = (seeded(i * 7) - 0.5) * 7;

      return {
        position: [posX, posY, posZ] as [number, number, number],
        rotation: [
          seeded(i * 11) * Math.PI,
          seeded(i * 13) * Math.PI,
          seeded(i * 17) * Math.PI,
        ] as [number, number, number],
        floatSpeed: 0.3 + seeded(i * 19) * 0.5,
        floatOffset: seeded(i * 23) * Math.PI * 2,
        spinSpeed: (seeded(i * 29) - 0.5) * 0.004,
        initY: posY,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.3;
    groupRef.current.rotation.x = Math.sin(t * 0.07) * 0.15;
  });

  return (
    <group ref={groupRef}>
      {discsData.map((data, i) => (
        <GlassDisc key={allSkills[i]} data={data} />
      ))}
    </group>
  );
}