import { Ct as createInvalidVariablesError, Et as setOnSetGetEnv, wt as getEnv$1 } from "./sequence_QxkgRyO6.mjs";
//#region node_modules/astro/dist/env/validators.js
function getEnvFieldType(options) {
	const optional = options.optional ? options.default !== void 0 ? false : true : false;
	let type;
	if (options.type === "enum") type = options.values.map((v) => `'${v}'`).join(" | ");
	else type = options.type;
	return `${type}${optional ? " | undefined" : ""}`;
}
var stringValidator = ({ max, min, length, url, includes, startsWith, endsWith }) => (input) => {
	if (typeof input !== "string") return {
		ok: false,
		errors: ["type"]
	};
	const errors = [];
	if (max !== void 0 && !(input.length <= max)) errors.push("max");
	if (min !== void 0 && !(input.length >= min)) errors.push("min");
	if (length !== void 0 && !(input.length === length)) errors.push("length");
	if (url !== void 0 && !URL.canParse(input)) errors.push("url");
	if (includes !== void 0 && !input.includes(includes)) errors.push("includes");
	if (startsWith !== void 0 && !input.startsWith(startsWith)) errors.push("startsWith");
	if (endsWith !== void 0 && !input.endsWith(endsWith)) errors.push("endsWith");
	if (errors.length > 0) return {
		ok: false,
		errors
	};
	return {
		ok: true,
		value: input
	};
};
var numberValidator = ({ gt, min, lt, max, int }) => (input) => {
	const num = Number.parseFloat(input ?? "");
	if (isNaN(num)) return {
		ok: false,
		errors: ["type"]
	};
	const errors = [];
	if (gt !== void 0 && !(num > gt)) errors.push("gt");
	if (min !== void 0 && !(num >= min)) errors.push("min");
	if (lt !== void 0 && !(num < lt)) errors.push("lt");
	if (max !== void 0 && !(num <= max)) errors.push("max");
	if (int !== void 0) {
		const isInt = Number.isInteger(num);
		if (!(int ? isInt : !isInt)) errors.push("int");
	}
	if (errors.length > 0) return {
		ok: false,
		errors
	};
	return {
		ok: true,
		value: num
	};
};
var booleanValidator = (input) => {
	const bool = input === "true" ? true : input === "false" ? false : void 0;
	if (typeof bool !== "boolean") return {
		ok: false,
		errors: ["type"]
	};
	return {
		ok: true,
		value: bool
	};
};
var enumValidator = ({ values }) => (input) => {
	if (!(typeof input === "string" ? values.includes(input) : false)) return {
		ok: false,
		errors: ["type"]
	};
	return {
		ok: true,
		value: input
	};
};
function selectValidator(options) {
	switch (options.type) {
		case "string": return stringValidator(options);
		case "number": return numberValidator(options);
		case "boolean": return booleanValidator;
		case "enum": return enumValidator(options);
	}
}
function validateEnvVariable(value, options) {
	const isOptional = options.optional || options.default !== void 0;
	if (isOptional && value === void 0) return {
		ok: true,
		value: options.default
	};
	if (!isOptional && value === void 0) return {
		ok: false,
		errors: ["missing"]
	};
	return selectValidator(options)(value);
}
//#endregion
//#region \0virtual:astro:env/internal
var schema = {
	"GRAPHQL_URL": {
		"context": "server",
		"access": "secret",
		"default": "http://localhost:4000/",
		"type": "string"
	},
	"GRAPHQL_WS_URL": {
		"context": "server",
		"access": "secret",
		"default": "ws://localhost:4000/subscriptions",
		"type": "string"
	},
	"SSE_MAX_MS": {
		"context": "server",
		"access": "public",
		"default": 0,
		"type": "number"
	}
};
//#endregion
//#region \0astro:env/server
/** @returns {string} */
var getEnv = (key) => {
	return getEnv$1(key);
};
var _internalGetSecret = (key) => {
	const rawVariable = getEnv(key);
	const variable = rawVariable === "" ? void 0 : rawVariable;
	const options = schema[key];
	const result = validateEnvVariable(variable, options);
	if (result.ok) return result.value;
	const type = getEnvFieldType(options);
	throw createInvalidVariablesError(key, type, result);
};
setOnSetGetEnv(() => {
	GRAPHQL_URL = _internalGetSecret("GRAPHQL_URL");
	GRAPHQL_WS_URL = _internalGetSecret("GRAPHQL_WS_URL");
});
var GRAPHQL_URL = _internalGetSecret("GRAPHQL_URL");
var GRAPHQL_WS_URL = _internalGetSecret("GRAPHQL_WS_URL");
//#endregion
//#region src/lib/queries.ts
var OBTENER_MENU = `
  query ObtenerMenu {
    productos { id nombre precio imagen stock }
  }
`;
var OBTENER_PRODUCTO = `
  query ObtenerProducto($id: ID!) {
    producto(id: $id) { id nombre precio imagen stock }
  }
`;
var CAMPOS_PEDIDO = `
  id total status fecha
  metodoPago pagoReferencia pagoUrl pagoExpira
  productos { id nombre precio cantidad }
`;
var CREAR_PEDIDO = `
  mutation CrearPedido($productos: [ID!]!, $metodoPago: String!, $tarjeta: TarjetaInput) {
    crearPedido(productos: $productos, metodoPago: $metodoPago, tarjeta: $tarjeta) {
      id total status metodoPago pagoUrl
    }
  }
`;
var MIS_PEDIDOS = `
  query MisPedidos {
    misPedidos { ${CAMPOS_PEDIDO} }
  }
`;
var OBTENER_PEDIDO = `
  query ObtenerPedido($id: ID!) {
    pedido(id: $id) { ${CAMPOS_PEDIDO} }
  }
`;
var CONFIG_PAGOS = `
  query ConfigPagos {
    configPagos { modo metodos horasParaPagar }
  }
`;
/** Solo funciona con MP_MODO=simulado en el backend. */
var SIMULAR_PAGO = `
  mutation SimularPago($pedidoId: ID!) {
    simularPago(pedidoId: $pedidoId) { id status }
  }
`;
var ME = `
  query Me {
    me { id nombre email rol }
  }
`;
var LOGIN = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) { token }
  }
