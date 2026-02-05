"use client";

import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect } from "react";

export function Skybox() {
  const { scene } = useThree();

  useEffect(() => {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      "/textures/skybox/right.png",
      "/textures/skybox/left.png",
      "/textures/skybox/up.png",
      "/textures/skybox/down.png",
      "/textures/skybox/front.png",
      "/textures/skybox/back.png",
    ]);

    scene.background = texture;
  }, [scene]);

  return null;
}
