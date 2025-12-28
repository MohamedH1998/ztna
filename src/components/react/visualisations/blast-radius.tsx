import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "../../../lib/utils";
import { Slider } from "../slider";
import {
  VisualizationBody,
  VisualizationContainer,
  VisualizationHeader,
} from "./layout";

// --- Types ---
type NodeType = "gateway" | "app" | "db" | "files";

interface NetworkNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
}

// --- Constants ---
const NODES: NetworkNode[] = [
  { id: "gateway", type: "gateway", label: "Gateway", x: 50, y: 10 },
  { id: "app1", type: "app", label: "JIRA", x: 20, y: 40 },
  { id: "app2", type: "app", label: "Wiki", x: 50, y: 40 },
  { id: "app3", type: "app", label: "CRM", x: 80, y: 40 },
  { id: "db1", type: "db", label: "Users DB", x: 35, y: 70 },
  { id: "files1", type: "files", label: "Docs", x: 65, y: 70 },
];

const CONNECTIONS = [
  ["gateway", "app1"],
  ["gateway", "app2"],
  ["gateway", "app3"],
  ["app1", "db1"],
  ["app2", "files1"],
  ["app3", "db1"],
  ["app1", "app2"],
  ["app2", "app3"],
];

const Header = ({
  severity,
  setSeverity,
}: {
  severity: number;
  setSeverity: (severity: number) => void;
}) => (
  <VisualizationHeader className="block h-auto">
    <div className="flex items-center justify-between gap-4">
      <span className="font-mono text-xs font-medium uppercase tracking-widest dark:text-white">
        Blast radius - <span className="text-neutral-500 dark:text-neutral-400">increase severity to see impact</span>
      </span>
      <span className="font-mono text-sm">{severity}%</span>
    </div>
    <div className="w-full p-2">
      <Slider
        value={severity}
        onValueChange={(value: number) => setSeverity(value)}
        min={0}
        max={100}
      />
    </div>
  </VisualizationHeader>
);

const BlastRadius = () => {
  const [severity, setSeverity] = useState(0);

  const getVpnStatus = (nodeId: string) => {
    if (severity === 0) return "secure";
    // VPN: Once gateway is breached, lateral movement is easy
    if (severity > 5 && nodeId === "gateway") return "compromised";
    if (severity > 15 && ["app1", "app2", "app3"].includes(nodeId))
      return "compromised";
    if (severity > 25) return "compromised"; // Total takeover
    return "secure";
  };

  const getZtnaStatus = (nodeId: string) => {
    if (severity === 0) return "secure";
    // ZTNA: Compromise is contained to authorized path only
    if (severity > 5 && nodeId === "gateway") return "compromised";
    if (severity > 15 && nodeId === "app2") return "compromised";
    if (severity > 35 && nodeId === "files1") return "compromised";
    // App1, App3, and DB1 remain secure because policy blocks access
    return "secure";
  };

  return (
    <VisualizationContainer>
      {/* Header & Controls */}
      <Header severity={severity} setSeverity={setSeverity} />

      {/* Visualization Grid */}
      <VisualizationBody className="grid grid-cols-2 gap-px bg-neutral-50 dark:bg-neutral-800">
        <NetworkView
          title="VPN (Network Trust)"
          subtitle="Flat Network"
          nodes={NODES}
          connections={CONNECTIONS}
          getStatus={getVpnStatus}
          theme="red"
        />

        <NetworkView
          title="Zero Trust (App Trust)"
          subtitle="Scoped Access"
          nodes={NODES}
          connections={CONNECTIONS}
          getStatus={getZtnaStatus}
          theme="orange"
        />
      </VisualizationBody>
    </VisualizationContainer>
  );
};

const NetworkView = ({
  title,
  subtitle,
  nodes,
  connections,
  getStatus,
  theme,
}: {
  title: string;
  subtitle: string;
  nodes: NetworkNode[];
  connections: string[][];
  getStatus: (id: string) => "secure" | "compromised";
  theme: "red" | "orange";
}) => {
  const colors = {
    red: { bg: "bg-red-500", text: "text-red-500" },
    orange: { bg: "bg-accent", text: "text-accent" },
  };
  const activeColor = colors[theme];

  return (
    <div className="py-4 md:p-8 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center">
      <div className="mb-8 text-center">
        <h4 className="font-mono text-[10px] font-medium uppercase tracking-widest mb-1 text-neutral-900 dark:text-neutral-100">
          {title}
        </h4>
        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wide">
          {subtitle}
        </p>
      </div>

      <div className="relative aspect-square w-full max-w-[240px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map(([start, end], i) => {
            const startNode = nodes.find((n) => n.id === start)!;
            const endNode = nodes.find((n) => n.id === end)!;
            const isCompromised =
              getStatus(start) === "compromised" &&
              getStatus(end) === "compromised";

            return (
              <motion.line
                key={i}
                x1={`${startNode.x}%`}
                y1={`${startNode.y}%`}
                x2={`${endNode.x}%`}
                y2={`${endNode.y}%`}
                stroke="currentColor"
                strokeWidth="1"
                className={cn(
                  "transition-colors duration-300 ease-in-out",
                  isCompromised
                    ? `${activeColor.text} opacity-100`
                    : "text-neutral-300 dark:text-neutral-800 opacity-100"
                )}
                initial={false}
              />
            );
          })}
        </svg>

        {nodes.map((node) => {
          const status = getStatus(node.id);
          return (
            <motion.div
              key={node.id}
              className={cn(
                "absolute w-3 h-3 -ml-1.5 -mt-1.5 flex items-center justify-center transition-colors duration-300 ease-in-out z-10",
                status === "compromised"
                  ? activeColor.bg
                  : "bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700"
              )}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              initial={false}
            >
              {/* No labels on nodes for cleaner look, implied by layout */}
            </motion.div>
          );
        })}

        {/* Labels overlay */}
        {nodes.map((node) => (
          <div
            key={`label-${node.id}`}
            className="absolute text-[9px] font-mono uppercase text-neutral-500 tracking-widest text-center pointer-events-none bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-1 whitespace-nowrap"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, 12px)",
            }}
          >
            {node.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlastRadius;
