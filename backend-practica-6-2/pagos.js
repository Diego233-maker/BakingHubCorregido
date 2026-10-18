import 'dotenv/config';
import crypto from 'node:crypto';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

/**
 * Capa de pagos de Baking Hub.
 *
 * Todo lo que habla con Mercado Pago vive en ESTE archivo. El resto del backend (index.js) solo usa
 * las funciones exportadas:
 *
 *   crearCobroMercadoPago()      -> crea el pago (tarjeta, OXXO, SPEI) o la preferencia (billetera)
 *   consultarPagoMercadoPago()   -> consulta el estado real de un pago (webhook y conciliación)
 *   buscarPagosDePedido()        -> busca los pagos de un pedido por external_reference (billetera)
 *   verificarFirmaWebhook()      -> valida la cabecera x-signature de los avisos
 *
 * Tarjeta, OXXO y SPEI usan la API de ORDERS de Mercado Pago (POST /v1/orders), igual que el proyecto de
 * referencia que sí cobra. La billetera de Mercado Pago sigue con Checkout Pro (Preferences).
 *
 * La integración YA está hecha: para usarla basta con llenar el .env (ver .env.example) y poner
 * MP_MODO=real. Mientras MP_MODO=simulado (valor por defecto) NO se llama a Mercado Pago: los pagos se
 * simulan para poder probar todas las pantallas. El modo simulado se rechaza con NODE_ENV=production.
 */

export const METODOS_DISPONIBLES = ['tarjeta', 'oxxo', 'spei', 'mercadopago'];

export const MODO = (process.env.MP_MODO ?? 'simulado').trim().toLowerCase() === 'real' ? 'real' : 'simulado';

/** Métodos que se ofrecen en el checkout. Se pueden recortar con MP_METODOS=tarjeta,oxxo en el .env. */
export const METODOS_ACTIVOS = (process.env.MP_METODOS ?? METODOS_DISPONIBLES.join(','))
  .split(',')
  .map((m) => m.trim().toLowerCase())
  .filter((m) => METODOS_DISPONIBLES.includes(m));

/** Horas que tiene el cliente para pagar en OXXO / SPEI antes de que el pedido expire y se libere el stock. */
export const HORAS_PARA_PAGAR = Number(process.env.PEDIDO_EXPIRA_HORAS) || 72;

const FRONTEND_URL = (process.env.FRONTEND_URL ?? 'http://localhost:4321').replace(/\/$/, '');
const BACKEND_PUBLIC_URL = (process.env.BACKEND_PUBLIC_URL ?? '').replace(/\/$/, '');
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN ?? '';
const MP_TEST_PAYER_EMAIL = process.env.MP_TEST_PAYER_EMAIL?.trim() ?? '';
// URL base de la API de Mercado Pago. Solo se cambia en pruebas automáticas (servidor falso).
const MP_API_URL = (process.env.MP_API_URL ?? 'https://api.mercadopago.com').replace(/\/$/, '');
/** Correo del comprador. En pruebas, MP_TEST_PAYER_EMAIL es opcional: si no se define se usa el del cliente. */
const emailDelPagador = (usuario) => (MP_CREDENCIALES_PRUEBA && MP_TEST_PAYER_EMAIL ? MP_TEST_PAYER_EMAIL : usuario.email);
// ¿Son credenciales de PRUEBA? Mercado Pago ya no las distingue por el prefijo: las de prueba pueden empezar con
// TEST- o con APP_USR-. Si las copiaste de "Pruebas → Credenciales de prueba" y empiezan con APP_USR-,
// pon MP_CREDENCIALES_PRUEBA=true.
const MP_CREDENCIALES_PRUEBA =
  MP_ACCESS_TOKEN.startsWith('TEST-') || ['1', 'true', 'si', 'sí'].includes((process.env.MP_CREDENCIALES_PRUEBA ?? '').trim().toLowerCase());

// En simulado cualquier cliente puede "simular" que pagó (mutation simularPago): jamás en producción.
if (MODO === 'simulado' && process.env.NODE_ENV === 'production') {
  console.error('❌ MP_MODO=simulado no se permite con NODE_ENV=production (cualquiera podría marcar sus pedidos como pagados).');
  console.error('   Usa MP_MODO=real con tus credenciales de Mercado Pago.');
  process.exit(1);
}

