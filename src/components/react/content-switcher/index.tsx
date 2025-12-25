import { useState, useEffect } from "react";
import { depthStore, type Depth } from "../../../stores/depthStore";
import { TickRulerPill } from "../slider/ruler";

type LevelConfig = {
  label: string;
  depth: Depth;
};

const LEVELS: LevelConfig[] = [
  { label: "Beginner-friendly", depth: "beginner" },
  { label: "Moderately technical", depth: "technical" },
  { label: "Highly technical", depth: "deep" },
];

function getLevelConfig(value: number): LevelConfig {
  if (value < 33) return LEVELS[0];
  if (value < 66) return LEVELS[1];
  return LEVELS[2];
}

export default function ContentSwitcher() {
  const [v, setV] = useState(50);

  useEffect(() => {
    const { depth } = getLevelConfig(v);
    depthStore.set(depth);
  }, [v]);
  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
      <div className="backdrop-blur-xs">
        <TickRulerPill
          value={v}
          onChange={setV}
          formatLabel={(val) => getLevelConfig(val).label}
          ariaLabel="Technical depth"
        />
      </div>
    </div>
  );
}
