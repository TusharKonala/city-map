import { RotatingControls } from "../controls/RotatingControls";
import { Marker } from "../markers/Marker";
import { Building } from "../world/Building";
import { CityGround } from "../world/CityGround";
import { GLBModel } from "../world/GLBModel";
import { Skybox } from "../world/Skybox";

export function CityScene({
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