if (MODO === 'real') {
  if (!MP_ACCESS_TOKEN) {
    console.error('❌ MP_MODO=real pero falta MP_ACCESS_TOKEN en tu archivo .env');
    process.exit(1);
  }
  if (MP_CREDENCIALES_PRUEBA && !MP_TEST_PAYER_EMAIL) {
    console.warn(
      'ℹ️  Credenciales de prueba sin MP_TEST_PAYER_EMAIL: se cobrará con el correo del cliente. Si Mercado Pago lo rechaza\n' +
        '   (por ejemplo, si es el mismo correo de tu cuenta vendedora), define MP_TEST_PAYER_EMAIL con una cuenta compradora de prueba.'
    );
  }
  console.log(MP_CREDENCIALES_PRUEBA ? '🧪 Mercado Pago: credenciales de PRUEBA.' : '💳 Mercado Pago: credenciales de PRODUCCIÓN (cobros reales).');
  if (BACKEND_PUBLIC_URL && !process.env.MP_WEBHOOK_SECRET) {
    // Sin la clave secreta el webhook rechaza todos los avisos (401) y Mercado Pago los reintenta durante días.
    console.error('❌ Hay BACKEND_PUBLIC_URL pero falta MP_WEBHOOK_SECRET (Tus integraciones → Webhooks → clave secreta).');
    process.exit(1);
  }
  if (!BACKEND_PUBLIC_URL) {
    console.warn(
      '⚠️  Sin BACKEND_PUBLIC_URL no hay webhook: los pagos de OXXO/SPEI se confirmarán por consulta periódica\n' +
        '   a Mercado Pago (cada 5 min). Para confirmación inmediata, pon una URL https pública en BACKEND_PUBLIC_URL.'
    );
  } else if (!BACKEND_PUBLIC_URL.startsWith('https://')) {
    console.warn('⚠️  BACKEND_PUBLIC_URL debería ser https://… (Mercado Pago exige HTTPS para las notificaciones).');
  }
  if (!process.env.MP_WEBHOOK_SECRET) {
    console.warn('⚠️  Falta MP_WEBHOOK_SECRET: se ignorarán los webhooks; la conciliación periódica seguirá consultando pagos pendientes.');
  }
}
const mp = MODO === 'real' ? new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN }) : null;

if (MODO === 'real') {
  console.log(
    '💳 Mercado Pago: token y clave pública deben ser del MISMO entorno (ambas de prueba o ambas de producción).\n' +
      '   Si ves "Unauthorized use of live credentials" (código 7), revisa PASO A PASO la sección de credenciales del README.'
  );
}

// Mercado Pago pide la fecha ISO con zona horaria (México = -06:00).
const fechaMP = (d) => new Date(d.getTime() - 6 * 3600_000).toISOString().replace('Z', '-06:00');
if (METODOS_ACTIVOS.length === 0) {
  console.error('❌ MP_METODOS no contiene ningún método válido. Opciones:', METODOS_DISPONIBLES.join(', '));
  process.exit(1);
}

/**
 * Resultado que devuelve crearCobro().
 * @typedef {Object} ResultadoCobro
 * @property {'pagado'|'pendiente'|'rechazado'} estado
 * @property {string|null} pagoId       Id del pago en Mercado Pago (para cruzarlo en el webhook)
 * @property {string|null} referencia   Referencia para pagar en OXXO o CLABE de SPEI
 * @property {Date|null}   expira       Fecha límite para pagar (solo OXXO / SPEI)
 * @property {string|null} url          OXXO/SPEI: ficha de pago de Mercado Pago · mercadopago: URL a la que redirigir al cliente
 */

const aleatorioNumerico = (digitos) =>
  Array.from(crypto.randomBytes(digitos), (b) => b % 10).join('');

/** Crea el cobro de un pedido con el método elegido. */
export async function crearCobro({ pedido, usuario, metodo, tarjeta }) {
  if (MODO === 'simulado') return crearCobroSimulado({ metodo, tarjeta });
  return crearCobroMercadoPago({ pedido, usuario, metodo, tarjeta });
}

/** Consulta el estado real de una order (ORD…) o de un pago de la billetera. Devuelve { pagoId, estado, pedidoId, monto, moneda }. */
export async function consultarPago(pagoId) {
  if (MODO === 'simulado') throw new Error('consultarPago no se usa en modo simulado');
  return consultarPagoMercadoPago(pagoId);
}

