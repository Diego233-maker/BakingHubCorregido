import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, j as maybeRenderHead, w as renderComponent } from "./sequence_QxkgRyO6.mjs";
import { l as CONFIG_PAGOS } from "./queries_DPD021At.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CKtUr8XU.mjs";
import { n as graphql, t as ApiError } from "./graphql_b8rvOFuU.mjs";
import { t as $$Layout } from "./Layout_Djj96ORb.mjs";
import { t as $$Alert } from "./Alert_CzAlVcvH.mjs";
//#region src/pages/checkout.astro
var checkout_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Checkout,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Checkout = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Checkout;
	const usuario = Astro.locals.usuario;
	let config = null;
	let error = null;
	try {
		({configPagos: config} = await graphql(CONFIG_PAGOS));
	} catch (e) {
		error = e instanceof ApiError ? e.message : "Error inesperado";
	}
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"titulo": "Checkout",
		"sidebar": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<h2 class="section-title">Finalizar compra</h2>${error && renderTemplate`${renderComponent($$result, "Alert", $$Alert, {}, { "default": ($$result) => renderTemplate`No pudimos cargar los métodos de pago: ${error}` })}`}${config && renderTemplate`${renderComponent($$result, "CheckoutView", null, {
		"client:only": "react",
		"config": config,
		"usuario": {
			nombre: usuario.nombre,
			email: usuario.email
		},
		"client:component-hydration": "only",
		"client:component-path": "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/CheckoutView.tsx",
		"client:component-export": "default"
	}, { "fallback": ($$result) => renderTemplate`<p class="estado-vacio">Cargando tu orden…</p>` })}`}` })}`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/checkout.astro", void 0);
var $$file = "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/checkout.astro";
var $$url = "/checkout";
//#endregion
//#region \0virtual:astro:page:src/pages/checkout@_@astro
var page = () => checkout_exports;
//#endregion
export { page };
