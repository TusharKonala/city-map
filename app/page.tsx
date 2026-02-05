"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Text, useGLTF } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

function Skybox() {
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

function GLBModel({
  path,
  position = [0, 0, 0],
  targetSize = 10, // desired max size in world units
  scale = 1,
}: {
  path: string;
  position?: [number, number, number];
  targetSize?: number;
  scale?: number;
}) {
  const { scene } = useGLTF(path);

  useEffect(() => {
    scene.scale.set(1, 1, 1);

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);

    const maxAxis = Math.max(size.x, size.y, size.z);
    const autoScale = targetSize / maxAxis;

    scene.scale.setScalar(autoScale * scale);
  }, [scene, targetSize]);

  return <primitive object={scene} position={position} />;
}

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

function RotatingControls({
  targetRotation,
  controlsRef,
  onComplete,
}: {
  targetRotation: number;
  controlsRef: React.RefObject<any>;
  onComplete: () => void;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const startTimeRef = useRef(0);
  const MIN_ANIMATION_DURATION = 20; // 50ms minimum

  useFrame((state) => {
    if (!controlsRef.current || !isAnimating) return;

    const currentAzimuthal = controlsRef.current.getAzimuthalAngle?.();
    if (currentAzimuthal === undefined) return;

    const diff = targetRotation - currentAzimuthal;
    const normalizedDiff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
    const elapsed = state.clock.elapsedTime * 1000 - startTimeRef.current;

    if (Math.abs(normalizedDiff) > 0.01 && elapsed < MIN_ANIMATION_DURATION) {
      const easeFactor = Math.min(0.35, Math.abs(normalizedDiff) * 0.6);
      controlsRef.current.setAzimuthalAngle(
        currentAzimuthal + normalizedDiff * easeFactor,
      );
    } else {
      // Force complete after minimum duration
      setIsAnimating(false);
      onComplete();
    }
  });

  useEffect(() => {
    if (targetRotation !== undefined) {
      startTimeRef.current = performance.now();
      setIsAnimating(true);
    }
  }, [targetRotation]);

  return null;
}

function CityScene({
  targetRotation,
  controlsRef,
  onTransitionComplete,
}: {
  targetRotation: number;
  controlsRef: React.RefObject<any>;
  onTransitionComplete: () => void;
}) {
  return (
    <>
      <Skybox />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <CityGround />

      {/* Assembled GLB assets from ZIP */}
      <GLBModel path="/models/map.glb" scale={0.5} />

      <GLBModel path="/models/wallGate.glb" position={[0, 0, -8]} scale={1} />

      <GLBModel
        path="/models/fireTower.glb"
        position={[11, 0, 7]}
        scale={0.7}
      />

      <GLBModel
        path="/models/centerCrystal.glb"
        position={[0, 0, 0]}
        scale={0.7}
      />

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

      <RotatingControls
        targetRotation={targetRotation}
        controlsRef={controlsRef}
        onComplete={onTransitionComplete}
      />
    </>
  );
}

export default function Home() {
  const [currentView, setCurrentView] = useState(0);
  const [targetRotation, setTargetRotation] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const controlsRef = useRef<any>(null);

  const rotateToView = (direction: "next" | "prev") => {
    if (isTransitioning) return;

    // Reset immediately for instant responsiveness
    setIsTransitioning(true);

    const newView =
      direction === "next" ? (currentView + 1) % 6 : (currentView - 1 + 6) % 6;

    setCurrentView(newView);
    setTargetRotation((newView * Math.PI) / 3);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Left Previous Button */}
        <button
          onClick={() => rotateToView("prev")}
          className={`absolute left-8 top-1/2 -translate-y-1/2 px-4 py-4 bg-gray-700/90 hover:bg-gray-600 text-white font-bold rounded-xl shadow-lg transition-all border border-gray-600 hover:shadow-xl hover:border-gray-500 backdrop-blur-sm z-10 w-14 h-14 flex items-center justify-center text-xl ${isTransitioning ? "opacity-50 cursor-not-allowed animate-pulse" : ""}`}
          title="Previous View"
        >
          ←
        </button>

        {/* Right Next Button */}
        <button
          onClick={() => rotateToView("next")}
          className={`absolute right-8 top-1/2 -translate-y-1/2 px-4 py-4 bg-gray-700/90 hover:bg-gray-600 text-white font-bold rounded-xl shadow-lg transition-all border border-gray-600 hover:shadow-xl hover:border-gray-500 backdrop-blur-sm z-10 w-14 h-14 flex items-center justify-center text-xl ${isTransitioning ? "opacity-50 cursor-not-allowed animate-pulse" : ""}`}
          title="Next View"
        >
          →
        </button>

        <div className="w-full aspect-video max-h-[600px] mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-700 relative">
          <Canvas camera={{ position: [0, 15, 25], fov: 60 }} shadows>
            <Suspense fallback={null}>
              <CityScene
                targetRotation={targetRotation}
                controlsRef={controlsRef}
                onTransitionComplete={() => {
                  // Add small delay to ensure frame completes
                  requestAnimationFrame(() => {
                    setIsTransitioning(false);
                  });
                }}
              />
              <OrbitControls
                ref={controlsRef}
                enablePan={false}
                enableZoom={true}
                enableRotate={false}
                minDistance={15}
                maxDistance={50}
                makeDefault
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </main>
  );
}

useGLTF.preload("/models/map.glb");
useGLTF.preload("/models/wallGate.glb");
useGLTF.preload("/models/fireTower.glb");
useGLTF.preload("/models/centerCrystal.glb");