/**
 * Busca en Mercado Pago los pagos hechos para un pedido (por external_reference).
 * Sirve para el pago con la billetera (Checkout Pro), donde el id del pago no se conoce hasta que el cliente paga.
 */
export async function buscarPagosDePedido(pedidoId) {
  if (MODO === 'simulado') return [];
  const res = await new Payment(mp).search({
    options: { external_reference: String(pedidoId), sort: 'date_created', criteria: 'desc', limit: 10 },
  });
  return (res.results ?? []).map(resumenPago);
}

/** Traduce el estado de un pago de Mercado Pago al vocabulario de Baking Hub. */
export function estadoDesdeMercadoPago(status, statusDetail) {
  switch (status) {
    case 'approved':
      return 'pagado';
    case 'pending':
    case 'in_process':
    case 'in_mediation':
    case 'authorized':
      return 'pendiente';
    case 'rejected':
      return 'rechazado';
    case 'cancelled':
      return statusDetail === 'expired' ? 'expirado' : 'cancelado';
    case 'refunded':
    case 'charged_back':
      return 'reembolsado';
    default:
      return 'pendiente';
  }
}

/**
 * Traduce el estado de una ORDER de Mercado Pago (API de Orders) al vocabulario de Baking Hub.
 * status: processed (pagada) · created / action_required (esperando pago en OXXO/SPEI) · failed (rechazada)
 *         canceled · expired · refunded
 */
export function estadoDesdeOrden(status) {
  switch (String(status ?? '').toLowerCase()) {
    case 'processed':
      return 'pagado';
    case 'failed':
      return 'rechazado';
    case 'canceled':
    case 'cancelled':
      return 'cancelado';
    case 'expired':
      return 'expirado';
    case 'refunded':
      return 'reembolsado';
    default: // created, action_required, at_buyer, processing…
      return 'pendiente';
  }
}

/* ------------------------------------------------------------------------------------------------
 * MODO SIMULADO (no llama a Mercado Pago)
 * -----------------------------------------------------------------------------------------------*/

function crearCobroSimulado({ metodo, tarjeta }) {
  const pagoId = `SIM-${crypto.randomUUID().slice(0, 8)}`;
  const expira = new Date(Date.now() + HORAS_PARA_PAGAR * 60 * 60 * 1000);

  switch (metodo) {
    case 'tarjeta':
      // Para probar un rechazo: usa una tarjeta cuyo número termine en 0002.
      if (tarjeta?.token?.endsWith('0002')) return { estado: 'rechazado', pagoId, referencia: null, expira: null, url: null };
      return { estado: 'pagado', pagoId, referencia: null, expira: null, url: null };
    case 'oxxo':
      return { estado: 'pendiente', pagoId, referencia: aleatorioNumerico(14), expira, url: null };
    case 'spei':
      return { estado: 'pendiente', pagoId, referencia: aleatorioNumerico(18), expira, url: null };
    case 'mercadopago':
      return { estado: 'pagado', pagoId, referencia: null, expira: null, url: null };
    default:
      throw new Error(`Método de pago desconocido: ${metodo}`);
  }
}

/* ------------------------------------------------------------------------------------------------
 * MODO REAL
 * -----------------------------------------------------------------------------------------------*/

