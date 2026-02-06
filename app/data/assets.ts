export interface AssetConfig {
  id: number;
  model: string;
  position: [number, number, number];
  scale: number;
  markerOffset?: [number, number, number];
}

export const ASSETS: AssetConfig[] = [
  {
    id: 1,
    model: "/models/map.glb",
    position: [0, 0, 0],
    scale: 5.2,
  },
  {
    id: 2,
    model: "/models/centerCrystal.glb",
    position: [0, -3, 0],
    scale: 1,
    markerOffset: [3, 17, 0],
  },
  {
    id: 3,
    model: "/models/wallGate1.glb",
    position: [-6, 5, 21],
    scale: 1,
  },
  {
    id: 4,
    model: "/models/wallGate2.glb",
    position: [5, 5, 21],
    scale: 1,
  },
  {
    id: 5,
    model: "/models/wallGate3.glb",
    position: [6, 5, -21],
    scale: 1,
  },
  {
    id: 6,
    model: "/models/wallGate4.glb",
    position: [-5, 5, -21],
    scale: 1,
  },
  {
    id: 7,
    model: "/models/fireTower.glb",
    position: [16.5, 4.5, 9.5],
    scale: 0.9,
    markerOffset: [0, 9, -2.5],
  },

  {
    id: 8,
    model: "/models/waterTower.glb",
    position: [-15, 4.5, 9],
    scale: 0.9,
    markerOffset: [-2.5, 9.5, 0],
  },

  {
    id: 9,
    model: "/models/windTower.glb",
    position: [-16, 4.5, -9],
    scale: 0.9,
    markerOffset: [-2, 8.5, -1],
  },

  {
    id: 10,
    model: "/models/lightTower.glb",
    position: [16, 4.5, -9],
    scale: 0.9,
    markerOffset: [2, 8.5, 0],
  },

  {
    id: 11,
    model: "/models/darkTower.glb",
    position: [0, 4.5, -18],
    scale: 0.9,
    markerOffset: [-2, 9.5, -1],
  },
  {
    id: 12,
    model: "/models/ballista.glb",
    position: [0, 4.5, 17],
    scale: 1.1,
    markerOffset: [1.9, 7, 2],
  },
];
