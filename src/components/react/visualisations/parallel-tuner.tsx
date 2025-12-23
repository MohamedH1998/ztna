import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../lib/utils";
import Slider from "../slider";
import { VisualizationBody, VisualizationContainer, VisualizationHeader } from "./layout";

// Generate a random permutation of 0..99 once to ensure stable random fill order
const generateShuffledIndices = () => {
  const indices = Array.from({ length: 100 }, (_, i) => i);
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
};

const StatusIndicator = ({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) => (
  <div className="flex items-center gap-2">
    <div
      className={cn(
        "w-1.5 h-1.5 rounded-full",
        active ? "bg-[#f56500]" : "bg-neutral-300 dark:bg-neutral-700"
      )}
    />
    <span
      className={cn(
        "font-mono text-[10px] uppercase tracking-wide",
        active
          ? "text-neutral-900 dark:text-white"
          : "text-neutral-400 dark:text-neutral-600"
      )}
    >
      {label}
    </span>
  </div>
);

const Header = ({
  mix,
  setMix,
}: {
  mix: number;
  setMix: (val: number) => void;
}) => (
  <VisualizationHeader className="block h-auto p-0">
    <div className="flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800 ">
      <div className="flex items-center justify-between w-full py-3">
        <span className="font-mono text-xs font-medium uppercase tracking-widest dark:text-white">
          Primitives
        </span>
        <div className="flex gap-4">
          <StatusIndicator label="Legacy" active={false} />
          <StatusIndicator label="Zero Trust" active={true} />
        </div>
      </div>
    </div>

    <div className="w-full px-4 py-2 pt-5">
      <Slider
        value={mix}
        onChange={setMix}
        min={0}
        max={100}
        labels={["Legacy Only", "Parallel", "Full Zero Trust"]}
      />
    </div>
  </VisualizationHeader>
);

const ParallelTuner = () => {
  const [mix, setMix] = useState(30);
  // We use state for indices so they don't reshuffle on every render
  const [shuffledIndices] = useState(generateShuffledIndices);

  // Determine active cells based on mix %
  const activeSet = useMemo(() => {
    // Number of cells to turn "Zero Trust"
    const count = Math.round(mix);
    // Slice the shuffled array to get the random IDs
    return new Set(shuffledIndices.slice(0, count));
  }, [mix, shuffledIndices]);

  return (
    <VisualizationContainer>
      <Header mix={mix} setMix={setMix} />

      {/* Visualization Grid */}
      <VisualizationBody className="p-8 sm:p-12 flex justify-center bg-neutral-50/50 dark:bg-neutral-900/50">
        <div
          className="grid gap-1.5 sm:gap-2"
          style={{ gridTemplateColumns: "repeat(10, 1fr)" }}
        >
          {Array.from({ length: 100 }).map((_, i) => (
            <Cell key={i} active={activeSet.has(i)} />
          ))}
        </div>
      </VisualizationBody>
    </VisualizationContainer>
  );
};

const Cell = React.memo(({ active }: { active: boolean }) => {
  return (
    <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5">
      <motion.div
        layout
        initial={false}
        animate={{
          scale: active ? 1 : 0.85,
          backgroundColor: active ? "var(--color-active)" : "transparent",
          borderColor: active ? "transparent" : "var(--color-inactive)",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
        style={{
          // @ts-ignore
          "--color-active": "currentColor",
          "--color-inactive": "var(--border-color)",
        }}
        className={cn(
          "w-full h-full rounded-[1px] border transition-colors duration-300",
          active
            ? "text-[#f56500] border-gray-500" // Active styles
            : "text-gray-500 border-neutral-800 dark:border-neutral-200 bg-neutral-900 dark:bg-white" // Inactive styles (Legacy)
        )}
      >
        {/* Inner Dot for Legacy State */}
        <AnimatePresence>
          {!active && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="w-full h-full flex items-center justify-center"
            >
              {/* No inner dot needed if we fill the legacy ones */}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
});

export default ParallelTuner;
