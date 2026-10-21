import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, j as maybeRenderHead, w as renderComponent } from "./sequence_QxkgRyO6.mjs";
import { n as createComponent } from "./compiler_CKtUr8XU.mjs";
import { t as $$Layout } from "./Layout_Djj96ORb.mjs";
//#region src/pages/carrito.astro
var carrito_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Carrito,
	file: () => $$file,
	url: () => $$url
});
var $$Carrito = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"titulo": "Carrito",
		"sidebar": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<h2 class="section-title">Tu carrito de compras</h2>${renderComponent($$result, "CartView", null, {
		"client:only": "react",
		"client:component-hydration": "only",
		"client:component-path": "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/CartView.tsx",
		"client:component-export": "default"
	}, { "fallback": ($$result) => renderTemplate`<p class="estado-vacio">Cargando tu carrito…</p>` })}` })}`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/carrito.astro", void 0);
var $$file = "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/carrito.astro";
var $$url = "/carrito";
//#endregion
//#region \0virtual:astro:page:src/pages/carrito@_@astro
var page = () => carrito_exports;
//#endregion
export { page };
