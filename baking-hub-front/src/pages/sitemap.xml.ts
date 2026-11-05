import type { APIRoute } from 'astro';
import { graphql } from '../lib/graphql';
import { OBTENER_MENU } from '../lib/queries';
import type { Producto } from '../types';
import { CATEGORIAS } from '../lib/categorias';

const escaparXml = (valor: string) => valor.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

export const GET: APIRoute = async ({ request }) => {
  const origin = new URL(request.url).origin;
  let productos: Producto[] = [];
  try {
    ({ productos } = await graphql<{ productos: Producto[] }>(OBTENER_MENU));
  } catch (error) {
    console.error('No se pudo cargar el catálogo para el sitemap; se publicarán las rutas estáticas.', error);
  }

  const categorias = CATEGORIAS.filter((categoria) => categoria !== 'Todas').map(
    (categoria) => `${origin}/categoria/${encodeURIComponent(categoria)}`,
  );
  const urls = [origin, ...categorias, ...productos.map((producto) => `${origin}/producto/${encodeURIComponent(producto.id)}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${escaparXml(url)}</loc></url>`)
    .join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};