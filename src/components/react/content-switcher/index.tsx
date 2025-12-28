import { useState, useEffect, useRef } from "react";
import { depthStore, type Depth } from "../../../stores/depthStore";
import { TickRulerPill } from "../slider/ruler";

type LevelConfig = {
  label: string;
  depth: Depth;
};

const LEVELS: LevelConfig[] = [
  { label: "Non-technical", depth: "non-technical" },
  { label: "Moderately technical", depth: "technical" },
  { label: "Highly technical", depth: "deep" },
];

function getLevelConfig(value: number): LevelConfig {
  if (value < 33) return LEVELS[0];
  if (value < 66) return LEVELS[1];
  return LEVELS[2];
}

function getInitialValue(): number {
  if (typeof window === "undefined") return 50;

  const params = new URLSearchParams(window.location.search);
  const depthParam = params.get("depth");

  if (depthParam !== null) {
    const value = parseInt(depthParam, 10);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      return value;
    }
  }

  return 50;
}

export default function ContentSwitcher() {
  const [v, setV] = useState(getInitialValue);
  const urlUpdateTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const { depth } = getLevelConfig(v);
    depthStore.set(depth);
  }, [v]);

  useEffect(() => {
    if (urlUpdateTimerRef.current) {
      clearTimeout(urlUpdateTimerRef.current);
    }

    urlUpdateTimerRef.current = window.setTimeout(() => {
      const currentUrl = new URL(window.location.href);
      const currentDepth = currentUrl.searchParams.get("depth");
      const newDepth = v.toString();

      if (currentDepth !== newDepth) {
        currentUrl.searchParams.set("depth", newDepth);
        window.history.replaceState({}, "", currentUrl.toString());
      }
    }, 300);

    return () => {
      if (urlUpdateTimerRef.current) {
        clearTimeout(urlUpdateTimerRef.current);
      }
    };
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
