import React, { forwardRef } from "react";
import { cn } from "../../../lib/utils";

interface VisualizationContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const VisualizationContainer = forwardRef<
  HTMLDivElement,
  VisualizationContainerProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "w-full bg-white dark:bg-neutral-900 overflow-hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
VisualizationContainer.displayName = "VisualizationContainer";

interface VisualizationHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const VisualizationHeader = forwardRef<
  HTMLDivElement,
  VisualizationHeaderProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
VisualizationHeader.displayName = "VisualizationHeader";

interface VisualizationBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const VisualizationBody = forwardRef<
  HTMLDivElement,
  VisualizationBodyProps
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("relative w-full", className)} {...props}>
      {children}
    </div>
  );
});
VisualizationBody.displayName = "VisualizationBody";
