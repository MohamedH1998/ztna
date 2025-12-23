import { atom } from "nanostores";

export type Depth = "beginner" | "technical" | "deep";

export const depthStore = atom<Depth>("technical");
