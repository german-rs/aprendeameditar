# Arquitectura

## Objetivo del producto

Aprendeameditar.cl es una app web que combina:
1. Un **reproductor de audios de meditación** organizados por categoría.
2. Un **blog** para publicar artículos, atraer tráfico orgánico (SEO) y dar contexto a las meditaciones.

## Página de inicio (home)

Decisión de producto: quien entra al sitio debe poder empezar a meditar **de inmediato**, sin navegar primero. Por eso el home (`/`) no es una landing de blog con enlaces — carga directamente el **reproductor completo** (ver [guía de estilo](./guia-estilo-reproductor.md)) con la **meditación del día** lista para reproducir.

Implicaciones:
- `src/pages/index.astro` renderiza el layout del reproductor completo, no una portada tradicional.
- La navegación a categorías, blog y demás meditaciones queda accesible desde el mismo home (header o accesos debajo del reproductor), pero sin bloquear el acceso inmediato al audio.

### Rotación de "meditación del día"

El sitio es 100% estático (GitHub Pages, sin backend ni cron jobs), así que la rotación diaria **no depende de un rebuild**: se calcula en el cliente con una función determinística de la fecha, sobre la lista completa de meditaciones que ya viene embebida en el build.

```ts
// ejemplo: misma meditación para todo el mundo, el mismo día
function meditacionDelDia(meditaciones: Meditacion[]): Meditacion {
  const hoy = new Date();
  const inicioAño = new Date(hoy.getFullYear(), 0, 0);
  const diaDelAño = Math.floor((+hoy - +inicioAño) / 86_400_000);
  return meditaciones[diaDelAño % meditaciones.length];
}
```

Así, aunque el sitio no se recompile todos los días, la meditación destacada cambia solo con el paso del calendario (misma para todos los visitantes en el mismo día, en su horario local).

## Stack técnico

| Capa | Elección | Motivo |
|---|---|---|
| Framework | [Astro](https://astro.build) | Sitio mayormente estático, rendimiento óptimo para SEO y contenido |
| Islas interactivas | React | Reproductor de audio, filtros/búsqueda del blog |
| Contenido | Astro Content Collections (Markdown/MDX) — ver [decisión pendiente](#gestión-de-contenido) | Sin backend, versionado en Git |
| Alojamiento de audio | Archivos estáticos en `public/audio/` | Simplicidad para el MVP, sin costos de storage externo |
| Hosting | GitHub Pages | Gratuito, integrado al repo |
| DNS | Cloudflare | Dominio `aprendeameditar.cl` |
| Lenguaje | TypeScript | Tipado en schemas de contenido y componentes |

## Modo de renderizado

Astro en modo **estático (`output: 'static'`)**, ya que GitHub Pages solo sirve archivos estáticos (no hay SSR/edge functions disponibles). Todas las páginas se generan en build time.

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://aprendeameditar.cl',
  output: 'static',
  integrations: [react()],
});
```

## Islas de interactividad (Astro Islands)

Astro renderiza todo como HTML estático por defecto. Los componentes React se usan **solo** donde hace falta interactividad en el cliente:

- `<AudioPlayer client:load />` — reproductor de audio (necesita estado inmediato)
- `<BlogFilters client:visible />` — filtros/búsqueda del blog (puede cargar diferido)

Regla general: preferir componentes `.astro` estáticos; usar React solo cuando haya estado, eventos o interactividad real. Esto mantiene el sitio liviano y rápido.

## Estructura de carpetas propuesta

```
├── public/
│   ├── audio/meditaciones/       # mp3 de las meditaciones
│   ├── images/
│   └── CNAME                      # dominio custom para GitHub Pages
├── src/
│   ├── components/
│   │   ├── react/                 # AudioPlayer.tsx, BlogFilters.tsx, etc.
│   │   └── astro/                 # Header.astro, Footer.astro, Card.astro
│   ├── content/
│   │   ├── config.ts              # schemas de collections
│   │   ├── meditaciones/          # *.md — una por meditación
│   │   └── blog/                  # *.md — una por entrada
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── BlogPostLayout.astro
│   ├── pages/
│   │   ├── index.astro             # home = reproductor completo con la meditación destacada
│   │   ├── meditaciones/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── blog/
│   │       ├── index.astro
│   │       └── [slug].astro
│   └── styles/
└── docs/
```

## Gestión de contenido

**Pendiente de decidir.** Por defecto para el MVP se recomienda usar **Astro Content Collections** (Markdown/MDX versionado en el repo) porque:
- No requiere backend ni costos adicionales.
- Encaja directo con GitHub Pages (todo se resuelve en build time).
- Es suficiente mientras el volumen de contenido sea bajo/medio y quien publique sepa editar Markdown, o use más adelante un CMS basado en Git.

Si el volumen de contenido crece o alguien no técnico necesita publicar, evaluar **Decap CMS** (gratis, basado en Git, sin servidor propio) antes que un CMS headless con API externa, para no romper el modelo 100% estático de GitHub Pages.

## SEO / tráfico

Consideraciones a documentar cuando se implementen:
- Sitemap y RSS del blog (`@astrojs/sitemap`, `@astrojs/rss`)
- Metadatos Open Graph por página
- URLs limpias y estables (`/blog/[slug]`, `/meditaciones/[slug]`)

## Decisiones abiertas

- [ ] Gestión de contenido definitiva (Content Collections vs CMS)
- [ ] Formato de audio y estrategia de compresión/tamaño de archivos
- [ ] Herramienta de analítica (Cloudflare Web Analytics / Plausible / GA)