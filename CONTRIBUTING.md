# Guía de contribución / flujo de trabajo

## Requisitos

- Node.js 18+ (recomendado 20 LTS)
- npm

## Flujo de trabajo local

```bash
npm install
npm run dev        # servidor local en localhost:4321
npm run build       # build de producción a ./dist
npm run preview     # previsualizar el build
```

## Convención de commits

Se recomienda usar [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: agregar reproductor de audio`
- `fix: corregir ruta de audio en Safari`
- `docs: actualizar guía de despliegue`
- `content: agregar meditación de respiración`
- `chore: actualizar dependencias`

## Ramas

- `main` — rama de producción, cada push dispara el deploy
- `feature/nombre-corto` — para cambios de código
- `content/nombre-corto` — para agregar/editar contenido

## Cómo agregar una meditación nueva

1. Subir el archivo de audio a `public/audio/meditaciones/nombre-archivo.mp3`
2. Crear `src/content/meditaciones/nombre-archivo.md` con el frontmatter definido en [`docs/modelo-contenido.md`](./docs/modelo-contenido.md)
3. Verificar en local con `npm run dev`
4. Hacer commit y push (o PR) a `main`

## Cómo agregar una entrada de blog

1. Crear `src/content/blog/titulo-del-post.md`
2. Completar el frontmatter (ver [`docs/modelo-contenido.md`](./docs/modelo-contenido.md))
3. Escribir el contenido en Markdown
4. Marcar `draft: true` mientras no esté listo para publicar

## Estilo de código

- TypeScript en componentes y schemas
- Preferir componentes `.astro` estáticos; usar React solo donde haya interactividad real (ver [`docs/arquitectura.md`](./docs/arquitectura.md))