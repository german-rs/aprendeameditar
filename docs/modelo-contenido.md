# Modelo de contenido

Define los *content collections* de Astro para meditaciones y entradas de blog. Ambas colecciones viven en `src/content/`, se cargan con el loader `glob()` y se validan con `zod` en `src/content.config.ts` (Astro 7).

## Colección: `meditaciones`

Ruta: `src/content/meditaciones/*.md`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `title` | string | ✅ | Título de la meditación |
| `description` | string | ✅ | Resumen corto (para listados y SEO) |
| `audioFile` | string | ✅ | Ruta relativa en `public/audio/meditaciones/` |
| `duration` | number | ✅ | Duración en segundos |
| `category` | enum | ✅ | `sueño` \| `ansiedad` \| `estrés` \| `respiración` \| `principiantes` |
| `coverImage` | image | opcional | Imagen de portada |
| `publishDate` | date | ✅ | Fecha de publicación |
| `tags` | string[] | opcional | Etiquetas adicionales |

```ts
// src/content.config.ts (fragmento)
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const meditaciones = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/meditaciones' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    audioFile: z.string(),
    duration: z.number(),
    category: z.enum(['sueño', 'ansiedad', 'estrés', 'respiración', 'principiantes']),
    coverImage: image().optional(),
    publishDate: z.date(),
    tags: z.array(z.string()).optional(),
  }),
});
```

> No existe un campo para elegir qué meditación se muestra en el home: la "meditación del día" rota entre **todas** las meditaciones (ver [arquitectura](./arquitectura.md#rotación-de-meditación-del-día)).

## Colección: `blog`

Ruta: `src/content/blog/*.md`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `title` | string | ✅ | Título del post |
| `description` | string | ✅ | Descripción para SEO/listados |
| `publishDate` | date | ✅ | Fecha de publicación |
| `updatedDate` | date | opcional | Fecha de última edición |
| `coverImage` | image | opcional | Imagen destacada |
| `tags` | string[] | opcional | Categorías/etiquetas del post |
| `draft` | boolean | opcional (default `false`) | Ocultar del sitio si es borrador |

```ts
// src/content.config.ts (continuación)
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    coverImage: image().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { meditaciones, blog };
```

## Ejemplo de entrada — meditación

```md
---
title: "Respiración consciente para empezar el día"
description: "Una meditación de 10 minutos para centrar la atención al despertar."
audioFile: "/audio/meditaciones/respiracion-manana.mp3"
duration: 600
category: "respiración"
publishDate: 2026-09-19
tags: ["mañana", "principiantes"]
---

Texto introductorio opcional sobre la meditación...
```

## Ejemplo de entrada — blog

```md
---
title: "5 beneficios de meditar 10 minutos al día"
description: "Qué dice la evidencia sobre los efectos de una práctica breve y constante."
publishDate: 2026-09-19
tags: ["beneficios", "principiantes"]
draft: false
---

Contenido del artículo en Markdown...
```

## Convención de archivos de audio

- Ubicación: `public/audio/meditaciones/`
- Nombre: `kebab-case`, sin espacios ni tildes (ej. `respiracion-manana.mp3`)
- Formato (primera fase): MP3, 128–192 kbps (balance calidad/peso para carga rápida)