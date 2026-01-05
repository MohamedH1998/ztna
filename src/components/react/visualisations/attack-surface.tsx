import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "../../../lib/utils";
import Tab from "../tab";
import { ControlButton } from "../controls";
import { VisualizationBody, VisualizationContainer, VisualizationHeader } from "./layout";

// --- Types ---
type NodeStatus = "secure" | "compromised";
type Mode = "castle" | "zero-trust";

interface Node {
  id: number;
  status: NodeStatus;
  x: number;
  y: number;
}

// --- Constants ---
const GRID_SIZE = 5; // 5x5 grid
const NODE_COUNT = GRID_SIZE * GRID_SIZE;
const SPREAD_DELAY = 100; // ms between infections

// --- Component ---
const AttackSurface = () => {
  const [mode, setMode] = useState<Mode>("castle");
  const [nodes, setNodes] = useState<Node[]>([]);
  const runIdRef = useRef(0);

  // Initialize nodes
  useEffect(() => {
    const newNodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
      id: i,
      status: "secure" as NodeStatus,
      x: i % GRID_SIZE,
      y: Math.floor(i / GRID_SIZE),
    }));
    setNodes(newNodes);
  }, []);

  // Handle Mode Switch
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    resetNodes();
  };

  const resetNodes = () => {
    runIdRef.current++;
    setNodes((prev) => prev.map((n) => ({ ...n, status: "secure" })));
  };

  // The Hack Logic
  const handleHack = (targetId: number) => {
    if (nodes[targetId].status === "compromised") return;

    // Infect the target
    setNodes((prev) =>
      prev.map((n) => (n.id === targetId ? { ...n, status: "compromised" } : n))
    );

    if (mode === "castle") {
      triggerCastleSpread(targetId);
    }
  };

  const triggerCastleSpread = async (startId: number) => {
    const queue = [startId];
    const visited = new Set([startId]);
    const currentRunId = runIdRef.current;
    const timeouts: number[] = [];

    const spread = async () => {
      if (queue.length === 0 || currentRunId !== runIdRef.current) {
        // Clean up any pending timeouts
        timeouts.forEach((id) => clearTimeout(id));
        return;
      }

      const currentId = queue.shift()!;

      const neighbors = [
        currentId - 1, // Left
        currentId + 1, // Right
        currentId - GRID_SIZE, // Up
        currentId + GRID_SIZE, // Down
      ].filter((nid) => {
        if (nid < 0 || nid >= NODE_COUNT) return false;
        if (currentId % GRID_SIZE === 0 && nid === currentId - 1) return false;
        if (currentId % GRID_SIZE === GRID_SIZE - 1 && nid === currentId + 1)
          return false;
        return true;
      });

      for (const nid of neighbors) {
        if (currentRunId !== runIdRef.current) {
          // Clean up any pending timeouts
          timeouts.forEach((id) => clearTimeout(id));
          return;
        }
        if (!visited.has(nid)) {
          visited.add(nid);
          queue.push(nid);
          setNodes((prev) =>
            prev.map((n) =>
              n.id === nid ? { ...n, status: "compromised" } : n
            )
          );
          await new Promise((resolve) => {
            const timeoutId = window.setTimeout(resolve, SPREAD_DELAY);
            timeouts.push(timeoutId);
          });
        }
      }
      spread();
    };

    spread();
  };

  return (
    <VisualizationContainer>
      <VisualizationHeader>
        <Tab
          items={[
            { id: "castle", label: "Castle & Moat" },
            { id: "zero-trust", label: "Zero Trust" },
          ]}
          activeTab={mode}
          onChange={(id) => handleModeChange(id as Mode)}
        />
        <ControlButton onClick={resetNodes}>Reset</ControlButton>
      </VisualizationHeader>

      <VisualizationBody className="bg-neutral-50 dark:bg-black border-b border-neutral-200 dark:border-neutral-800 p-8 flex items-center justify-center">
        <div
          className="grid gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {nodes.map((node) => (
            <NodeComponent
              key={node.id}
              id={node.id}
              status={node.status}
              x={node.x}
              y={node.y}
              mode={mode}
              onClick={() => handleHack(node.id)}
            />
          ))}
        </div>
        <span className="absolute bottom-2 mx-auto text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          [Click any node to simulate a breach.]
        </span>
      </VisualizationBody>

      <div className="p-4 flex items-start gap-6 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700" />
          <span>SECURE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500" />
          <span>COMPROMISED</span>
        </div>
      </div>
    </VisualizationContainer>
  );
};

const NodeComponent = ({
  id,
  status,
  mode,
  onClick,
}: Node & { mode: Mode; onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 0.95 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Node ${id + 1}, ${status === "secure" ? "secure" : "compromised"}. Click to simulate breach.`}
      className={cn(
        "w-8 h-8 md:w-12 md:h-12 flex items-center justify-center transition-colors duration-200 cursor-pointer",
        status === "secure"
          ? "bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          : "bg-red-500"
      )}
    >
      {/* Rectangular geometry only */}
      <div
        className={cn(
          "w-2 h-2",
          status === "secure"
            ? "bg-neutral-200 dark:bg-neutral-800"
            : "bg-white"
        )}
      />
    </motion.button>
  );
};

export default AttackSurface;
