import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_QxkgRyO6.mjs";
import { r as ADMIN_PEDIDOS } from "./queries_DPD021At.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CKtUr8XU.mjs";
import { t as renderScript } from "./script_DjT6wws8.mjs";
import { n as graphql } from "./graphql_b8rvOFuU.mjs";
import { t as $$AdminLayout } from "./AdminLayout_lM0NE0yP.mjs";
import { t as $$Alert } from "./Alert_CzAlVcvH.mjs";
import { t as precio } from "./format_Bjv1Xm-T.mjs";
import { r as mensajeError } from "./admin_r1TXMaPX.mjs";
import { n as estadoPedido, r as formatearFecha } from "./pagos_qwx821WV.mjs";
//#region src/pages/admin/pedidos.astro
var pedidos_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Pedidos,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Pedidos = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Pedidos;
	const token = Astro.locals.token;
	const aviso = Astro.url.searchParams.get("ok") === "actualizado" ? "Estado del pedido actualizado." : null;
	let pedidos = [];
	let error = null;
	try {
		({adminPedidos: pedidos} = await graphql(ADMIN_PEDIDOS, {}, token));
	} catch (e) {
		error ??= mensajeError(e);
	}
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {
		"titulo": "Pedidos",
		"seccion": "pedidos",
		"data-astro-cid-boyufebe": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<h2 class="admin-titulo" data-astro-cid-boyufebe>Pedidos</h2><p class="admin-subtitulo" data-astro-cid-boyufebe>Revisa qué pidió cada cliente y cuándo se registró. Los datos personales están ocultos inicialmente.</p>${aviso && renderTemplate`<p class="mensaje-exito" role="status" data-astro-cid-boyufebe>${aviso}</p>`}${error && renderTemplate`${renderComponent($$result, "Alert", $$Alert, { "data-astro-cid-boyufebe": true }, { "default": ($$result) => renderTemplate`${error}` })}`}${pedidos.length === 0 && !error && renderTemplate`<p class="estado-vacio" data-astro-cid-boyufebe>Todavía no hay pedidos registrados.</p>`}${pedidos.length > 0 && renderTemplate`<div class="tabla-wrap" data-astro-cid-boyufebe><table class="tabla-admin tabla-pedidos" data-astro-cid-boyufebe><thead data-astro-cid-boyufebe><tr data-astro-cid-boyufebe><th scope="col" data-astro-cid-boyufebe>Pedido</th><th scope="col" data-astro-cid-boyufebe>Cliente</th><th scope="col" data-astro-cid-boyufebe>Cuándo</th><th scope="col" data-astro-cid-boyufebe>Qué pidió</th><th scope="col" class="num" data-astro-cid-boyufebe>Total</th><th scope="col" data-astro-cid-boyufebe>Pago</th><th scope="col" data-astro-cid-boyufebe>Preparación</th><th scope="col" data-astro-cid-boyufebe>Acción</th></tr></thead><tbody data-astro-cid-boyufebe>${pedidos.map((pedido) => {
		const pago = estadoPedido(pedido.status);
		return renderTemplate`<tr data-astro-cid-boyufebe><td data-label="Pedido" data-astro-cid-boyufebe><strong data-astro-cid-boyufebe>#${pedido.id}</strong></td><td data-label="Cliente" data-astro-cid-boyufebe><div class="pedido-cliente" data-astro-cid-boyufebe><button class="pedido-ojo" type="button" data-customer-toggle aria-label="Mostrar datos del cliente" aria-expanded="false" title="Mostrar datos del cliente" data-astro-cid-boyufebe><svg data-eye-open viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-boyufebe><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" data-astro-cid-boyufebe></path><circle cx="12" cy="12" r="3" data-astro-cid-boyufebe></circle></svg><svg data-eye-closed class="icono-oculto" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-boyufebe><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" data-astro-cid-boyufebe></path><path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a15.8 15.8 0 0 1-4.1 4.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7c1.3 0 2.5-.3 3.5-.7" data-astro-cid-boyufebe></path></svg><span class="solo-lector" data-astro-cid-boyufebe>Mostrar datos del cliente</span></button><div data-customer-details hidden data-astro-cid-boyufebe><strong data-astro-cid-boyufebe>${pedido.clienteNombre}</strong><small data-astro-cid-boyufebe>${pedido.clienteEmail}</small></div></div></td><td data-label="Cuándo" data-astro-cid-boyufebe>${formatearFecha(pedido.fecha)}</td><td data-label="Qué pidió" data-astro-cid-boyufebe><ul class="pedido-productos-admin" data-astro-cid-boyufebe>${pedido.productos.map((producto) => renderTemplate`<li data-astro-cid-boyufebe>${producto.cantidad} × ${producto.nombre}</li>`)}</ul></td><td data-label="Total" class="num" data-astro-cid-boyufebe>${precio(pedido.total)}</td><td data-label="Pago" data-astro-cid-boyufebe><span${addAttribute(`badge badge-${pago.clase}`, "class")} data-astro-cid-boyufebe>${pago.etiqueta}</span></td><td data-label="Preparación" data-astro-cid-boyufebe><span class="badge badge-warn" data-order-state data-astro-cid-boyufebe>No completado</span></td><td data-label="Acción" data-astro-cid-boyufebe><button class="btn-admin" type="button" data-order-toggle${addAttribute(pedido.id, "data-order-id")} aria-pressed="false" data-astro-cid-boyufebe>Marcar completado</button></td></tr>`;
	})}</tbody></table></div>`}` })}${renderScript($$result, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/admin/pedidos.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/admin/pedidos.astro", void 0);
var $$file = "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/admin/pedidos.astro";
var $$url = "/admin/pedidos";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/pedidos@_@astro
var page = () => pedidos_exports;
//#endregion
export { page };
