"use client";

import { Sphere, Text } from "@react-three/drei";

interface Props {
  position: [number, number, number];
  id: number;
  onSelect: (id: number) => void;
}

export function Marker({ position, id, onSelect }: Props) {
  return (
    <group position={position}>
      <Sphere
        args={[0.5, 16, 16]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
      >
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
