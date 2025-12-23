import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Class name utility - merges Tailwind classes intelligently
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Math utilities
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Color constants - SINGLE SOURCE OF TRUTH
export const COLORS = {
  idle: "#000",
  active: "#f56500", // Cloudflare Orange
  dim: "rgba(0,0,0,0.35)",
  inactive: "#e5e5e5", // Neutral 200
} as const;

export type ColorKey = keyof typeof COLORS;
