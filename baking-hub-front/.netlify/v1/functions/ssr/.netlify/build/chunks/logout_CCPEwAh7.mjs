import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as cerrarSesion } from "./auth_DTgZtdCi.mjs";
//#region src/pages/api/auth/logout.ts
var logout_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = ({ cookies, redirect }) => {
	cerrarSesion(cookies);
	return redirect("/", 303);
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/auth/logout@_@ts
var page = () => logout_exports;
//#endregion
export { page };
