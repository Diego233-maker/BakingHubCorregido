import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_QxkgRyO6.mjs";
import { c as CAMBIAR_ESTADO_USUARIO, n as ACTUALIZAR_USUARIO, o as ADMIN_USUARIOS, p as ELIMINAR_USUARIO } from "./queries_DPD021At.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CKtUr8XU.mjs";
import { n as graphql } from "./graphql_b8rvOFuU.mjs";
import { t as $$AdminLayout } from "./AdminLayout_lM0NE0yP.mjs";
import { t as $$Alert } from "./Alert_CzAlVcvH.mjs";
import { t as precio } from "./format_Bjv1Xm-T.mjs";
import { o as texto, r as mensajeError, t as ErrorFormulario } from "./admin_r1TXMaPX.mjs";
import { useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/components/AdminPresenceUpdates.tsx
function AdminPresenceUpdates() {
	const [estado, setEstado] = useState("Conectando presencia de clientes…");
	useEffect(() => {
		const eventos = new EventSource("/api/admin/presencia");
		eventos.addEventListener("open", () => setEstado("Conectando con el backend…"));
		eventos.addEventListener("conectado", () => setEstado("Presencia en tiempo real activa."));
		eventos.addEventListener("presencia-usuario", () => {
			setEstado("Cambió la presencia de un cliente. Actualizando la lista…");
			window.location.reload();
		});
		eventos.addEventListener("error", (evento) => {
			const datos = evento.data;
			setEstado(datos ? JSON.parse(datos).message : "No se pudo conectar en tiempo real. Reconectando…");
		});
		return () => eventos.close();
	}, []);
	return /* @__PURE__ */ jsx("p", {
		role: "status",
		"aria-live": "polite",
		children: estado
	});
}
//#endregion
//#region src/pages/admin/usuarios.astro
var usuarios_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Usuarios,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Usuarios = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Usuarios;
	const token = Astro.locals.token;
	const aviso = {
		actualizado: "Datos del cliente actualizados.",
		suspendido: "Cuenta suspendida: el cliente ya no puede entrar ni comprar.",
		reactivado: "Cuenta reactivada.",
		eliminado: "Cliente eliminado. Sus pedidos se conservan en el historial."
	}[Astro.url.searchParams.get("ok") ?? ""] ?? null;
	const busqueda = (Astro.url.searchParams.get("q") ?? "").trim().slice(0, 100);
	const volver = (ok) => `/admin/usuarios?ok=${ok}${busqueda ? `&q=${encodeURIComponent(busqueda)}` : ""}`;
	let error = null;
	if (Astro.request.method === "POST") {
		const datos = await Astro.request.formData();
		const accion = texto(datos, "accion");
		const id = texto(datos, "id");
		try {
			switch (accion) {
				case "actualizar":
					await graphql(ACTUALIZAR_USUARIO, {
						id,
						nombre: texto(datos, "nombre"),
						email: texto(datos, "email")
					}, token);
					return Astro.redirect(volver("actualizado"), 303);
				case "suspender":
				case "reactivar":
					await graphql(CAMBIAR_ESTADO_USUARIO, {
						id,
						activo: accion === "reactivar"
					}, token);
					return Astro.redirect(volver(accion === "suspender" ? "suspendido" : "reactivado"), 303);
				case "eliminar":
					await graphql(ELIMINAR_USUARIO, { id }, token);
					return Astro.redirect(volver("eliminado"), 303);
				default: throw new ErrorFormulario("Acción no reconocida.");
			}
		} catch (e) {
			error = mensajeError(e);
		}
	}
	let usuarios = [];
	try {
		({adminUsuarios: usuarios} = await graphql(ADMIN_USUARIOS, { busqueda }, token));
	} catch (e) {
		error ??= mensajeError(e);
	}
	const fecha = (iso) => new Date(iso).toLocaleDateString("es-MX", { dateStyle: "medium" });
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {
		"titulo": "Clientes",
		"seccion": "usuarios"
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<h2 class="admin-titulo">Clientes</h2><p class="admin-subtitulo">Consulta las cuentas de clientes, corrige sus datos o suspende el acceso.</p>${renderComponent($$result, "AdminPresenceUpdates", AdminPresenceUpdates, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/components/AdminPresenceUpdates.tsx",
		"client:component-export": "default"
	})}${aviso && renderTemplate`<p class="mensaje-exito" role="status">${aviso}</p>`}${error && renderTemplate`${renderComponent($$result, "Alert", $$Alert, {}, { "default": ($$result) => renderTemplate`${error}` })}`}<form method="GET" class="buscador" role="search"><input type="search" name="q"${addAttribute(busqueda, "value")} placeholder="Buscar por nombre o correo…" aria-label="Buscar cliente"><button class="btn-admin" type="submit">Buscar</button>${busqueda && renderTemplate`<a class="btn-admin sec" href="/admin/usuarios">Limpiar</a>`}</form>${usuarios.length === 0 && !error && renderTemplate`<p class="estado-vacio">${busqueda ? "Ningún cliente coincide con tu búsqueda." : "Todavía no hay clientes registrados."}</p>`}${usuarios.length > 0 && renderTemplate`<div class="tabla-wrap"><table class="tabla-admin"><thead><tr><th>Cliente</th><th>Registro</th><th class="num">Pedidos</th><th class="num">Total pagado</th><th>Estado</th><th>Online</th><th>Acciones</th></tr></thead><tbody>${usuarios.map((u) => renderTemplate`<tr${addAttribute({ suspendido: !u.activo }, "class:list")}><td><strong>${u.nombre}</strong><br><small>${u.email}</small></td><td>${fecha(u.creado)}</td><td class="num">${u.pedidos}</td><td class="num">${precio(u.totalComprado)}</td><td><span${addAttribute(`badge ${u.activo ? "badge-ok" : "badge-error"}`, "class")}>${u.activo ? "Activo" : "Suspendido"}</span></td><td><span${addAttribute(["presencia-usuario", u.online ? "en-linea" : "fuera-linea"], "class:list")}>${u.online ? "En línea" : "Desconectado"}</span></td><td><div class="acciones"><div class="fila"><form method="POST"${addAttribute(u.activo ? `¿Suspender la cuenta de ${u.nombre}? No podrá entrar ni comprar.` : void 0, "data-confirmar")}><input type="hidden" name="accion"${addAttribute(u.activo ? "suspender" : "reactivar", "value")}><input type="hidden" name="id"${addAttribute(u.id, "value")}><button class="btn-admin sec" type="submit">${u.activo ? "Suspender" : "Reactivar"}</button></form><form method="POST"${addAttribute(`¿Eliminar a ${u.nombre}? Esta acción no se puede deshacer.`, "data-confirmar")}><input type="hidden" name="accion" value="eliminar"><input type="hidden" name="id"${addAttribute(u.id, "value")}><button class="btn-admin peligro" type="submit">Eliminar</button></form></div><details><summary>Editar datos</summary><form method="POST"><input type="hidden" name="accion" value="actualizar"><input type="hidden" name="id"${addAttribute(u.id, "value")}><div class="campo-admin"><label${addAttribute(`u-nombre-${u.id}`, "for")}>Nombre</label><input${addAttribute(`u-nombre-${u.id}`, "id")} name="nombre"${addAttribute(u.nombre, "value")} minlength="2" maxlength="100" required></div><div class="campo-admin"><label${addAttribute(`u-email-${u.id}`, "for")}>Correo</label><input${addAttribute(`u-email-${u.id}`, "id")} name="email" type="email"${addAttribute(u.email, "value")} maxlength="254" required></div><button class="btn-admin" type="submit">Guardar</button></form></details></div></td></tr>`)}</tbody></table></div>`}` })}`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/admin/usuarios.astro", void 0);
var $$file = "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/admin/usuarios.astro";
var $$url = "/admin/usuarios";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/usuarios@_@astro
var page = () => usuarios_exports;
//#endregion
export { page };
