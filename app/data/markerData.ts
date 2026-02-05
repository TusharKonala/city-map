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
