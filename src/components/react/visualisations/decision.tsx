import React, { useRef, useState, useEffect, useMemo } from "react";
import { useInView } from "motion/react";

import { AnimatedBeam } from "../svg/atoms/beam";
import { COLORS, cn } from "../../../lib/utils";
import { User, IdP, Warp, Gateway, AtomWrapper } from "../svg/atoms";
import Controls from "../controls";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { VisualizationBody, VisualizationContainer, VisualizationHeader } from "./layout";

type BeamId = "userToIdp" | "idpToWarp" | "userToWarp" | "warpToGateway";

interface SequenceStep {
  beam?: BeamId;
  action?: "setIdentity" | "setDevice" | "reset";
  duration: number;
}

const SEQUENCE: SequenceStep[] = [
  { beam: "userToIdp", duration: 1600 }, // Travel + Processing
  { beam: "idpToWarp", duration: 800 },
  { action: "setIdentity", duration: 1000 },
  { beam: "userToWarp", duration: 800 },
  { action: "setDevice", duration: 1000 },
  { beam: "warpToGateway", duration: 800 },
  { action: "reset", duration: 5000 },
];

interface BeamConfig {
  id: BeamId;
  from: React.RefObject<HTMLDivElement | null>;
  to: React.RefObject<HTMLDivElement | null>;
  straight?: boolean;
  curvature?: number;
}

// --- Main Component ---

