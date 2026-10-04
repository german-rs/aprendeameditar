---
description: Crea un borrador de post para el blog
---

# Nuevo post

1. Pregunta al usuario: tema, título tentativo y a quién va dirigido. Si no lo dice, asume personas que están empezando a meditar.
2. Revisa `src/content.config.ts` para usar exactamente los campos del schema del blog.
3. Crea el archivo `.md` en `src/content/blog/` con un nombre en minúsculas y con guiones, sin tildes.
4. Escribe el frontmatter con `title`, `description` (máximo 160 caracteres, pensada para buscadores), `publishDate` con la fecha de hoy y `draft: true`.
5. Redacta el borrador siguiendo @docs/brand.md: lenguaje simple, párrafos cortos, un `##` por idea principal.
6. Ejecuta `npm run build` y confirma que no hay errores.
7. Recuerda al usuario que el post queda como borrador hasta cambiar `draft` a `false`.