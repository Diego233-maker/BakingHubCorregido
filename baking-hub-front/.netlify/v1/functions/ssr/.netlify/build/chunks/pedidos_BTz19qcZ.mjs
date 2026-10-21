import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_QxkgRyO6.mjs";
import { g as MIS_PEDIDOS } from "./queries_DPD021At.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CKtUr8XU.mjs";
import { n as graphql, t as ApiError } from "./graphql_b8rvOFuU.mjs";
import { t as $$Layout } from "./Layout_Djj96ORb.mjs";
import { t as $$Alert } from "./Alert_CzAlVcvH.mjs";
import { t as precio } from "./format_Bjv1Xm-T.mjs";
import { n as estadoPedido, t as METODOS } from "./pagos_qwx821WV.mjs";
//#region src/components/PedidoCard.astro
createAstro("https://astro.build");
var $$PedidoCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PedidoCard;
	const { pedido, destacado = false } = Astro.props;
	const fecha = new Date(pedido.fecha).toLocaleString("es-MX", {
		dateStyle: "medium",
		timeStyle: "short"
	});
	const estado = estadoPedido(pedido.status);
	const metodo = pedido.metodoPago ? METODOS[pedido.metodoPago] : null;
	const porPagar = pedido.status === "pendiente" && pedido.metodoPago !== null;
	return renderTemplate`${maybeRenderHead($$result)}<article${addAttribute(["pedido", { destacado }], "class:list")} data-astro-cid-wzn3blgp><header data-astro-cid-wzn3blgp><h3 data-astro-cid-wzn3blgp><a${addAttribute(`/pedidos/${pedido.id}`, "href")} data-astro-cid-wzn3blgp>Pedido #${pedido.id}</a></h3><span${addAttribute(`badge badge-${estado.clase}`, "class")} data-astro-cid-wzn3blgp>${estado.etiqueta}</span></header><p class="fecha" data-astro-cid-wzn3blgp>${fecha}${metodo && ` · ${metodo.etiqueta}`}</p><ul data-astro-cid-wzn3blgp>${pedido.productos.map((p) => renderTemplate`<li data-astro-cid-wzn3blgp><span data-astro-cid-wzn3blgp>${p.cantidad} × ${p.nombre}</span><span data-astro-cid-wzn3blgp>${precio(p.precio * p.cantidad)}</span></li>`)}</ul><p class="total" data-astro-cid-wzn3blgp>Total: <strong data-astro-cid-wzn3blgp>${precio(pedido.total)}</strong></p><p class="acciones" data-astro-cid-wzn3blgp><a${addAttribute(`/pedidos/${pedido.id}`, "href")} data-astro-cid-wzn3blgp>${porPagar ? "Ver instrucciones de pago →" : "Ver detalle →"}</a></p></article>`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/PedidoCard.astro", void 0);
//#endregion
//#region src/pages/pedidos.astro
var pedidos_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Pedidos,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Pedidos = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Pedidos;
	const nuevo = Astro.url.searchParams.get("nuevo");
	let pedidos = [];
	let error = null;
	try {
		({misPedidos: pedidos} = await graphql(MIS_PEDIDOS, {}, Astro.locals.token));
	} catch (e) {
		error = e instanceof ApiError ? e.message : "Error inesperado";
	}
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"titulo": "Mis pedidos",
		"sidebar": true,
		"data-astro-cid-jualvfut": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<h2 class="section-title" data-astro-cid-jualvfut>Mis pedidos</h2>${nuevo && !error && renderTemplate`<p class="exito" role="status" data-astro-cid-jualvfut>¡Pedido creado con éxito! Tu número de pedido es #${nuevo}.</p>`}${error && renderTemplate`${renderComponent($$result, "Alert", $$Alert, { "data-astro-cid-jualvfut": true }, { "default": ($$result) => renderTemplate`${error}` })}`}${!error && pedidos.length === 0 && renderTemplate`<p class="estado-vacio" data-astro-cid-jualvfut>Todavía no tienes pedidos. <a href="/" data-astro-cid-jualvfut>Ver el catálogo</a></p>`}<div class="lista" data-astro-cid-jualvfut>${pedidos.map((p) => renderTemplate`${renderComponent($$result, "PedidoCard", $$PedidoCard, {
		"pedido": p,
		"destacado": p.id === nuevo,
		"data-astro-cid-jualvfut": true
	})}`)}</div>` })}`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/pedidos.astro", void 0);
var $$file = "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/pedidos.astro";
var $$url = "/pedidos";
//#endregion
//#region \0virtual:astro:page:src/pages/pedidos@_@astro
var page = () => pedidos_exports;
//#endregion
export { page };
