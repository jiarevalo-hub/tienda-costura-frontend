import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CLAVE_PEDIDOS_STORAGE = 'pedidos_taller_costura_v1';
const API_CLIENTES_URL = 'https://tienda-costura-backend.onrender.com/api/clientes';

const ESTADOS_PEDIDO = [
  {
    id: 'Recibido en taller',
    paso: 1,
    icono: '🟡',
    colorBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    descripcion: 'Tu prenda fue recibida y registrada en nuestro taller.',
  },
  {
    id: 'En proceso de costura',
    paso: 2,
    icono: '🔵',
    colorBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    descripcion: 'Estamos trabajando en los ajustes, corte o confección de tu prenda.',
  },
  {
    id: 'Listo para retirar',
    paso: 3,
    icono: '🟢',
    colorBadge: 'bg-green-50 text-green-700 border-green-300',
    descripcion: '¡Tu prenda está lista y planchada! Ya puedes pasar a retirarla.',
  },
  {
    id: 'Entregado',
    paso: 4,
    icono: '✅',
    colorBadge: 'bg-gray-100 text-gray-700 border-gray-300',
    descripcion: 'Pedido entregado al cliente. ¡Gracias por tu preferencia!',
  },
];

const PEDIDOS_DEMO = [
  {
    id: 101,
    codigo: 'ORD-101',
    clienteNombre: 'María Gómez',
    clienteTelefono: '0997447443',
    prenda: 'Vestido de fiesta azul (Entalle y basta invisible)',
    estado: 'Listo para retirar',
    fechaIngreso: '2026-11-17',
    fechaEntrega: '2026-11-19',
    total: 18.0,
    abono: 10.0,
    notas: 'Basta a 2 cm del tacón.',
  },
  {
    id: 102,
    codigo: 'ORD-102',
    clienteNombre: 'Carlos Andrade',
    clienteTelefono: '0987654321',
    prenda: 'Terno gris (Ajuste de mangas y cintura)',
    estado: 'En proceso de costura',
    fechaIngreso: '2026-11-18',
    fechaEntrega: '2026-11-21',
    total: 25.0,
    abono: 15.0,
    notas: 'Conservar botones originales.',
  },
];

// Convierte números locales (ej: 0991234567) a formato internacional de WhatsApp (593991234567)
function formatearTelefonoWhatsApp(telefono = '') {
  const limpio = telefono.replace(/\D/g, '');
  if (!limpio) return '';
  if (limpio.startsWith('09') && limpio.length === 10) {
    return `593${limpio.slice(1)}`;
  }
  if (limpio.length === 9 && limpio.startsWith('9')) {
    return `593${limpio}`;
  }
  return limpio;
}

