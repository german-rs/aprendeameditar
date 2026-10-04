# Aprende a Meditar: reglas del proyecto

## Stack y alcance
- Sitio 100% estático (`output: 'static'`), Astro 7 y TypeScript. No agregar SSR ni adaptadores.
- Estilos solo con Tailwind. Sin CSS aparte, salvo los tokens de `src/styles/global.css`.
- React solo para islas interactivas (reproductor y filtros). Todo lo demás, componentes Astro.
- Contenido en Content Collections (`src/content/meditaciones` y `src/content/blog`). Los campos válidos están en `src/content.config.ts`.

## Documentación de referencia
- Arquitectura: @docs/arquitectura.md
- Modelo de contenido: @docs/modelo-contenido.md
- Tokens de diseño del reproductor: @docs/guia-estilo-reproductor.md
- Voz y tono de los textos: @docs/brand.md
- Despliegue: @docs/despliegue.md

## Convenciones
- Textos de la interfaz y del contenido en español, con tono cercano y sin jerga.
- Respetar accesibilidad: foco visible, `aria-label` en botones de icono, `prefers-reduced-motion`.
- Los tokens de color y tipografía son la fuente de verdad: no inventar colores nuevos.

## Verificación
- Una tarea no está terminada hasta que `npm run build` pase sin errores.
- Para cambios visuales, revisar el resultado en el navegador, en claro y en oscuro, en móvil y escritorio.

## Seguridad
- Nunca guardar claves, tokens ni credenciales en archivos del repositorio.
- No modificar `.github/workflows` ni la configuración de DNS sin pedir confirmación.