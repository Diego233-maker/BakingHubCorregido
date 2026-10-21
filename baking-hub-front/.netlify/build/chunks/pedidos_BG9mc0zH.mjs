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
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<h2 class="admin-titulo" data-astro-cid-boyufebe>Pedidos</h2><p class="admin-subtitulo" data-astro-cid-boyufebe>Consulta quién realizó cada pedido y actualiza su estado de preparación.</p>${aviso && renderTemplate`<p class="mensaje-exito" role="status" data-astro-cid-boyufebe>${aviso}</p>`}${error && renderTemplate`${renderComponent($$result, "Alert", $$Alert, { "data-astro-cid-boyufebe": true }, { "default": ($$result) => renderTemplate`${error}` })}`}${pedidos.length === 0 && !error && renderTemplate`<p class="estado-vacio" data-astro-cid-boyufebe>Todavía no hay pedidos registrados.</p>`}${pedidos.length > 0 && renderTemplate`<div class="tabla-wrap" data-astro-cid-boyufebe><table class="tabla-admin tabla-pedidos" data-astro-cid-boyufebe><thead data-astro-cid-boyufebe><tr data-astro-cid-boyufebe><th data-astro-cid-boyufebe>Pedido</th><th data-astro-cid-boyufebe>Cliente</th><th data-astro-cid-boyufebe>Fecha</th><th data-astro-cid-boyufebe>Productos</th><th class="num" data-astro-cid-boyufebe>Total</th><th data-astro-cid-boyufebe>Pago</th><th data-astro-cid-boyufebe>Preparación</th><th data-astro-cid-boyufebe>Acción</th></tr></thead><tbody data-astro-cid-boyufebe>${pedidos.map((pedido) => {
		const pago = estadoPedido(pedido.status);
		return renderTemplate`<tr data-astro-cid-boyufebe><td data-astro-cid-boyufebe><strong data-astro-cid-boyufebe>#${pedido.id}</strong></td><td data-astro-cid-boyufebe><strong data-astro-cid-boyufebe>${pedido.clienteNombre}</strong><br data-astro-cid-boyufebe><small data-astro-cid-boyufebe>${pedido.clienteEmail}</small></td><td data-astro-cid-boyufebe>${formatearFecha(pedido.fecha)}</td><td data-astro-cid-boyufebe><ul class="pedido-productos-admin" data-astro-cid-boyufebe>${pedido.productos.map((producto) => renderTemplate`<li data-astro-cid-boyufebe>${producto.cantidad} × ${producto.nombre}</li>`)}</ul></td><td class="num" data-astro-cid-boyufebe>${precio(pedido.total)}</td><td data-astro-cid-boyufebe><span${addAttribute(`badge badge-${pago.clase}`, "class")} data-astro-cid-boyufebe>${pago.etiqueta}</span></td><td data-astro-cid-boyufebe><span class="badge badge-warn" data-order-state data-astro-cid-boyufebe>No completado</span></td><td data-astro-cid-boyufebe><button class="btn-admin" type="button" data-order-toggle${addAttribute(pedido.id, "data-order-id")} aria-pressed="false" data-astro-cid-boyufebe>Marcar completado</button></td></tr>`;
	})}</tbody></table></div>`}` })}${renderScript($$result, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/admin/pedidos.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/admin/pedidos.astro", void 0);
var $$file = "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/admin/pedidos.astro";
var $$url = "/admin/pedidos";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/pedidos@_@astro
var page = () => pedidos_exports;
//#endregion
export { page };
