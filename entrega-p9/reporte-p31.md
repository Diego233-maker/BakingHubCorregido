# Práctica P9 — Auditoría de calidad de Baking Hub

**Auditoría:** Lighthouse Mobile, Lighthouse 13.6.0 / Chrome for Testing 151.0.7922.34. Las capturas se hicieron con viewport 390×844; las capturas full-page de páginas largas se rasterizaron a 375 px por la barra vertical del navegador.  
**Rutas auditadas:** Home (`/`), categoría Chocolates y producto Brownies de Chocolate (`/producto/1`).

> **Estado del reporte: borrador técnico.** No se encontró `0PlantillaReporte.md` ni `1PracticaP3-31.md` en el workspace. Las métricas "antes" son del sitio publicado en Netlify. Las métricas "después local" son una comprobación preliminar en Astro dev (con Vite HMR y un mock local de GraphQL), tomada antes de las últimas optimizaciones del contador y preload; no son comparables con producción y no deben presentarse como resultados finales. Para cerrar la auditoría se debe desplegar el código y volver a medir las mismas tres URLs públicas.

## Línea base y comprobación local

Los valores de puntuación son sobre 100. Core Web Vitals corresponden al resultado de Lighthouse simulado; INP no se reporta en una navegación de laboratorio sin interacción de usuario.

| Página | Antes P/A/SEO | LCP antes | CLS antes | Diagnóstico local preliminar P/A/SEO | LCP local | CLS local |
|---|---:|---:|---:|---:|---:|---:|
| Home | 84 / 100 / 90 | 2.5 s | 0.003 | 60 / 95 / 100 | 4.1 s | 0 |
| Categoría Chocolates | 85 / 96 / 91 | 3.7 s | 0.003 | 52 / 93 / 100 | 6.1 s | 0 |
| Producto Brownies | 93 / 96 / 91 | 2.6 s | 0.003 | 53 / 95 / 100 | 4.9 s | 0 |

**Metas:** Accesibilidad ≥ 90 y SEO ≥ 90 se alcanzaron en las mediciones de referencia y en los diagnósticos locales. Performance ≥ 80 se alcanzó en las tres páginas públicas de referencia; las cifras locales posteriores no alcanzan la meta y son inválidas para comparar porque se midieron en modo desarrollo, con servidor Vite y sin el runtime de producción de Netlify. No se afirma que la meta Performance esté verificada para la versión modificada.

## Cambios realizados

- Encabezados principales: Home, categoría y producto tienen un único `h1`; categorías ahora usan rutas `/categoria/Chocolates` y `/categoria/Panader%C3%ADa`. Los enlaces antiguos con `?categoria=` redirigen a la ruta limpia.
- SEO por ruta: título y descripción únicos, canonical sin query string, Open Graph y Twitter Cards. Se añadió JSON-LD `Product` con imagen, SKU, oferta, precio, moneda y disponibilidad.
- SEO de rastreo: `/sitemap.xml` incluye Home, categorías y productos disponibles; si GraphQL no responde, publica al menos las rutas estáticas. `/robots.txt` permite la tienda y excluye panel admin/API.
- Accesibilidad: imágenes con `alt`; imágenes de catálogo con dimensiones, la primera imagen visible se carga con prioridad alta y las demás con lazy loading; imagen de detalle con dimensiones y prioridad LCP. Se conserva foco visible, se añade `prefers-reduced-motion` y el contador del carrito anuncia cambios mediante `aria-live`.
- Contraste: texto de acción oscuro en botones salmón; contraste comprobado con ratios de 5.78:1 en tema claro y 7.89:1 en tema oscuro. El tema claro del texto secundario revisado da 4.63:1.
- Rendimiento: se quitó la hidratación React del contador del carrito y el SDK de Mercado Pago ahora solo se carga en checkout. Se añade preload para la primera imagen de Home/categoría y la imagen del producto.
- Renderizado: se mantiene SSR porque catálogo, stock, precios y sesión son dinámicos; no se fuerza SSG con datos potencialmente obsoletos.

## Core Web Vitals

- **LCP (Largest Contentful Paint):** tiempo hasta pintar el elemento visible más grande; objetivo recomendado < 2.5 s. Lighthouse encontró la imagen principal como LCP, por lo que se marcaron eager/fetchpriority y preload. La validación final de LCP debe repetirse en producción porque las cifras locales corresponden a Vite dev.
- **INP (Interaction to Next Paint):** latencia de respuesta a interacciones reales; objetivo < 200 ms. Lighthouse de laboratorio devuelve N/A; debe medirse con tráfico de usuario o una prueba de interacción en navegador, no inferirse de la carga.
- **CLS (Cumulative Layout Shift):** movimiento inesperado de elementos; objetivo < 0.1. Las capturas Lighthouse dieron 0.003 antes y 0 en las mediciones locales. Las imágenes ahora reservan dimensiones explícitas.

## Evidencia

- `assets/antes-home.png`, `assets/antes-categoria.png`, `assets/antes-producto.png`: capturas del Netlify publicado antes de los cambios, viewport 390×844.
- `assets/despues-home.png`, `assets/despues-categoria.png`, `assets/despues-producto.png`: capturas locales con las mejoras, viewport 390×844 y datos de catálogo de prueba.
- `assets/lighthouse-antes-*.json`: reportes completos de Lighthouse Mobile del sitio publicado antes de cambios.
- `assets/lighthouse-local-*.json`: diagnósticos preliminares del servidor de desarrollo; no comparar directamente con producción.

## Validación de código

`npm run check` terminó con 0 errores, 0 warnings y 0 hints. `npm run build` completó con el adaptador SSR de Netlify. La interfaz local usa un mock temporal del catálogo porque no había backend configurado en este entorno; el mock no forma parte del código ni del ZIP.

## Pendiente antes de entregar como resultado final

1. Publicar/desplegar estos cambios en Netlify con el backend real disponible.
2. Ejecutar Lighthouse Mobile en las tres URLs públicas tras el deploy y actualizar la tabla con esas puntuaciones y métricas.
3. Reemplazar las capturas locales posteriores por capturas de las mismas URLs públicas y volver a crear el ZIP de reportes.
4. Confirmar que Performance ≥ 80 en las tres páginas. La medición local de desarrollo no lo demuestra.
