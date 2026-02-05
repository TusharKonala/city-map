"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, Text } from "@react-three/drei";
import { Suspense } from "react";

function CityGround() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0] as [number, number, number]}
      position={[0, -1, 0] as [number, number, number]}
    >
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#4a5568" />
    </mesh>
  );
}

function Building({
  position,
  height = 3,
  color = "#3182ce",
}: {
  position: [number, number, number];
  height?: number;
  color?: string;
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[2, height, 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, height / 2 + 0.1, 0]}>
        <coneGeometry args={[1.5, 1]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
    </group>
  );
}

function Marker({
  position,
  id,
}: {
  position: [number, number, number];
  id: number;
}) {
  return (
    <group position={position}>
      <Sphere args={[0.5, 16, 16]}>
        <meshStandardMaterial
          color="#f56565"
          emissive="#f56565"
          emissiveIntensity={0.3}
        />
      </Sphere>
      <mesh scale={[1.5, 1.5, 1.5]}>
        <Sphere args={[0.6, 16, 16]}>
          <meshBasicMaterial color="#f56565" transparent opacity={0.3} />
        </Sphere>
      </mesh>
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {id}
      </Text>
    </group>
  );
}

function CityScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <CityGround />

      {/* 4 Buildings */}
      <Building
        position={[-10, 0, -10] as [number, number, number]}
        height={4}
        color="#3182ce"
      />
      <Building
        position={[10, 0, -10] as [number, number, number]}
        height={6}
        color="#48bb78"
      />
      <Building
        position={[-10, 0, 10] as [number, number, number]}
        height={3}
        color="#ed8936"
      />
      <Building
        position={[5, 0, 0] as [number, number, number]}
        height={5}
        color="#9f7aea"
      />

      {/* 6 Markers */}
      <Marker position={[5, 0, 5] as [number, number, number]} id={1} />
      <Marker position={[-8, 0, 3] as [number, number, number]} id={2} />
      <Marker position={[2, 0, -10] as [number, number, number]} id={3} />
      <Marker position={[12, 0, -5] as [number, number, number]} id={4} />
      <Marker position={[-5, 0, 12] as [number, number, number]} id={5} />
      <Marker position={[8, 0, 8] as [number, number, number]} id={6} />
    </>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="w-full aspect-video max-h-[600px] mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-700">
          <Canvas camera={{ position: [0, 15, 25], fov: 60 }} shadows>
            <Suspense fallback={null}>
              <CityScene />
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                enableRotate={true}
                minDistance={15}
                maxDistance={50}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </main>
  );
}
