import { A as renderTemplate, D as renderSlot, N as addAttribute, j as maybeRenderHead } from "./sequence_QxkgRyO6.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CKtUr8XU.mjs";
//#region src/components/AuthCard.astro
createAstro("https://astro.build");
var $$AuthCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AuthCard;
	const { titulo, subtitulo } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<section class="auth-card" data-astro-cid-qq26h3fn><h2 data-astro-cid-qq26h3fn>${titulo}</h2>${subtitulo && renderTemplate`<p class="subtitulo" data-astro-cid-qq26h3fn>${subtitulo}</p>`}${renderSlot($$result, $$slots["default"])}<p class="pie" data-astro-cid-qq26h3fn>${renderSlot($$result, $$slots["pie"])}</p></section>`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/AuthCard.astro", void 0);
//#endregion
//#region src/components/FormField.astro
createAstro("https://astro.build");
var $$FormField = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$FormField;
	const { label, name, type = "text", autocomplete, value = "", minlength, required = true } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="campo" data-astro-cid-dchldyzy><label${addAttribute(name, "for")} data-astro-cid-dchldyzy>${label}</label><input${addAttribute(name, "id")}${addAttribute(name, "name")}${addAttribute(type, "type")}${addAttribute(autocomplete, "autocomplete")}${addAttribute(value, "value")}${addAttribute(minlength, "minlength")}${addAttribute(required, "required")} data-astro-cid-dchldyzy></div>`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/FormField.astro", void 0);
//#endregion
export { $$AuthCard as n, $$FormField as t };
