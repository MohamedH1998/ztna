"use client";

import { useCallback, useState } from "react";

import { cn } from "../../../lib/utils";

interface SliderFiveProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  className?: string;
  rounded?: string;
  height?: string;
  labels?: string[];
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 0,
  value: controlledValue,
  rounded = "rounded-full",
  height = "h-1.5",
  onValueChange,
  className = "",
  labels,
}: SliderFiveProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);

      if (onValueChange) {
        onValueChange(newValue);
      } else {
        setInternalValue(newValue);
      }
    },
    [onValueChange]
  );

  // Calculate position for visual representation
  const position = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("relative flex w-full items-center py-4 flex-col", className)}>
      <div className={`relative ${height} w-full`}>
        {/* Background track */}
        <div className={`absolute inset-0 ${rounded} bg-neutral-200`} />

        {/* Fill track */}
        <div
          className={`absolute h-full ${rounded} bg-black pointer-events-none`}
          style={{
            left: "0%",
            right: `${100 - position}%`,
          }}
        />

        {/* Native range input (invisible but functional) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="slider-custom absolute inset-0 cursor-pointer"
        />

        {/* Visual thumb (cosmetic only) */}
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div
            className={`h-5 w-5 ${rounded} border-2 border-black bg-white`}
          />
        </div>
      </div>
      {labels && (
          <div className="flex justify-between py-2 w-full text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            {labels.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
        )}
    </div>
  );
}
