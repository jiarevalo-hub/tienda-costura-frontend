import React from 'react';
import { convertirArchivoABase64 } from '../configSitio';
import { notificar } from './Notificaciones';

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
      notificar('Imagen del banner principal actualizada.');
    } catch (err) {
      notificar(err.message, 'error');
    }
  };

  return (
    <div className="animate-fade-up">
      {/* Panel de edición del Hero cuando Modo Edición está activo */}
      {modoEdicion && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-semibold text-amber-800 uppercase tracking-wider block">
                🖼️ Cambiar imagen de fondo del Banner Principal
              </span>
              <span className="text-amber-700">
                Sube una foto desde tu computadora/celular o pega un enlace:
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

      {/* SECCIÓN HERO CON ANIMACIÓN DE ZOOM SUAVE Y MARCO EDITORIAL */}
      <section className="relative w-full min-h-[460px] sm:h-[580px] md:h-[650px] py-16 sm:py-0 flex items-center justify-center text-center overflow-hidden border-b-2 border-[#e4d9c3]">
        {/* Imagen de fondo animada */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-hero-bg"
          style={{
            backgroundImage: `url('${datos.heroImagen}')`,
          }}
        />

        {/* Degradado elegante oscuro para máximo contraste de lectura */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/70 z-0" />

        {/* Marco decorativo interior (solo en pantallas medianas/grandes) */}
        <div className="hidden sm:block absolute inset-6 md:inset-10 border border-[#c8a45d]/35 pointer-events-none z-10" />

        <div className="relative z-10 px-4 sm:px-8 max-w-3xl mx-auto text-white w-full">
          {modoEdicion ? (
            <div className="space-y-4 bg-black/55 p-5 sm:p-7 rounded-md border border-amber-400/70 backdrop-blur-sm">
              <span className="text-[11px] uppercase tracking-widest text-amber-300 font-semibold block">
                ✏️ Editando Textos del Banner Principal
              </span>
              <input
                type="text"
                value={datos.heroTitulo}
                onChange={(e) => cambiarCampo('heroTitulo', e.target.value)}
                className="w-full text-center text-2xl sm:text-4xl font-editorial bg-white/15 border border-white/40 rounded-xs p-2.5 text-white"
                placeholder="Título principal"
              />
              <textarea
                rows={2}
                value={datos.heroSubtitulo}
                onChange={(e) => cambiarCampo('heroSubtitulo', e.target.value)}
                className="w-full text-center text-sm sm:text-base bg-white/15 border border-white/40 rounded-xs p-2.5 text-white"
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
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-[#c8a45d]/50 text-[#ebd4a2] text-[10px] sm:text-xs uppercase tracking-[0.28em] mb-6">
                <span>✦</span>
                <span>Sastrería &amp; Alta Costura</span>
                <span>✦</span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-medium tracking-wide mb-5 drop-shadow-md leading-tight">
                {datos.heroTitulo}
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-100/95 font-light tracking-wide max-w-2xl mx-auto mb-9 leading-relaxed">
                {datos.heroSubtitulo}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <button
                  onClick={() => irAVista('tienda')}
                  className="w-full sm:w-auto btn-gold text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] px-9 py-4 rounded-sm cursor-pointer"
                >
                  {datos.heroBoton}
                </button>
                <button
                  onClick={() => irAVista('seguimiento')}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/40 text-white text-xs sm:text-sm font-medium uppercase tracking-[0.18em] px-7 py-4 rounded-sm transition cursor-pointer"
                >
                  📦 Rastrear mi Prenda
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3 Tarjetas de resumen inferiores con bordes de alta costura */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#b38f48] font-semibold">
            Excelencia en cada puntada
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-gray-900 mt-1">
            Especialidades de Nuestro Taller
          </h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="w-12 h-[1px] bg-[#c8a45d]" />
            <span className="text-[#c8a45d] text-xs">◆</span>
            <span className="w-12 h-[1px] bg-[#c8a45d]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {datos.tarjetas.map((tarjeta, idx) => (
            <div
              key={idx}
              onClick={() => !modoEdicion && irAVista(tarjeta.destino || 'servicios')}
              className={`card-atelier relative p-7 sm:p-9 text-center group overflow-hidden ${
                modoEdicion
                  ? 'border-amber-400 bg-amber-50/20'
                  : 'cursor-pointer'
              }`}
            >
              {/* Línea superior dorada decorativa */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#c8a45d] to-transparent opacity-75 group-hover:opacity-100 transition" />

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
                  <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#faf6ed] border border-[#e6d8bc] text-[#c8a45d] flex items-center justify-center text-3xl shadow-2xs group-hover:scale-110 group-hover:bg-[#c8a45d] group-hover:text-white transition duration-300">
                    {tarjeta.icono}
                  </div>
                  <h3 className="font-editorial text-2xl font-semibold text-gray-900 tracking-wide mb-2.5">
                    {tarjeta.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {tarjeta.descripcion}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#a37f38] font-semibold group-hover:translate-x-1 transition">
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
