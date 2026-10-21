import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_QxkgRyO6.mjs";
import { d as CREAR_PRODUCTO, f as ELIMINAR_PRODUCTO, i as ADMIN_PRODUCTOS, s as AJUSTAR_STOCK, t as ACTUALIZAR_PRODUCTO } from "./queries_DPD021At.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CKtUr8XU.mjs";
import { n as graphql } from "./graphql_b8rvOFuU.mjs";
import { t as $$AdminLayout } from "./AdminLayout_lM0NE0yP.mjs";
import { t as $$Alert } from "./Alert_CzAlVcvH.mjs";
import { t as precio } from "./format_Bjv1Xm-T.mjs";
import { a as numero, i as nivelStock, n as entero, o as texto, r as mensajeError, t as ErrorFormulario } from "./admin_r1TXMaPX.mjs";
//#region src/pages/admin/inventario.astro
var inventario_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Inventario,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Inventario = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Inventario;
	const token = Astro.locals.token;
	const aviso = {
		creado: "Producto agregado al inventario.",
		actualizado: "Producto actualizado.",
		stock: "Existencias actualizadas.",
		eliminado: "Producto eliminado del catálogo."
	}[Astro.url.searchParams.get("ok") ?? ""] ?? null;
	let error = null;
	let nuevo = {
		nombre: "",
		precio: "",
		imagen: "",
		stock: ""
	};
	if (Astro.request.method === "POST") {
		const datos = await Astro.request.formData();
		const accion = texto(datos, "accion");
		try {
			switch (accion) {
				case "crear":
					nuevo = {
						nombre: texto(datos, "nombre"),
						precio: texto(datos, "precio"),
						imagen: texto(datos, "imagen"),
						stock: texto(datos, "stock")
					};
					await graphql(CREAR_PRODUCTO, {
						nombre: nuevo.nombre,
						precio: numero(datos, "precio", "El precio"),
						imagen: nuevo.imagen,
						stock: entero(datos, "stock", "El stock inicial")
					}, token);
					return Astro.redirect("/admin/inventario?ok=creado", 303);
				case "actualizar":
					await graphql(ACTUALIZAR_PRODUCTO, {
						id: texto(datos, "id"),
						nombre: texto(datos, "nombre"),
						precio: numero(datos, "precio", "El precio"),
						imagen: texto(datos, "imagen"),
						stock: entero(datos, "stock", "El stock")
					}, token);
					return Astro.redirect("/admin/inventario?ok=actualizado", 303);
				case "ajustar": {
					const cantidad = entero(datos, "cantidad", "La cantidad");
					if (cantidad <= 0) throw new ErrorFormulario("La cantidad a agregar debe ser mayor a 0.");
					await graphql(AJUSTAR_STOCK, {
						id: texto(datos, "id"),
						cantidad
					}, token);
					return Astro.redirect("/admin/inventario?ok=stock", 303);
				}
				case "eliminar":
					await graphql(ELIMINAR_PRODUCTO, { id: texto(datos, "id") }, token);
					return Astro.redirect("/admin/inventario?ok=eliminado", 303);
				default: throw new ErrorFormulario("Acción no reconocida.");
			}
		} catch (e) {
			error = mensajeError(e);
		}
	}
	let productos = [];
	try {
		({adminProductos: productos} = await graphql(ADMIN_PRODUCTOS, {}, token));
	} catch (e) {
		error ??= mensajeError(e);
	}
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {
		"titulo": "Inventario",
		"seccion": "inventario"
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<h2 class="admin-titulo">Inventario</h2><p class="admin-subtitulo">Da de alta productos nuevos y controla cuántas piezas hay de cada uno.</p>${aviso && renderTemplate`<p class="mensaje-exito" role="status">${aviso}</p>`}${error && renderTemplate`${renderComponent($$result, "Alert", $$Alert, {}, { "default": ($$result) => renderTemplate`${error}` })}`}<section class="admin-bloque"><h3>Agregar producto nuevo</h3><form method="POST" class="form-grid"><input type="hidden" name="accion" value="crear"><div class="campo-admin"><label for="n-nombre">Nombre</label><input id="n-nombre" name="nombre"${addAttribute(nuevo.nombre, "value")} maxlength="100" required></div><div class="campo-admin"><label for="n-precio">Precio (MXN)</label><input id="n-precio" name="precio" type="number" step="0.01" min="0.01"${addAttribute(nuevo.precio, "value")} required></div><div class="campo-admin"><label for="n-stock">Piezas iniciales</label><input id="n-stock" name="stock" type="number" step="1" min="0"${addAttribute(nuevo.stock || "0", "value")} required></div><div class="campo-admin ancho"><label for="n-imagen">URL de la imagen</label><input id="n-imagen" name="imagen" type="url" placeholder="https://…"${addAttribute(nuevo.imagen, "value")} maxlength="255" required></div><div class="ancho"><button class="btn-admin" type="submit">Agregar al inventario</button></div></form></section><h3 class="section-title">Productos (${productos.length})</h3>${productos.length === 0 && !error && renderTemplate`<p class="estado-vacio">Todavía no hay productos. Agrega el primero arriba.</p>`}<div class="lista-productos">${productos.map((p) => {
		const nivel = nivelStock(p.stock);
		return renderTemplate`<article class="producto-fila"><img${addAttribute(p.imagen, "src")}${addAttribute(p.nombre, "alt")} loading="lazy"><div><h4>${p.nombre}</h4><div class="producto-meta"><span>${precio(p.precio)}</span><span${addAttribute(`badge badge-${nivel.clase}`, "class")}>${nivel.etiqueta}</span><span>#${p.id}</span></div></div><div class="producto-acciones"><form method="POST" class="form-inline"><input type="hidden" name="accion" value="ajustar"><input type="hidden" name="id"${addAttribute(p.id, "value")}><input type="number" name="cantidad" min="1" step="1" value="10"${addAttribute(`Piezas a agregar de ${p.nombre}`, "aria-label")} required><button class="btn-admin" type="submit">+ Reabastecer</button></form><div class="fila"><form method="POST"${addAttribute(`¿Eliminar "${p.nombre}" del catálogo?`, "data-confirmar")}><input type="hidden" name="accion" value="eliminar"><input type="hidden" name="id"${addAttribute(p.id, "value")}><button class="btn-admin peligro" type="submit">Eliminar</button></form></div></div><details><summary>Editar datos</summary><form method="POST" class="form-grid"><input type="hidden" name="accion" value="actualizar"><input type="hidden" name="id"${addAttribute(p.id, "value")}><div class="campo-admin"><label${addAttribute(`e-nombre-${p.id}`, "for")}>Nombre</label><input${addAttribute(`e-nombre-${p.id}`, "id")} name="nombre"${addAttribute(p.nombre, "value")} maxlength="100" required></div><div class="campo-admin"><label${addAttribute(`e-precio-${p.id}`, "for")}>Precio (MXN)</label><input${addAttribute(`e-precio-${p.id}`, "id")} name="precio" type="number" step="0.01" min="0.01"${addAttribute(p.precio, "value")} required></div><div class="campo-admin"><label${addAttribute(`e-stock-${p.id}`, "for")}>Existencias</label><input${addAttribute(`e-stock-${p.id}`, "id")} name="stock" type="number" step="1" min="0"${addAttribute(p.stock, "value")} required></div><div class="campo-admin ancho"><label${addAttribute(`e-imagen-${p.id}`, "for")}>URL de la imagen</label><input${addAttribute(`e-imagen-${p.id}`, "id")} name="imagen" type="url"${addAttribute(p.imagen, "value")} maxlength="255" required></div><div class="ancho"><button class="btn-admin" type="submit">Guardar cambios</button></div></form></details></article>`;
	})}</div>` })}`;
}, "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/admin/inventario.astro", void 0);
var $$file = "/home/jax/Documents/Kegovc/BakingHubCorregido/baking-hub-front/src/pages/admin/inventario.astro";
var $$url = "/admin/inventario";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/inventario@_@astro
var page = () => inventario_exports;
//#endregion
export { page };
