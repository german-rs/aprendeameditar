# Guía de estilo — Reproductor de meditación

Referencia visual: [mockup interactivo](https://claude.ai/artifact/9XA3sW7MvLRe516JsaR9Fi) (modo claro/oscuro, reproductor completo y variante mini-player).

## Principios

1. **Patrones de Spotify, no su identidad visual.** Tomamos prestada la estructura que la gente ya sabe usar de memoria: portada grande, barra de progreso con tiempos, controles centrados, jerarquía título/metadatos. La piel visual es propia.
2. **Vidrio, no tarjeta plana.** Todo panel del reproductor es una superficie translúcida con blur sobre un fondo con color detrás (gradiente + formas difusas). Sin ese fondo con color, el efecto no se percibe — nunca colocar el panel de vidrio sobre blanco/gris plano.
3. **Quietud con un solo gesto vivo.** El movimiento se reserva casi por completo a un único detalle: el halo del "orbe" de portada pulsa suavemente al reproducir (~3s, tipo respiración). El resto de la interfaz es estático; nada de animaciones sueltas en cada hover.
4. **Funciona en claro y oscuro.** Todos los tokens de color están duplicados por modo; ningún color se escribe "a mano" (ni `#hex` ni `bg-[#...]`) fuera de los tokens.

## Paleta

Todos los colores se declaran como tokens con variante por modo. **Esta tabla es la fuente de verdad**: no se usan colores fuera de ella, y si hace falta uno nuevo se agrega primero aquí (y en `global.css`, ver [Implementación con Tailwind CSS](#implementación-con-tailwind-css)).

| Token | Modo claro | Modo oscuro | Uso |
|---|---|---|---|
| `--bg-base` | `#F4F1FC` | `#0B0818` | Fondo general |
| `--accent` | `#7C5CFA` | `#9B7EFF` | Play, progreso, foco, slider |
| `--accent-soft` | `#E4DBFF` | `rgba(155,126,255,.25)` | Halo del orbe, sombra del botón play |
| `--text-primary` | `#2A1F4D` | `#F1EDFF` | Título, texto principal |
| `--text-secondary` | `#756894` | `#B3A6E0` | Metadatos, tiempos |
| `--glass-bg` | `rgba(255,255,255,.55)` | `rgba(255,255,255,.07)` | Fondo de paneles de vidrio |
| `--glass-border` | `rgba(255,255,255,.75)` | `rgba(255,255,255,.16)` | Borde de paneles de vidrio |
| `--glass-shadow` | `rgba(76,44,140,.18)` | `rgba(0,0,0,.45)` | Sombra del panel de vidrio |
| `--ghost-bg` | `rgba(255,255,255,.45)` | `rgba(255,255,255,.06)` | Fondo de los botones secundarios (anterior/siguiente) |
| `--track-bg` | `rgba(42,31,77,.12)` | `rgba(255,255,255,.14)` | Riel de la barra de progreso/volumen |
| `--blob-1` | `#C9B8FF` (lavanda) | `#4B3494` (violeta profundo) | Forma difusa de fondo 1 |
| `--blob-2` | `#B8D4FF` (azul cielo) | `#2B2568` (índigo) | Forma difusa de fondo 2 |
| `--blob-3` | `#FFC9E8` (rosa) | `#6A2E5C` (ciruela) | Forma difusa de fondo 3 |

Las formas difusas de fondo (`--blob-1/2/3`) existen para que el blur tenga algo que revelar: `blur-[70px]` y opacidad ~0.55 en modo claro; misma técnica en modo oscuro.

## Tipografía

- **Display** (título de la meditación): `Fraunces`, itálica, weight 500. Serif cálida y editorial — evita la sensación de dashboard/SaaS genérico. Clases: `font-display italic font-medium`.
- **UI** (metadatos, tiempos, botones, labels): `Manrope`, weights 400/500/600/700. Geométrica y legible en tamaños pequeños. Clase: `font-ui`.
- Números de tiempo con `tabular-nums` (`font-variant-numeric: tabular-nums`) para que no "salten" de ancho mientras avanza el progreso.

## Implementación con Tailwind CSS

Los estilos se escriben **solo con Tailwind CSS v4**: sin CSS vanilla y sin bloques `<style>` en los componentes. El único archivo CSS es `src/styles/global.css`, que no contiene estilos de componentes, solo la configuración de Tailwind: los valores de los tokens por modo, sus alias como utilidades y las animaciones.

```css
/* src/styles/global.css — único archivo CSS del proyecto */
@import "tailwindcss";
@plugin "@tailwindcss/typography"; /* clase `prose` para el contenido del blog */

/* Modo oscuro por clase en <html> (toggle manual, como el mockup) */
@custom-variant dark (&:where(.dark, .dark *));

/* 1) Valores de los tokens por modo (copiados de la tabla de la paleta) */
:root {
  --bg-base: #F4F1FC;
  --accent: #7C5CFA;
  --accent-soft: #E4DBFF;
  --text-primary: #2A1F4D;
  --text-secondary: #756894;
  --glass-bg: rgba(255,255,255,.55);
  --glass-border: rgba(255,255,255,.75);
  --glass-shadow: rgba(76,44,140,.18);
  --ghost-bg: rgba(255,255,255,.45);
  --track-bg: rgba(42,31,77,.12);
  --blob-1: #C9B8FF;
  --blob-2: #B8D4FF;
  --blob-3: #FFC9E8;
}

.dark {
  --bg-base: #0B0818;
  --accent: #9B7EFF;
  --accent-soft: rgba(155,126,255,.25);
  --text-primary: #F1EDFF;
  --text-secondary: #B3A6E0;
  --glass-bg: rgba(255,255,255,.07);
  --glass-border: rgba(255,255,255,.16);
  --glass-shadow: rgba(0,0,0,.45);
  --ghost-bg: rgba(255,255,255,.06);
  --track-bg: rgba(255,255,255,.14);
  --blob-1: #4B3494;
  --blob-2: #2B2568;
  --blob-3: #6A2E5C;
}

/* 2) Alias de Tailwind: cada token pasa a ser una utilidad */
@theme inline {
  --color-base: var(--bg-base);
  --color-accent: var(--accent);
  --color-accent-soft: var(--accent-soft);
  --color-primary: var(--text-primary);
  --color-secondary: var(--text-secondary);
  --color-glass: var(--glass-bg);
  --color-glass-border: var(--glass-border);
  --color-ghost: var(--ghost-bg);
  --color-track: var(--track-bg);
  --color-blob-1: var(--blob-1);
  --color-blob-2: var(--blob-2);
  --color-blob-3: var(--blob-3);
  --shadow-glass: 0 24px 60px var(--glass-shadow), inset 0 1px 0 rgba(255,255,255,.25);
  --font-display: "Fraunces", serif;
  --font-ui: "Manrope", sans-serif;
}

/* 3) Pulso del orbe (~3s, tipo respiración); los valores son un ejemplo a ajustar */
@theme {
  --animate-orb-pulse: orb-pulse 3s ease-in-out infinite;

  @keyframes orb-pulse {
    0%, 100% { transform: scale(1); opacity: .7; }
    50% { transform: scale(1.06); opacity: 1; }
  }
}
```

Los valores de `:root` y `.dark` se copian de la tabla de la paleta: si un token cambia, se actualizan ambos lugares en el mismo cambio.

> **Modo oscuro (decisión abierta):** el ejemplo asume un toggle manual con la clase `.dark` en `<html>`, como el mockup. Si se decide seguir solo la preferencia del sistema, los valores oscuros pasan a `@media (prefers-color-scheme: dark) { :root { ... } }` y se elimina el `@custom-variant`. En ambos casos los componentes no usan `dark:`: los tokens cambian de valor solos.

### Token → utilidad

| Token | Utilidades |
|---|---|
| `--bg-base` | `bg-base` |
| `--accent` | `bg-accent`, `text-accent`, `outline-accent` |
| `--accent-soft` | `bg-accent-soft` |
| `--text-primary` | `text-primary` |
| `--text-secondary` | `text-secondary` |
| `--glass-bg` | `bg-glass` |
| `--glass-border` | `border-glass-border` |
| `--glass-shadow` | `shadow-glass` (sombra completa del panel de vidrio) |
| `--ghost-bg` | `bg-ghost` |
| `--track-bg` | `bg-track` |
| `--blob-1/2/3` | `bg-blob-1`, `bg-blob-2`, `bg-blob-3` |

El nombre de la utilidad es solo un alias: el nombre del token en la tabla de la paleta sigue siendo el de referencia.

### Reglas de uso

- Colores solo desde estos alias; los valores arbitrarios (`rounded-[32px]`, `backdrop-blur-[24px]`, `size-[168px]`) se reservan para las medidas del diseño de esta guía.
- Para reutilizar un conjunto de clases se crea un componente (por ejemplo `GlassPanel`), no `@apply`.
- Para estilar pseudo-elementos (anillos del orbe, thumb del slider) se usan variantes de Tailwind: `before:`, `after:`, `[&::-webkit-slider-thumb]:`.
- El contenido Markdown del blog se estiliza con `prose` (`@tailwindcss/typography`), apuntando sus variables `--tw-prose-*` a los tokens.

## El "vidrio"

El panel de vidrio se construye con utilidades, sin CSS aparte:

```html
<div class="rounded-[32px] border border-glass-border bg-glass shadow-glass backdrop-blur-[24px] backdrop-saturate-[160%]">
  ...
</div>
```

`shadow-glass` incluye la sombra `0 24px 60px` con `--glass-shadow` y el reborde interior superior. El radio es `32px` (20px en el mini-player, fuera del MVP).

## Anatomía del reproductor completo

Es el formato definido para el MVP: se usa en el home (con la meditación del día) y embebido en la página de detalle de cada meditación.

1. **Orbe de portada** (168px, circular) — gradiente radial con `--accent-soft` → `--accent`, dos anillos concéntricos sutiles (`before:`/`after:`). Pulsa suavemente mientras reproduce (`motion-safe:animate-orb-pulse` en el halo, solo en estado "reproduciendo").
2. **Título** — Fraunces itálica, 19px.
3. **Metadatos** — categoría · duración, texto secundario, 13px.
4. **Barra de progreso** — riel de 4px, relleno con `--accent`, thumb circular; tiempo transcurrido a la izquierda, duración total a la derecha.
5. **Controles** — anterior / **play-pause** (botón circular grande, 62px, relleno `--accent`) / siguiente. Los botones secundarios usan `--ghost-bg` y un borde de 1px con `--glass-border`, más discretos que el play.
6. **Volumen** — ícono + slider horizontal, mismo tratamiento visual que la barra de progreso.

Ejemplos de traducción a clases:

| Elemento | Clases |
|---|---|
| Título | `font-display italic font-medium text-[19px] text-primary` |
| Metadatos | `font-ui text-[13px] text-secondary` |
| Tiempos | `font-ui tabular-nums text-secondary` |
| Riel / relleno | `h-1 rounded-full bg-track` / `bg-accent` |
| Botón play | `size-[62px] rounded-full bg-accent focus-visible:outline-2 focus-visible:outline-accent` |
| Botón secundario | `rounded-full border border-glass-border bg-ghost focus-visible:outline-2 focus-visible:outline-accent` |

## Variante mini-player (fuera del MVP)

Misma superficie de vidrio en formato compacto (borde 20px), pensada para quedar fija en la parte inferior de la pantalla: orbe pequeño (38px) + título/metadatos truncados + botón play.

**No se implementa en el MVP**: se definió el reproductor completo. Si se retoma más adelante, tener en cuenta que en un sitio multipágina de Astro el audio se corta al navegar entre páginas, salvo que se use el enrutador de transiciones de Astro con `transition:persist` (revisar la documentación de Astro sobre transiciones de vista).

## Accesibilidad

- Contraste verificado entre `--text-primary`/`--text-secondary` y `--glass-bg` en ambos modos (texto siempre por encima de AA para tamaño de UI).
- `:focus-visible` con anillo de foco de 2px en `--accent` en todo elemento interactivo (botones, slider, riel de progreso): `focus-visible:outline-2 focus-visible:outline-accent`.
- `prefers-reduced-motion: reduce` desactiva el pulso del orbe y el desplazamiento ambiental de los blobs de fondo: las animaciones se aplican solo con `motion-safe:`.
- Los `aria-label` describen la acción real del botón ("Reproducir", "Meditación siguiente", "Volumen"), no el ícono.