/**
 * Crea el cobro en Mercado Pago (API de Orders para tarjeta/OXXO/SPEI, Preferences para la billetera).
 *
 * Datos que recibe:
 *   pedido  -> { id, total }            (total en pesos; usa Number(pedido.total))
 *   usuario -> { id, nombre, email }    (el pagador)
 *   metodo  -> 'tarjeta' | 'oxxo' | 'spei' | 'mercadopago'
 *   tarjeta -> { token, paymentMethodId, issuerId, cuotas }   (solo en 'tarjeta'; el token lo genera el navegador)
 *
 * Qué se manda a Mercado Pago (API de Orders, POST /v1/orders):
 *
 *   { type: 'online', processing_mode: 'automatic', total_amount: '123.00', external_reference: String(pedido.id),
 *     payer: { email, first_name, last_name },
 *     transactions: { payments: [{ amount: '123.00', payment_method }] },
 *     expiration_time: 'P3D' }            <- solo OXXO / SPEI
 *
 *   payment_method según el método:
 *     tarjeta: { id: 'visa', type: 'credit_card' | 'debit_card', token, installments }
 *     oxxo:    { id: 'oxxo',  type: 'ticket' }
 *     spei:    { id: 'clabe', type: 'bank_transfer' }
 *
 *   mercadopago (billetera / Checkout Pro): new Preference(mp).create({ body: { items, payer, external_reference,
 *               notification_url, back_urls: { success/pending/failure: `${FRONTEND_URL}/pedidos/${pedido.id}` },
 *               auto_return: 'approved' } })  -> redirige al cliente a `init_point`.
 *
 * Qué devolver (ver ResultadoCobro arriba):
 *   estado      <- estadoDesdeOrden(orden.status)   ('processed' => 'pagado', 'failed' => 'rechazado', etc.)
 *   pagoId      <- orden.id  (empieza con "ORD"; es lo que llega en el webhook)
 *   referencia  <- orden.transactions.payments[0].payment_method.reference  (OXXO: referencia · SPEI: CLABE)
 *   expira      <- orden.transactions.payments[0].date_of_expiration
 *   url         <- OXXO/SPEI: payment_method.ticket_url  ·  mercadopago: preference.init_point
 *
 * Si Mercado Pago responde con error, lanza una excepción: index.js cancela el pedido y libera el stock.
 */
// eslint-disable-next-line no-unused-vars
async function crearCobroMercadoPago({ pedido, usuario, metodo, tarjeta }) {
  const monto = Number(pedido.total);
  const notification_url = BACKEND_PUBLIC_URL ? `${BACKEND_PUBLIC_URL}/webhooks/mercadopago` : undefined;
  const [nombre, ...resto] = usuario.nombre.trim().split(/\s+/);
  const requestOptions = { idempotencyKey: `pedido-${pedido.id}-${metodo}`, timeout: 12_000, retries: 1 };

  // Billetera de Mercado Pago: se crea una preferencia y se redirige al cliente a init_point.
  if (metodo === 'mercadopago') {
    const expira = new Date(Date.now() + 2 * 3600_000); // el stock se libera si abandona el pago
    const bodyPref = {
      items: [{ id: String(pedido.id), title: `Pedido #${pedido.id} - Baking Hub`, quantity: 1, unit_price: monto, currency_id: 'MXN' }],
      payer: { email: MP_CREDENCIALES_PRUEBA ? MP_TEST_PAYER_EMAIL : usuario.email },
      external_reference: String(pedido.id),
      notification_url,
      back_urls: {
        success: `${FRONTEND_URL}/pedidos/${pedido.id}?nuevo=1`,
        pending: `${FRONTEND_URL}/pedidos/${pedido.id}?nuevo=1`,
        failure: `${FRONTEND_URL}/pedidos/${pedido.id}`,
      },
      ...(FRONTEND_URL.startsWith('https://') ? { auto_return: 'approved' } : {}),
      expires: true,
      expiration_date_to: fechaMP(expira),
    };
    const pref = await llamarMP(() => new Preference(mp).create({ body: bodyPref, requestOptions }), { metodo, body: bodyPref, requestOptions });
    return { estado: 'pendiente', pagoId: null, referencia: null, expira, url: pref.init_point };
  }

  // Tarjeta, OXXO y SPEI: API de Orders (POST /v1/orders).
  const total = monto.toFixed(2); // Orders pide los montos como texto con 2 decimales
  const body = {
    type: 'online',
    processing_mode: 'automatic',
    total_amount: total,
    description: `Pedido #${pedido.id} - Baking Hub`,
    external_reference: String(pedido.id), // así el webhook sabe a qué pedido pertenece
    payer: {
      email: emailDelPagador(usuario),
      first_name: nombre,
      last_name: resto.join(' ') || nombre,
    },
    transactions: { payments: [{ amount: total, payment_method: metodoDePagoOrden(metodo, tarjeta) }] },
  };
  // Las fichas de OXXO y SPEI vencen; la tarjeta se cobra al momento.
  if (metodo !== 'tarjeta') body.expiration_time = duracionISO(HORAS_PARA_PAGAR);

  const orden = await llamarOrders({ metodo, method: 'POST', path: '/v1/orders', body, idempotencyKey: requestOptions.idempotencyKey });
  if (process.env.MP_DEBUG === '1') console.log('MP_DEBUG respuesta de la order:', JSON.stringify(orden, null, 2));
  return resultadoDeOrden(orden, metodo);
}

