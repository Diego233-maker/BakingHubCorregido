//#region src/lib/auth.ts
var COOKIE_SESION = "bh_token";
var SIETE_DIAS = 604800;
function guardarSesion(cookies, token) {
	cookies.set(COOKIE_SESION, token, {
		httpOnly: true,
		sameSite: "lax",
		secure: true,
		path: "/",
		maxAge: SIETE_DIAS
	});
}
function cerrarSesion(cookies) {
	cookies.delete(COOKIE_SESION, { path: "/" });
}
function rutaSegura(next, porDefecto = "/") {
	return next && /^\/(?![/\\])/.test(next) ? next : porDefecto;
}
//#endregion
export { rutaSegura as i, cerrarSesion as n, guardarSesion as r, COOKIE_SESION as t };
