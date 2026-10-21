import { st as defineMiddleware, t as sequence } from "./chunks/sequence_QxkgRyO6.mjs";
import { h as ME } from "./chunks/queries_DPD021At.mjs";
import { n as cerrarSesion } from "./chunks/auth_DTgZtdCi.mjs";
import { n as graphql } from "./chunks/graphql_b8rvOFuU.mjs";
//#region src/middleware.ts
var RUTAS_PROTEGIDAS = [
	"/checkout",
	"/pedidos",
	"/admin"
];
var RUTAS_ADMIN = ["/admin"];
var coincide = (ruta, base) => ruta === base || ruta.startsWith(`${base}/`);
var onRequest$1 = defineMiddleware(async ({ cookies, locals, url, redirect }, next) => {
	const token = cookies.get("bh_token")?.value ?? null;
	locals.token = token;
	locals.usuario = null;
	let falloAlValidarSesion = false;
	if (token) try {
		const { me } = await graphql(ME, {}, token);
		if (me) locals.usuario = me;
		else cerrarSesion(cookies);
	} catch (error) {
		falloAlValidarSesion = true;
		console.error("No se pudo validar la sesión con el backend:", error);
	}
	const protegida = RUTAS_PROTEGIDAS.some((r) => coincide(url.pathname, r));
	if (protegida && token && falloAlValidarSesion) return new Response("No pudimos validar tu sesión en este momento. Inténtalo de nuevo.", {
		status: 503,
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Retry-After": "5",
			"X-Content-Type-Options": "nosniff",
			"X-Frame-Options": "DENY",
			"Referrer-Policy": "strict-origin-when-cross-origin"
		}
	});
	if (protegida && !locals.usuario) return redirect(`/login?next=${encodeURIComponent(url.pathname)}`);
	if (RUTAS_ADMIN.some((r) => coincide(url.pathname, r)) && locals.usuario?.rol !== "admin") return redirect("/");
	const respuesta = await next();
	respuesta.headers.set("X-Content-Type-Options", "nosniff");
	respuesta.headers.set("X-Frame-Options", "DENY");
	respuesta.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	return respuesta;
});
//#endregion
//#region \0virtual:astro:middleware
var onRequest = sequence(onRequest$1);
//#endregion
export { onRequest };
