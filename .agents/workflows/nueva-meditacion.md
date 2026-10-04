---
description: Agrega una meditación nueva al catálogo
---

# Nueva meditación

1. Pregunta al usuario: título, descripción breve, categoría, duración en minutos y nombre del archivo MP3.
2. Verifica que el MP3 exista en `public/audio/meditaciones/`. Si no existe, avisa y detente.
3. Revisa `src/content.config.ts` para usar exactamente los campos del schema.
4. Crea el archivo `.md` en `src/content/meditaciones/` con un nombre en minúsculas y con guiones, sin tildes. Usa `audioSrc` con la ruta pública (`/audio/meditaciones/...`), `duration` en minutos y `publishDate` con la fecha de hoy.
5. Si la categoría es nueva, avísalo: aparecerá como filtro nuevo en el sitio.
6. Ejecuta `npm run build` y confirma que no hay errores.
7. Resume qué archivo creaste.