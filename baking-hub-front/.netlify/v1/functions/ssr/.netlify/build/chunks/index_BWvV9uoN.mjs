import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_QxkgRyO6.mjs";
import { _ as OBTENER_MENU } from "./queries_DPD021At.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CKtUr8XU.mjs";
import { n as graphql, t as ApiError } from "./graphql_b8rvOFuU.mjs";
import { n as CATEGORIAS, r as obtenerCategoria, t as $$Layout } from "./Layout_Djj96ORb.mjs";
import { t as $$Alert } from "./Alert_CzAlVcvH.mjs";
import { t as precio } from "./format_Bjv1Xm-T.mjs";
//#region src/components/Hero.astro
var $$Hero = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="hero" data-astro-cid-ge2uvauf><h2 data-astro-cid-ge2uvauf>Bienvenido a Baking Hub</h2><p data-astro-cid-ge2uvauf>Los mejores postres horneados, directo del horno a tu mesa.</p></div>`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/Hero.astro", void 0);
//#endregion
//#region src/components/ProductCard.astro
createAstro("https://astro.build");
var $$ProductCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ProductCard;
	const { id, nombre, precio: valor, imagen, stock } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<article class="tarjeta-producto" data-astro-cid-4fhpls6h><img${addAttribute(imagen, "src")}${addAttribute(nombre, "alt")} width="190" height="150" loading="lazy" data-astro-cid-4fhpls6h><div class="tarjeta-producto-info" data-astro-cid-4fhpls6h><h3 data-astro-cid-4fhpls6h>${nombre}</h3><p class="precio" data-astro-cid-4fhpls6h>${precio(valor)}</p>${stock <= 0 && renderTemplate`<p class="existencia agotado" data-astro-cid-4fhpls6h>Agotado</p>`}${stock > 0 && stock <= 5 && renderTemplate`<p class="existencia pocas" data-astro-cid-4fhpls6h>¡Solo quedan ${stock}!</p>`}<a class="ver-detalle-btn"${addAttribute(`/producto/${id}`, "href")} data-astro-cid-4fhpls6h>Ver detalles</a></div></article>`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/ProductCard.astro", void 0);
//#endregion
//#region src/components/WhyUs.astro
var $$WhyUs = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="context" data-astro-cid-tbvw4kn2><h3 data-astro-cid-tbvw4kn2>¿Por qué elegirnos?</h3><p data-astro-cid-tbvw4kn2>En Baking Hub garantizamos ingredientes 100% orgánicos y entregas el mismo día para que disfrutes de la frescura en cada bocado.</p></section>`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/WhyUs.astro", void 0);
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
createAstro("https://astro.build");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const categoria = CATEGORIAS.find((c) => c === Astro.url.searchParams.get("categoria")) ?? "Todas";
	let productos = [];
	let error = null;
	try {
		({productos} = await graphql(OBTENER_MENU));
	} catch (e) {
		error = e instanceof ApiError ? e.message : "Error inesperado";
	}
	const filtrados = categoria === "Todas" ? productos : productos.filter((p) => obtenerCategoria(p.nombre) === categoria);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"sidebar": true,
		"categoriaActiva": categoria,
		"data-astro-cid-lcdefpme": true
	}, { "default": ($$result) => renderTemplate`${categoria === "Todas" && renderTemplate`${renderComponent($$result, "Hero", $$Hero, { "data-astro-cid-lcdefpme": true })}`}${maybeRenderHead($$result)}<h2 class="section-title" data-astro-cid-lcdefpme>Catálogo: ${categoria}</h2>${error && renderTemplate`${renderComponent($$result, "Alert", $$Alert, { "data-astro-cid-lcdefpme": true }, { "default": ($$result) => renderTemplate`Error de conexión: ${error}` })}`}${!error && renderTemplate`<div class="product-grid" data-astro-cid-lcdefpme>${filtrados.length === 0 && renderTemplate`<p class="estado-vacio" data-astro-cid-lcdefpme>No hay productos en esta categoría.</p>`}${filtrados.map((p) => renderTemplate`${renderComponent($$result, "ProductCard", $$ProductCard, {
		...p,
		"data-astro-cid-lcdefpme": true
	})}`)}</div>`}${categoria === "Todas" && !error && renderTemplate`${renderComponent($$result, "WhyUs", $$WhyUs, { "data-astro-cid-lcdefpme": true })}`}` })}`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/index.astro", void 0);
var $$file = "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
