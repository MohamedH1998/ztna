export interface AbstractPlaneProps {
  active: boolean;
  label?: string;
  zIndex: number;
  pattern?: "solid" | "grid" | "diagonal" | "dots" | "waves";
  outlineStyle?: "solid" | "dashed";
  className?: string;
  // New props for split layer support
  split?: boolean;
  secondaryPattern?: "solid" | "grid" | "diagonal" | "dots" | "waves";
  secondaryLabel?: string;
  // Control which parts of a split layer are visible (useful for legend)
  showSplitPart?: "both" | "primary" | "secondary";
}

export const AbstractPlane = ({
  active,
  label,
  zIndex,
  pattern = "solid", // distinct visual texture
  outlineStyle = "solid",
  className = "w-full h-auto",
  split = false,
  secondaryPattern,
  secondaryLabel,
  showSplitPart = "both",
}: AbstractPlaneProps) => {
  const strokeColor = active ? "#f56500" : "#737373"; // Lighter grey for better visibility
  const fillColor = active ? "#f56500" : "#262626"; // Slightly lighter fill for depth

  // Dynamic base opacity based on zIndex/layer-depth
  // Significantly increased for better visibility/prominence
  const baseFillOpacity = active ? 0.15 : 0.05 + zIndex * 0.02;

  const showPrimary =
    !split || showSplitPart === "both" || showSplitPart === "primary";
  const showSecondary =
    split && (showSplitPart === "both" || showSplitPart === "secondary");

  return (
    <svg
      className={`${className} overflow-visible`}
      viewBox="0 0 300 180"
      fill="none"
    >
      {/* Pattern Definitions - Enhanced for visibility */}
      <defs>
        <pattern
          id="diagonalHatch"
          width="4"
          height="4"
          patternTransform="rotate(60 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="4"
            stroke={strokeColor}
            strokeWidth="1.2"
            strokeOpacity="1"
          />
        </pattern>
        <pattern
          id="gridPattern"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 8 0 L 0 0 0 8"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1"
            strokeOpacity="0.8"
          />
        </pattern>
        <pattern
          id="dotPattern"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1.1" fill={strokeColor} fillOpacity="1" />
        </pattern>
        <pattern
          id="wavesPattern"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 0 3 Q 1.5 0 3 3 T 6 3"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1"
            strokeOpacity="0.9"
          />
        </pattern>
      </defs>

      {/* Render Single Plane or Split Plane */}
      {!split ? (
        <>
          {/* Main Plane Outline */}
          <path
            d="M150 20 L280 90 L150 160 L20 90 L150 20Z"
            fill={fillColor}
            fillOpacity={baseFillOpacity}
            stroke={strokeColor}
            strokeWidth={active ? 2.5 : 1.5}
            strokeDasharray={outlineStyle === "dashed" ? "6 3" : "none"}
          />
          {/* Internal Texture/Pattern Fill */}
          <path
            d="M150 20 L280 90 L150 160 L20 90 L150 20Z"
            fill={
              pattern === "diagonal"
                ? "url(#diagonalHatch)"
                : pattern === "grid"
                ? "url(#gridPattern)"
                : pattern === "dots"
                ? "url(#dotPattern)"
                : pattern === "waves"
                ? "url(#wavesPattern)"
                : "none"
            }
            fillOpacity={active ? 1 : 0.9}
            style={{ pointerEvents: "none" }}
          />
          {/* Solid variant special handling */}
          {pattern === "solid" && (
            <path
              d="M150 40 L243 90 L150 140 L57 90 L150 40Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}
        </>
      ) : (
        <>
          {/* Bottom-Left Half (Secondary Pattern - e.g. User) */}
          {/* Split points: (85, 55) and (215, 125) which are midpoints of top-left and bottom-right edges */}
          {showSecondary && (
            <>
              <path
                d="M20 90 L150 160 L215 125 L85 55 Z"
                fill={fillColor}
                fillOpacity={baseFillOpacity}
                stroke={strokeColor}
                strokeWidth={active ? 2.5 : 1.5}
                strokeDasharray={outlineStyle === "dashed" ? "6 3" : "none"}
              />
              <path
                d="M20 90 L150 160 L215 125 L85 55 Z"
                fill={
                  secondaryPattern === "diagonal"
                    ? "url(#diagonalHatch)"
                    : secondaryPattern === "grid"
                    ? "url(#gridPattern)"
                    : secondaryPattern === "dots"
                    ? "url(#dotPattern)"
                    : secondaryPattern === "waves"
                    ? "url(#wavesPattern)"
                    : "none"
                }
                fillOpacity={active ? 1 : 0.9}
                style={{ pointerEvents: "none" }}
              />
            </>
          )}

          {/* Top-Right Half (Primary Pattern - e.g. Device) */}
          {showPrimary && (
            <>
              <path
                d="M150 20 L280 90 L215 125 L85 55 Z"
                fill={fillColor}
                fillOpacity={baseFillOpacity}
                stroke={strokeColor}
                strokeWidth={active ? 2.5 : 1.5}
                strokeDasharray={outlineStyle === "dashed" ? "6 3" : "none"}
              />
              <path
                d="M150 20 L280 90 L215 125 L85 55 Z"
                fill={
                  pattern === "diagonal"
                    ? "url(#diagonalHatch)"
                    : pattern === "grid"
                    ? "url(#gridPattern)"
                    : pattern === "dots"
                    ? "url(#dotPattern)"
                    : pattern === "waves"
                    ? "url(#wavesPattern)"
                    : "none"
                }
                fillOpacity={active ? 1 : 0.9}
                style={{ pointerEvents: "none" }}
              />
            </>
          )}

          {/* Diagonal Divider Line - Only show if both parts are visible */}
          {showPrimary && showSecondary && (
            <line
              x1="85"
              y1="55"
              x2="215"
              y2="125"
              stroke={strokeColor}
              strokeWidth={1.5}
            />
          )}
        </>
      )}

      {/* Technical Labels */}
      {/* Right Label (Primary) - Show if primary part is visible */}
      {showPrimary && (
        <g
          transform="translate(285, 90)"
          className="transition-opacity duration-300"
          style={{ opacity: label ? 1 : 0 }}
        >
          <text
            x="15"
            y="4"
            fill={active ? "#f56500" : "#525252"}
            fontWeight="bold"
            fontSize="11"
            fontFamily="DM Mono, monospace"
            className="uppercase tracking-widest"
            textAnchor="start"
          >
            {label}
          </text>
          <line
            x1="-5"
            y1="0"
            x2="10"
            y2="0"
            stroke={strokeColor}
            strokeWidth={1.5}
          />
          <circle cx="-5" cy="0" r="2" fill={strokeColor} />
        </g>
      )}

      {/* Left Label (Secondary - e.g. for split layers) - Show if secondary part is visible */}
      {split && secondaryLabel && showSecondary && (
        <g
          transform="translate(15, 90)"
          className="transition-opacity duration-300"
          style={{ opacity: secondaryLabel ? 1 : 0 }}
        >
          <text
            x="-15"
            y="4"
            fill={active ? "#f56500" : "#525252"}
            fontWeight="bold"
            fontSize="11"
            fontFamily="DM Mono, monospace"
            className="uppercase tracking-widest"
            textAnchor="end"
          >
            {secondaryLabel}
          </text>
          <line
            x1="-10"
            y1="0"
            x2="5"
            y2="0"
            stroke={strokeColor}
            strokeWidth={1.5}
          />
          <circle cx="5" cy="0" r="2" fill={strokeColor} />
        </g>
      )}
    </svg>
  );
};
