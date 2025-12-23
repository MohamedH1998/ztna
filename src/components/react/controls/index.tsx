import React from "react";
import { cn } from "../../../lib/utils";

interface ControlsProps {
  prefersReducedMotion?: boolean;
  setStepIndex?: (index: number) => void;
  setPlaying?: (playing: boolean) => void;
  playing: boolean;
  onReplay?: () => void;
  onTogglePlay?: () => void;
  variant?: "default" | "secondary";
  className?: string;
}

const BUTTON_VARIANTS = {
  default:
    "hover:bg-neutral-50 dark:hover:bg-neutral-900 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300",
  secondary:
    "bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-950 text-gray-500 dark:text-gray-700",
};

interface ControlButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_VARIANTS;
}

export const ControlButton = ({
  className,
  variant = "default",
  children,
  ...props
}: ControlButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        "font-mono text-[10px] uppercase tracking-wider border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 transition-all duration-100 cursor-pointer hover:scale-98 disabled:opacity-50 disabled:cursor-not-allowed",
        BUTTON_VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Controls = ({
  prefersReducedMotion = false,
  setStepIndex,
  setPlaying,
  playing,
  onReplay,
  onTogglePlay,
  variant = "default",
  className,
}: ControlsProps) => {
  const handleReplay = () => {
    if (prefersReducedMotion) return;

    if (onReplay) {
      onReplay();
    } else if (setStepIndex && setPlaying) {
      setStepIndex(0);
      setPlaying(true);
    }
  };

  const handleTogglePlay = () => {
    // If disabled, the button shouldn't fire click usually, but good safeguard
    if (prefersReducedMotion) return;

    if (onTogglePlay) {
      onTogglePlay();
    } else if (setPlaying) {
      setPlaying(!playing);
    }
  };

  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="flex items-center gap-2">
        {onReplay && (
          <ControlButton
            onClick={handleReplay}
            variant={variant}
            disabled={prefersReducedMotion}
          >
            Replay
          </ControlButton>
        )}
        <ControlButton
          onClick={handleTogglePlay}
          variant={variant}
          disabled={prefersReducedMotion}
          aria-disabled={prefersReducedMotion}
        >
          {playing ? "Pause" : "Play"}
        </ControlButton>
      </div>
    </div>
  );
};

export default Controls;