/** Traduce el motivo de rechazo de Mercado Pago (status_detail) a un mensaje para el cliente. */
export function explicarRechazo(motivo) {
  const m = String(motivo ?? '').toLowerCase();
  const pista = MP_CREDENCIALES_PRUEBA ? ' (Modo de prueba: usa una tarjeta de prueba de Mercado Pago y escribe APRO como titular.)' : '';
  if (m.includes('card_token')) {
    return 'No pudimos validar tu tarjeta. Vuelve a escribir los datos e inténtalo de nuevo.' + (MP_CREDENCIALES_PRUEBA ? ' (Si se repite: la clave pública del frontend y el Access Token del backend deben ser de la misma aplicación y del mismo entorno.)' : '');
  }
  if (m.includes('insufficient')) return 'Tu tarjeta no tiene fondos suficientes. Prueba con otra tarjeta u otro método de pago.' + pista;
  if (m.includes('security_code') || m.includes('cvv')) return 'El código de seguridad (CVV) no es correcto. Revísalo e inténtalo de nuevo.';
  if (m.includes('card_number')) return 'El número de la tarjeta no es válido. Revísalo e inténtalo de nuevo.';
  if (m.includes('date') || m.includes('expir')) return 'La fecha de vencimiento no es correcta. Revísala e inténtalo de nuevo.';
  if (m.includes('call_for_authorize')) return 'Tu banco necesita que autorices este pago. Llámalos o prueba con otra tarjeta.';
  if (m.includes('blacklist') || m.includes('high_risk') || m.includes('fraud')) return 'No pudimos aprobar este pago por seguridad. Prueba con otro método de pago.';
  if (m.includes('max_attempts')) return 'Superaste los intentos permitidos con esta tarjeta. Prueba con otra tarjeta u otro método.';
  if (m.includes('duplicated')) return 'Ya enviaste un pago igual hace unos instantes. Espera unos minutos antes de reintentar.';
  if (m.includes('bad_filled') || m.includes('invalid')) return 'Algún dato de la tarjeta no es correcto. Revísalos e inténtalo de nuevo.';
  return 'El banco rechazó el pago. Revisa los datos o prueba con otra tarjeta u otro método de pago.' + pista;
}

/** Duración ISO 8601 para expiration_time: 72 h => "P3D". */
function duracionISO(horas) {
  return horas % 24 === 0 ? `P${horas / 24}D` : `PT${horas}H`;
}

/** payment_method de la order según el método elegido. */
function metodoDePagoOrden(metodo, tarjeta) {
  switch (metodo) {
    case 'tarjeta': {
      const tipos = ['credit_card', 'debit_card', 'prepaid_card'];
      return {
        id: tarjeta.paymentMethodId,
        type: tipos.includes(tarjeta.paymentTypeId) ? tarjeta.paymentTypeId : 'credit_card',
        token: tarjeta.token,
        installments: tarjeta.cuotas ?? 1,
      };
    }
    case 'spei':
      return { id: 'clabe', type: 'bank_transfer' };
    case 'oxxo':
      return { id: 'oxxo', type: 'ticket' };
    default:
      throw new Error(`Método de pago desconocido: ${metodo}`);
  }
}

/** Convierte la order de Mercado Pago en el ResultadoCobro que usa index.js. */
function resultadoDeOrden(orden, metodo) {
  const pago = orden?.transactions?.payments?.[0] ?? {};
  const pm = pago.payment_method ?? {};
  const estado = estadoDesdeOrden(orden?.status);
  const venceHoras = metodo === 'tarjeta' ? null : HORAS_PARA_PAGAR;
  return {
    estado: estado === 'pagado' || estado === 'pendiente' ? estado : 'rechazado',
    motivo: estado === 'rechazado' ? (orden?.status_detail ?? null) : null,
    pagoId: orden?.id ? String(orden.id) : null,
    referencia: pm.reference ?? null,
    expira: pago.date_of_expiration
      ? new Date(pago.date_of_expiration)
      : venceHoras
        ? new Date(Date.now() + venceHoras * 3600_000)
        : null,
    url: pm.ticket_url ?? null,
  };
}

