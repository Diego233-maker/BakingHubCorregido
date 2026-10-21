import { T as GRAPHQL_URL } from "./queries_DPD021At.mjs";
//#region src/lib/graphql.ts
/** Error devuelto por el backend (o por la red) con un código para decidir qué mostrar. */
var ApiError = class extends Error {
	codigo;
	constructor(message, codigo = "INTERNAL") {
		super(message);
		this.codigo = codigo;
	}
};
/** Ejecuta una query/mutation contra el backend GraphQL. Solo se usa en el servidor. */
async function graphql(query, variables = {}, token, timeoutMs = 8e3) {
	let res;
	try {
		res = await fetch(GRAPHQL_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...token ? { Authorization: `Bearer ${token}` } : {}
			},
			body: JSON.stringify({
				query,
				variables
			}),
			signal: AbortSignal.timeout(timeoutMs)
		});
	} catch (error) {
		if (error instanceof Error && error.name === "TimeoutError") throw new ApiError("El pago está tardando más de lo esperado. Revisa “Mis pedidos” antes de volver a intentarlo.", "TIMEOUT");
		throw new ApiError("No se pudo conectar con el servidor", "NETWORK");
	}
	const json = await res.json().catch(() => null);
	if (json?.errors?.length) {
		const [primero] = json.errors;
		throw new ApiError(primero.message, primero.extensions?.code ?? "INTERNAL");
	}
	if (!res.ok || !json?.data) throw new ApiError(`El servidor respondió con el estado ${res.status}`, "HTTP");
	return json.data;
}
//#endregion
export { graphql as n, ApiError as t };
