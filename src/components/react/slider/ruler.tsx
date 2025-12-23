import React, { useId, useMemo } from "react";
import { clamp, cn } from "../../../lib/utils";

const RULER_WIDTH = 182;
const RULER_HEIGHT = 19;
const TICK_COUNT = 19;
const TICK_START_X = 10.5;
const TICK_SPACING = 9;
const TICK_BASE_TOP_Y = 12;
const TICK_ACTIVE_TOP_Y = 4;
const TICK_BOTTOM_Y = 19;

export type TickRulerPillProps = {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  /** Function to format the label based on the current value */
  formatLabel?: (value: number) => React.ReactNode;
  /** Accessibility label for the range input */
  ariaLabel?: string;
};

export const TickRulerPill: React.FC<TickRulerPillProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  formatLabel,
  ariaLabel = "Value selector",
}) => {
  const id = useId();
  const safeValue = clamp(value, min, max);
  const label = useMemo(() => {
    if (formatLabel) return formatLabel(safeValue);
    return Math.round(safeValue);
  }, [safeValue, formatLabel]);

  // Continuous position across ticks
  const position = useMemo(() => {
    if (max === min) return 0;
    const t = (safeValue - min) / (max - min);
    return t * (TICK_COUNT - 1);
  }, [safeValue, min, max]);

  return (
    <div
      className={cn(
        "w-fit relative flex flex-col items-center justify-center border border-neutral-200 dark:border-neutral-800 md:px-2 py-2 select-none rounded-none [--tick-rgb:0,0,0] dark:[--tick-rgb:255,255,255] shadow-xs",
        className
      )}
    >
      <span className="whitespace-nowrap font-medium text-neutral-800 font-mono uppercase text-[10px] md:text-xs">
        {label}
      </span>
      {/* Ruler */}
      <div className="relative">
        <svg
          width={RULER_WIDTH}
          height={RULER_HEIGHT}
          viewBox={`0 0 ${RULER_WIDTH} ${RULER_HEIGHT}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="block"
        >
          {Array.from({ length: TICK_COUNT }, (_, i) => {
            const x = TICK_START_X + i * TICK_SPACING;
            const d = Math.abs(i - position);
            const influence = clamp(1 - d, 0, 1);
            const y1 =
              TICK_BASE_TOP_Y -
              influence * (TICK_BASE_TOP_Y - TICK_ACTIVE_TOP_Y);

            return (
              <line
                key={i}
                x1={x}
                y1={y1}
                x2={x}
                y2={TICK_BOTTOM_Y}
                stroke={`rgba(var(--tick-rgb), ${
                  influence > 0 ? 0.2 + influence * 0.8 : 0.2
                })`}
                strokeWidth={1}
                shapeRendering="crispEdges"
              />
            );
          })}
        </svg>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeValue}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        className="absolute inset-0 opacity-0 h-full w-full cursor-pointer py-4"
      />
    </div>
  );
};
