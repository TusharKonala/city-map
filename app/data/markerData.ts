export const MARKER_DATA: Record<
  number,
  {
    title: string;
    level: number;
    element: string;
    attack: number;
    defense: number;
  }
> = {
  2: {
    title: "Crystal Core",
    level: 10,
    element: "Light",
    attack: 120,
    defense: 90,
  },

  7: {
    title: "Fire Tower",
    level: 5,
    element: "Fire",
    attack: 80,
    defense: 40,
  },

  8: {
    title: "Water Tower",
    level: 4,
    element: "Water",
    attack: 60,
    defense: 70,
  },

  9: {
    title: "Wind Tower",
    level: 6,
    element: "Wind",
    attack: 90,
    defense: 30,
  },

  10: {
    title: "Light Tower",
    level: 7,
    element: "Light",
    attack: 95,
    defense: 60,
  },

  11: {
    title: "Dark Tower",
    level: 7,
    element: "Dark",
    attack: 100,
    defense: 55,
  },

  12: {
    title: "Ballista",
    level: 5,
    element: "Siege",
    attack: 85,
    defense: 35,
  },
};
