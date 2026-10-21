import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, j as maybeRenderHead, w as renderComponent } from "./sequence_QxkgRyO6.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CKtUr8XU.mjs";
import { t as $$Layout } from "./Layout_Djj96ORb.mjs";
//#region src/pages/404.astro
var _404_exports = /* @__PURE__ */ __exportAll({
	default: () => $$404,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$404 = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$404;
	Astro.response.status = 404;
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"titulo": "No encontrado",
		"sidebar": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<h2 class="section-title">No encontramos lo que buscabas</h2><p class="estado-vacio">La página o el producto no existe. <a href="/">Volver al catálogo</a></p>` })}`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/404.astro", void 0);
var $$file = "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/404.astro";
var $$url = "/404";
//#endregion
//#region \0virtual:astro:page:src/pages/404@_@astro
var page = () => _404_exports;
//#endregion
export { page };
