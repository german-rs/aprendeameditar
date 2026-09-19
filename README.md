# Aprende a Meditar

Aplicación web para descubrir y escuchar meditaciones guiadas en español, con un blog para generar contenido y tráfico orgánico.

🌐 Sitio: https://aprendeameditar.cl
📦 Stack: Astro + React (islands) + TypeScript
🚀 Despliegue: GitHub Pages + Cloudflare (DNS)

## Documentación

Toda la documentación de desarrollo vive en [`docs/`](./docs):

- [Arquitectura](./docs/arquitectura.md) — stack, estructura de carpetas, decisiones técnicas
- [Modelo de contenido](./docs/modelo-contenido.md) — cómo se estructuran las meditaciones y los posts del blog
- [Despliegue](./docs/despliegue.md) — GitHub Pages + Cloudflare DNS, CI/CD
- [Roadmap](./docs/roadmap.md) — fases del proyecto
- [Guía de contribución](./CONTRIBUTING.md) — cómo agregar contenido y flujo de trabajo

## Requisitos

- Node.js 18+ (recomendado 20 LTS)
- npm

## Primeros pasos

```bash
npm install
npm run dev
```

El sitio queda disponible en `http://localhost:4321`.

## Comandos

| Comando | Acción |
|---|---|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Genera el sitio estático en `./dist/` |
| `npm run preview` | Previsualiza el build de producción localmente |
| `npm run astro ...` | Ejecuta comandos del CLI de Astro |

## Estructura del proyecto

Detalle completo en [docs/arquitectura.md](./docs/arquitectura.md).

```
├── public/
│   ├── audio/meditaciones/   # archivos de audio (mp3)
│   └── images/
├── src/
│   ├── components/
│   │   ├── react/            # islas interactivas (reproductor, filtros)
│   │   └── astro/            # componentes estáticos
│   ├── content/               # Content Collections (meditaciones y blog)
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── docs/                      # documentación del proyecto
└── astro.config.mjs
```

## Estado del proyecto

🟡 Fase inicial — ver [roadmap](./docs/roadmap.md).

## Licencia

Por definir.