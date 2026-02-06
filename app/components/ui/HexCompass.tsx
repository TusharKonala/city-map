export function HexCompass({
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
    <div className="hex-compass">
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
                    : "fill-gray-700 active:fill-gray-600"
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