export default function Seguimiento({ esAdmin, nombreTienda = 'Taller de Costura', whatsappTaller = '593997447443' }) {
  const [pedidos, setPedidos] = useState(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_PEDIDOS_STORAGE);
      return guardado ? JSON.parse(guardado) : PEDIDOS_DEMO;
    } catch {
      return PEDIDOS_DEMO;
    }
  });

  const [clientesRegistrados, setClientesRegistrados] = useState([]);
  const [consultaCliente, setConsultaCliente] = useState('');
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [pedidoEditandoId, setPedidoEditandoId] = useState(null);
  const [notificarAlGuardar, setNotificarAlGuardar] = useState(true);

  const [formPedido, setFormPedido] = useState({
    clienteNombre: '',
    clienteTelefono: '',
    prenda: '',
    estado: 'Recibido en taller',
    fechaEntrega: '',
    total: '',
    abono: '',
    notas: '',
  });

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_PEDIDOS_STORAGE, JSON.stringify(pedidos));
    } catch (e) {
      console.error('Error al guardar pedidos:', e);
    }
  }, [pedidos]);

  useEffect(() => {
    if (esAdmin) {
      axios
        .get(API_CLIENTES_URL)
        .then((res) => setClientesRegistrados(res.data || []))
        .catch(() => {});
    }
  }, [esAdmin]);

  // Envía notificación por WhatsApp al cliente según el estado del pedido
  const notificarClientePorWhatsApp = (pedido, estadoPersonalizado) => {
    const estadoActual = estadoPersonalizado || pedido.estado;
    const telWhatsApp = formatearTelefonoWhatsApp(pedido.clienteTelefono);

    if (!telWhatsApp) {
      alert('Este pedido no tiene un número de teléfono registrado para enviar WhatsApp.');
      return;
    }

    const totalNum = Number(pedido.total || 0);
    const abonoNum = Number(pedido.abono || 0);
    const saldo = Math.max(0, totalNum - abonoNum).toFixed(2);

    let mensaje = '';
    if (estadoActual === 'Listo para retirar') {
      mensaje =
        `¡Hola *${pedido.clienteNombre}*! ✂️✨\n\n` +
        `Te saludamos de *${nombreTienda}*. Te informamos que tu pedido:\n` +
        `📦 *Orden:* ${pedido.codigo}\n` +
        `👗 *Prenda / Trabajo:* ${pedido.prenda}\n\n` +
        `Ya se encuentra *¡LISTO PARA RETIRAR!* 🟢\n` +
        `💰 *Total:* $${totalNum.toFixed(2)} | *Abono:* $${abonoNum.toFixed(2)} | *Saldo pendiente:* $${saldo}\n\n` +
        `Puedes pasar a retirarlo en nuestro horario de atención. ¡Te esperamos!`;
    } else if (estadoActual === 'Recibido en taller') {
      mensaje =
        `¡Hola *${pedido.clienteNombre}*! ✂️\n\n` +
        `Hemos registrado tu prenda en *${nombreTienda}*:\n` +
        `📦 *Código de seguimiento:* ${pedido.codigo}\n` +
        `👗 *Prenda / Trabajo:* ${pedido.prenda}\n` +
        `📅 *Fecha estimada:* ${pedido.fechaEntrega || 'Por confirmar'}\n` +
        `💰 *Total:* $${totalNum.toFixed(2)} (Abono: $${abonoNum.toFixed(2)} | Saldo: $${saldo})\n\n` +
        `Te avisaremos por este medio apenas esté lista para retirar.`;
    } else {
      mensaje =
        `¡Hola *${pedido.clienteNombre}*! ✂️\n\n` +
        `Te informamos desde *${nombreTienda}* que el estado de tu orden *${pedido.codigo}* (*${pedido.prenda}*) se actualizó a:\n` +
        `👉 *${estadoActual}*\n\n` +
        `Cualquier consulta estamos a las órdenes.`;
    }

    const url = `https://wa.me/${telWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  // Cambiar rápidamente el estado desde la tabla del Admin
  const cambiarEstadoRapido = (pedido, nuevoEstado) => {
    const actualizados = pedidos.map((p) =>
      p.id === pedido.id ? { ...p, estado: nuevoEstado } : p
    );
    setPedidos(actualizados);

    // Si pasa a "Listo para retirar", enviamos la notificación por WhatsApp automáticamente
    if (nuevoEstado === 'Listo para retirar') {
      const confirmar = window.confirm(
        `¡El pedido ${pedido.codigo} de ${pedido.clienteNombre} pasó a "Listo para retirar"!\n\n¿Deseas enviarle ahora mismo la notificación por WhatsApp al ${pedido.clienteTelefono}?`
      );
      if (confirmar) {
        notificarClientePorWhatsApp({ ...pedido, estado: nuevoEstado }, 'Listo para retirar');
      }
    }
  };

  // Guardar nuevo pedido o actualizar existente (Admin)
  const guardarPedidoAdmin = (e) => {
    e.preventDefault();
    const hoy = new Date().toISOString().split('T')[0];

    if (pedidoEditandoId) {
      const pedidoAnterior = pedidos.find((p) => p.id === pedidoEditandoId);
      const pedidoActualizado = {
        ...pedidoAnterior,
        ...formPedido,
        total: Number(formPedido.total || 0),
        abono: Number(formPedido.abono || 0),
      };

      setPedidos(
        pedidos.map((p) => (p.id === pedidoEditandoId ? pedidoActualizado : p))
      );
      setPedidoEditandoId(null);

      if (
        notificarAlGuardar &&
        pedidoActualizado.estado === 'Listo para retirar'
      ) {
        notificarClientePorWhatsApp(pedidoActualizado, 'Listo para retirar');
      }
    } else {
      const nuevoId =
        pedidos.length > 0 ? Math.max(...pedidos.map((p) => p.id)) + 1 : 101;
      const nuevoPedido = {
        id: nuevoId,
        codigo: `ORD-${nuevoId}`,
        clienteNombre: formPedido.clienteNombre,
        clienteTelefono: formPedido.clienteTelefono,
        prenda: formPedido.prenda,
        estado: formPedido.estado,
        fechaIngreso: hoy,
        fechaEntrega: formPedido.fechaEntrega,
        total: Number(formPedido.total || 0),
        abono: Number(formPedido.abono || 0),
        notas: formPedido.notas,
      };

      setPedidos([nuevoPedido, ...pedidos]);

      if (notificarAlGuardar && nuevoPedido.estado === 'Listo para retirar') {
        notificarClientePorWhatsApp(nuevoPedido, 'Listo para retirar');
      }
    }

    setFormPedido({
      clienteNombre: '',
      clienteTelefono: '',
      prenda: '',
      estado: 'Recibido en taller',
      fechaEntrega: '',
      total: '',
      abono: '',
      notas: '',
    });
  };

  const eliminarPedido = (id, codigo) => {
    if (!window.confirm(`¿Eliminar la orden ${codigo}?`)) return;
    setPedidos(pedidos.filter((p) => p.id !== id));
  };

  // Filtrar pedidos para el buscador del cliente
  const termino = consultaCliente.trim().toLowerCase();
  const pedidosEncontrados = termino
    ? pedidos.filter(
        (p) =>
          p.codigo.toLowerCase().includes(termino) ||
          p.clienteTelefono.replace(/\D/g, '').includes(termino.replace(/\D/g, '') || '___') ||
          p.clienteNombre.toLowerCase().includes(termino)
      )
    : [];

  const obtenerPasoEstado = (nombreEstado) => {
    const encontrado = ESTADOS_PEDIDO.find((e) => e.id === nombreEstado);
    return encontrado ? encontrado.paso : 1;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 font-sans">
      {/* Encabezado */}
      <div className="text-center mb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-[#b38f48] font-semibold">
          Consulta en Línea
        </span>
        <h1 className="text-2xl sm:text-4xl font-light text-gray-800 mt-2 tracking-wide">
          Seguimiento de tu Prenda o Pedido
        </h1>
        <div className="w-16 h-0.5 bg-[#c8a45d] mx-auto mt-4 mb-4" />
        <p className="text-gray-600 max-w-xl mx-auto text-sm">
          Ingresa tu <b>número de teléfono</b>, tu <b>código de orden</b> (ej.{' '}
          <code>ORD-101</code>) o tu <b>nombre</b> para conocer el estado actual de tu prenda.
        </p>
      </div>

      {/* Buscador para el Cliente */}
      <div className="max-w-xl mx-auto mb-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setBusquedaRealizada(true);
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <input
            type="text"
            value={consultaCliente}
            onChange={(e) => {
              setConsultaCliente(e.target.value);
              setBusquedaRealizada(true);
            }}
            placeholder="Ej: 0997447443, ORD-101 o María Gómez..."
            className="flex-1 p-3 bg-white border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d] shadow-2xs"
          />
          <button
            type="submit"
            className="bg-[#c8a45d] hover:bg-[#b59049] text-white px-6 py-3 rounded-xs text-xs uppercase tracking-[0.16em] font-semibold transition cursor-pointer"
          >
            🔍 Consultar Estado
          </button>
        </form>
      </div>

      {/* Resultados de seguimiento para el Cliente */}
      {busquedaRealizada && termino && (
        <div className="mb-14">
          {pedidosEncontrados.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-sm p-8 text-center max-w-xl mx-auto">
              <p className="text-gray-600 text-sm mb-2">
                No encontramos una orden con <b>"{consultaCliente}"</b>.
              </p>
              <p className="text-xs text-gray-400">
                Verifica tu código de orden o escríbenos por WhatsApp para ayudarte.
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {pedidosEncontrados.map((pedido) => {
                const pasoActual = obtenerPasoEstado(pedido.estado);
                const infoEstado =
                  ESTADOS_PEDIDO.find((e) => e.id === pedido.estado) ||
                  ESTADOS_PEDIDO[0];
                const saldo = Math.max(
                  0,
                  Number(pedido.total || 0) - Number(pedido.abono || 0)
                ).toFixed(2);

                return (
                  <div
                    key={pedido.id}
                    className="bg-white border border-gray-200 rounded-sm shadow-xs p-6 sm:p-8"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-6">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-[#a37f38] font-semibold">
                          Orden {pedido.codigo}
                        </span>
                        <h3 className="text-xl font-medium text-gray-900 mt-0.5">
                          {pedido.prenda}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Cliente: <b>{pedido.clienteNombre}</b>
                        </p>
                      </div>

                      <span
                        className={`text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-xs border ${infoEstado.colorBadge}`}
                      >
                        {infoEstado.icono} {pedido.estado}
                      </span>
                    </div>

                    {/* Barra de progreso visual paso a paso */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
                      {ESTADOS_PEDIDO.map((est) => {
                        const completado = pasoActual >= est.paso;
                        const esActual = pasoActual === est.paso;
                        return (
                          <div
                            key={est.id}
                            className={`p-3 rounded-xs border text-center transition ${
                              esActual
                                ? 'border-[#c8a45d] bg-[#f9f5ec]'
                                : completado
                                ? 'border-green-200 bg-green-50/40'
                                : 'border-gray-200 bg-gray-50 opacity-50'
                            }`}
                          >
                            <div className="text-lg mb-1">{est.icono}</div>
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-800">
                              {est.id}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mensaje destacado cuando está Listo para retirar */}
                    <div
                      className={`p-4 rounded-xs text-sm mb-6 ${
                        pedido.estado === 'Listo para retirar'
                          ? 'bg-green-50 border border-green-200 text-green-800 font-medium'
                          : 'bg-[#faf9f6] border border-gray-200 text-gray-700'
                      }`}
                    >
                      {infoEstado.icono} {infoEstado.descripcion}
                    </div>

                    {/* Resumen de fechas y valores */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-[#faf9f6] p-4 rounded-xs border border-gray-100">
                      <div>
                        <span className="text-gray-400 block uppercase">
                          Fecha Ingreso
                        </span>
                        <span className="font-semibold text-gray-800">
                          {pedido.fechaIngreso || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block uppercase">
                          Entrega Estimada
                        </span>
                        <span className="font-semibold text-gray-800">
                          {pedido.fechaEntrega || 'Por confirmar'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block uppercase">
                          Total / Abono
                        </span>
                        <span className="font-semibold text-gray-800">
                          ${Number(pedido.total || 0).toFixed(2)} / $
                          {Number(pedido.abono || 0).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block uppercase">
                          Saldo a Pagar
                        </span>
                        <span className="font-bold text-[#a37f38] text-sm">
                          ${saldo}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                      <a
                        href={`https://wa.me/${whatsappTaller}?text=${encodeURIComponent(
                          `¡Hola! Consulto por mi orden ${pedido.codigo} (${pedido.prenda}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs uppercase tracking-wider text-[#25D366] font-semibold hover:underline"
                      >
                        💬 Consultar sobre mi prenda por WhatsApp →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================== PANEL DE ADMINISTRADOR DE PEDIDOS ==================== */}
      {esAdmin && (
        <div className="border-t-2 border-[#e8dfd1] pt-10 mt-8">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-[0.2em] text-[#b38f48] font-semibold">
              Panel exclusivo de Administrador
            </span>
            <h2 className="text-2xl font-light text-gray-800 mt-1">
              🛠️ Gestión de Órdenes y Notificación por WhatsApp
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Cuando cambies el estado de un pedido a <b>"🟢 Listo para retirar"</b>, se abrirá WhatsApp automáticamente con el mensaje listo para notificar al cliente.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario para Crear / Editar Orden de Trabajo */}
            <div className="bg-white p-6 rounded-sm border border-[#e8dfd1] shadow-2xs h-fit">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800">
                  {pedidoEditandoId
                    ? `✏️ Editando Orden #${pedidoEditandoId}`
                    : '➕ Nueva Orden de Trabajo'}
                </h3>
                {pedidoEditandoId && (
                  <button
                    type="button"
                    onClick={() => {
                      setPedidoEditandoId(null);
                      setFormPedido({
                        clienteNombre: '',
                        clienteTelefono: '',
                        prenda: '',
                        estado: 'Recibido en taller',
                        fechaEntrega: '',
                        total: '',
                        abono: '',
                        notas: '',
                      });
                    }}
                    className="text-xs text-gray-500 hover:text-gray-800 underline cursor-pointer"
                  >
                    Cancelar
                  </button>
                )}
              </div>

              {/* Selector rápido de cliente registrado */}
              {clientesRegistrados.length > 0 && !pedidoEditandoId && (
                <div className="mb-4">
                  <label className="block text-[11px] uppercase tracking-wider text-[#a37f38] font-semibold mb-1">
                    Autocompletar con cliente registrado (opcional):
                  </label>
                  <select
                    onChange={(e) => {
                      const cl = clientesRegistrados.find(
                        (c) => String(c.id) === e.target.value
                      );
                      if (cl) {
                        setFormPedido((prev) => ({
                          ...prev,
                          clienteNombre: cl.nombre || '',
                          clienteTelefono: cl.telefono || '',
                        }));
                      }
                    }}
                    defaultValue=""
                    className="w-full p-2 border border-gray-300 rounded-xs text-xs bg-[#faf9f6]"
                  >
                    <option value="">-- Seleccionar cliente --</option>
                    {clientesRegistrados.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} ({c.telefono || 'Sin tel.'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <form onSubmit={guardarPedidoAdmin} className="space-y-3.5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPedido.clienteNombre}
                    onChange={(e) =>
                      setFormPedido({
                        ...formPedido,
                        clienteNombre: e.target.value,
                      })
                    }
                    placeholder="Ej. María Gómez"
                    className="w-full p-2.5 border border-gray-300 rounded-xs text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                    WhatsApp / Teléfono del Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPedido.clienteTelefono}
                    onChange={(e) =>
                      setFormPedido({
                        ...formPedido,
                        clienteTelefono: e.target.value,
                      })
                    }
                    placeholder="Ej. 0997447443"
                    className="w-full p-2.5 border border-gray-300 rounded-xs text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                    Prenda / Trabajo a realizar *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formPedido.prenda}
                    onChange={(e) =>
                      setFormPedido({ ...formPedido, prenda: e.target.value })
                    }
                    placeholder="Ej. Vestido rojo - entalle y cambio de cierre"
                    className="w-full p-2.5 border border-gray-300 rounded-xs text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                      Estado
                    </label>
                    <select
                      value={formPedido.estado}
                      onChange={(e) =>
                        setFormPedido({ ...formPedido, estado: e.target.value })
                      }
                      className="w-full p-2.5 border border-gray-300 rounded-xs text-xs font-medium"
                    >
                      {ESTADOS_PEDIDO.map((est) => (
                        <option key={est.id} value={est.id}>
                          {est.icono} {est.id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                      Fecha Entrega
                    </label>
                    <input
                      type="date"
                      value={formPedido.fechaEntrega}
                      onChange={(e) =>
                        setFormPedido({
                          ...formPedido,
                          fechaEntrega: e.target.value,
                        })
                      }
                      className="w-full p-2.5 border border-gray-300 rounded-xs text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                      Total ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formPedido.total}
                      onChange={(e) =>
                        setFormPedido({ ...formPedido, total: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full p-2.5 border border-gray-300 rounded-xs text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                      Abono ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formPedido.abono}
                      onChange={(e) =>
                        setFormPedido({ ...formPedido, abono: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full p-2.5 border border-gray-300 rounded-xs text-sm"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-gray-600 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificarAlGuardar}
                    onChange={(e) => setNotificarAlGuardar(e.target.checked)}
                  />
                  <span>
                    Notificar por WhatsApp si el estado es{' '}
                    <b>"Listo para retirar"</b>
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full bg-[#c8a45d] hover:bg-[#b59049] text-white py-3 rounded-xs text-xs uppercase tracking-[0.16em] font-semibold transition cursor-pointer"
                >
                  {pedidoEditandoId
                    ? 'Guardar Cambios de Orden'
                    : 'Registrar Orden de Trabajo'}
                </button>
              </form>
            </div>

            {/* Listado de todas las órdenes para el Administrador */}
            <div className="lg:col-span-2 space-y-4">
              {pedidos.map((pedido) => {
                const saldo = Math.max(
                  0,
                  Number(pedido.total || 0) - Number(pedido.abono || 0)
                ).toFixed(2);

                return (
                  <div
                    key={pedido.id}
                    className="bg-white p-5 rounded-sm border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#a37f38] bg-[#f9f5ec] px-2.5 py-0.5 rounded-xs">
                          {pedido.codigo}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {pedido.clienteNombre}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({pedido.clienteTelefono})
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 font-medium">
                        {pedido.prenda}
                      </p>

                      <p className="text-xs text-gray-500">
                        Entrega: <b>{pedido.fechaEntrega || 'Sin fecha'}</b> |
                        Total: <b>${Number(pedido.total || 0).toFixed(2)}</b> |
                        Saldo: <b className="text-[#a37f38]">${saldo}</b>
                      </p>
                    </div>

                    {/* Controles de cambio rápido de estado y botón de notificación WhatsApp */}
                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <select
                        value={pedido.estado}
                        onChange={(e) =>
                          cambiarEstadoRapido(pedido, e.target.value)
                        }
                        className={`p-2 rounded-xs text-xs font-semibold border cursor-pointer ${
                          pedido.estado === 'Listo para retirar'
                            ? 'bg-green-50 text-green-800 border-green-300'
                            : pedido.estado === 'En proceso de costura'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {ESTADOS_PEDIDO.map((est) => (
                          <option key={est.id} value={est.id}>
                            {est.icono} {est.id}
                          </option>
                        ))}
                      </select>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            notificarClientePorWhatsApp(
                              pedido,
                              'Listo para retirar'
                            )
                          }
                          className="text-[11px] bg-[#25D366] hover:bg-[#1ebe5d] text-white px-3 py-1.5 rounded-xs font-semibold cursor-pointer flex items-center gap-1"
                          title="Enviar aviso de Listo para retirar por WhatsApp"
                        >
                          📲 Avisar "Listo para retirar"
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPedidoEditandoId(pedido.id);
                            setFormPedido({
                              clienteNombre: pedido.clienteNombre,
                              clienteTelefono: pedido.clienteTelefono,
                              prenda: pedido.prenda,
                              estado: pedido.estado,
                              fechaEntrega: pedido.fechaEntrega || '',
                              total: pedido.total || '',
                              abono: pedido.abono || '',
                              notas: pedido.notas || '',
                            });
                          }}
                          className="text-xs px-2.5 py-1 rounded-xs bg-amber-50 text-amber-700 border border-amber-200 cursor-pointer"
                        >
                          ✏️
                        </button>

                        <button
                          type="button"
                          onClick={() => eliminarPedido(pedido.id, pedido.codigo)}
                          className="text-xs px-2.5 py-1 rounded-xs bg-red-50 text-red-600 border border-red-200 cursor-pointer"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
