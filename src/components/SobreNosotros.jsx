import React from 'react';
import { convertirArchivoABase64 } from '../configSitio';
import { notificar } from './Notificaciones';

export default function SobreNosotros({
  irAVista,
  datos,
  modoEdicion,
  actualizarSeccion,
}) {
  const cambiarCampo = (campo, valor) => {
    actualizarSeccion('nosotros', { ...datos, [campo]: valor });
  };

  const cambiarEstadistica = (indice, campo, valor) => {
    const nuevas = datos.estadisticas.map((est, i) =>
      i === indice ? { ...est, [campo]: valor } : est
    );
    cambiarCampo('estadisticas', nuevas);
  };

  const cambiarValor = (indice, campo, valor) => {
    const nuevos = datos.valores.map((v, i) =>
      i === indice ? { ...v, [campo]: valor } : v
    );
    cambiarCampo('valores', nuevos);
  };

  const subirImagenNosotros = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    try {
      const base64 = await convertirArchivoABase64(archivo, 1000);
      cambiarCampo('imagen', base64);
      notificar('Fotografía del taller actualizada.');
    } catch (err) {
      notificar(err.message, 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 animate-fade-up">
      {/* Encabezado */}
      <div className="text-center mb-12 sm:mb-16">
        {modoEdicion ? (
          <div className="max-w-md mx-auto space-y-2 bg-amber-50/60 border border-amber-300 p-4 rounded-md">
            <input
              type="text"
              value={datos.etiqueta}
              onChange={(e) => cambiarCampo('etiqueta', e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded-xs text-xs text-center uppercase tracking-widest bg-white"
            />
            <input
              type="text"
              value={datos.titulo}
              onChange={(e) => cambiarCampo('titulo', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-xs text-xl text-center bg-white"
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
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="w-12 h-[1px] bg-[#c8a45d]" />
              <span className="text-[#c8a45d] text-xs">◆</span>
              <span className="w-12 h-[1px] bg-[#c8a45d]" />
            </div>
          </>
        )}
      </div>

      {/* Bloque principal con imagen enmarcada e historia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center bg-white p-6 sm:p-12 rounded-md border border-[#e6dec8] shadow-sm mb-12">
        <div>
          <div className="relative p-2 bg-[#faf6ed] border border-[#e4d5b7] rounded-md shadow-xs">
            <div className="overflow-hidden rounded-sm h-72 sm:h-96 bg-gray-100">
              <img
                src={datos.imagen}
                alt="Taller de Costura"
                className="w-full h-full object-cover hover:scale-105 transition duration-700"
              />
            </div>
          </div>
          {modoEdicion && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xs space-y-2 text-xs">
              <span className="font-semibold text-amber-800 block">
                🖼️ Cambiar foto de Sobre Nosotros:
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={subirImagenNosotros}
                className="w-full text-xs bg-white p-1.5 border border-amber-300 rounded-xs cursor-pointer"
              />
              <input
                type="text"
                value={datos.imagen?.startsWith('data:') ? '' : datos.imagen}
                onChange={(e) => cambiarCampo('imagen', e.target.value)}
                placeholder="O pega URL de la imagen..."
                className="w-full p-1.5 bg-white border border-amber-300 rounded-xs text-xs"
              />
            </div>
          )}
        </div>

        <div>
          {modoEdicion ? (
            <div className="space-y-3">
              <input
                type="text"
                value={datos.subtituloHistoria}
                onChange={(e) =>
                  cambiarCampo('subtituloHistoria', e.target.value)
                }
                className="w-full p-2 border border-amber-300 rounded-xs text-xs uppercase tracking-widest"
              />
              <input
                type="text"
                value={datos.tituloHistoria}
                onChange={(e) => cambiarCampo('tituloHistoria', e.target.value)}
                className="w-full p-2 border border-amber-300 rounded-xs text-lg"
              />
              <textarea
                rows={4}
                value={datos.parrafo1}
                onChange={(e) => cambiarCampo('parrafo1', e.target.value)}
                className="w-full p-2 border border-amber-300 rounded-xs text-xs"
              />
              <textarea
                rows={3}
                value={datos.parrafo2}
                onChange={(e) => cambiarCampo('parrafo2', e.target.value)}
                className="w-full p-2 border border-amber-300 rounded-xs text-xs"
              />
            </div>
          ) : (
            <>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#b38f48] font-semibold">
                {datos.subtituloHistoria}
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-gray-900 mt-1.5 mb-4 leading-snug">
                {datos.tituloHistoria}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                {datos.parrafo1}
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                {datos.parrafo2}
              </p>
            </>
          )}

          <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-[#efe8da] text-center mt-4">
            {datos.estadisticas.map((est, idx) => (
              <div
                key={idx}
                className="bg-[#faf8f3] border border-[#ebe2cf] rounded-sm p-3"
              >
                {modoEdicion ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={est.valor}
                      onChange={(e) =>
                        cambiarEstadistica(idx, 'valor', e.target.value)
                      }
                      className="w-full p-1 border border-amber-300 rounded-xs text-center text-sm font-semibold"
                    />
                    <input
                      type="text"
                      value={est.etiqueta}
                      onChange={(e) =>
                        cambiarEstadistica(idx, 'etiqueta', e.target.value)
                      }
                      className="w-full p-1 border border-amber-300 rounded-xs text-center text-[10px]"
                    />
                  </div>
                ) : (
                  <>
                    <span className="block font-editorial text-2xl sm:text-3xl font-bold text-[#b89146]">
                      {est.valor}
                    </span>
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                      {est.etiqueta}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Valores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
        {datos.valores.map((val, idx) => (
          <div
            key={idx}
            className={`card-atelier p-7 text-center ${
              modoEdicion ? 'border-amber-400' : ''
            }`}
          >
            {modoEdicion ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={val.titulo}
                  onChange={(e) => cambiarValor(idx, 'titulo', e.target.value)}
                  className="w-full p-1.5 border border-gray-300 rounded-xs text-xs font-semibold text-center"
                />
                <textarea
                  rows={3}
                  value={val.descripcion}
                  onChange={(e) =>
                    cambiarValor(idx, 'descripcion', e.target.value)
                  }
                  className="w-full p-1.5 border border-gray-300 rounded-xs text-xs text-center"
                />
              </div>
            ) : (
              <>
                <h3 className="font-editorial text-xl font-semibold text-gray-900 mb-2">
                  {val.titulo}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {val.descripcion}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={() => irAVista('contacto')}
          className="w-full sm:w-auto btn-gold text-xs uppercase tracking-[0.2em] font-semibold px-9 py-4 rounded-sm cursor-pointer"
        >
          Contáctanos
        </button>
      </div>
    </div>
  );
}
