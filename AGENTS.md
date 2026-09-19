# AGENTS.md

Contexto para agentes de código (Claude Code, Codex, Cursor, etc.) que trabajen en **Aprende a Meditar**.

## Qué es este proyecto

App web en Astro: reproductor de audios de meditación + blog, pensada para generar tráfico orgánico. Sitio **100% estático**, desplegado en GitHub Pages con dominio `aprendeameditar.cl` (DNS en Cloudflare). No hay backend ni base de datos — todo se resuelve en build time o en el cliente.

Antes de tocar código, lee la documentación del proyecto:

- [`docs/arquitectura.md`](./docs/arquitectura.md) — stack, modo de renderizado, estructura de carpetas, decisión de producto del home
- [`docs/modelo-contenido.md`](./docs/modelo-contenido.md) — schemas de las Content Collections (`meditaciones`, `blog`)
- [`docs/guia-estilo-reproductor.md`](./docs/guia-estilo-reproductor.md) — tokens de color/tipografía, glassmorfismo
- [`docs/despliegue.md`](./docs/despliegue.md) — GitHub Actions, dominio personalizado, DNS
- [`docs/roadmap.md`](./docs/roadmap.md) — fases del proyecto y qué está pendiente
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — convención de commits/ramas, cómo agregar meditaciones o posts

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Reglas del proyecto

Estas decisiones ya están tomadas — si una tarea parece requerir romper alguna, avisar antes de hacerlo y actualizar la documentación correspondiente en el mismo cambio.

- **Sitio estático**: `output: 'static'` en `astro.config.mjs`. No agregar SSR, endpoints de servidor ni adaptadores — GitHub Pages no los soporta.
- **React solo para interactividad real**: reproductor de audio y filtros del blog. Todo lo demás son componentes `.astro` estáticos.
- **No inventar tokens de color/tipografía nuevos** para el reproductor — usar las variables CSS definidas en `docs/guia-estilo-reproductor.md`.
- **Audio**: archivos estáticos en `public/audio/meditaciones/`, nombre de archivo en `kebab-case`, sin tildes ni espacios.
- **Home (`/`)**: carga el reproductor completo con la "meditación del día" (rotación determinística por fecha, calculada en el cliente — ver `docs/arquitectura.md`). No convertir el home en una landing de blog tradicional.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `content:`, `chore:`) — ver `CONTRIBUTING.md`.

## Documentación externa de Astro

Full documentation: <https://docs.astro.build>

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)