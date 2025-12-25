import React, { useMemo } from "react";
import { clamp, cn } from "../../../lib/utils";
import { Slider } from "./index";

const CONFIG = {
  width: 182,
  height: 19,
  tickStartX: 10.5,
  tickSpacing: 9,
  tickBaseTopY: 12,
  tickActiveTopY: 4,
  tickBottomY: 19,
  tickCount: 19,
};

export type TickRulerPillProps = {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  formatLabel?: (value: number) => React.ReactNode;
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
  const safeValue = clamp(value, min, max);

  const label = useMemo(() => {
    if (formatLabel) return formatLabel(safeValue);
    return Math.round(safeValue);
  }, [safeValue, formatLabel]);

  const position = useMemo(() => {
    if (max === min) return 0;
    const t = (safeValue - min) / (max - min);
    return t * (CONFIG.tickCount - 1);
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
      <div className="">
        <svg
          width={CONFIG.width}
          height={CONFIG.height}
          viewBox={`0 0 ${CONFIG.width} ${CONFIG.height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="block"
        >
          {Array.from({ length: CONFIG.tickCount }, (_, i) => {
            const x = CONFIG.tickStartX + i * CONFIG.tickSpacing;
            const d = Math.abs(i - position);
            const influence = clamp(1 - d, 0, 1);
            const y1 =
              CONFIG.tickBaseTopY -
              influence * (CONFIG.tickBaseTopY - CONFIG.tickActiveTopY);

            return (
              <line
                key={i}
                x1={x}
                y1={y1}
                x2={x}
                y2={CONFIG.tickBottomY}
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
      <Slider
        className="absolute opacity-0 p-0"
        rounded="rounded-none"
        height="h-10"
        value={safeValue}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v as number)}
        aria-label={ariaLabel}
      />
    </div>
  );
};
