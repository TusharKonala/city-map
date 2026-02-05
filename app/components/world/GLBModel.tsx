"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

interface Props {
  path: string;
  position?: [number, number, number];
  targetSize?: number;
  scale?: number;
}

export function GLBModel({
  path,
  position = [0, 0, 0],
  targetSize = 10,
  scale = 1,
}: Props) {
  const { scene } = useGLTF(path);

  useEffect(() => {
    scene.scale.set(1, 1, 1);

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);

    const maxAxis = Math.max(size.x, size.y, size.z);
    const autoScale = targetSize / maxAxis;

    scene.scale.setScalar(autoScale * scale);
  }, [scene, targetSize, scale]);

  return <primitive object={scene} position={position} />;
}
