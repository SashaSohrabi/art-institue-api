import { z } from "zod";

export const ArtworkSchema = z.object({
  id: z.number(),
  title: z.string().default("Untitled"),
  artist_title: z.string().nullable().optional(),
  image_id: z.string().nullable().optional(),
  thumbnail: z.object({ alt_text: z.string().nullable().optional() })
    .nullable()
    .optional(),
});


export const ApiListSchema = z.object({
  data: z.array(ArtworkSchema),
  pagination: z.object({
    total: z.number().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
    next_url: z.string().nullable().optional(),
  }).optional(),
  config: z.object({ iiif_url: z.string() }),
});
