//#region src/lib/pagos.ts
/** Textos de cada método de pago. Para agregar o quitar métodos, ver también MP_METODOS en el .env del backend. */
var METODOS = {
	tarjeta: {
		etiqueta: "Tarjeta de crédito o débito",
		descripcion: "Visa, Mastercard y American Express. Se cobra al instante.",
		icono: "VISA"
	},
	oxxo: {
		etiqueta: "Efectivo en OXXO",
		descripcion: "Genera una ficha y paga en caja en cualquier tienda OXXO.",
		icono: "OXXO"
	},
	spei: {
		etiqueta: "Transferencia SPEI",
		descripcion: "Transfiere desde la app o la banca en línea de tu banco.",
		icono: "SPEI"
	},
	mercadopago: {
		etiqueta: "Mercado Pago",
		descripcion: "Paga con tu saldo o con las tarjetas guardadas en tu cuenta.",
		icono: "MP"
	}
};
/** Estados de un pedido: texto y color de la insignia. */
var ESTADOS_PEDIDO = {
	pendiente: {
		etiqueta: "Pendiente de pago",
		clase: "warn"
	},
	pagado: {
		etiqueta: "Pagado",
		clase: "ok"
	},
	cancelado: {
		etiqueta: "Cancelado",
		clase: "error"
	},
	expirado: {
		etiqueta: "Expirado",
		clase: "error"
	},
	reembolsado: {
		etiqueta: "Reembolsado",
		clase: "muted"
	}
};
var estadoPedido = (status) => ESTADOS_PEDIDO[status.toLowerCase()] ?? {
	etiqueta: status,
	clase: "muted"
};
/** Agrupa una referencia en bloques de 4 dígitos para leerla mejor: 1234 5678 9012 34 */
var formatearReferencia = (ref) => ref.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
var formatearFecha = (iso) => new Date(iso).toLocaleString("es-MX", {
	dateStyle: "medium",
	timeStyle: "short"
});
//#endregion
export { formatearReferencia as i, estadoPedido as n, formatearFecha as r, METODOS as t };
