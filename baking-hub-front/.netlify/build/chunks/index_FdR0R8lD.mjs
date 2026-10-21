import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, T as Fragment$1, j as maybeRenderHead, w as renderComponent } from "./sequence_QxkgRyO6.mjs";
import { a as ADMIN_RESUMEN } from "./queries_DPD021At.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CKtUr8XU.mjs";
import { n as graphql, t as ApiError } from "./graphql_b8rvOFuU.mjs";
import { t as $$AdminLayout } from "./AdminLayout_lM0NE0yP.mjs";
import { t as $$Alert } from "./Alert_CzAlVcvH.mjs";
import { t as precio } from "./format_Bjv1Xm-T.mjs";
import { useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/components/AdminLiveUpdates.tsx
function AdminLiveUpdates() {
	const [estado, setEstado] = useState("Conectando actualizaciones en tiempo real…");
	useEffect(() => {
		const eventos = new EventSource("/api/admin/pedidos-pagados");
		eventos.addEventListener("open", () => setEstado("Conectando con el backend…"));
		eventos.addEventListener("conectado", () => setEstado("Actualizaciones en tiempo real activas."));
		eventos.addEventListener("pedido-pagado", () => {
			setEstado("Pago confirmado. Actualizando el resumen…");
			window.location.reload();
		});
		eventos.addEventListener("error", (evento) => {
			const datos = evento.data;
			setEstado(datos ? JSON.parse(datos).message : "No se pudo conectar en tiempo real. Reconectando…");
		});
		return () => eventos.close();
	}, []);
	return /* @__PURE__ */ jsx("p", {
		role: "status",
		"aria-live": "polite",
		children: estado
	});
}
//#endregion
//#region src/pages/admin/index.astro
var admin_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	let resumen = null;
	let error = null;
	try {
		({adminResumen: resumen} = await graphql(ADMIN_RESUMEN, {}, Astro.locals.token));
	} catch (e) {
		error = e instanceof ApiError ? e.message : "Error inesperado";
	}
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {
		"titulo": "Resumen",
		"seccion": "resumen"
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<h2 class="admin-titulo">Resumen de la tienda</h2><p class="admin-subtitulo">Hola, ${Astro.locals.usuario?.nombre}. Esto es lo más importante de hoy.</p>${renderComponent($$result, "AdminLiveUpdates", AdminLiveUpdates, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/AdminLiveUpdates.tsx",
		"client:component-export": "default"
	})}${error && renderTemplate`${renderComponent($$result, "Alert", $$Alert, {}, { "default": ($$result) => renderTemplate`${error}` })}`}${resumen && renderTemplate`${renderComponent($$result, "Fragment", Fragment$1, {}, { "default": ($$result) => renderTemplate`<div class="stats"><div class="stat"><span class="stat-valor">${precio(resumen.ventas)}</span><span class="stat-texto">Ventas cobradas</span></div><div class="stat"><span class="stat-valor">${resumen.pedidosPagados}</span><span class="stat-texto">Pedidos pagados</span></div><div class="stat"><span class="stat-valor">${resumen.pedidosPendientes}</span><span class="stat-texto">Pedidos pendientes de pago</span></div><a class="stat" href="/admin/inventario"><span class="stat-valor">${resumen.productos}</span><span class="stat-texto">Productos en catálogo</span></a><a${addAttribute(["stat", { alerta: resumen.sinStock > 0 }], "class:list")} href="/admin/inventario"><span class="stat-valor">${resumen.sinStock}</span><span class="stat-texto">Productos agotados</span></a><a class="stat" href="/admin/inventario"><span class="stat-valor">${resumen.stockBajo}</span><span class="stat-texto">Con stock bajo (5 o menos)</span></a><a class="stat" href="/admin/usuarios"><span class="stat-valor">${resumen.clientes}</span><span class="stat-texto">Clientes registrados</span></a><a class="stat" href="/admin/usuarios"><span class="stat-valor">${resumen.clientesSuspendidos}</span><span class="stat-texto">Cuentas suspendidas</span></a></div><div class="admin-bloque"><h3>Accesos rápidos</h3><p style="display:flex;gap:0.6rem;flex-wrap:wrap;margin:0"><a class="btn-admin" href="/admin/inventario">Agregar inventario</a><a class="btn-admin sec" href="/admin/usuarios">Gestionar clientes</a></p></div>` })}`}` })}`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/admin/index.astro", void 0);
var $$file = "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/admin/index.astro";
var $$url = "/admin";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/index@_@astro
var page = () => admin_exports;
//#endregion
export { page };
