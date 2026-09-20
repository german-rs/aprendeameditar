# Arquitectura

## Objetivo del producto

Aprendeameditar.cl es una app web que combina:
1. Un **reproductor de audios de meditación** organizados por categoría.
2. Un **blog** para publicar artículos, atraer tráfico orgánico (SEO) y dar contexto a las meditaciones.

## Página de inicio (home)

Decisión de producto: quien entra al sitio debe poder empezar a meditar **de inmediato**, sin navegar primero. Por eso el home (`/`) no es una landing de blog con enlaces — carga directamente el **reproductor completo** (ver [guía de estilo](./guia-estilo-reproductor.md)) con la **meditación del día** lista para reproducir.

El reproductor completo es el formato definido para el MVP: se usa en el home y embebido en la página de detalle de cada meditación. No hay mini-player fijo.

Como el objetivo del sitio también es tráfico orgánico, el home no es solo un reproductor. Además incluye, en **HTML estático** (indexable aunque el JavaScript del cliente aún no haya cargado):

- Un `h1` que describa el sitio.
- Una breve descripción de qué es y a quién ayuda, en el tono de la marca (ver [brand.md](./brand.md)).
- Enlaces a las categorías de meditaciones y al blog, con acceso a sus artículos.

Nada de esto bloquea ni retrasa el acceso al audio: el reproductor sigue siendo el elemento principal del home.

Implicaciones:
- `src/pages/index.astro` renderiza el layout del reproductor completo junto con el `h1`, la descripción y los enlaces, no una portada tradicional de blog.
- La navegación a categorías, blog y demás meditaciones queda accesible desde el mismo home (header y accesos debajo del reproductor), sin bloquear el acceso inmediato al audio.

### Rotación de "meditación del día"

El sitio es 100% estático (GitHub Pages, sin backend ni cron jobs), así que la rotación diaria **no depende de un rebuild**: se calcula en el cliente con una función determinística de la fecha local del visitante, sobre la lista completa de meditaciones que ya viene embebida en el build. Todas las meditaciones participan en la rotación: no existe un campo para destacarlas o excluirlas.

Dos detalles para que la rotación sea estable:

1. **El día se cuenta con `Date.UTC`.** Restar fechas locales con `new Date` desfasa el cambio de día en una hora durante parte del año por el horario de verano (Chile cambia de hora); contar los días en UTC a partir de la fecha calendario local lo evita.
2. **La lista se ordena de forma fija en build time** (por `publishDate` ascendente y luego por `id`), para que la rotación no dependa del orden en que Astro devuelve la colección.

```ts
// En build time (p. ej. en index.astro): orden fijo de la colección
const meditaciones = (await getCollection('meditaciones')).sort(
  (a, b) => +a.data.publishDate - +b.data.publishDate || a.id.localeCompare(b.id),
);
```

```ts
// En el cliente: misma meditación para todo el mundo el mismo día calendario
function meditacionDelDia(meditaciones: Meditacion[]): Meditacion {
  const ahora = new Date();
  // Días desde el 31/12 del año anterior, contados en UTC a partir de la
  // fecha calendario local: el horario de verano no adelanta ni atrasa el cambio de día.
  const hoyUTC = Date.UTC(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const inicioAñoUTC = Date.UTC(ahora.getFullYear(), 0, 0);
  const diaDelAño = Math.floor((hoyUTC - inicioAñoUTC) / 86_400_000);
  return meditaciones[diaDelAño % meditaciones.length];
}
```

Así, aunque el sitio no se recompile todos los días, la meditación destacada cambia solo con el paso del calendario (misma para todos los visitantes en el mismo día, en su horario local).

Nota: al agregar o quitar meditaciones cambia `meditaciones.length`, por lo que la rotación se reordena. Es un comportamiento esperado.

## Stack técnico

