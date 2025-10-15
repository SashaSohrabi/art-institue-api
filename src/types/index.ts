import z from 'zod';

import { ArtworkSchema, ApiListSchema } from '@/schemas/artwork';
import { NoteSchema } from '@/schemas/note';

export type Artwork = z.infer<typeof ArtworkSchema>;
export type ApiList = z.infer<typeof ApiListSchema>;
export type NoteSchema = z.infer<typeof NoteSchema>;

export type SavedArtwork = Artwork & {
  imageUrl: string | null;
  description?: string;
  note?: string;
};