import React from 'react';
import { convertirArchivoABase64 } from '../configSitio';

export default function Inicio({
  irAVista,
  datos,
  modoEdicion,
  actualizarSeccion,
}) {
  const cambiarCampo = (campo, valor) => {
    actualizarSeccion('inicio', { ...datos, [campo]: valor });
  };

  const cambiarTarjeta = (indice, campo, valor) => {
    const nuevas = datos.tarjetas.map((t, i) =>
      i === indice ? { ...t, [campo]: valor } : t
    );
    cambiarCampo('tarjetas', nuevas);
  };

  const subirImagenHero = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    try {
      const base64 = await convertirArchivoABase64(archivo, 1400);
      cambiarCampo('heroImagen', base64);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      {/* Panel de edición del Hero cuando Modo Edición está activo */}
      {modoEdicion && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-semibold text-amber-800 uppercase tracking-wider block">
                🖼️ Cambiar imagen de fondo del Banner Principal
              </span>
              <span className="text-amber-700">
                Sube una foto desde tu computadora o pega un enlace:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={subirImagenHero}
                className="text-xs bg-white border border-amber-300 rounded-xs p-1.5 cursor-pointer"
              />
              <input
                type="text"
                value={datos.heroImagen?.startsWith('data:') ? '' : datos.heroImagen}
                onChange={(e) => cambiarCampo('heroImagen', e.target.value)}
                placeholder="O pega URL de imagen..."
                className="p-1.5 px-2.5 bg-white border border-amber-300 rounded-xs text-xs w-52"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN HERO */}
      <section
        className="relative w-full min-h-[420px] sm:h-[540px] md:h-[620px] py-14 sm:py-0 flex items-center justify-center text-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url('${datos.heroImagen}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/55 z-0" />

        <div className="relative z-10 px-4 sm:px-6 max-w-3xl mx-auto text-white w-full">
          {modoEdicion ? (
            <div className="space-y-4 bg-black/45 p-6 rounded-sm border border-amber-400/60 backdrop-blur-xs">
              <span className="text-[11px] uppercase tracking-widest text-amber-300 font-semibold block">
                ✏️ Editando Textos del Banner Principal
              </span>
              <input
                type="text"
                value={datos.heroTitulo}
                onChange={(e) => cambiarCampo('heroTitulo', e.target.value)}
                className="w-full text-center text-2xl sm:text-4xl font-light bg-white/15 border border-white/40 rounded-xs p-2 text-white focus:outline-none focus:border-amber-400"
                placeholder="Título principal"
              />
              <textarea
                rows={2}
                value={datos.heroSubtitulo}
                onChange={(e) => cambiarCampo('heroSubtitulo', e.target.value)}
                className="w-full text-center text-sm sm:text-base bg-white/15 border border-white/40 rounded-xs p-2 text-white focus:outline-none focus:border-amber-400"
                placeholder="Subtítulo del banner"
              />
              <div>
                <label className="text-[11px] text-amber-200 block mb-1">
                  Texto del botón dorado:
                </label>
                <input
                  type="text"
                  value={datos.heroBoton}
                  onChange={(e) => cambiarCampo('heroBoton', e.target.value)}
                  className="text-center text-xs uppercase tracking-widest bg-[#c8a45d] border border-white/60 rounded-xs px-6 py-3 text-white font-semibold"
                />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.04em] mb-4 drop-shadow-xs">
                {datos.heroTitulo}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-100 font-light tracking-wide mb-8">
                {datos.heroSubtitulo}
              </p>
              <button
                onClick={() => irAVista('tienda')}
                className="inline-block bg-[#c8a45d] hover:bg-[#b59049] text-white text-xs sm:text-sm font-medium uppercase tracking-[0.18em] px-8 py-4 rounded-xs shadow-md transition duration-300 cursor-pointer"
              >
                {datos.heroBoton}
              </button>
            </>
          )}
        </div>
      </section>

      {/* 3 Tarjetas de resumen inferiores */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {datos.tarjetas.map((tarjeta, idx) => (
            <div
              key={idx}
              onClick={() => !modoEdicion && irAVista(tarjeta.destino || 'servicios')}
              className={`bg-white p-6 sm:p-8 rounded-sm border shadow-2xs text-center transition ${
                modoEdicion
                  ? 'border-amber-400 bg-amber-50/20'
                  : 'border-gray-200 hover:shadow-md hover:border-[#c8a45d] cursor-pointer'
              }`}
            >
              {modoEdicion ? (
                <div className="space-y-3 text-left">
                  <span className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold block">
                    ✏️ Tarjeta #{idx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600">Ícono:</label>
                    <input
                      type="text"
                      value={tarjeta.icono}
                      onChange={(e) =>
                        cambiarTarjeta(idx, 'icono', e.target.value)
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
                      value={tarjeta.titulo}
                      onChange={(e) =>
                        cambiarTarjeta(idx, 'titulo', e.target.value)
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
                      value={tarjeta.descripcion}
                      onChange={(e) =>
                        cambiarTarjeta(idx, 'descripcion', e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-xs text-xs"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#f9f5ec] text-[#c8a45d] flex items-center justify-center text-2xl">
                    {tarjeta.icono}
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 tracking-[0.12em] uppercase mb-2">
                    {tarjeta.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {tarjeta.descripcion}
                  </p>
                  <span className="text-xs uppercase tracking-widest text-[#b38f48] font-semibold">
                    {tarjeta.textoEnlace}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
