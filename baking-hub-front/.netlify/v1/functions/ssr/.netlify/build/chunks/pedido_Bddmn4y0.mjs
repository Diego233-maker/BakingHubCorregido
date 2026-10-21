import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { u as CREAR_PEDIDO } from "./queries_DPD021At.mjs";
import { n as graphql, t as ApiError } from "./graphql_b8rvOFuU.mjs";
//#region src/pages/api/pedido.ts
var pedido_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var METODOS = [
	"tarjeta",
	"oxxo",
	"spei",
	"mercadopago"
];
var json = (cuerpo, status = 200) => new Response(JSON.stringify(cuerpo), {
	status,
	headers: { "Content-Type": "application/json" }
});
var textoCorto = (v, max) => typeof v === "string" && v.length > 0 && v.length <= max;
/**
* Recibe { productos: ["1","1","3"], metodoPago: "oxxo", tarjeta?: { token, paymentMethodId, issuerId, cuotas } }
* desde la isla de checkout, crea el pedido y el cobro en el backend con el token de la cookie.
* `tarjeta` solo trae el TOKEN de Mercado Pago, nunca el número de la tarjeta.
*/
var POST = async ({ request, locals }) => {
	if (!locals.usuario || !locals.token) return json({ error: "Debes iniciar sesión para pagar." }, 401);
	const cuerpo = await request.json().catch(() => null);
	const productos = cuerpo?.productos;
	if (!(Array.isArray(productos) && productos.length > 0 && productos.length <= 500 && productos.every((id) => typeof id === "string" && /^\d+$/.test(id)))) return json({ error: "El carrito no es válido." }, 400);
	const metodoPago = cuerpo?.metodoPago;
	if (typeof metodoPago !== "string" || !METODOS.includes(metodoPago)) return json({ error: "Elige un método de pago válido." }, 400);
	let tarjeta;
	if (metodoPago === "tarjeta") {
		const t = cuerpo?.tarjeta;
		const cuotas = t?.cuotas ?? 1;
		if (!textoCorto(t?.token, 200) || t?.paymentMethodId != null && !textoCorto(t.paymentMethodId, 50) || t?.issuerId != null && !textoCorto(t.issuerId, 50) || !Number.isInteger(cuotas) || cuotas < 1 || cuotas > 24) return json({ error: "Los datos de la tarjeta no son válidos." }, 400);
		tarjeta = {
			token: t.token,
			paymentMethodId: t.paymentMethodId ?? null,
			issuerId: t.issuerId ?? null,
			cuotas
		};
	}
	try {
		const { crearPedido } = await graphql(CREAR_PEDIDO, {
			productos,
			metodoPago,
			tarjeta
		}, locals.token, 3e4);
		return json({ pedido: crearPedido });
	} catch (e) {
		if (e instanceof ApiError) {
			const status = e.codigo === "UNAUTHENTICATED" ? 401 : e.codigo === "BAD_USER_INPUT" ? 400 : e.codigo === "TIMEOUT" ? 504 : 502;
			return json({ error: e.message }, status);
		}
		return json({ error: "Error inesperado." }, 500);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/pedido@_@ts
var page = () => pedido_exports;
//#endregion
export { page };
