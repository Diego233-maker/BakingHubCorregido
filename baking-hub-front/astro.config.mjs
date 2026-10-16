// @ts-check
import { defineConfig, envField } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';

export default defineConfig({
  // Todas las páginas se renderizan en el servidor: necesitamos leer la cookie de sesión.
  // En Netlify el servidor corre como función serverless gracias al adaptador.
  output: 'server',
  adapter: netlify(),
  integrations: [react()],
  vite: {
    server: {
      allowedHosts: ['rinse-bless-licorice.ngrok-free.dev'],
    },
  },
  env: {
    schema: {
      // URL del backend GraphQL (en producción: la URL de Render). Solo se usa en el servidor,
      // nunca llega al navegador.
      GRAPHQL_URL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'http://localhost:4000/',
      }),
      // Solo lo utiliza el proxy SSE del servidor Astro para escuchar las suscripciones GraphQL.
      // En producción: wss://TU-SERVICIO.onrender.com/subscriptions
      GRAPHQL_WS_URL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'ws://localhost:4000/subscriptions',
      }),
      // Milisegundos máximos que dura cada conexión SSE del panel admin. 0 = sin límite (local / servidor propio).
      // En Netlify usa 9000: sus funciones con streaming se cortan a los 10 s.
      SSE_MAX_MS: envField.number({
        context: 'server',
        access: 'public',
        default: 0,
      }),
    },
  },
});