import { RotatingControls } from "../controls/RotatingControls";
import { Marker } from "../markers/Marker";
import { CityGround } from "../world/CityGround";
import { GLBModel } from "../world/GLBModel";
import { Skybox } from "../world/Skybox";
import { ASSETS } from "@/app/data/assets";

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
      {ASSETS.map((asset) => (
        <GLBModel
          key={asset.id}
          path={asset.model}
          position={asset.position}
          scale={asset.scale}
        />
      ))}

      {/*Each Glb model has a corresponding marker except for 'map'*/}
      {ASSETS.filter((a) => a.id !== 1 && !a.model.includes("wallGate")).map(
        (asset) => (
          <Marker
            key={asset.id}
            id={asset.id}
            onSelect={onMarkerSelect}
            position={[
              asset.position[0] + asset.markerOffset![0],
              asset.position[1] + asset.markerOffset![1],
              asset.position[2] + asset.markerOffset![2],
            ]}
          />
        ),
      )}

      <RotatingControls
        targetRotation={targetRotation}
        controlsRef={controlsRef}
        onComplete={onTransitionComplete}
      />
    </>
  );
}
