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
  onSelect,
}: {
  position: [number, number, number];
  id: number;
  onSelect: (id: number) => void;
}) {
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
  const onCompleteRef = useRef(onComplete);
  const MIN_ANIMATION_DURATION = 20;

  // keep ref updated without breaking deps
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useFrame((state) => {
    if (!controlsRef.current || !isAnimating) return;

    const currentAzimuthal = controlsRef.current.getAzimuthalAngle?.();
    if (currentAzimuthal === undefined) return;

    const diff = targetRotation - currentAzimuthal;
    const normalizedDiff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
    const elapsed = state.clock.elapsedTime * 1000 - startTimeRef.current;

    if (Math.abs(normalizedDiff) > 0.01 && elapsed < MIN_ANIMATION_DURATION) {
      const easeFactor = 0.4;
      controlsRef.current.setAzimuthalAngle(
        currentAzimuthal + normalizedDiff * easeFactor,
      );
    } else {
      setIsAnimating(false);
      onCompleteRef.current();
    }
  });

  useEffect(() => {
    startTimeRef.current = performance.now();
    setIsAnimating(true);
  }, [targetRotation]);

  return null;
}

function CityScene({
  targetRotation,
  controlsRef,
  onTransitionComplete,
  onMarkerSelect,
}: {
  targetRotation: number;
  controlsRef: React.RefObject<any>;
  onTransitionComplete: () => void;
  onMarkerSelect: (id: number) => void;
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
      <Marker
        position={[5, 0, 5] as [number, number, number]}
        id={1}
        onSelect={onMarkerSelect}
      />
      <Marker
        position={[-8, 0, 3] as [number, number, number]}
        id={2}
        onSelect={onMarkerSelect}
      />
      <Marker
        position={[2, 0, -10] as [number, number, number]}
        id={3}
        onSelect={onMarkerSelect}
      />
      <Marker
        position={[12, 0, -5] as [number, number, number]}
        id={4}
        onSelect={onMarkerSelect}
      />
      <Marker
        position={[-5, 0, 12] as [number, number, number]}
        id={5}
        onSelect={onMarkerSelect}
      />
      <Marker
        position={[8, 0, 8] as [number, number, number]}
        id={6}
        onSelect={onMarkerSelect}
      />

      <RotatingControls
        targetRotation={targetRotation}
        controlsRef={controlsRef}
        onComplete={onTransitionComplete}
      />
    </>
  );
}

function HexCompass({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const center = { x: 50, y: 50 };
  const points = [
    [50, 0], // top
    [100, 25], // top-right
    [100, 75], // bottom-right
    [50, 100], // bottom
    [0, 75], // bottom-left
    [0, 25], // top-left
  ];

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-32 h-32">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {points.map((p, i) => {
          const next = points[(i + 1) % points.length];

          const d = `
            M ${center.x} ${center.y}
            L ${p[0]} ${p[1]}
            L ${next[0]} ${next[1]}
            Z
          `;

          return (
            <path
              key={i}
              d={d}
              onClick={() => onSelect(i)}
              className={`cursor-pointer transition-colors
                ${
                  activeIndex === i
                    ? "fill-blue-500"
                    : "fill-gray-700 hover:fill-gray-600"
                }`}
              stroke="#1f2937"
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </div>
  );
}

function MarkerDetailCard({
  markerId,
  onClose,
}: {
  markerId: number;
  onClose: () => void;
}) {
  const data = MARKER_DATA[markerId];
  if (!data) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm">
      <div className="bg-gradient-to-br from-yellow-500 to-amber-800 p-[2px] rounded-xl">
        <div className="bg-gray-900 rounded-xl p-4 text-white">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">{data.title}</h2>
            <button onClick={onClose} className="text-gray-400">
              ✕
            </button>
          </div>

          <p className="text-sm text-gray-300">Level: {data.level}</p>
          <p className="text-sm text-gray-300">Element: {data.element}</p>

          <div className="mt-3 flex justify-between text-sm">
            <span>⚔️ Attack: {data.attack}</span>
            <span>🛡 Defense: {data.defense}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const MARKER_DATA: Record<
  number,
  {
    title: string;
    level: number;
    element: string;
    attack: number;
    defense: number;
  }
> = {
  1: {
    title: "Fire Tower",
    level: 5,
    element: "Fire",
    attack: 80,
    defense: 40,
  },
  2: { title: "Ice Gate", level: 3, element: "Ice", attack: 50, defense: 60 },
  3: {
    title: "Earth Node",
    level: 4,
    element: "Earth",
    attack: 65,
    defense: 70,
  },
  4: {
    title: "Wind Spire",
    level: 6,
    element: "Wind",
    attack: 90,
    defense: 30,
  },
  5: {
    title: "Shadow Hub",
    level: 7,
    element: "Dark",
    attack: 95,
    defense: 50,
  },
  6: {
    title: "Crystal Core",
    level: 10,
    element: "Light",
    attack: 120,
    defense: 90,
  },
};

export default function Home() {
  const [currentView, setCurrentView] = useState(0);
  const [targetRotation, setTargetRotation] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);

  const controlsRef = useRef<any>(null);

  const rotateToView = (direction: "next" | "prev") => {
    const newView =
      direction === "next" ? (currentView + 1) % 6 : (currentView - 1 + 6) % 6;

    if (newView === currentView) return;

    setIsTransitioning(true);
    setCurrentView(newView);
    setTargetRotation((newView * Math.PI) / 3);
  };

  const rotateToIndex = (index: number) => {
    if (index === currentView) return;

    setIsTransitioning(true);
    setCurrentView(index);
    setTargetRotation((index * Math.PI) / 3);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Left Previous Button */}
        <button
          disabled={isTransitioning}
          onClick={() => rotateToView("prev")}
          className={`absolute left-8 top-1/2 -translate-y-1/2 px-4 py-4 bg-gray-700/90 hover:bg-gray-600 text-white font-bold rounded-xl shadow-lg transition-all border border-gray-600 hover:shadow-xl hover:border-gray-500 backdrop-blur-sm z-10 w-14 h-14 flex items-center justify-center text-xl  ${isTransitioning ? "opacity-50 cursor-not-allowed animate-pulse" : ""}`}
          title="Previous View"
        >
          ←
        </button>

        {/* Right Next Button */}
        <button
          disabled={isTransitioning}
          onClick={() => rotateToView("next")}
          className={`absolute right-8 top-1/2 -translate-y-1/2 px-4 py-4 bg-gray-700/90 hover:bg-gray-600 text-white font-bold rounded-xl shadow-lg transition-all border border-gray-600 hover:shadow-xl hover:border-gray-500 backdrop-blur-sm z-10 w-14 h-14 flex items-center justify-center text-xl  ${isTransitioning ? "opacity-50 cursor-not-allowed animate-pulse" : ""}`}
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
                onMarkerSelect={(id) => setSelectedMarker(id)}
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
        <HexCompass activeIndex={currentView} onSelect={rotateToIndex} />
        {selectedMarker && (
          <MarkerDetailCard
            markerId={selectedMarker}
            onClose={() => setSelectedMarker(null)}
          />
        )}
      </div>
    </main>
  );
}

useGLTF.preload("/models/map.glb");
useGLTF.preload("/models/wallGate.glb");
useGLTF.preload("/models/fireTower.glb");
useGLTF.preload("/models/centerCrystal.glb");
