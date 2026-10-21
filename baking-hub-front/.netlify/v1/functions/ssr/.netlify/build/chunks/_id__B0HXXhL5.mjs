import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_QxkgRyO6.mjs";
import { y as OBTENER_PRODUCTO } from "./queries_DPD021At.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CKtUr8XU.mjs";
import { n as graphql, t as ApiError } from "./graphql_b8rvOFuU.mjs";
import { t as $$Layout } from "./Layout_Djj96ORb.mjs";
import { t as $$Alert } from "./Alert_CzAlVcvH.mjs";
import { t as precio } from "./format_Bjv1Xm-T.mjs";
//#region src/components/ProductDetail.astro
createAstro("https://astro.build");
var $$ProductDetail = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ProductDetail;
	const { producto } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="detalle-card" data-astro-cid-tyiywhkw><a class="volver-btn" href="/" data-astro-cid-tyiywhkw>← Volver al catálogo</a><h2 data-astro-cid-tyiywhkw>${producto.nombre}</h2><img${addAttribute(producto.imagen, "src")}${addAttribute(producto.nombre, "alt")} data-astro-cid-tyiywhkw><p class="detalle-precio" data-astro-cid-tyiywhkw>Precio: ${precio(producto.precio)}</p>${producto.stock <= 0 && renderTemplate`<p class="existencia agotado" data-astro-cid-tyiywhkw>Producto agotado por ahora</p>`}${producto.stock > 0 && producto.stock <= 5 && renderTemplate`<p class="existencia pocas" data-astro-cid-tyiywhkw>¡Solo quedan ${producto.stock} piezas!</p>`}${renderComponent($$result, "AddToCartButton", null, {
		"client:only": "react",
		"producto": producto,
		"data-astro-cid-tyiywhkw": true,
		"client:component-hydration": "only",
		"client:component-path": "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/AddToCartButton.tsx",
		"client:component-export": "default"
	}, { "fallback": ($$result) => renderTemplate`<button class="btn-primario" disabled data-astro-cid-tyiywhkw>Añadir al carrito</button>` })}</div>`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/ProductDetail.astro", void 0);
//#endregion
//#region src/pages/producto/[id].astro
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
	let producto = null;
	let error = null;
	try {
		({producto} = await graphql(OBTENER_PRODUCTO, { id }));
	} catch (e) {
		error = e instanceof ApiError ? e.message : "Error inesperado";
	}
	if (!producto && !error) return Astro.rewrite("/404");
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"titulo": producto?.nombre,
		"sidebar": true
	}, { "default": ($$result) => renderTemplate`${error && renderTemplate`${renderComponent($$result, "Alert", $$Alert, {}, { "default": ($$result) => renderTemplate`Error de conexión: ${error}` })}`}${producto && renderTemplate`${renderComponent($$result, "ProductDetail", $$ProductDetail, { "producto": producto })}`}` })}`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/producto/[id].astro", void 0);
var $$file = "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/producto/[id].astro";
var $$url = "/producto/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/producto/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
