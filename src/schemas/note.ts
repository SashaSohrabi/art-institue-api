import z from 'zod';

export const NoteSchema = z.string().trim().max(500);