/**
 * Llamada HTTP a la API de Orders. Un 402 (pago rechazado) NO es un error del sistema: Mercado Pago devuelve la
 * order con el motivo y aquí se convierte en una order "failed". Cualquier otro fallo lanza una excepción con
 * error.status, para que index.js cancele el pedido y libere el stock.
 */
async function llamarOrders({ metodo, method, path, body, idempotencyKey }) {
  const res = await fetch(MP_API_URL + path, {
    method,
    headers: {
      Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15_000),
  });
  const texto = await res.text();
  let json = null;
  try {
    json = texto ? JSON.parse(texto) : null;
  } catch {
    json = null;
  }
  if (res.ok) return json;

  if (res.status === 402 && json) {
    const orden = json.data && typeof json.data === 'object' ? json.data : json;
    // La order solo dice "failed"; el motivo real viene en el pago (transactions.payments[0].status_detail) o en errors[].
    const candidatos = [
      orden.transactions?.payments?.[0]?.status_detail,
      json.errors?.[0]?.code,
      json.errors?.[0]?.message,
      orden.status_detail,
    ].filter((x) => typeof x === 'string' && x && x !== 'failed');
    const detalle = candidatos[0] ?? 'failed';
    console.warn(`Mercado Pago rechazó el pago (402): ${detalle}`);
    if (String(detalle).includes('card_token')) {
      console.warn(
        '   💡 invalid_card_token: el token de la tarjeta no es válido para este Access Token. Causas habituales:\n' +
          '      1) PUBLIC_MP_PUBLIC_KEY (Netlify) y MP_ACCESS_TOKEN (Render) son de aplicaciones o entornos distintos (prueba vs producción).\n' +
          '      2) El frontend publicado se compiló con otra clave pública: tras cambiarla hay que volver a desplegar Netlify.\n' +
          '      3) El token ya se usó o venció (cada token sirve una sola vez).'
      );
    }
    console.warn('   Respuesta completa de Mercado Pago:', JSON.stringify(json, (k, v) => (k === 'token' ? '***' : v)).slice(0, 1500));
    return { ...orden, status: 'failed', status_detail: detalle };
  }

  const causas = Array.isArray(json?.errors) ? json.errors : [];
  console.error(`❌ Error de Mercado Pago (status ${res.status}) en ${method} ${path}:`, texto.slice(0, 800));
  if (body) {
    console.error('   Método:', metodo ?? '?');
    console.error('   Body enviado:', JSON.stringify(body, (k, v) => (k === 'token' ? '***' : v), 2));
    console.error('   Idempotency key:', idempotencyKey ?? '-');
  }
  const error = new Error(`Mercado Pago rechazó la solicitud (${res.status})`);
  error.status = res.status;
  error.cause = causas;
  error.error = json;
  throw error;
}

/**
 * Ejecuta una llamada a Mercado Pago y, si falla, imprime un diagnóstico legible (status, código y causas)
 * antes de relanzar el error. Así el log dice QUÉ revisar en vez de solo "MPAuthenticationError".
 */
async function llamarMP(fn, contexto = {}) {
  try {
    return await fn();
  } catch (error) {
    const causas = Array.isArray(error?.cause) ? error.cause : Array.isArray(error?.causes) ? error.causes : [];
    const codigos = causas.map((c) => c?.code);
    if (error?.status === 401 && codigos.includes(7)) {
      console.error(
        '❌ Mercado Pago rechazó las credenciales (401 / código 7: "Unauthorized use of live credentials").\n' +
          '   Causas habituales:\n' +
          '   1) Usas credenciales de PRODUCCIÓN pero tu aplicación aún no está activada para producción\n' +
          '      (Tus integraciones → tu app → Credenciales de producción → completar y activar).\n' +
          '   2) Usas credenciales de producción con un comprador/tarjeta de PRUEBA, o credenciales de prueba mezcladas\n' +
          '      con las de producción (MP_ACCESS_TOKEN y PUBLIC_MP_PUBLIC_KEY deben ser del mismo entorno).\n' +
          '   3) El comprador usa el mismo correo/cuenta que el vendedor dueño de las credenciales.'
      );
    } else {
      console.error(`❌ Error de Mercado Pago (status ${error?.status ?? '?'}):`, JSON.stringify(causas.length ? causas : error?.message));
    }
    // Diagnóstico extra: qué método falló y qué se envió (sin el token de la tarjeta).
    console.error('   Método:', contexto.metodo ?? '?');
    console.error('   Body enviado:', JSON.stringify(ocultarSecretos(contexto.body), null, 2));
    console.error('   Idempotency key:', contexto.requestOptions?.idempotencyKey ?? '-');
    console.error('   Respuesta de MP:', JSON.stringify({ status: error?.status, message: error?.message, error: error?.error, causes: causas }));
    throw error;
  }
}

