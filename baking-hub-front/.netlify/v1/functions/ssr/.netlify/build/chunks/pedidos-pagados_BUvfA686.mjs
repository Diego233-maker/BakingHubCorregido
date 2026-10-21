import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { E as GRAPHQL_WS_URL, b as PEDIDO_PAGADO_SUBSCRIPTION } from "./queries_DPD021At.mjs";
import { createClient } from "graphql-ws";
import WebSocket from "ws";
//#region src/pages/api/admin/pedidos-pagados.ts
var pedidos_pagados_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = ({ locals, request }) => {
	if (!locals.token || locals.usuario?.rol !== "admin") return new Response("No autorizado", { status: locals.usuario ? 403 : 401 });
	let cancel = () => {};
	const stream = new ReadableStream({
		start(controller) {
			let activo = true;
			controller.enqueue(new TextEncoder().encode("retry: 1000\n\n"));
			let limite;
			const enviar = (evento, datos = "") => {
				if (activo) controller.enqueue(new TextEncoder().encode(`event: ${evento}\ndata: ${datos}\n\n`));
			};
			const client = createClient({
				url: GRAPHQL_WS_URL,
				webSocketImpl: WebSocket,
				connectionParams: { authorization: `Bearer ${locals.token}` },
				on: {
					connected: () => enviar("conectado"),
					error: (error) => {
						console.error("Error en WebSocket de la suscripción admin:", error);
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
			let unsubscribe = () => {};
			const heartbeat = setInterval(() => {
				if (activo) controller.enqueue(new TextEncoder().encode(": keep-alive\n\n"));
			}, 25e3);
			cancel = () => cerrar(false);
			request.signal.addEventListener("abort", () => cerrar(true), { once: true });
			unsubscribe = client.subscribe({ query: PEDIDO_PAGADO_SUBSCRIPTION }, {
				next: ({ data, errors }) => {
					if (errors?.length) {
						console.error("Error GraphQL en la suscripción admin:", errors);
						enviar("error", JSON.stringify({ message: "No se pudo recibir la actualización en tiempo real." }));
						cerrar(true);
						return;
					}
					if (data?.pedidoPagado) enviar("pedido-pagado", JSON.stringify(data.pedidoPagado));
				},
				error: (error) => {
					console.error("Falló la suscripción GraphQL del panel admin:", error);
					enviar("error", JSON.stringify({ message: "No se pudo recibir la actualización en tiempo real." }));
					cerrar(true);
				},
				complete: () => cerrar(true)
			});
		},
		cancel() {
			cancel();
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
//#region \0virtual:astro:page:src/pages/api/admin/pedidos-pagados@_@ts
var page = () => pedidos_pagados_exports;
//#endregion
export { page };
