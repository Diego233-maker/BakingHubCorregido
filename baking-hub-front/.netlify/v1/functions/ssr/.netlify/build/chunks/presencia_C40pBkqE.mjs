import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { E as GRAPHQL_WS_URL, w as USUARIO_PRESENCIA_SUBSCRIPTION } from "./queries_DPD021At.mjs";
import { createClient } from "graphql-ws";
import WebSocket from "ws";
//#region src/pages/api/admin/presencia.ts
var presencia_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = ({ locals, request }) => {
	if (!locals.token || locals.usuario?.rol !== "admin") return new Response("No autorizado", { status: locals.usuario ? 403 : 401 });
	let cancelar = () => {};
	const stream = new ReadableStream({
		start(controller) {
			let activo = true;
			controller.enqueue(new TextEncoder().encode("retry: 1000\n\n"));
			let limite;
			let unsubscribe = () => {};
			const enviar = (evento, datos = "") => {
				if (activo) controller.enqueue(new TextEncoder().encode(`event: ${evento}\ndata: ${datos}\n\n`));
			};
			const heartbeat = setInterval(() => {
				if (activo) controller.enqueue(new TextEncoder().encode(": keep-alive\n\n"));
			}, 25e3);
			const client = createClient({
				url: GRAPHQL_WS_URL,
				webSocketImpl: WebSocket,
				connectionParams: { authorization: `Bearer ${locals.token}` },
				on: {
					connected: () => enviar("conectado"),
					error: (error) => {
						console.error("Error en WebSocket de presencia de usuarios:", error);
						enviar("error", JSON.stringify({ message: "Reconectando con el backend…" }));
					}
				}
			});
			const cerrar = (cerrarRespuesta) => {
				if (!activo) return;
				activo = false;
				clearInterval(heartbeat);
				clearTimeout(limite);
				unsubscribe();
				client.dispose();
				if (cerrarRespuesta) controller.close();
			};
			cancelar = () => cerrar(false);
			request.signal.addEventListener("abort", () => cerrar(true), { once: true });
			unsubscribe = client.subscribe({ query: USUARIO_PRESENCIA_SUBSCRIPTION }, {
				next: ({ data, errors }) => {
					if (errors?.length) {
						console.error("Error GraphQL en la suscripción de presencia:", errors);
						enviar("error", JSON.stringify({ message: "No se pudo recibir la presencia en tiempo real." }));
						cerrar(true);
						return;
					}
					if (data?.usuarioPresenciaActualizada) enviar("presencia-usuario", JSON.stringify(data.usuarioPresenciaActualizada));
				},
				error: (error) => {
					console.error("Falló la suscripción GraphQL de presencia:", error);
					enviar("error", JSON.stringify({ message: "No se pudo recibir la presencia en tiempo real." }));
					cerrar(true);
				},
				complete: () => cerrar(true)
			});
		},
		cancel() {
			cancelar();
		}
	});
	return new Response(stream, { headers: {
		"Cache-Control": "no-cache, no-transform",
		Connection: "keep-alive",
		"Content-Type": "text/event-stream; charset=utf-8",
		"X-Accel-Buffering": "no"
	} });
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/admin/presencia@_@ts
var page = () => presencia_exports;
//#endregion
export { page };
