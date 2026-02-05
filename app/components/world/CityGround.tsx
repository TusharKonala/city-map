"use client";

export function CityGround() {
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
