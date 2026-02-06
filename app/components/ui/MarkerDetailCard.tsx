import { MARKER_DATA } from "@/app/data/markerData";

export function MarkerDetailCard({
  markerId,
  onClose,
}: {
  markerId: number;
  onClose: () => void;
}) {
  const data = MARKER_DATA[markerId];
  if (!data) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm">
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
