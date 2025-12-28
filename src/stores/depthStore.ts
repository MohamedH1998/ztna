import { atom } from "nanostores";

export type Depth = "non-technical" | "technical" | "deep";

export const depthStore = atom<Depth>("technical");
