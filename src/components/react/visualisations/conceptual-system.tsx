import React, { useRef, useState, useEffect } from "react";
import { AnimatedBeam } from "../svg/atoms/beam";
import { COLORS } from "../../../lib/utils";
import { ANIMATION_STEP_DURATION } from "../../../lib/utils";
import { User, Gateway, App, AtomWrapper } from "../svg/atoms";
import Tab from "../tab";
import Controls from "../controls";
import { useIsMobile } from "../../../hooks/useIsMobile";

// --- Constants ---

type RequestType = "initial" | "subsequent";

// --- Main Component ---

const ConceptualSystem: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // VPN Refs
  const vpnUserRef = useRef<HTMLDivElement>(null);
  const vpnCheckRef = useRef<HTMLDivElement>(null);
  const vpnAppRef = useRef<HTMLDivElement>(null);

  // Zero Trust Refs
  const ztUserRef = useRef<HTMLDivElement>(null);
  const ztPolicyRef = useRef<HTMLDivElement>(null);
  const ztAppRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [requestType, setRequestType] = useState<RequestType>("initial");
  const [activeStep, setActiveStep] = useState<number>(0);

  const isMobile = useIsMobile();

  // Animation Logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isPlaying) {
      if (activeStep < 5) {
        timeout = setTimeout(() => {
          setActiveStep((prev) => prev + 1);
        }, ANIMATION_STEP_DURATION * 500);
      } else {
        timeout = setTimeout(() => {
          setIsPlaying(false);
          setActiveStep(0);
        }, 20);
      }
    } else {
      setActiveStep(0);
    }

    return () => clearTimeout(timeout);
  }, [isPlaying, activeStep]);

  const handleSimulate = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setActiveStep(1);
  };

  const toggleRequestType = () => {
    if (isPlaying) return;
    setRequestType((prev) => (prev === "initial" ? "subsequent" : "initial"));
  };

  // VPN Logic
  const vpnUserActive = activeStep >= 1;
  const vpnCheckActive = requestType === "initial" && activeStep >= 2;
  const vpnAppActive = activeStep >= (requestType === "initial" ? 3 : 2);

  // ZT Logic - Simplified to User+Identity -> Policy -> App
  const ztUserActive = activeStep >= 1;
  const ztPolicyActive = activeStep >= 2;
  const ztAppActive = activeStep >= 3;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-neutral-900">
      {/* Controls */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-6">
          <Tab
            activeTab={requestType}
            onChange={(id) => {
              if (!isPlaying) setRequestType(id as RequestType);
            }}
            disabled={isPlaying}
            items={[
              { id: "initial", label: "FIRST_REQUEST" },
              { id: "subsequent", label: "SUBSEQUENT_REQUESTS" },
            ]}
          />
        </div>
        <Controls
          prefersReducedMotion={false}
          setStepIndex={() => handleSimulate()}
          setPlaying={setIsPlaying}
          playing={isPlaying}
        />
      </div>

      <hr className="border-neutral-200 dark:border-neutral-800" />
      <div ref={containerRef} className="relative w-full bg-neutral-50">
        {/* Row 1: VPN */}
        <div className="relative group p-4">
          <div className="flex items-center gap-4 mb-8 border-black dark:border-white">
            <span className="font-mono text-xs font-medium uppercase tracking-widest dark:text-white">
              VPN
            </span>
            <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wide">
              [ VERIFY_ONCE ]
            </span>
          </div>

          <div className="flex items-center justify-between md:px-12">
            <AtomWrapper ref={vpnUserRef}>
              <User x={23.5} y={23.5} active={vpnUserActive} label="USER" />
            </AtomWrapper>

            {/* Visual spacer for alignment */}
            <div className="w-24 h-24 flex items-center justify-center">
              <div className="w-1 h-1 bg-neutral-200 dark:bg-neutral-800" />
            </div>

            <AtomWrapper
              ref={vpnCheckRef}
              className={
                requestType === "subsequent"
                  ? "opacity-30 grayscale transition-all duration-500"
                  : "transition-all duration-500"
              }
            >
              {/* Using Gateway to represent the Access Check/Firewall */}
              <Gateway
                x={3}
                y={3}
                active={vpnCheckActive}
                label="ACCESS_CHECK"
              />
            </AtomWrapper>

            <AtomWrapper ref={vpnAppRef}>
              <App x={30.5} y={30.5} active={vpnAppActive} label="APP" />
            </AtomWrapper>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-neutral-200 dark:border-neutral-800 mt-4" />

        {/* Row 2: Zero Trust */}
        <div className="relative group p-4">
          {/* Grid Lines */}
          <div className="flex items-center gap-4 mb-8 border-black dark:border-white">
            <span className="font-mono text-xs font-medium uppercase tracking-widest dark:text-white">
              ZERO TRUST
            </span>
            <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wide">
              [ VERIFY_EVERY_REQUEST ]
            </span>
          </div>

          <div className="flex items-center justify-between md:px-12 pb-4">
            <AtomWrapper ref={ztUserRef}>
              <User x={23.5} y={23.5} active={ztUserActive} label="USER+ID" />
            </AtomWrapper>

            {/* Visual spacer to align Policy somewhat with VPN Check or midway */}
            <div className="w-24 h-24 flex items-center justify-center">
              <div className="w-1 h-1 bg-neutral-200 dark:bg-neutral-800" />
            </div>

            <AtomWrapper ref={ztPolicyRef}>
              <Gateway
                x={3}
                y={3}
                active={ztPolicyActive}
                label="ACCESS_CHECK"
              />
            </AtomWrapper>

            <AtomWrapper ref={ztAppRef}>
              <App x={30.5} y={30.5} active={ztAppActive} label="APP" />
            </AtomWrapper>
          </div>
        </div>

        {/* BEAMS */}

        {/* VPN Beams */}
        {requestType === "initial" ? (
          <>
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={vpnUserRef}
              toRef={vpnCheckRef}
              duration={vpnCheckActive ? ANIMATION_STEP_DURATION : 0}
              pathColor={vpnCheckActive ? COLORS.active : COLORS.inactive}
              pathOpacity={vpnCheckActive ? 1 : 0.3}
              gradientStartColor={
                vpnCheckActive ? COLORS.active : COLORS.inactive
              }
              gradientStopColor={
                vpnCheckActive ? COLORS.active : COLORS.inactive
              }
              straight
              pathWidth={2}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={vpnCheckRef}
              toRef={vpnAppRef}
              duration={vpnAppActive ? ANIMATION_STEP_DURATION : 0}
              pathColor={vpnAppActive ? COLORS.active : COLORS.inactive}
              pathOpacity={vpnAppActive ? 1 : 0.3}
              gradientStartColor={
                vpnAppActive ? COLORS.active : COLORS.inactive
              }
              gradientStopColor={vpnAppActive ? COLORS.active : COLORS.inactive}
              straight
              pathWidth={2}
            />
          </>
        ) : (
          <>
            {/* Active Beam Skipping Check (Square Elbow) */}
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={vpnUserRef}
              toRef={vpnAppRef}
              duration={ANIMATION_STEP_DURATION * 2}
              curvature={isMobile ? 50 : 70}
              pathColor={vpnAppActive ? COLORS.active : COLORS.inactive}
              pathOpacity={vpnAppActive ? 1 : 0.3}
              gradientStartColor={
                vpnAppActive ? COLORS.active : COLORS.inactive
              }
              gradientStopColor={vpnAppActive ? COLORS.active : COLORS.inactive}
              pathWidth={2}
            />
          </>
        )}

        {/* Zero Trust Beams */}
        {/* User+ID -> Policy */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={ztUserRef}
          toRef={ztPolicyRef}
          duration={ztPolicyActive ? ANIMATION_STEP_DURATION : 0}
          pathColor={ztPolicyActive ? COLORS.active : COLORS.inactive}
          pathOpacity={ztPolicyActive ? 1 : 0.3}
          gradientStartColor={ztPolicyActive ? COLORS.active : COLORS.inactive}
          gradientStopColor={ztPolicyActive ? COLORS.active : COLORS.inactive}
          straight
          pathWidth={2}
        />
        {/* Policy -> App */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={ztPolicyRef}
          toRef={ztAppRef}
          duration={ztAppActive ? ANIMATION_STEP_DURATION : 0}
          pathColor={ztAppActive ? COLORS.active : COLORS.inactive}
          pathOpacity={ztAppActive ? 1 : 0.3}
          gradientStartColor={ztAppActive ? COLORS.active : COLORS.inactive}
          gradientStopColor={ztAppActive ? COLORS.active : COLORS.inactive}
          straight
          pathWidth={2}
        />
      </div>
    </div>
  );
};

export default ConceptualSystem;
