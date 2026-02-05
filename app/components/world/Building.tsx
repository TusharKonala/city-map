"use client";

interface Props {
  position: [number, number, number];
  height?: number;
  color?: string;
}

export function Building({ position, height = 3, color = "#3182ce" }: Props) {
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
