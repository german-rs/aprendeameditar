# Roadmap

## Fase 0 — Setup (actual)

- [x] Repo creado, Astro inicializado
- [x] Dominio `aprendeameditar.cl` configurado
- [x] Cloudflare como DNS
- [x] Documentación base del proyecto
- [x] Pipeline de GitHub Actions funcionando (build y deploy automático a producción)

## Fase 1 — MVP

- [ ] Configurar Tailwind CSS (plugin de Vite), tokens de diseño y tipografía en `src/styles/global.css`
- [ ] Layout base (header, footer, navegación)
- [ ] Content Collections de `meditaciones` y `blog` (`src/content.config.ts`)
- [ ] Reproductor de audio completo (React island) — play/pause, progreso, volumen
- [ ] Home (`/`) carga el reproductor completo con la meditación del día lista para reproducir, sin pasos previos, junto con `h1`, descripción breve y enlaces a categorías y blog
- [ ] Listado y detalle de meditaciones (por categoría), con el reproductor completo embebido en el detalle
- [ ] Listado y detalle de posts del blog (contenido estilizado con `prose`)
- [ ] 5–10 meditaciones (MP3) y 3–5 posts de contenido inicial
- [ ] SEO básico: metadatos, sitemap, Open Graph

## Fase 2 — Mejoras

- [ ] Buscador/filtros por categoría, duración, tags
- [ ] Favoritos (persistencia en `localStorage`)
- [ ] Newsletter / captura de email
- [x] Analítica de uso (GA)
- [ ] Optimización de imágenes y audio (lazy loading, compresión)

## Fase 3 — Crecimiento

- [ ] Evaluar CMS (Decap u otro) si el volumen de contenido lo justifica
- [ ] Internacionalización (si se apunta a más países hispanohablantes)
- [ ] Posible monetización (donaciones, contenido premium, patrocinios)
- [ ] PWA / soporte offline para meditaciones