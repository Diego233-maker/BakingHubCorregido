import { t as ApiError } from "./graphql_b8rvOFuU.mjs";
//#region src/lib/admin.ts
/** Error de validación del formulario (se muestra tal cual al administrador). */
var ErrorFormulario = class extends Error {};
function mensajeError(e) {
	if (e instanceof ErrorFormulario) return e.message;
	if (e instanceof ApiError) return e.message;
	return "Ocurrió un error inesperado. Inténtalo de nuevo.";
}
/** Lee un campo de texto de un formulario ya limpio de espacios. */
var texto = (datos, campo) => String(datos.get(campo) ?? "").trim();
function numero(datos, campo, etiqueta) {
	const valor = Number(texto(datos, campo));
	if (texto(datos, campo) === "" || !Number.isFinite(valor)) throw new ErrorFormulario(`${etiqueta} no es válido.`);
	return valor;
}
function entero(datos, campo, etiqueta) {
	const valor = numero(datos, campo, etiqueta);
	if (!Number.isInteger(valor)) throw new ErrorFormulario(`${etiqueta} debe ser un número entero.`);
	return valor;
}
/** Nivel de existencias para pintar la insignia. */
function nivelStock(stock) {
	if (stock <= 0) return {
		clase: "error",
		etiqueta: "Agotado"
	};
	if (stock <= 5) return {
		clase: "warn",
		etiqueta: `Stock bajo: ${stock}`
	};
	return {
		clase: "ok",
		etiqueta: `${stock} en stock`
	};
}
//#endregion
export { numero as a, nivelStock as i, entero as n, texto as o, mensajeError as r, ErrorFormulario as t };
