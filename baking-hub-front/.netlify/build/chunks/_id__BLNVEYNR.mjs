import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, R as unescapeHTML, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_QxkgRyO6.mjs";
import { C as SIMULAR_PAGO, l as CONFIG_PAGOS, v as OBTENER_PEDIDO } from "./queries_DPD021At.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CKtUr8XU.mjs";
import { t as renderScript } from "./script_DjT6wws8.mjs";
import { n as graphql, t as ApiError } from "./graphql_b8rvOFuU.mjs";
import { t as $$Layout } from "./Layout_Djj96ORb.mjs";
import { t as $$Alert } from "./Alert_CzAlVcvH.mjs";
import { t as precio } from "./format_Bjv1Xm-T.mjs";
import { i as formatearReferencia, n as estadoPedido, r as formatearFecha, t as METODOS } from "./pagos_qwx821WV.mjs";
//#region src/components/InstruccionesPago.astro
createAstro("https://astro.build");
var $$InstruccionesPago = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$InstruccionesPago;
	const { pedido } = Astro.props;
	const esOxxo = pedido.metodoPago === "oxxo";
	const esSpei = pedido.metodoPago === "spei";
	const esBilletera = pedido.metodoPago === "mercadopago";
	const enlace = pedido.pagoUrl?.startsWith("https://") ? pedido.pagoUrl : null;
	return renderTemplate`${(esOxxo || esSpei) && renderTemplate`${maybeRenderHead($$result)}<section class="ficha"${addAttribute(esOxxo ? "Ficha de pago OXXO" : "Datos de transferencia SPEI", "aria-label")} data-astro-cid-cvmxobfu><h3 data-astro-cid-cvmxobfu>${esOxxo ? "Paga en cualquier OXXO" : "Paga con transferencia SPEI"}</h3><dl data-astro-cid-cvmxobfu><div data-astro-cid-cvmxobfu><dt data-astro-cid-cvmxobfu>${esOxxo ? "Referencia de pago" : "CLABE interbancaria"}</dt><dd class="referencia" id="referencia-pago" data-astro-cid-cvmxobfu>${pedido.pagoReferencia ? formatearReferencia(pedido.pagoReferencia) : "Pendiente de generar"}</dd></div><div data-astro-cid-cvmxobfu><dt data-astro-cid-cvmxobfu>Monto exacto a pagar</dt><dd class="monto" data-astro-cid-cvmxobfu>${precio(pedido.total)}</dd></div>${pedido.pagoExpira && renderTemplate`<div data-astro-cid-cvmxobfu><dt data-astro-cid-cvmxobfu>Págalo antes del</dt><dd data-astro-cid-cvmxobfu>${formatearFecha(pedido.pagoExpira)}</dd></div>`}</dl>${pedido.pagoReferencia && renderTemplate`<button class="copiar" type="button"${addAttribute(pedido.pagoReferencia, "data-copiar")} data-astro-cid-cvmxobfu>Copiar ${esOxxo ? "referencia" : "CLABE"}</button>`}<ol data-astro-cid-cvmxobfu>${esOxxo ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<li data-astro-cid-cvmxobfu>Acude a cualquier tienda OXXO y dile al cajero que quieres hacer un pago de servicio con Mercado Pago.</li><li data-astro-cid-cvmxobfu>Indica la referencia y paga el monto exacto en efectivo.</li><li data-astro-cid-cvmxobfu>Conserva tu comprobante. Esta página mostrará “Pagado” en cuanto se acredite el pago.</li>` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<li data-astro-cid-cvmxobfu>Abre la app o la banca en línea de tu banco y elige hacer una transferencia SPEI.</li><li data-astro-cid-cvmxobfu>Captura la CLABE y transfiere el monto exacto.</li><li data-astro-cid-cvmxobfu>Esta página mostrará “Pagado” en cuanto se acredite la transferencia.</li>` })}`}</ol>${enlace && renderTemplate`<a class="enlace-ficha"${addAttribute(enlace, "href")} target="_blank" rel="noopener noreferrer" data-astro-cid-cvmxobfu>Ver / imprimir ficha en Mercado Pago ↗</a>`}</section>`}${esBilletera && renderTemplate`<section class="ficha" aria-label="Pago con Mercado Pago" data-astro-cid-cvmxobfu><h3 data-astro-cid-cvmxobfu>Completa tu pago en Mercado Pago</h3><p data-astro-cid-cvmxobfu>Tu pedido está apartado. Termina el pago desde tu cuenta de Mercado Pago.</p>${enlace && renderTemplate`<a class="btn-primario enlace-btn"${addAttribute(enlace, "href")} data-astro-cid-cvmxobfu>Ir a Mercado Pago</a>`}</section>`}${renderScript($$result, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/InstruccionesPago.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/InstruccionesPago.astro", void 0);
//#endregion
//#region src/pages/pedidos/[id].astro
var _id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Id,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Id = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Id;
	const { id } = Astro.params;
	if (!id || !/^\d+$/.test(id)) return Astro.rewrite("/404");
	const token = Astro.locals.token;
	let error = null;
	if (Astro.request.method === "POST") {
		if ((await Astro.request.formData()).get("accion") === "simular-pago") try {
			await graphql(SIMULAR_PAGO, { pedidoId: id }, token);
			return Astro.redirect(`/pedidos/${id}`, 303);
		} catch (e) {
			error = e instanceof ApiError ? e.message : "Error inesperado";
		}
	}
	let pedido = null;
	let config = null;
	try {
		({pedido} = await graphql(OBTENER_PEDIDO, { id }, token));
		({configPagos: config} = await graphql(CONFIG_PAGOS));
	} catch (e) {
		error = e instanceof ApiError ? e.message : "Error inesperado";
	}
	if (!pedido && !error) return Astro.rewrite("/404");
	const nuevo = Astro.url.searchParams.get("nuevo") === "1";
	const estado = pedido ? estadoPedido(pedido.status) : null;
	const pendiente = pedido?.status === "pendiente";
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"titulo": pedido ? `Pedido #${pedido.id}` : "Pedido",
		"sidebar": true,
		"data-astro-cid-rpuhui7c": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<a class="volver" href="/pedidos" data-astro-cid-rpuhui7c>← Mis pedidos</a>${error && renderTemplate`${renderComponent($$result, "Alert", $$Alert, { "data-astro-cid-rpuhui7c": true }, { "default": ($$result) => renderTemplate`${error}` })}`}${pedido && estado && renderTemplate`<article class="pedido-detalle" data-astro-cid-rpuhui7c><header data-astro-cid-rpuhui7c><h2 class="section-title" data-astro-cid-rpuhui7c>Pedido #${pedido.id}</h2><span${addAttribute(`badge badge-${estado.clase}`, "class")} data-astro-cid-rpuhui7c>${estado.etiqueta}</span></header><p class="meta" data-astro-cid-rpuhui7c>${formatearFecha(pedido.fecha)}${pedido.metodoPago && ` · ${METODOS[pedido.metodoPago].etiqueta}`}</p>${nuevo && pedido.status === "pagado" && renderTemplate`<p class="mensaje-exito" role="status" data-astro-cid-rpuhui7c>¡Pago aprobado! Gracias por tu compra, estamos preparando tu pedido.</p>`}${nuevo && pendiente && renderTemplate`<p class="mensaje-exito" role="status" data-astro-cid-rpuhui7c>¡Pedido creado! Apartamos tus productos; falta completar el pago con las instrucciones de abajo.</p>`}${pendiente && renderTemplate`${renderComponent($$result, "InstruccionesPago", $$InstruccionesPago, {
		"pedido": pedido,
		"data-astro-cid-rpuhui7c": true
	})}`}${pendiente && config?.modo === "real" && renderTemplate`<script>${unescapeHTML("setInterval(function () { if (!document.hidden) location.reload(); }, 60000);")}<\/script>`}${pedido.status === "cancelado" && renderTemplate`<p class="aviso" data-astro-cid-rpuhui7c>Este pedido fue cancelado y las piezas regresaron al inventario.</p>`}${pedido.status === "expirado" && renderTemplate`<p class="aviso" data-astro-cid-rpuhui7c>Este pedido expiró porque no recibimos el pago a tiempo. Si todavía quieres los productos,${" "}<a href="/" data-astro-cid-rpuhui7c>vuelve al catálogo</a> y haz un pedido nuevo.</p>`}<ul class="lineas" data-astro-cid-rpuhui7c>${pedido.productos.map((p) => renderTemplate`<li data-astro-cid-rpuhui7c><span data-astro-cid-rpuhui7c>${p.cantidad} × ${p.nombre}</span><span data-astro-cid-rpuhui7c>${precio(p.precio * p.cantidad)}</span></li>`)}</ul><p class="total" data-astro-cid-rpuhui7c>Total: <strong data-astro-cid-rpuhui7c>${precio(pedido.total)}</strong></p>${pendiente && config?.modo === "simulado" && renderTemplate`<form method="POST" class="simulador" data-astro-cid-rpuhui7c><input type="hidden" name="accion" value="simular-pago" data-astro-cid-rpuhui7c><p data-astro-cid-rpuhui7c>Modo de pruebas: simula el pago para ver cómo cambia el estado del pedido.</p><button class="btn-primario" type="submit" data-astro-cid-rpuhui7c>Simular pago recibido</button></form>`}</article>`}` })}`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/pedidos/[id].astro", void 0);
var $$file = "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/pedidos/[id].astro";
var $$url = "/pedidos/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/pedidos/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
