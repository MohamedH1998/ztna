import { motion as m } from "motion/react";
import { COLORS, cn } from "../../../../lib/utils";

interface IdPProps {
  active?: boolean;
  x: number;
  y: number;
  label?: string;
}

export const IdP = ({ active = false, x, y, label }: IdPProps) => {
  // Original shape was centered at x=126, y=20
  // Calculate offset from original position
  const offsetX = x - 109.18;
  const offsetY = y - 0.576172;

  const centerX = x + 16.82;
  const centerY = y + 19.424;

  return (
    <g>
      <path
        d={`M${offsetX + 142.82} ${offsetY + 10.2881}V${offsetY + 29.7109}L${
          offsetX + 126
        } ${offsetY + 39.4229}L${offsetX + 109.18} ${offsetY + 29.7109}V${
          offsetY + 10.2881
        }L${offsetX + 126} ${offsetY + 0.576172}L${offsetX + 142.82} ${
          offsetY + 10.2881
        }Z`}
        stroke={active ? COLORS.active : "#b1b1bc"}
        fill="white"
        className="transition-colors duration-500"
      />
      <m.circle
        cx={centerX}
        cy={centerY}
        r="10"
        fill={active ? COLORS.active : "#b1b1bc"}
        initial={false}
        animate={{
          scale: active ? 1.3 : 1,
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
            y={y + 43}
            width={label.length * 6 + 8}
            height="16"
            fill="white"
            stroke="#e5e5e5"
            strokeWidth="0.5"
          />
          <text
            x={centerX}
            y={y + 53.5}
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
