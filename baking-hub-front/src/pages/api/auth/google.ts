import type { APIRoute } from 'astro';
import { guardarSesion } from '../../../lib/auth';
import { ApiError, graphql } from '../../../lib/graphql';
import { LOGIN_CON_GOOGLE } from '../../../lib/queries';

export const POST: APIRoute = async ({ request, cookies, url }) => {
  if (request.headers.get('origin') !== url.origin) {
    return Response.json({ error: 'Solicitud no válida.' }, { status: 403 });
  }

  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return Response.json({ error: 'La solicitud no contiene JSON válido.' }, { status: 400 });
  }

  const idToken =
    cuerpo && typeof cuerpo === 'object' && 'idToken' in cuerpo && typeof cuerpo.idToken === 'string'
      ? cuerpo.idToken
      : '';
  if (!idToken || idToken.length > 10_000) {
    return Response.json({ error: 'La credencial de Google no es válida.' }, { status: 400 });
  }

  try {
    const { loginConGoogle } = await graphql<{ loginConGoogle: { token: string } }>(
      LOGIN_CON_GOOGLE,
      { idToken },
    );
    guardarSesion(cookies, loginConGoogle.token);
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      const status = error.codigo === 'AUTH_PROVIDER_UNAVAILABLE' ? 503 : error.codigo === 'UNAUTHENTICATED' ? 401 : 502;
      return Response.json({ error: error.message }, { status });
    }
    console.error('Error al iniciar sesión con Google:', error);
    return Response.json({ error: 'No se pudo iniciar sesión. Inténtalo de nuevo.' }, { status: 500 });
  }
};
