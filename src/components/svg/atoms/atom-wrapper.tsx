import React from "react";
import { cn } from "../../../lib/utils";

export const AtomWrapper = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex items-center justify-center z-20 w-24 h-24", className)}
  >
    <svg width="100%" height="100%" viewBox="0 0 80 80" className="overflow-visible">
      {children}
    </svg>
  </div>
));
AtomWrapper.displayName = "AtomWrapper";
