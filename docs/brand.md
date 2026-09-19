# Marca — Aprende a Meditar

## Misión

Ayudar a quienes recién empiezan a meditar a encontrar un espacio simple, sin fricción, donde puedan sentarse a respirar en el momento en que lo necesiten — sin cursos largos, sin jerga y sin la sensación de "no estar haciéndolo bien".

## A quién le hablamos

Principiantes. Personas que quizás lo intentaron una vez y lo dejaron, que sienten que el mundo del mindfulness es intimidante o poco claro, o que solo buscan 10 minutos de calma en medio del día. No asumimos conocimiento previo de técnicas ni de terminología.

## Voz y tono

Cercano y coloquial — como un amigo que te acompaña, no un instructor que corrige.

**Hacemos:**
- Hablamos de tú
- Frases cortas, lenguaje cotidiano
- Validamos sin sermonear ("está bien si tu mente se distrae, es parte del proceso")
- Explicamos cualquier término técnico la primera vez que aparece

**Evitamos:**
- Jerga espiritual o académica sin explicar ("samadhi", "ecuanimidad", "vipassana" sin contexto)
- Tono de experto que sabe más que quien lee
- Imperativos duros ("Debes respirar así") — mejor invitaciones ("Prueba respirar así")
- Promesas exageradas ("elimina tu ansiedad para siempre")

**Ejemplo:**
- ❌ "Practique la atención plena mediante la observación no reactiva de las sensaciones somáticas."
- ✅ "Solo nota cómo se siente tu cuerpo ahora mismo. No hay que cambiar nada, solo notar."

## Identidad visual

### Isotipo

Figura de meditación en una sola línea continua (trazo tipo caligrafía, sin cierres) — evoca a alguien sentado con las piernas cruzadas. Es la única pieza de marca definida hasta ahora; todavía no existe un wordmark.

- **Color**: el isotipo no tiene un color propio — al ser una figura simple, hereda los tokens ya definidos en la [guía de estilo del reproductor](./guia-estilo-reproductor.md) según el fondo donde aparezca:
  - Sobre fondo oscuro/vidrio oscuro → `--accent` claro (`#9B7EFF`) o blanco puro
  - Sobre fondo claro/vidrio claro → `--accent` (`#7C5CFA`) o `--text-primary` (`#2A1F4D`)
  - Se mantiene siempre monocromático — al ser un trazo continuo, no se le aplican degradados ni colores mezclados dentro de la misma figura.
- **Espacio de protección**: dejar alrededor del isotipo un margen mínimo equivalente al grosor del trazo más ancho de la figura, para que no compita con otros elementos cercanos.
- **Tamaño mínimo**: el trazo fino puede perderse a tamaños muy pequeños (favicon, ícono de pestaña). Probar legibilidad por debajo de 32px antes de usarlo así; si se pierde detalle, usar una versión simplificada solo para esos casos.
- **Qué no hacer**: no rotar la figura, no rellenar el interior de los loops, no aplicarle sombra o glow pesado (rompe la limpieza del trazo), no estirarla fuera de su proporción original.
- **Formato**: PNG, definitivo. Se usa directamente en favicon, header y demás tamaños del sitio sin conversión a otro formato.

### Wordmark (pendiente)

Todavía no hay una versión tipográfica del nombre para acompañar al isotipo en el header. Punto de partida sugerido: `Manrope` en peso 600–700 para legibilidad a tamaños pequeños de header, reservando `Fraunces` itálica para títulos editoriales del blog. Confirmar antes de construir el lockup final logo + texto.

### Tipografía de marca

Se reutilizan los mismos dos tipos ya definidos para el reproductor, para que blog y producto se sientan una sola marca:
- **Fraunces** (itálica) — titulares, nombres de meditaciones, momentos editoriales
- **Manrope** — cuerpo de texto, UI, metadatos

### Color

La paleta nocturna violeta/azul definida para el reproductor (`./guia-estilo-reproductor.md`) es la paleta de marca completa, no solo la del componente — se usa igual en blog, header, footer y cualquier material de marca, para que el sitio se sienta un solo producto y no "un reproductor" más "un blog" separados.

### Imágenes

Evitar el cliché de fotos de stock (persona en la playa en posición de loto, piedras apiladas, velas encendidas). Preferir el mismo lenguaje visual del reproductor: orbes y gradientes suaves difuminados sobre fondo oscuro/violeta, coherentes con el glassmorfismo. Si se usa fotografía real, que sea de luz natural y personas reales, no poses genéricas de stock.

## Pilares de contenido del blog

Pensados para principiantes y para tráfico orgánico (SEO):
1. **Primeros pasos** — cómo empezar a meditar sin experiencia, qué esperar la primera vez, errores comunes de principiante
2. **Mitos y dudas** — "no puedo dejar la mente en blanco", "necesito una hora libre", "no lo estoy haciendo bien"
3. **Meditación en el día a día** — micro-pausas, antes de dormir, en momentos puntuales de ansiedad
4. **Detrás de cada meditación** — contexto breve de las meditaciones del catálogo: por qué esa técnica, para qué sirve
5. **Evidencia, explicada simple** — qué dice la investigación sobre meditación, sin jerga académica

## Terminología consistente

- "Meditaciones", no "sesiones" ni "clases"
- "Meditación del día" — término fijo para la destacada del home (ver `./arquitectura.md`)
- Evitar la palabra "mindfulness" sin explicarla la primera vez que aparece en un texto
- Categorías del catálogo: sueño, ansiedad, estrés, respiración, principiantes (mismas del schema de contenido, ver `./modelo-contenido.md`)