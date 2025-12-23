import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "../../../lib/utils";
import Tab from "../tab";
import { ControlButton } from "../controls";
import { VisualizationBody, VisualizationContainer, VisualizationHeader } from "./layout";

const SCENARIOS = {
  gateway: {
    id: "gateway",
    label: "Gateway",
    title: "Secure Web Gateway",
    subtitle: "Response Time (95th percentile)",
    description:
      "Time for a user to make a request, go through the proxy, and get the response.",
    metrics: [
      { name: "Cloudflare", value: 163.77, color: "bg-[#F38020]" },
      { name: "No Gateway", value: 142.22, color: "bg-neutral-400" },
      { name: "Zscaler ZIA", value: 365.77, color: "bg-[#0076CE]" },
    ],
    unit: "ms",
    max: 400,
  },
  access: {
    id: "access",
    label: "Access",
    title: "Zero Trust Access",
    subtitle: "Time to First Byte (Global)",
    description: "Time to authenticate and reach the application.",
    metrics: [
      { name: "Cloudflare", value: 849, color: "bg-[#F38020]" },
      { name: "Zscaler ZPA", value: 1361, color: "bg-[#0076CE]" },
    ],
    unit: "ms",
    max: 1500,
  },
  rbi: {
    id: "rbi",
    label: "RBI",
    title: "Remote Browser Isolation",
    subtitle: "Time to First Byte (Global)",
    description: "Time to stream the isolated browser session.",
    metrics: [
      { name: "Cloudflare", value: 2072, color: "bg-[#F38020]" },
      { name: "Zscaler ZCBI", value: 3781, color: "bg-[#0076CE]" },
    ],
    unit: "ms",
    max: 4000,
  },
};

const AnimatedNumber = ({
  value,
  duration,
  isRacing,
  isCompleted,
}: {
  value: number;
  duration: number;
  isRacing: boolean;
  isCompleted: boolean;
}) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isCompleted) {
      setDisplay(value);
      return;
    }
    if (!isRacing) {
      setDisplay(0);
      return;
    }

    let startTimestamp: number | null = null;
    let reqId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min(
        (timestamp - startTimestamp) / (duration * 1000),
        1
      );
      setDisplay(Math.floor(progress * value));

      if (progress < 1) {
        reqId = window.requestAnimationFrame(step);
      }
    };
    reqId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(reqId);
  }, [value, duration, isRacing, isCompleted]);

  return <>{display}</>;
};

const SpeedRace = () => {
  const [activeTab, setActiveTab] = useState<keyof typeof SCENARIOS>("gateway");
  const [racing, setRacing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentScenario = SCENARIOS[activeTab];

  const handleRace = () => {
    if (racing) return;
    setRacing(true);
    setCompleted(false);

    // Reset after race duration (max duration is determined by animation logic)
    // Let's say max duration is 3s for the slowest.
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCompleted(true);
      setRacing(false);
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleReset = () => {
    setRacing(false);
    setCompleted(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleTabChange = (id: string) => {
    setRacing(false);
    setCompleted(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveTab(id as keyof typeof SCENARIOS);
  };

  return (
    <VisualizationContainer>
      {/* Header & Controls */}
      <VisualizationHeader className="border-t">
        <Tab
          items={(Object.keys(SCENARIOS) as Array<keyof typeof SCENARIOS>).map(
            (key) => ({
              id: key,
              label: SCENARIOS[key].label,
            })
          )}
          activeTab={activeTab}
          onChange={handleTabChange}
        />
        <div className="flex items-center gap-2">
          <ControlButton onClick={handleReset} disabled={!completed && !racing}>
            Reset
          </ControlButton>
          <ControlButton onClick={handleRace} disabled={racing || completed}>
            {racing ? "Testing..." : "Run Test"}
          </ControlButton>
        </div>
      </VisualizationHeader>

      {/* Visualization Area */}
      <VisualizationBody className="bg-neutral-50 dark:bg-black border-b border-neutral-200 dark:border-neutral-800 p-8">
        <div className="mb-8 text-center max-w-lg mx-auto">
          <h4 className="font-mono text-[10px] font-medium uppercase tracking-widest mb-1 text-neutral-900 dark:text-neutral-100">
            {currentScenario.title}
          </h4>
          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wide mb-2">
            {currentScenario.subtitle}
          </p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {currentScenario.description}
          </p>
        </div>

        <div className="flex flex-col gap-6 relative max-w-3xl mx-auto">
          {/* Start/Finish Lines */}
          <div className="absolute top-0 bottom-0 left-[100px] w-px border-l border-dashed border-neutral-200 dark:border-neutral-800 z-0">
            <div className="absolute -top-6 -left-3 text-[9px] text-neutral-400 font-mono uppercase tracking-widest">
              Start
            </div>
          </div>
          <div className="absolute top-0 bottom-0 right-16 w-px border-l border-dashed border-neutral-200 dark:border-neutral-800 z-0">
            <div className="absolute -top-6 -left-4 text-[9px] text-neutral-400 font-mono uppercase tracking-widest">
              Finish
            </div>
          </div>

          {currentScenario.metrics.map((metric) => {
            const raceDuration = (metric.value / currentScenario.max) * 3;
            return (
              <div key={metric.name} className="relative z-10">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-[100px] text-[10px] font-mono font-medium text-neutral-500 uppercase tracking-wider shrink-0 text-right pr-4 truncate">
                    {metric.name}
                  </div>

                  <div className="relative flex-1 h-8 bg-neutral-200 dark:bg-neutral-800/50 overflow-hidden flex items-center px-1 border border-neutral-200 dark:border-neutral-800">
                    {/* The Runner */}
                    <motion.div
                      className={cn(
                        "w-6 h-5 shadow-sm z-10 relative",
                        metric.color
                      )}
                      initial={{ left: "0%" }}
                      animate={
                        racing || completed
                          ? { left: "calc(100% - 25px)" }
                          : { left: "0%" }
                      }
                      transition={
                        racing
                          ? {
                              duration: raceDuration, // Scale duration relative to max
                              ease: "linear", // Constant speed
                            }
                          : { duration: 0 }
                      }
                    />
                  </div>

                  <div className="w-16 text-right font-mono text-[10px] font-bold text-neutral-900 dark:text-neutral-100 shrink-0 uppercase tracking-wider">
                    <AnimatedNumber
                      value={metric.value}
                      duration={raceDuration}
                      isRacing={racing}
                      isCompleted={completed}
                    />
                    <span className="text-neutral-500 font-normal ml-0.5 lowercase">
                      ms
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </VisualizationBody>

      <p className="text-right italic text-[10px] text-neutral-500 dark:text-neutral-400 p-2">
        Data: Cloudflare vs Zscaler Tests (2023)
      </p>
    </VisualizationContainer>
  );
};

export default SpeedRace;
