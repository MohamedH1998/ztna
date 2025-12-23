import { z, defineCollection } from "astro:content";

const depthSchema = z.enum(["beginner", "technical", "deep"]);

// Schema for product sections
const productsCollection = defineCollection({
  type: "content",
  schema: z.object({
    product: z.string(), // 'zero-trust', 'waf', etc.
    section: z.object({
      id: z.string(),
      badgeTitle: z.string(),
      title: z.string(),
      description: z.string(),
      order: z.number(),
      alignment: z.enum(["horizontal", "vertical"]).optional(),
      visualization: z.string().optional(),
    }),
    depth: depthSchema,
  }),
});

export const collections = {
  products: productsCollection,
};
