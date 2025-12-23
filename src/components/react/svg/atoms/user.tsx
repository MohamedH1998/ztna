import { motion as m } from "motion/react";
import { COLORS, cn } from "../../../../lib/utils";

interface UserProps {
  active?: boolean;
  x: number;
  y: number;
  label?: string;
  width?: number;
  rx?: number;
  ry?: number;
  height?: number;
}

export const User = ({
  active = false,
  x,
  y,
  label,
  width = 33,
  height = 33,
  rx = 16.5,
  ry = 16.5,
}: UserProps) => {
  const centerX = x + 16.5;
  const centerY = y + 16.5;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={rx}
        ry={ry}
        stroke={active ? COLORS.active : "#b1b1bc"}
        fill="white"
        className="transition-colors duration-500"
      />
      <m.circle
        cx={centerX}
        cy={centerY}
        r="5"
        fill={active ? COLORS.active : "#b1b1bc"}
        initial={false}
        animate={{
          scale: active ? 1.15 : 1,
        }}
        style={{
          transformOrigin: `${centerX}px ${centerY}px`,
        }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
      {label && (
        <>
          <rect
            x={centerX - (label.length * 6 + 8) / 2}
            y={y + 36}
            width={label.length * 6 + 8}
            height="16"
            fill="white"
            stroke="#e5e5e5"
            strokeWidth="0.5"
          />
          <text
            x={centerX}
            y={y + 46.5}
            textAnchor="middle"
            className={cn(
              "font-mono text-[8px] uppercase tracking-wider transition-colors duration-200 fill-current",
              active
                ? "text-[#2b2b30] dark:text-neutral-300"
                : "text-[#6b6b74] dark:text-neutral-600"
            )}
          >
            {label}
          </text>
        </>
      )}
    </g>
  );
};
