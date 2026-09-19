# Guía de estilo — Reproductor de meditación

Referencia visual: [mockup interactivo](https://claude.ai/artifact/9XA3sW7MvLRe516JsaR9Fi) (modo claro/oscuro, reproductor completo y variante mini-player).

## Principios

1. **Patrones de Spotify, no su identidad visual.** Tomamos prestada la estructura que la gente ya sabe usar de memoria: portada grande, barra de progreso con tiempos, controles centrados, jerarquía título/metadatos. La piel visual es propia.
2. **Vidrio, no tarjeta plana.** Todo panel del reproductor es una superficie translúcida con blur sobre un fondo con color detrás (gradiente + formas difusas). Sin ese fondo con color, el efecto no se percibe — nunca colocar el panel de vidrio sobre blanco/gris plano.
3. **Quietud con un solo gesto vivo.** El movimiento se reserva casi por completo a un único detalle: el halo del "orbe" de portada pulsa suavemente al reproducir (~3s, tipo respiración). El resto de la interfaz es estático; nada de animaciones sueltas en cada hover.
4. **Funciona en claro y oscuro.** Todos los tokens de color están duplicados por modo; ningún color se declara "a mano" fuera de las variables.

## Paleta

6 colores base, con variantes por modo definidas como tokens (ver tabla):

| Token | Modo claro | Modo oscuro | Uso |
|---|---|---|---|
| `--bg-base` | `#F4F1FC` | `#0B0818` | Fondo general |
| `--accent` | `#7C5CFA` | `#9B7EFF` | Play, progreso, foco, slider |
| `--accent-soft` | `#E4DBFF` | `rgba(155,126,255,.25)` | Halo del orbe, sombra del botón play |
| `--text-primary` | `#2A1F4D` | `#F1EDFF` | Título, texto principal |
| `--text-secondary` | `#756894` | `#B3A6E0` | Metadatos, tiempos |
| `--glass-bg` | `rgba(255,255,255,.55)` | `rgba(255,255,255,.07)` | Fondo de paneles de vidrio |
| `--glass-border` | `rgba(255,255,255,.75)` | `rgba(255,255,255,.16)` | Borde de paneles de vidrio |
| `--track-bg` | `rgba(42,31,77,.12)` | `rgba(255,255,255,.14)` | Riel de la barra de progreso/volumen |

Formas difusas de fondo (`blob`), para que el blur tenga algo que revelar:
- Claro: lavanda `#C9B8FF`, azul cielo `#B8D4FF`, rosa `#FFC9E8` — `filter: blur(70px)`, opacidad ~0.55
- Oscuro: violeta profundo `#4B3494`, índigo `#2B2568`, ciruela `#6A2E5C` — misma técnica

## Tipografía

- **Display** (título de la meditación): `Fraunces`, itálica, weight 500. Serif cálida y editorial — evita la sensación de dashboard/SaaS genérico.
- **UI** (metadatos, tiempos, botones, labels): `Manrope`, weights 400/500/600/700. Geométrica y legible en tamaños pequeños.
- Números de tiempo con `font-variant-numeric: tabular-nums` para que no "salten" de ancho mientras avanza el progreso.

## El "vidrio" (glass token)

```css
.panel {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  box-shadow: 0 24px 60px var(--glass-shadow), inset 0 1px 0 rgba(255,255,255,.25);
  border-radius: 32px; /* 20px en el mini-player */
}
```

## Anatomía del reproductor completo

1. **Orbe de portada** (168px, circular) — gradiente radial con `--accent-soft` → `--accent`, dos anillos concéntricos sutiles (`::before`/`::after`). Pulsa suavemente mientras reproduce.
2. **Título** — Fraunces itálica, 19px.
3. **Metadatos** — categoría · duración, texto secundario, 13px.
4. **Barra de progreso** — riel de 4px, relleno con `--accent`, thumb circular; tiempo transcurrido a la izquierda, duración total a la derecha.
5. **Controles** — anterior / **play-pause** (botón circular grande, 62px, relleno `--accent`) / siguiente. Los botones secundarios usan `--ghost-bg`, más discretos que el play.
6. **Volumen** — ícono + slider horizontal, mismo tratamiento visual que la barra de progreso.

## Variante mini-player

Misma superficie de vidrio en formato compacto (borde 20px), pensada para quedar fija en la parte inferior de la pantalla: orbe pequeño (38px) + título/metadatos truncados + botón play. Ver nota de decisión pendiente abajo.

## Accesibilidad

- Contraste verificado entre `--text-primary`/`--text-secondary` y `--glass-bg` en ambos modos (texto siempre por encima de AA para tamaño de UI).
- `:focus-visible` con anillo de foco de 2px en `--accent` en todo elemento interactivo (botones, slider, riel de progreso).
- `prefers-reduced-motion: reduce` desactiva el pulso del orbe y el desplazamiento ambiental de los blobs de fondo.
- Los `aria-label` describen la acción real del botón ("Reproducir", "Meditación siguiente", "Volumen"), no el ícono.

## Pendiente de decisión

- **Comportamiento del reproductor en el MVP**: ¿reproductor completo embebido en la página de detalle, o mini-player fijo visible en toda la app? El mockup incluye ambas variantes para comparar antes de implementar.