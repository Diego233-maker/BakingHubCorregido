import { A as renderTemplate, D as renderSlot, j as maybeRenderHead } from "./sequence_QxkgRyO6.mjs";
import { n as createComponent } from "./compiler_CKtUr8XU.mjs";
//#region src/components/Alert.astro
var $$Alert = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<p class="mensaje-error" role="alert">${renderSlot($$result, $$slots["default"])}</p>`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/Alert.astro", void 0);
//#endregion
export { $$Alert as t };
