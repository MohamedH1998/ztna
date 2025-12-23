export interface ProductConfig {
  id: string;
  name: string;
  description: string;
  route: string;
  heroVisualization?: string;
  sections: {
    id: string;
    visualization: "stack" | "primitives" | "flow" | "comparison" | "custom";
    customComponent?: string;
  }[];
}

export const products: ProductConfig[] = [
  {
    id: "zero-trust",
    name: "Zero Trust Network Access",
    description: "Per-request verification for every application",
    route: "/",
    sections: [
      { id: "the-shift", visualization: "comparison" },
      { id: "the-contract", visualization: "primitives" },
      { id: "the-primitives", visualization: "stack" },
      { id: "the-decision", visualization: "flow" },
      { id: "vpn-vs-ztna", visualization: "comparison" },
      { id: "unified-enforcement", visualization: "custom", customComponent: "UnifiedAccess" },
    ],
  },
];