| Capa | Elección | Motivo |
|---|---|---|
| Framework | [Astro](https://astro.build) 7 | Sitio mayormente estático, rendimiento óptimo para SEO y contenido |
| Islas interactivas | React | Reproductor de audio, filtros/búsqueda del blog |
| Estilos | [Tailwind CSS](https://tailwindcss.com) v4 (plugin `@tailwindcss/vite`) | Tokens de diseño como utilidades y modo claro/oscuro, sin CSS vanilla |
| Contenido | Astro Content Collections (Markdown/MDX) — ver [Gestión de contenido](#gestión-de-contenido) | Sin backend, versionado en Git |
| Alojamiento de audio | Archivos MP3 estáticos en `public/audio/` | Simplicidad para el MVP, sin costos de storage externo |
| Hosting | GitHub Pages | Gratuito, integrado al repo |
| DNS | Cloudflare | Dominio `aprendeameditar.cl` |
| Lenguaje | TypeScript | Tipado en schemas de contenido y componentes |

## Modo de renderizado

Astro en modo **estático (`output: 'static'`)**, ya que GitHub Pages solo sirve archivos estáticos (no hay SSR/edge functions disponibles). Todas las páginas se generan en build time.

```js
// astro.config.mjs
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://aprendeameditar.cl',
  output: 'static',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
```

## Estilos

Todo el estilado se hace con **Tailwind CSS v4**, sin CSS vanilla ni bloques `<style>` en los componentes (ni `.astro` ni React). El diseño lo definen los tokens de la [guía de estilo](./guia-estilo-reproductor.md#implementación-con-tailwind-css).

Instalación (plugin de Vite, la vía que Astro recomienda para Tailwind 4; el plugin se registra en `astro.config.mjs`, ver arriba):

```bash
npm install tailwindcss @tailwindcss/vite
npm install -D @tailwindcss/typography
```

Reglas:
- El único archivo CSS es `src/styles/global.css`: import de Tailwind, valores de los tokens por modo, alias `@theme` y `@keyframes`. Se importa una sola vez en `BaseLayout.astro`.
- Los colores salen solo de los tokens; los valores arbitrarios (`rounded-[32px]`, `backdrop-blur-[24px]`) se reservan para medidas del diseño.
- Para reutilizar estilos se crean componentes (por ejemplo `GlassPanel`), no `@apply`.
- El contenido Markdown del blog no trae clases: se estiliza con `prose` (`@tailwindcss/typography`).
- Tras instalar, verificar que `npm run build` funcione: hubo reportes de fallos del plugin de Vite con Astro 6. Si ocurre, la alternativa es `@tailwindcss/postcss`.

## Islas de interactividad (Astro Islands)

Astro renderiza todo como HTML estático por defecto. Los componentes React se usan **solo** donde hace falta interactividad en el cliente:

- `<AudioPlayer client:load />` — reproductor de audio completo, en el home y en la página de detalle de cada meditación (necesita estado inmediato)
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
│   ├── content.config.ts          # schemas y loaders de las collections
│   ├── content/
│   │   ├── meditaciones/          # *.md — una por meditación
│   │   └── blog/                  # *.md — una por entrada
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── BlogPostLayout.astro
│   ├── pages/
│   │   ├── index.astro             # home = reproductor completo con la meditación del día + h1, descripción y enlaces
│   │   ├── meditaciones/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── blog/
│   │       ├── index.astro
│   │       └── [slug].astro
│   └── styles/
│       └── global.css             # única hoja CSS: Tailwind, tokens (@theme) y keyframes
└── docs/
```

## Gestión de contenido

**Decidido para el MVP: Astro Content Collections** (Markdown/MDX versionado en el repo), configuradas en `src/content.config.ts` con el loader `glob()` (ver [modelo de contenido](./modelo-contenido.md)). Motivos:
- No requiere backend ni costos adicionales.
- Encaja directo con GitHub Pages (todo se resuelve en build time).
- Es suficiente mientras el volumen de contenido sea bajo/medio y quien publique sepa editar Markdown, o use más adelante un CMS basado en Git.

Si el volumen de contenido crece o alguien no técnico necesita publicar, evaluar **Decap CMS** (gratis, basado en Git, sin servidor propio) antes que un CMS headless con API externa, para no romper el modelo 100% estático de GitHub Pages. Esta evaluación está en la Fase 3 del [roadmap](./roadmap.md).

## SEO / tráfico

Consideraciones a documentar cuando se implementen:
- Sitemap y RSS del blog (`@astrojs/sitemap`, `@astrojs/rss`)
- Metadatos Open Graph por página
- URLs limpias y estables (`/blog/[slug]`, `/meditaciones/[slug]`)
- Home con `h1`, descripción y enlaces internos en HTML estático (ver [Página de inicio](#página-de-inicio-home))

## Decisiones

`[x]` = decidido, `[ ]` = abierto.

- [x] Gestión de contenido: Astro Content Collections (`src/content.config.ts`); el CMS se evalúa en Fase 3 si el volumen lo justifica
- [x] Formato de audio: MP3 (128–192 kbps) en esta primera fase
- [x] Reproductor: formato completo en home y detalle; sin mini-player en el MVP
- [x] Estilos: Tailwind CSS v4, sin CSS vanilla (única hoja: `src/styles/global.css`)
- [x] Meditación del día: rota entre todas las meditaciones; sin campo `featured`
- [x] Modo oscuro: solo preferencia del sistema (`prefers-color-scheme`) o toggle manual con clase `.dark` (la guía de estilo asume el toggle, como el mockup)
- [x] Herramienta de analítica (GA)