const Decision: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);

  const userRef = useRef<HTMLDivElement>(null);
  const idpRef = useRef<HTMLDivElement>(null);
  const warpRef = useRef<HTMLDivElement>(null);
  const gatewayRef = useRef<HTMLDivElement>(null);

  const [activeBeam, setActiveBeam] = useState<BeamId | null>(null);
  const [hasIdentity, setHasIdentity] = useState(false);
  const [hasDevice, setHasDevice] = useState(false);

  const [playing, setPlaying] = useState(false);
  const [key, setKey] = useState(0); // For forcing restart

  const isMobile = useIsMobile();

  const handleReset = () => {
    setActiveBeam(null);
    setHasIdentity(false);
    setHasDevice(false);
    setKey((prev) => prev + 1);
  };

  // Animation Loop
  useEffect(() => {
    if (!playing || !isInView) return;

    let timeoutId: NodeJS.Timeout;
    let cancelled = false;

    const runSequence = async () => {
      // If we are just starting or restarting, ensure clean slate
      if (activeBeam || hasIdentity || hasDevice) {
        // Optionally reset here if we want strict restart from current state
        // But logic below handles state setting.
        // If we want to resume, we'd need to track index.
        // For simplicity, let's restart sequence if not "paused" mid-way?
        // Actually, standard behavior for this type of loop is:
        // If playing, run loop.
      }

      while (!cancelled) {
        for (const step of SEQUENCE) {
          if (cancelled) break;

          // Execute Step
          if (step.beam) setActiveBeam(step.beam);
          if (step.action === "setIdentity") {
            setActiveBeam(null);
            setHasIdentity(true);
          }
          if (step.action === "setDevice") {
            setActiveBeam(null);
            setHasDevice(true);
          }
          if (step.action === "reset") {
            setActiveBeam(null);
            setHasIdentity(false);
            setHasDevice(false);
          }

          // Wait
          await new Promise((resolve) => {
            timeoutId = setTimeout(resolve, step.duration);
          });
        }
      }
    };

    runSequence();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [playing, isInView, key]);

  const beams = useMemo<BeamConfig[]>(
    () => [
      { id: "userToIdp", from: userRef, to: idpRef, straight: true },
      { id: "idpToWarp", from: idpRef, to: warpRef, straight: true },
      {
        id: "userToWarp",
        from: userRef,
        to: warpRef,
        curvature: isMobile ? -25 : -40,
      },
      {
        id: "warpToGateway",
        from: warpRef,
        to: gatewayRef,
        curvature: isMobile ? 40 : 70,
      },
    ],
    [isMobile]
  );

  return (
    <VisualizationContainer className="max-w-4xl mx-auto">
      <Header
        hasIdentity={hasIdentity}
        hasDevice={hasDevice}
        playing={playing}
        setPlaying={setPlaying}
        onReplay={handleReset}
      />

      <VisualizationBody ref={containerRef} className="px-4 py-8 md:p-12">
        <div className="grid grid-cols-3 gap-y-12 gap-x-4 md:gap-x-8 justify-items-center">
          <AtomWrapper ref={userRef}>
            <User
              label="USER"
              active={activeBeam === "userToIdp" || activeBeam === "userToWarp"}
              x={23.5}
              y={23.5}
            />
          </AtomWrapper>

          <AtomWrapper ref={idpRef}>
            <IdP
              label="IDP"
              active={activeBeam === "userToIdp" || activeBeam === "idpToWarp"}
              x={23.5}
              y={23.5}
            />
          </AtomWrapper>

          <AtomWrapper ref={warpRef}>
            <Warp
              label="WARP"
              active={
                activeBeam === "idpToWarp" ||
                activeBeam === "userToWarp" ||
                activeBeam === "warpToGateway" ||
                hasIdentity ||
                hasDevice
              }
              showMultipleRects={hasIdentity && hasDevice}
              x={23.5}
              y={23.5}
            />
          </AtomWrapper>

          {/* Spacer */}
          <div className="pointer-events-none" />

          <AtomWrapper ref={gatewayRef}>
            <Gateway
              label="GATEWAY"
              active={activeBeam === "warpToGateway"}
              x={5}
              y={3}
            />
          </AtomWrapper>

          {/* Spacer */}
          <div className="pointer-events-none" />
        </div>

        {beams.map((beam) => (
          <AnimatedBeam
            key={beam.id}
            containerRef={containerRef}
            fromRef={beam.from}
            toRef={beam.to}
            duration={activeBeam === beam.id ? 1.4 : 0}
            straight={beam.straight}
            curvature={beam.curvature}
            pathColor={activeBeam === beam.id ? COLORS.active : COLORS.inactive}
            pathOpacity={activeBeam === beam.id ? 1 : 0.3}
            pathWidth={2}
            gradientStartColor={
              activeBeam === beam.id ? COLORS.active : COLORS.inactive
            }
            gradientStopColor={
              activeBeam === beam.id ? COLORS.active : COLORS.inactive
            }
          />
        ))}
      </VisualizationBody>
    </VisualizationContainer>
  );
};

const Header = ({
  hasIdentity,
  hasDevice,
  playing,
  setPlaying,
  onReplay,
}: {
  hasIdentity: boolean;
  hasDevice: boolean;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  onReplay: () => void;
}) => (
  <VisualizationHeader className="md:py-4.5">
    <div className="flex items-center gap-4">
      <span className="font-mono text-xs font-medium uppercase tracking-widest dark:text-white">
        Decision
      </span>
      <div className="flex gap-4">
        <StatusIndicator label="IDENTITY" active={hasIdentity} />
        <StatusIndicator label="DEVICE" active={hasDevice} />
      </div>
    </div>
    <Controls
      setStepIndex={() => onReplay()}
      setPlaying={setPlaying}
      playing={playing}
    />
  </VisualizationHeader>
);

const StatusIndicator = ({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) => (
  <div className="flex items-center gap-2">
    <div
      className={cn(
        "w-1.5 h-1.5 rounded-full",
        active ? "bg-[#f56500]" : "bg-neutral-300 dark:bg-neutral-700"
      )}
    />
    <span
      className={cn(
        "font-mono text-[10px] uppercase tracking-wide",
        active
          ? "text-neutral-900 dark:text-white"
          : "text-neutral-400 dark:text-neutral-600"
      )}
    >
      {label}
    </span>
  </div>
);

export default Decision;
