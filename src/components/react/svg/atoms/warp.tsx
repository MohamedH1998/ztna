import { motion as m } from "motion/react";
import { COLORS, cn } from "../../../../lib/utils";

interface WarpProps {
  active?: boolean;
  x: number;
  y: number;
  label?: string;
  processing?: boolean;
  showMultipleRects?: boolean;
}

export const Warp = ({
  active = false,
  x,
  y,
  label,
  showMultipleRects,
}: WarpProps) => {
  const centerX = x + 16.5;
  const centerY = y + 16.5;

  // Show 4 rects when processing and active, otherwise show 1

  // 2x2 grid of rects - each 6x6 with 3px spacing
  const gridRects = [
    { x: x + 9, y: y + 9 }, // top-left
    { x: x + 18, y: y + 9 }, // top-right
    { x: x + 9, y: y + 18 }, // bottom-left
    { x: x + 18, y: y + 18 }, // bottom-right
  ];

  // Single centered rect - 9x9
  const singleRect = { x: x + 12, y: y + 12 };

  return (
    <g>
      <rect
        x={x}
        y={y}
        width="33"
        height="33"
        stroke={active ? COLORS.active : "#b1b1bc"}
        fill="white"
        className="transition-colors duration-500"
      />
      {showMultipleRects ? (
        gridRects.map((rect, i) => (
          <m.rect
            key={i}
            x={rect.x}
            y={rect.y}
            width="6"
            height="6"
            fill={active ? COLORS.active : "#b1b1bc"}
            initial={false}
            animate={{
              scale: active ? 1.2 : 1,
            }}
            style={{
              transformOrigin: `${centerX}px ${centerY}px`,
            }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))
      ) : (
        <m.rect
          x={singleRect.x}
          y={singleRect.y}
          width="9"
          height="9"
          fill={active ? COLORS.active : "#b1b1bc"}
          initial={false}
          animate={{
            scale: active ? 1.2 : 1,
          }}
          style={{
            transformOrigin: `${centerX}px ${centerY}px`,
          }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      )}
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
