# AGENTS.md

Contexto para agentes de código (Claude Code, Codex, Cursor, etc.) que trabajen en **Aprende a Meditar**.

## Qué es este proyecto

App web en Astro 7 con Tailwind CSS: reproductor de audios de meditación + blog, pensada para generar tráfico orgánico. Sitio **100% estático**, desplegado en GitHub Pages con dominio `aprendeameditar.cl` (DNS en Cloudflare). No hay backend ni base de datos — todo se resuelve en build time o en el cliente.

Antes de tocar código, lee la documentación del proyecto:

- [`docs/arquitectura.md`](./docs/arquitectura.md) — stack, modo de renderizado, estructura de carpetas, decisión de producto del home
- [`docs/modelo-contenido.md`](./docs/modelo-contenido.md) — schemas de las Content Collections (`meditaciones`, `blog`)
- [`docs/guia-estilo-reproductor.md`](./docs/guia-estilo-reproductor.md) — tokens de color/tipografía (su tabla de tokens es la fuente de verdad), glassmorfismo
- [`docs/brand.md`](./docs/brand.md) — misión, voz y tono, identidad visual, terminología
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
- **Reproductor completo**: es el único formato del MVP (home y página de detalle de cada meditación). No implementar un mini-player fijo.
- **Estilos: solo Tailwind CSS v4.** No escribir CSS vanilla ni bloques `<style>` en componentes. El único archivo CSS es `src/styles/global.css` (import de Tailwind, valores de los tokens por modo, alias `@theme` y `@keyframes`). Los colores salen solo de los tokens (`bg-accent`, `text-primary`, `bg-glass`…): nada de `#hex` ni `bg-[#...]`. Los valores arbitrarios (`rounded-[32px]`, `backdrop-blur-[24px]`) se usan solo para medidas del diseño definidas en la guía. Para reutilizar estilos, crear componentes en lugar de `@apply`. El contenido Markdown del blog se estiliza con `prose` (`@tailwindcss/typography`).
- **Tokens de diseño**: la tabla de `docs/guia-estilo-reproductor.md` es la fuente de verdad e incluye, además de los tokens de color y texto, `--glass-shadow` (sombra del panel de vidrio), `--ghost-bg` (fondo de los botones secundarios) y `--blob-1/2/3` (formas difusas de fondo). En código se usan mediante los alias de Tailwind definidos en `global.css`. No inventar tokens de color/tipografía nuevos: si hace falta uno, agregarlo primero a esa tabla y a `global.css`.
- **Content Collections**: es la gestión de contenido decidida para el MVP. La configuración vive en `src/content.config.ts` y usa el loader `glob()` (`astro/loaders`) con `z` importado desde `astro/zod`. No usar `src/content/config.ts` ni `type: 'content'` (API antigua).
- **Audio**: MP3 (128–192 kbps) en esta primera fase. Archivos estáticos en `public/audio/meditaciones/`, nombre de archivo en `kebab-case`, sin tildes ni espacios.
- **Home (`/`)**: carga el reproductor completo con la "meditación del día" (rotación determinística por fecha, calculada en el cliente con `Date.UTC` sobre una lista ordenada; todas las meditaciones participan, no hay campo `featured` — ver `docs/arquitectura.md`). Además del reproductor incluye, en HTML estático, un `h1`, una breve descripción y enlaces a las categorías y al blog (para SEO y navegación). Nada de esto puede bloquear el acceso inmediato al audio, y el home no se convierte en una landing de blog tradicional.
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