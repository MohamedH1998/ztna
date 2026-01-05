import React, { useState } from "react";
import { User, IdP, Warp, Gateway, Tunnel, App } from "../svg/atoms";
import { cn } from "../../../lib/utils";

const LEGEND_ITEMS = [
  {
    Icon: ({ x, y, active }: { x: number; y: number; active: boolean }) => (
      <User active={active} x={x} y={y} />
    ),
    x: 23.5,
    y: 23.5,
    label: "Origin",
    description: "User / device. Initiates intent. No authority.",
  },
  {
    Icon: ({ x, y, active }: { x: number; y: number; active: boolean }) => (
      <IdP active={active} x={x} y={y} />
    ),
    x: 23.18,
    y: 20.576,
    label: "Authority",
    description: "IdP. Verifies identity, issues trust.",
  },
  {
    Icon: ({ x, y, active }: { x: number; y: number; active: boolean }) => (
      <Warp active={active} x={x} y={y} />
    ),
    x: 23.5,
    y: 23.5,
    label: "Agent",
    description: "WARP. Acts for user. Carries identity + posture.",
  },
  {
    Icon: ({ x, y, active }: { x: number; y: number; active: boolean }) => (
      <Gateway active={active} x={x} y={y} />
    ),
    x: 3,
    y: 3,
    label: "Control plane",
    description: "Gateway. Evaluates policy. Chokepoint. Highest blast radius.",
  },
  {
    Icon: ({ x, y, active }: { x: number; y: number; active: boolean }) => (
      <Tunnel active={active} x={x} y={y} />
    ),
    x: 10,
    y: 23.5,
    label: "Transport",
    description: "Tunnel. Private reachability only. Never decides.",
  },
  {
    Icon: ({ x, y, active }: { x: number; y: number; active: boolean }) => (
      <App active={active} x={x} y={y} />
    ),
    x: 30.5,
    y: 30.5,
    label: "Application",
    description: "Destination. Receives requests, returns responses.",
  },
] as const;

// Memoized legend item component to prevent unnecessary re-renders
const LegendItem = React.memo(({
  item,
  index,
  isHovered
}: {
  item: typeof LEGEND_ITEMS[number],
  index: number,
  isHovered: boolean
}) => (
  <div
    className={cn(
      `flex items-start gap-4 border-r  border-neutral-200 dark:border-neutral-800 p-4 h-full`,
      index < 3 && "border-b"
    )}
  >
    <svg
      viewBox="0 0 80 80"
      className="w-16 h-16 flex-shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <item.Icon
        x={item.x}
        y={item.y}
        active={isHovered}
      />
    </svg>
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {item.label}
      </span>
      <span className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
        {item.description}
      </span>
    </div>
  </div>
));

const Legend = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full hidden md:block border-t border-neutral-200 dark:border-neutral-800">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {LEGEND_ITEMS.map((item, index) => (
          <div
            key={index}
            tabIndex={0}
            role="button"
            aria-label={`${item.label}: ${item.description}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
            className="focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
          >
            <LegendItem
              item={item}
              index={index}
              isHovered={hoveredIndex === index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
