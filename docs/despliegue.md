# Despliegue

## Resumen

- **Hosting**: GitHub Pages
- **DNS**: Cloudflare
- **Dominio**: `aprendeameditar.cl`
- **CI/CD**: GitHub Actions (build + deploy en cada push a `main`)

## GitHub Actions

Workflow recomendado en `.github/workflows/deploy.yml` usando la acción oficial de Astro:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

En GitHub: **Settings → Pages → Source → GitHub Actions**.

## Dominio personalizado

1. Archivo `public/CNAME` con una sola línea:
   ```
   aprendeameditar.cl
   ```
2. En **Settings → Pages → Custom domain**, ingresar `aprendeameditar.cl` y esperar la verificación.
3. Activar **Enforce HTTPS** una vez que el certificado esté emitido.

## Configuración DNS en Cloudflare

| Tipo | Nombre | Valor | Proxy |
|---|---|---|---|
| A | `@` | `185.199.108.153` | DNS only (nube gris) |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `german-rs.github.io` | DNS only |

**Importante:** mientras se valida el dominio y se emite el certificado de GitHub Pages, mantener el proxy de Cloudflare en modo **DNS only** (nube gris). Activar el proxy (nube naranja) puede interferir con la validación TLS/ACME de GitHub Pages. Una vez emitido el certificado, se puede evaluar activar el proxy si se necesitan funciones de Cloudflare (cache, WAF, etc.), verificando que no rompa la validación del dominio.

## `astro.config.mjs`

```js
export default defineConfig({
  site: 'https://aprendeameditar.cl',
  output: 'static',
});
```

`site` es necesario para generar URLs absolutas correctas (sitemap, RSS, Open Graph).

## Checklist de verificación post-deploy

- [ ] `https://aprendeameditar.cl` carga con certificado válido
- [ ] `https://www.aprendeameditar.cl` redirige correctamente
- [ ] Sitemap accesible en `/sitemap-index.xml`
- [ ] Audios cargan sin error 404 (rutas relativas a `public/`)