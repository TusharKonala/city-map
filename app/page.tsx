"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState, useRef, Suspense } from "react";
import { CityScene } from "./components/scene/CityScene";
import { HexCompass } from "./components/ui/HexCompass";
import { MarkerDetailCard } from "./components/ui/MarkerDetailCard";

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
        {/* Previous Button */}
        <button
          disabled={isTransitioning}
          onClick={() => rotateToView("prev")}
          className={`
    nav-arrow-btn left-4 md:left-8
    ${isTransitioning ? "nav-arrow-btn-disabled" : "nav-arrow-btn-enabled"}
  `}
        >
          ←
        </button>

        {/* Next Button */}
        <button
          disabled={isTransitioning}
          onClick={() => rotateToView("next")}
          className={`
    nav-arrow-btn right-4 md:right-8
    ${isTransitioning ? "nav-arrow-btn-disabled" : "nav-arrow-btn-enabled"}
  `}
        >
          →
        </button>

        {/* Map Container */}
        <div
          className="
            relative w-full mx-auto rounded-2xl overflow-hidden
            shadow-2xl border-4 border-gray-700
            h-[300px] md:h-[600px]
            mt-16 md:mt-0
          "
        >
          <Canvas camera={{ position: [0, 25, 40], fov: 60 }} shadows>
            <Suspense fallback={null}>
              <CityScene
                targetRotation={targetRotation}
                controlsRef={controlsRef}
                onTransitionComplete={() => {
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

        {/* Hex Compass */}
        <HexCompass activeIndex={currentView} onSelect={rotateToIndex} />

        {/* Marker Detail Card */}
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
