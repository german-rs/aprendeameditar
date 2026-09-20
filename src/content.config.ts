import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const meditaciones = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/meditaciones' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(), // ver nota abajo sobre categorías
    audioSrc: z.string(), // ruta al mp3 en /public, ej: "/audio/meditaciones/archivo.mp3"
    duration: z.number(), // duración en minutos
    coverImage: z.string().optional(),
    featured: z.boolean().default(false),
    publishDate: z.coerce.date(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { meditaciones, blog };