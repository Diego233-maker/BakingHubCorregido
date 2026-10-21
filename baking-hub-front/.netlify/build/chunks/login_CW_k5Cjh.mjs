import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_QxkgRyO6.mjs";
import { m as LOGIN } from "./queries_DPD021At.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CKtUr8XU.mjs";
import { i as rutaSegura, r as guardarSesion } from "./auth_DTgZtdCi.mjs";
import { n as graphql, t as ApiError } from "./graphql_b8rvOFuU.mjs";
import { t as $$Layout } from "./Layout_Djj96ORb.mjs";
import { t as $$Alert } from "./Alert_CzAlVcvH.mjs";
import { n as $$AuthCard, t as $$FormField } from "./FormField_DncmoRV2.mjs";
//#region src/pages/login.astro
var login_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Login,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Login = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Login;
	const next = rutaSegura(Astro.url.searchParams.get("next"));
	if (Astro.locals.usuario) return Astro.redirect(next);
	let error = null;
	let email = "";
	if (Astro.request.method === "POST") {
		const datos = await Astro.request.formData();
		email = String(datos.get("email") ?? "").trim();
		const password = String(datos.get("password") ?? "");
		try {
			const { login } = await graphql(LOGIN, {
				email,
				password
			});
			guardarSesion(Astro.cookies, login.token);
			return Astro.redirect(next, 303);
		} catch (e) {
			error = e instanceof ApiError && ["UNAUTHENTICATED", "BAD_USER_INPUT"].includes(e.codigo) ? e.message : "No pudimos iniciar sesión. Inténtalo de nuevo en un momento.";
		}
	}
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "titulo": "Ingresar" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "AuthCard", $$AuthCard, {
		"titulo": "Ingresar",
		"subtitulo": "Entra para confirmar tus pedidos y revisar tu historial."
	}, {
		"default": ($$result) => renderTemplate`${error && renderTemplate`${renderComponent($$result, "Alert", $$Alert, {}, { "default": ($$result) => renderTemplate`${error}` })}`}${maybeRenderHead($$result)}<form method="POST">${renderComponent($$result, "FormField", $$FormField, {
			"label": "Correo",
			"name": "email",
			"type": "email",
			"autocomplete": "email",
			"value": email
		})}${renderComponent($$result, "FormField", $$FormField, {
			"label": "Contraseña",
			"name": "password",
			"type": "password",
			"autocomplete": "current-password"
		})}<button class="btn-primario" type="submit">Ingresar</button></form>`,
		"pie": ($$result) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "slot": "pie" }, { "default": ($$result) => renderTemplate`
      ¿No tienes cuenta? <a${addAttribute(`/registro${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`, "href")}>Crear cuenta</a>` })}`
	})}` })}`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/login.astro", void 0);
var $$file = "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/login.astro";
var $$url = "/login";
//#endregion
//#region \0virtual:astro:page:src/pages/login@_@astro
var page = () => login_exports;
//#endregion
export { page };
