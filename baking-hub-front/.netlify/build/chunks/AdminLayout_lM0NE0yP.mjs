import { A as renderTemplate, D as renderSlot, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_QxkgRyO6.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CKtUr8XU.mjs";
import { t as renderScript } from "./script_DjT6wws8.mjs";
import { t as $$Layout } from "./Layout_Djj96ORb.mjs";
//#region src/components/AdminNav.astro
createAstro("https://astro.build");
var $$AdminNav = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AdminNav;
	const { activa } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<nav class="admin-nav" aria-label="Panel de administración" data-astro-cid-6me3rynq><span class="admin-nav-titulo" data-astro-cid-6me3rynq>Panel admin</span>${[
		{
			clave: "resumen",
			href: "/admin",
			texto: "Resumen"
		},
		{
			clave: "pedidos",
			href: "/admin/pedidos",
			texto: "Pedidos"
		},
		{
			clave: "inventario",
			href: "/admin/inventario",
			texto: "Inventario"
		},
		{
			clave: "usuarios",
			href: "/admin/usuarios",
			texto: "Clientes"
		}
	].map((e) => renderTemplate`<a${addAttribute(e.href, "href")}${addAttribute(["admin-enlace", { activa: activa === e.clave }], "class:list")}${addAttribute(activa === e.clave ? "page" : void 0, "aria-current")} data-astro-cid-6me3rynq>${e.texto}</a>`)}</nav>`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/AdminNav.astro", void 0);
//#endregion
//#region src/layouts/AdminLayout.astro
createAstro("https://astro.build");
var $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AdminLayout;
	const { titulo, seccion } = Astro.props;
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "titulo": `Admin · ${titulo}` }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "AdminNav", $$AdminNav, { "activa": seccion })}${renderSlot($$result, $$slots["default"])}` })}${renderScript($$result, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/layouts/AdminLayout.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/layouts/AdminLayout.astro", void 0);
//#endregion
export { $$AdminLayout as t };
