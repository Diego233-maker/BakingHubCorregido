import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { S as REGISTRAR_PRESENCIA } from "./queries_DPD021At.mjs";
import { n as graphql, t as ApiError } from "./graphql_b8rvOFuU.mjs";
//#region src/pages/api/presencia.ts
var presencia_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ locals }) => {
	if (!locals.token || !locals.usuario) return new Response("Debes iniciar sesión.", { status: 401 });
	if (locals.usuario.rol !== "cliente") return new Response("Solo los clientes reportan presencia.", { status: 403 });
	try {
		await graphql(REGISTRAR_PRESENCIA, {}, locals.token);
		return new Response(null, { status: 204 });
	} catch (error) {
		if (error instanceof ApiError) {
			const status = error.codigo === "UNAUTHENTICATED" ? 401 : error.codigo === "FORBIDDEN" ? 403 : 502;
			return new Response(error.message, { status });
		}
		console.error("Error inesperado al actualizar la presencia del cliente:", error);
		return new Response("No se pudo actualizar la presencia.", { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/presencia@_@ts
var page = () => presencia_exports;
//#endregion
export { page };
