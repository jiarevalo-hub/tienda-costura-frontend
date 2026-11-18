import React from 'react';

export default function Servicios({
  irAVista,
  datos,
  whatsapp,
  modoEdicion,
  actualizarSeccion,
}) {
  const cambiarCampo = (campo, valor) => {
    actualizarSeccion('servicios', { ...datos, [campo]: valor });
  };

  const cambiarServicio = (indice, campo, valor) => {
    const nuevaLista = datos.lista.map((srv, i) =>
      i === indice ? { ...srv, [campo]: valor } : srv
    );
    cambiarCampo('lista', nuevaLista);
  };

  const agregarNuevoServicio = () => {
    cambiarCampo('lista', [
      ...datos.lista,
      {
        icono: '✨',
        titulo: 'Nuevo Servicio',
        descripcion: 'Descripción del servicio de costura.',
        precioRef: 'Desde $10.00',
      },
    ]);
  };

  const eliminarServicio = (indice) => {
    cambiarCampo(
      'lista',
      datos.lista.filter((_, i) => i !== indice)
    );
  };

  const cambiarPaso = (indice, campo, valor) => {
    const nuevosPasos = datos.pasos.map((p, i) =>
      i === indice ? { ...p, [campo]: valor } : p
    );
    cambiarCampo('pasos', nuevosPasos);
  };

  const consultarServicio = (nombreServicio) => {
    const mensaje = `¡Hola! ✂️ Me gustaría cotizar el servicio de *${nombreServicio}*.`;
    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`,
      '_blank'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Encabezado */}
      <div className="text-center mb-14">
        {modoEdicion ? (
          <div className="max-w-xl mx-auto space-y-3 bg-amber-50/60 border border-amber-300 p-5 rounded-sm">
            <span className="text-[11px] uppercase tracking-widest text-amber-800 font-semibold block">
              ✏️ Editando Encabezado de Servicios
            </span>
            <input
              type="text"
              value={datos.etiqueta}
              onChange={(e) => cambiarCampo('etiqueta', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-xs text-xs text-center uppercase tracking-widest bg-white"
            />
            <input
              type="text"
              value={datos.titulo}
              onChange={(e) => cambiarCampo('titulo', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-xs text-xl text-center bg-white"
            />
            <textarea
              rows={2}
              value={datos.subtitulo}
              onChange={(e) => cambiarCampo('subtitulo', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-xs text-xs text-center bg-white"
            />
          </div>
        ) : (
          <>
            <span className="text-xs uppercase tracking-[0.25em] text-[#b38f48] font-semibold">
              {datos.etiqueta}
            </span>
            <h1 className="text-3xl sm:text-4xl font-light text-gray-800 mt-2 tracking-wide">
              {datos.titulo}
            </h1>
            <div className="w-16 h-0.5 bg-[#c8a45d] mx-auto mt-4 mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              {datos.subtitulo}
            </p>
          </>
        )}
      </div>

      {/* Botón para agregar servicio en modo edición */}
      {modoEdicion && (
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={agregarNuevoServicio}
            className="bg-[#c8a45d] hover:bg-[#b59049] text-white px-5 py-2.5 rounded-xs text-xs uppercase tracking-widest font-semibold cursor-pointer shadow-xs"
          >
            ➕ Agregar Nueva Tarjeta de Servicio
          </button>
        </div>
      )}

      {/* Cuadrícula de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {datos.lista.map((srv, idx) => (
          <div
            key={idx}
            className={`bg-white p-8 rounded-sm border shadow-2xs flex flex-col justify-between transition ${
              modoEdicion ? 'border-amber-400' : 'border-gray-200 hover:shadow-md'
            }`}
          >
            {modoEdicion ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold">
                    ✏️ Servicio #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => eliminarServicio(idx)}
                    className="text-xs text-red-600 hover:underline cursor-pointer"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600">Ícono:</label>
                  <input
                    type="text"
                    value={srv.icono}
                    onChange={(e) =>
                      cambiarServicio(idx, 'icono', e.target.value)
                    }
                    className="w-16 p-1.5 border border-gray-300 rounded-xs text-center text-lg"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">
                    Título:
                  </label>
                  <input
                    type="text"
                    value={srv.titulo}
                    onChange={(e) =>
                      cambiarServicio(idx, 'titulo', e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-xs text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">
                    Descripción:
                  </label>
                  <textarea
                    rows={3}
                    value={srv.descripcion}
                    onChange={(e) =>
                      cambiarServicio(idx, 'descripcion', e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-xs text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">
                    Precio referencial:
                  </label>
                  <input
                    type="text"
                    value={srv.precioRef}
                    onChange={(e) =>
                      cambiarServicio(idx, 'precioRef', e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-xs text-xs"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className="w-12 h-12 mb-5 rounded-full bg-[#f9f5ec] text-[#c8a45d] flex items-center justify-center text-2xl">
                    {srv.icono}
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 uppercase tracking-wide mb-2">
                    {srv.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {srv.descripcion}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#a37f38]">
                    {srv.precioRef}
                  </span>
                  <button
                    onClick={() => consultarServicio(srv.titulo)}
                    className="text-xs uppercase tracking-[0.14em] bg-[#c8a45d] hover:bg-[#b59049] text-white px-4 py-2 rounded-xs transition font-medium cursor-pointer"
                  >
                    Cotizar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Proceso de trabajo */}
      <div className="bg-white border border-[#e8dfd1] rounded-sm p-8 sm:p-12 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-[#b38f48] font-semibold">
          Paso a Paso
        </span>
        {modoEdicion ? (
          <input
            type="text"
            value={datos.pasosTitulo}
            onChange={(e) => cambiarCampo('pasosTitulo', e.target.value)}
            className="block mx-auto mt-2 mb-8 p-2 border border-amber-300 rounded-xs text-xl text-center w-full max-w-md"
          />
        ) : (
          <h2 className="text-2xl font-light text-gray-800 mt-2 mb-8">
            {datos.pasosTitulo}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {datos.pasos.map((paso, idx) => (
            <div key={idx}>
              <div className="w-10 h-10 rounded-full bg-[#c8a45d] text-white font-semibold flex items-center justify-center mx-auto mb-3">
                {idx + 1}
              </div>
              {modoEdicion ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={paso.titulo}
                    onChange={(e) =>
                      cambiarPaso(idx, 'titulo', e.target.value)
                    }
                    className="w-full p-2 border border-amber-300 rounded-xs text-xs text-center font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={paso.descripcion}
                    onChange={(e) =>
                      cambiarPaso(idx, 'descripcion', e.target.value)
                    }
                    className="w-full p-2 border border-amber-300 rounded-xs text-xs text-center"
                  />
                </div>
              ) : (
                <>
                  <h4 className="font-medium text-gray-800 uppercase text-sm tracking-wider mb-1">
                    {paso.titulo}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {paso.descripcion}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => irAVista('tienda')}
          className="bg-[#1c1b18] hover:bg-gray-800 text-white text-xs uppercase tracking-[0.18em] px-8 py-3.5 rounded-xs transition cursor-pointer"
        >
          Ver Catálogo en Tienda
        </button>
      </div>
    </div>
  );
}