/** Copia del body para el log: el token de la tarjeta nunca se imprime. */
function ocultarSecretos(body) {
  if (!body || typeof body !== 'object') return body;
  const copia = { ...body };
  if (copia.token) copia.token = '***';
  return copia;
}

/** Reduce un pago de Mercado Pago a los datos que usa Baking Hub. */
function resumenPago(pago) {
  const pedidoId = Number(pago.external_reference);
  return {
    pagoId: String(pago.id),
    estado: estadoDesdeMercadoPago(pago.status, pago.status_detail),
    pedidoId: Number.isInteger(pedidoId) && pedidoId > 0 ? pedidoId : null,
    monto: Number(pago.transaction_amount),
    moneda: pago.currency_id ?? null,
  };
}

/** Reduce una order de Mercado Pago a los datos que usa Baking Hub. */
function resumenOrden(orden) {
  const pedidoId = Number(orden?.external_reference);
  return {
    pagoId: String(orden?.id ?? ''),
    estado: estadoDesdeOrden(orden?.status),
    pedidoId: Number.isInteger(pedidoId) && pedidoId > 0 ? pedidoId : null,
    monto: Number(orden?.total_amount),
    moneda: null, // la order es siempre en la moneda de la cuenta (MXN); no viene como campo
  };
}

async function consultarPagoMercadoPago(pagoId) {
  // Los ids de la API de Orders empiezan con "ORD"; los de la billetera (Checkout Pro) son numéricos.
  if (/^ORD/i.test(String(pagoId))) {
    const orden = await llamarOrders({ method: 'GET', path: `/v1/orders/${encodeURIComponent(pagoId)}` });
    return resumenOrden(orden);
  }
  return resumenPago(await new Payment(mp).get({ id: pagoId }));
}

/**
 * Valida la firma que Mercado Pago pone en cada notificación (cabecera x-signature) para asegurar que
 * el aviso realmente viene de ellos. Necesita MP_WEBHOOK_SECRET (Tus integraciones -> Webhooks -> clave secreta).
 * Ya está implementado; solo confirma en la documentación de Mercado Pago que el formato no haya cambiado.
 */
export function verificarFirmaWebhook(req) {
  const secreto = process.env.MP_WEBHOOK_SECRET;
  if (!secreto) {
    console.error('Webhook rechazado: falta MP_WEBHOOK_SECRET en el .env');
    return false;
  }
  const firma = String(req.get('x-signature') ?? '');
  const requestId = String(req.get('x-request-id') ?? '');
  const partes = Object.fromEntries(
    firma.split(',').map((p) => {
      const [k, ...v] = p.trim().split('=');
      return [k, v.join('=')];
    }),
  );
  const { ts, v1 } = partes;
  if (!ts || !v1) return false;

  // Plantilla oficial: "id:[data.id];request-id:[x-request-id];ts:[ts];". El id va en minúsculas y,
  // según la documentación, si algún valor no viene en el aviso se quita ese segmento del manifiesto.
  const dataId = idDeNotificacion(req).toLowerCase();
  const manifiesto = [dataId && `id:${dataId};`, requestId && `request-id:${requestId};`, `ts:${ts};`].filter(Boolean).join('');
  const esperado = crypto.createHmac('sha256', secreto).update(manifiesto).digest('hex');

  const a = Buffer.from(esperado);
  const b = Buffer.from(v1);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Id del recurso del aviso. Se lee SIEMPRE de la query (?data.id=…), que es lo que Mercado Pago firma;
 * el cuerpo solo se usa si la query no lo trae. Se usa tanto para verificar la firma como para procesar
 * el aviso, así no se puede firmar un id y procesar otro.
 */
export function idDeNotificacion(req) {
  return String(req.query?.['data.id'] ?? req.body?.data?.id ?? '');
}

export { FRONTEND_URL, BACKEND_PUBLIC_URL };