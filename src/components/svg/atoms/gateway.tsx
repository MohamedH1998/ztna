import { motion as m } from "motion/react";
import { COLORS, cn } from "../../../lib/utils";

interface GatewayProps {
  active?: boolean;
  x: number;
  y: number;
  label?: string;
}

export const Gateway = ({ active = false, x, y, label }: GatewayProps) => {
  const centerX = x + 37;
  const centerY = y + 37;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width="74"
        height="74"
        rx="37"
        stroke={active ? COLORS.active : "#b1b1bc"}
        fill="white"
        className="transition-colors duration-500"
      />
      <m.rect
        x={x + 11.5}
        y={y + 11.5}
        width="51"
        height="51"
        rx="25.5"
        fill={active ? COLORS.active : "#b1b1bc"}
        initial={false}
        animate={{
          scale: active ? 1.35 : 1,
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
            y={y + 77}
            width={label.length * 6 + 8}
            height="16"
            fill="white"
            stroke="#e5e5e5"
            strokeWidth="0.5"
          />
          <text
            x={centerX}
            y={y + 87.5}
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
