import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_QxkgRyO6.mjs";
import { x as REGISTRAR } from "./queries_DPD021At.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CKtUr8XU.mjs";
import { i as rutaSegura, r as guardarSesion } from "./auth_DTgZtdCi.mjs";
import { n as graphql, t as ApiError } from "./graphql_b8rvOFuU.mjs";
import { t as $$Layout } from "./Layout_Djj96ORb.mjs";
import { t as $$Alert } from "./Alert_CzAlVcvH.mjs";
import { n as $$AuthCard, t as $$FormField } from "./FormField_DncmoRV2.mjs";
//#region src/pages/registro.astro
var registro_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Registro,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Registro = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Registro;
	const next = rutaSegura(Astro.url.searchParams.get("next"));
	if (Astro.locals.usuario) return Astro.redirect(next);
	let error = null;
	let nombre = "";
	let email = "";
	if (Astro.request.method === "POST") {
		const datos = await Astro.request.formData();
		nombre = String(datos.get("nombre") ?? "").trim();
		email = String(datos.get("email") ?? "").trim();
		const password = String(datos.get("password") ?? "");
		if (password !== String(datos.get("confirmar") ?? "")) error = "Las contraseñas no coinciden.";
		else try {
			const { registrar } = await graphql(REGISTRAR, {
				nombre,
				email,
				password
			});
			guardarSesion(Astro.cookies, registrar.token);
			return Astro.redirect(next, 303);
		} catch (e) {
			error = e instanceof ApiError && e.codigo === "BAD_USER_INPUT" ? e.message : "No pudimos crear tu cuenta. Inténtalo de nuevo en un momento.";
		}
	}
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "titulo": "Crear cuenta" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "AuthCard", $$AuthCard, {
		"titulo": "Crear cuenta",
		"subtitulo": "Con tu cuenta puedes pagar y ver tus pedidos anteriores."
	}, {
		"default": ($$result) => renderTemplate`${error && renderTemplate`${renderComponent($$result, "Alert", $$Alert, {}, { "default": ($$result) => renderTemplate`${error}` })}`}${maybeRenderHead($$result)}<form method="POST">${renderComponent($$result, "FormField", $$FormField, {
			"label": "Nombre",
			"name": "nombre",
			"autocomplete": "name",
			"value": nombre,
			"minlength": 2
		})}${renderComponent($$result, "FormField", $$FormField, {
			"label": "Correo",
			"name": "email",
			"type": "email",
			"autocomplete": "email",
			"value": email
		})}${renderComponent($$result, "FormField", $$FormField, {
			"label": "Contraseña (mínimo 8 caracteres)",
			"name": "password",
			"type": "password",
			"autocomplete": "new-password",
			"minlength": 8
		})}${renderComponent($$result, "FormField", $$FormField, {
			"label": "Repite la contraseña",
			"name": "confirmar",
			"type": "password",
			"autocomplete": "new-password",
			"minlength": 8
		})}<button class="btn-primario" type="submit">Crear cuenta</button></form>`,
		"pie": ($$result) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "slot": "pie" }, { "default": ($$result) => renderTemplate`
      ¿Ya tienes cuenta? <a${addAttribute(`/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`, "href")}>Ingresar</a>` })}`
	})}` })}`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/registro.astro", void 0);
var $$file = "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/registro.astro";
var $$url = "/registro";
//#endregion
//#region \0virtual:astro:page:src/pages/registro@_@astro
var page = () => registro_exports;
//#endregion
export { page };
