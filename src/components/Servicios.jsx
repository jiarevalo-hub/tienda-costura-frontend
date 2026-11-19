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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 animate-fade-up">
      {/* Encabezado */}
      <div className="text-center mb-12 sm:mb-16">
        {modoEdicion ? (
          <div className="max-w-xl mx-auto space-y-3 bg-amber-50/60 border border-amber-300 p-5 rounded-md">
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
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#b38f48] font-semibold">
              {datos.etiqueta}
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl font-semibold text-gray-900 mt-1.5 tracking-wide">
              {datos.titulo}
            </h1>
            <div className="flex items-center justify-center gap-3 mt-3 mb-4">
              <span className="w-12 h-[1px] bg-[#c8a45d]" />
              <span className="text-[#c8a45d] text-xs">◆</span>
              <span className="w-12 h-[1px] bg-[#c8a45d]" />
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
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
            className="btn-gold px-5 py-2.5 rounded-sm text-xs uppercase tracking-widest font-semibold cursor-pointer"
          >
            ➕ Agregar Nueva Tarjeta de Servicio
          </button>
        </div>
      )}

      {/* Cuadrícula de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
        {datos.lista.map((srv, idx) => (
          <div
            key={idx}
            className={`card-atelier relative p-7 sm:p-8 flex flex-col justify-between group overflow-hidden ${
              modoEdicion ? 'border-amber-400' : ''
            }`}
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#c8a45d] to-transparent opacity-60 group-hover:opacity-100 transition" />

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
                  <div className="w-14 h-14 mb-5 rounded-full bg-[#faf6ed] border border-[#e6d8bc] text-[#c8a45d] flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-[#c8a45d] group-hover:text-white transition duration-300">
                    {srv.icono}
                  </div>
                  <h3 className="font-editorial text-2xl font-semibold text-gray-900 mb-2.5">
                    {srv.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {srv.descripcion}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#efe8da] flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#9c7832] bg-[#faf6ed] border border-[#e9dec6] px-3 py-1 rounded-full">
                    {srv.precioRef}
                  </span>
                  <button
                    onClick={() => consultarServicio(srv.titulo)}
                    className="btn-gold text-xs uppercase tracking-[0.14em] px-4 py-2 rounded-sm font-semibold cursor-pointer"
                  >
                    Cotizar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Proceso de trabajo con borde tipo costura */}
      <div className="bg-white border border-[#e2d6be] rounded-md p-6 sm:p-12 text-center shadow-sm relative">
        <div className="stitch-border rounded-sm p-6 sm:p-10">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#b38f48] font-semibold">
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
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-gray-900 mt-1 mb-10">
              {datos.pasosTitulo}
            </h2>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {datos.pasos.map((paso, idx) => (
              <div key={idx} className="relative">
                <div className="w-12 h-12 rounded-full btn-gold font-editorial text-xl font-bold flex items-center justify-center mx-auto mb-4">
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
                    <h4 className="font-editorial text-xl font-semibold text-gray-900 mb-1.5">
                      {paso.titulo}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                      {paso.descripcion}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => irAVista('tienda')}
            className="w-full sm:w-auto bg-[#1c1b18] hover:bg-gray-800 text-white text-xs uppercase tracking-[0.2em] px-9 py-4 rounded-sm transition shadow-sm cursor-pointer"
          >
            Ver Catálogo en Tienda
          </button>
        </div>
      </div>
    </div>
  );
}
