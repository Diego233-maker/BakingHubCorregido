import { A as renderTemplate, D as renderSlot, M as renderHead, N as addAttribute, T as Fragment$1, j as maybeRenderHead, w as renderComponent } from "./sequence_QxkgRyO6.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CKtUr8XU.mjs";
import { useEffect } from "react";
//#region src/components/Header.astro
createAstro("https://astro.build");
var $$Header = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Header;
	const { usuario } = Astro.locals;
	const primerNombre = usuario?.nombre.split(" ")[0];
	return renderTemplate`${maybeRenderHead($$result)}<header class="top-bar" data-astro-cid-nen7h5rs><a class="brand" href="/" data-astro-cid-nen7h5rs>Baking Hub</a><nav class="acciones" aria-label="Cuenta y carrito" data-astro-cid-nen7h5rs>${usuario ? renderTemplate`${renderComponent($$result, "Fragment", Fragment$1, {}, { "default": ($$result) => renderTemplate`${usuario.rol === "admin" && renderTemplate`<a class="enlace enlace-admin" href="/admin" data-astro-cid-nen7h5rs>Panel admin</a>`}<a class="enlace" href="/pedidos" data-astro-cid-nen7h5rs>Mis pedidos</a><span class="saludo" data-astro-cid-nen7h5rs>Hola, ${primerNombre}</span><form method="POST" action="/api/auth/logout" data-astro-cid-nen7h5rs><button class="enlace enlace-btn" type="submit" data-astro-cid-nen7h5rs>Salir</button></form>` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment$1, {}, { "default": ($$result) => renderTemplate`<a class="enlace" href="/login" data-astro-cid-nen7h5rs>Ingresar</a><a class="enlace" href="/registro" data-astro-cid-nen7h5rs>Crear cuenta</a>` })}`}<button class="theme-toggle" type="button" data-theme-toggle aria-label="Tema oscuro" aria-pressed="false" title="Cambiar tema" data-astro-cid-nen7h5rs><span data-astro-cid-nen7h5rs>Oscuro</span><span class="theme-switch" aria-hidden="true" data-astro-cid-nen7h5rs><span data-astro-cid-nen7h5rs></span></span></button>${renderComponent($$result, "CartButton", null, {
		"client:only": "react",
		"data-astro-cid-nen7h5rs": true,
		"client:component-hydration": "only",
		"client:component-path": "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/CartButton.tsx",
		"client:component-export": "default"
	}, { "fallback": ($$result) => renderTemplate`<a class="cart-button" href="/carrito" data-astro-cid-nen7h5rs>Carrito</a>` })}</nav></header>`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/Header.astro", void 0);
//#endregion
//#region src/components/Footer.astro
var $$Footer = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<footer class="app-footer" data-astro-cid-jo6i4kqk><p data-astro-cid-jo6i4kqk>Baking Hub © 2026. Proyecto Universitario - Práctica 6-2.</p></footer>`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/Footer.astro", void 0);
//#endregion
//#region src/lib/categorias.ts
var CATEGORIAS = [
	"Todas",
	"Chocolates",
	"Panadería"
];
/** Deduce la categoría de un producto a partir de su nombre (misma lógica que el proyecto original). */
function obtenerCategoria(nombre) {
	const texto = nombre.toLowerCase();
	if (texto.includes("chocolate")) return "Chocolates";
	if ([
		"pan",
		"rol",
		"galleta",
		"pastel"
	].some((palabra) => texto.includes(palabra))) return "Panadería";
	return "Otra";
}
//#endregion
//#region src/components/Sidebar.astro
createAstro("https://astro.build");
var $$Sidebar = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Sidebar;
	const { activa } = Astro.props;
	const href = (categoria) => categoria === "Todas" ? "/" : `/?categoria=${encodeURIComponent(categoria)}`;
	return renderTemplate`${maybeRenderHead($$result)}<aside class="side-bar" data-astro-cid-wv7whodv><h3 data-astro-cid-wv7whodv>Categorías</h3><ul class="category-list" data-astro-cid-wv7whodv>${CATEGORIAS.map((categoria) => renderTemplate`<li data-astro-cid-wv7whodv><a${addAttribute(["category-item", { activa: activa === categoria }], "class:list")}${addAttribute(href(categoria), "href")}${addAttribute(activa === categoria ? "page" : void 0, "aria-current")} data-astro-cid-wv7whodv>${categoria === "Todas" ? "Ver todo" : categoria}</a></li>`)}</ul></aside>`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/Sidebar.astro", void 0);
//#endregion
//#region src/components/PresenciaUsuario.tsx
var INTERVALO_PRESENCIA_MS = 2e4;
function PresenciaUsuario() {
	useEffect(() => {
		let activo = true;
		let solicitudEnCurso = false;
		const enviarPresencia = async () => {
			if (!activo || document.visibilityState !== "visible" || solicitudEnCurso) return;
			solicitudEnCurso = true;
			try {
				const respuesta = await fetch("/api/presencia", { method: "POST" });
				if (!respuesta.ok && respuesta.status !== 401 && respuesta.status !== 403) console.error(`No se pudo actualizar la presencia (HTTP ${respuesta.status}).`);
				if (respuesta.status === 401 || respuesta.status === 403) activo = false;
			} catch (error) {
				console.error("No se pudo actualizar la presencia:", error);
			} finally {
				solicitudEnCurso = false;
			}
		};
		const alCambiarVisibilidad = () => {
			if (document.visibilityState === "visible") enviarPresencia();
		};
		enviarPresencia();
		const intervalo = window.setInterval(() => void enviarPresencia(), INTERVALO_PRESENCIA_MS);
		document.addEventListener("visibilitychange", alCambiarVisibilidad);
		return () => {
			activo = false;
			window.clearInterval(intervalo);
			document.removeEventListener("visibilitychange", alCambiarVisibilidad);
		};
	}, []);
	return null;
}
//#endregion
//#region src/layouts/Layout.astro
createAstro("https://astro.build");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { titulo, sidebar = false, categoriaActiva } = Astro.props;
	const title = titulo ? `${titulo} · Baking Hub` : "Baking Hub";
	return renderTemplate`<html lang="es" data-astro-cid-ju4pidww><head><script src="https://sdk.mercadopago.com/js/v2"><\/script><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script>
      const applyStoredTheme = (theme) => {
        document.documentElement.dataset.theme = theme;
        document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
          button.setAttribute('aria-pressed', String(theme === 'dark'));
        });
      };

      try {
        const theme = localStorage.getItem('baking-hub-theme');
        if (theme === 'light' || theme === 'dark') applyStoredTheme(theme);
      } catch {}

      document.addEventListener('click', (event) => {
        const target = event.target;
        const button = target instanceof Element ? target.closest('[data-theme-toggle]') : null;
        if (!button) return;

        const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        applyStoredTheme(theme);
        try {
          localStorage.setItem('baking-hub-theme', theme);
        } catch {}
      });

      document.addEventListener('DOMContentLoaded', () => {
        const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
        document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
          button.setAttribute('aria-pressed', String(theme === 'dark'));
        });
      });
    <\/script><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&display=swap" rel="stylesheet"><title>${title}</title>${renderHead($$result)}</head><body data-astro-cid-ju4pidww>${Astro.locals.usuario?.rol === "cliente" && renderTemplate`${renderComponent($$result, "PresenciaUsuario", PresenciaUsuario, {
		"client:load": true,
		"data-astro-cid-ju4pidww": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/PresenciaUsuario.tsx",
		"client:component-export": "default"
	})}`}<div class="layout-principal" data-astro-cid-ju4pidww>${renderComponent($$result, "Header", $$Header, { "data-astro-cid-ju4pidww": true })}<div class="contenedor-central" data-astro-cid-ju4pidww>${sidebar && renderTemplate`${renderComponent($$result, "Sidebar", $$Sidebar, {
		"activa": categoriaActiva,
		"data-astro-cid-ju4pidww": true
	})}`}<main${addAttribute(["main-content", { "sin-sidebar": !sidebar }], "class:list")} data-astro-cid-ju4pidww>${renderSlot($$result, $$slots["default"])}</main></div>${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-ju4pidww": true })}</div></body></html>`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/layouts/Layout.astro", void 0);
//#endregion
export { CATEGORIAS as n, obtenerCategoria as r, $$Layout as t };