`;
var REGISTRAR = `
  mutation Registrar($nombre: String!, $email: String!, $password: String!) {
    registrar(nombre: $nombre, email: $email, password: $password) { token }
  }
`;
var ADMIN_RESUMEN = `
  query AdminResumen {
    adminResumen {
      productos sinStock stockBajo clientes clientesSuspendidos
      pedidosPendientes pedidosPagados ventas
    }
  }
`;
var ADMIN_PEDIDOS = `
  query AdminPedidos {
    adminPedidos {
      id total status fecha clienteNombre clienteEmail
      productos { id nombre precio cantidad }
    }
  }
`;
var PEDIDO_PAGADO_SUBSCRIPTION = `
  subscription PedidoPagado {
    pedidoPagado { pedidoId total pagadoEn }
  }
`;
var REGISTRAR_PRESENCIA = `
  mutation RegistrarPresencia {
    registrarPresencia
  }
`;
var USUARIO_PRESENCIA_SUBSCRIPTION = `
  subscription UsuarioPresenciaActualizada {
    usuarioPresenciaActualizada { usuarioId online }
  }
`;
var ADMIN_PRODUCTOS = `
  query AdminProductos {
    adminProductos { id nombre precio imagen stock }
  }
`;
var ADMIN_USUARIOS = `
  query AdminUsuarios($busqueda: String) {
    adminUsuarios(busqueda: $busqueda) {
      id nombre email rol activo creado pedidos totalComprado online
    }
  }
`;
var CREAR_PRODUCTO = `
  mutation CrearProducto($nombre: String!, $precio: Float!, $imagen: String!, $stock: Int) {
    crearProducto(nombre: $nombre, precio: $precio, imagen: $imagen, stock: $stock) { id }
  }
`;
var ACTUALIZAR_PRODUCTO = `
  mutation ActualizarProducto($id: ID!, $nombre: String!, $precio: Float!, $imagen: String!, $stock: Int!) {
    actualizarProducto(id: $id, nombre: $nombre, precio: $precio, imagen: $imagen, stock: $stock) { id }
  }
`;
var AJUSTAR_STOCK = `
  mutation AjustarStock($id: ID!, $cantidad: Int!) {
    ajustarStock(id: $id, cantidad: $cantidad) { id stock }
  }
`;
var ELIMINAR_PRODUCTO = `
  mutation EliminarProducto($id: ID!) {
    eliminarProducto(id: $id)
  }
`;
var ACTUALIZAR_USUARIO = `
  mutation ActualizarUsuario($id: ID!, $nombre: String!, $email: String!) {
    actualizarUsuario(id: $id, nombre: $nombre, email: $email) { id }
  }
`;
var CAMBIAR_ESTADO_USUARIO = `
  mutation CambiarEstadoUsuario($id: ID!, $activo: Boolean!) {
    cambiarEstadoUsuario(id: $id, activo: $activo) { id activo }
  }
`;
var ELIMINAR_USUARIO = `
  mutation EliminarUsuario($id: ID!) {
    eliminarUsuario(id: $id)
  }
`;
//#endregion
export { SIMULAR_PAGO as C, GRAPHQL_WS_URL as E, REGISTRAR_PRESENCIA as S, GRAPHQL_URL as T, OBTENER_MENU as _, ADMIN_RESUMEN as a, PEDIDO_PAGADO_SUBSCRIPTION as b, CAMBIAR_ESTADO_USUARIO as c, CREAR_PRODUCTO as d, ELIMINAR_PRODUCTO as f, MIS_PEDIDOS as g, ME as h, ADMIN_PRODUCTOS as i, CONFIG_PAGOS as l, LOGIN as m, ACTUALIZAR_USUARIO as n, ADMIN_USUARIOS as o, ELIMINAR_USUARIO as p, ADMIN_PEDIDOS as r, AJUSTAR_STOCK as s, ACTUALIZAR_PRODUCTO as t, CREAR_PEDIDO as u, OBTENER_PEDIDO as v, USUARIO_PRESENCIA_SUBSCRIPTION as w, REGISTRAR as x, OBTENER_PRODUCTO as y };
