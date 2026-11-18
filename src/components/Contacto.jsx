import React, { useState } from 'react';
import axios from 'axios';

const API_CLIENTES_URL = 'https://tienda-costura-backend.onrender.com/api/clientes';

export default function Contacto({
  datos,
  whatsapp,
  modoEdicion,
  actualizarSeccion,
  actualizarGeneral,
  datosGeneral,
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    mensaje: '',
  });
  const [estadoEnvio, setEstadoEnvio] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cambiarCampo = (campo, valor) => {
    actualizarSeccion('contacto', { ...datos, [campo]: valor });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setEstadoEnvio('');

    try {
      await axios.post(API_CLIENTES_URL, {
        nombre: formData.nombre,
        telefono: formData.telefono,
        correo: formData.correo,
      });
    } catch (error) {
      console.warn('Aviso al registrar en API de clientes:', error);
    }

    const texto = `¡Hola! ✂️ Les escribo desde la página de Contacto:\n\n*Nombre:* ${formData.nombre}\n*Teléfono:* ${formData.telefono || 'No especificado'}\n*Correo:* ${formData.correo || 'No especificado'}\n*Mensaje:* ${formData.mensaje}`;
    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`,
      '_blank'
    );

    setEstadoEnvio(
      '¡Gracias por contactarnos! Hemos registrado tus datos y abierto WhatsApp para atenderte.'
    );
    setFormData({ nombre: '', telefono: '', correo: '', mensaje: '' });
    setEnviando(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Encabezado */}
      <div className="text-center mb-14">
        {modoEdicion ? (
          <div className="max-w-xl mx-auto space-y-2 bg-amber-50/60 border border-amber-300 p-4 rounded-sm">
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
            <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
              {datos.subtitulo}
            </p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Información de contacto */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-2xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-[#f9f5ec] text-[#c8a45d] flex items-center justify-center text-xl shrink-0">
              📍
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-800 mb-1">
                Nuestro Taller
              </h3>
              {modoEdicion ? (
                <textarea
                  rows={2}
                  value={datos.descripcionTaller}
                  onChange={(e) =>
                    cambiarCampo('descripcionTaller', e.target.value)
                  }
                  className="w-full p-2 border border-amber-300 rounded-xs text-xs"
                />
              ) : (
                <p className="text-gray-500 text-xs">
                  {datos.descripcionTaller}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-2xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-[#f9f5ec] text-[#c8a45d] flex items-center justify-center text-xl shrink-0">
              📞
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-800 mb-1">
                WhatsApp y Teléfono
              </h3>
              {modoEdicion ? (
                <div>
                  <label className="text-[11px] text-amber-800 block mb-1">
                    Número de WhatsApp (con código de país, ej: 593997447443):
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) =>
                      actualizarGeneral({
                        ...datosGeneral,
                        whatsapp: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-amber-300 rounded-xs text-sm"
                  />
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-sm mb-2">+{whatsapp}</p>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-widest text-[#b38f48] font-semibold hover:underline"
                  >
                    Iniciar chat directo →
                  </a>
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-2xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-[#f9f5ec] text-[#c8a45d] flex items-center justify-center text-xl shrink-0">
              🕒
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-800 mb-1">
                Horario de Atención
              </h3>
              {modoEdicion ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={datos.horarioLinea1}
                    onChange={(e) =>
                      cambiarCampo('horarioLinea1', e.target.value)
                    }
                    className="w-full p-1.5 border border-amber-300 rounded-xs text-xs"
                  />
                  <input
                    type="text"
                    value={datos.horarioLinea2}
                    onChange={(e) =>
                      cambiarCampo('horarioLinea2', e.target.value)
                    }
                    className="w-full p-1.5 border border-amber-300 rounded-xs text-xs"
                  />
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-sm">{datos.horarioLinea1}</p>
                  <p className="text-gray-600 text-sm">{datos.horarioLinea2}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Formulario de Contacto */}
        <div className="bg-white p-8 rounded-sm border border-gray-200 shadow-2xs">
          <h2 className="text-xl font-light text-gray-800 mb-6 tracking-wide">
            Envíanos un Mensaje
          </h2>

          {estadoEnvio && (
            <div className="bg-green-50 text-green-700 p-3 rounded-xs mb-4 text-xs">
              {estadoEnvio}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Ej. María Gómez"
                className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                  Teléfono / Celular
                </label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  placeholder="Ej. 0999999999"
                  className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) =>
                    setFormData({ ...formData, correo: e.target.value })
                  }
                  placeholder="correo@ejemplo.com"
                  className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                ¿En qué podemos ayudarte? *
              </label>
              <textarea
                rows={4}
                required
                value={formData.mensaje}
                onChange={(e) =>
                  setFormData({ ...formData, mensaje: e.target.value })
                }
                placeholder="Cuéntanos qué arreglo o confección necesitas..."
                className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full bg-[#c8a45d] hover:bg-[#b59049] text-white py-3 rounded-xs transition text-xs uppercase tracking-[0.18em] font-medium cursor-pointer"
            >
              {enviando ? 'Enviando...' : 'Enviar Consulta'}
            </button>
          </form>
        </div>
      </div>

      {/* Mapa interactivo de Google Maps */}
      <div className="bg-white p-4 sm:p-6 rounded-sm border border-gray-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#b38f48] font-semibold">
              Ubicación en Google Maps
            </span>
            <h2 className="text-xl font-light text-gray-800">
              Encuéntranos fácilmente
            </h2>
          </div>
          <a
            href={datos.mapaExternoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs uppercase tracking-[0.15em] text-[#a37f38] border border-[#c8a45d] hover:bg-[#c8a45d] hover:text-white px-4 py-2 rounded-xs transition font-medium w-fit"
          >
            Abrir en Google Maps ↗
          </a>
        </div>

        {modoEdicion && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xs space-y-2 text-xs">
            <label className="font-semibold text-amber-800 block">
              🗺️ URL de inserción (Embed src) de Google Maps:
            </label>
            <input
              type="text"
              value={datos.mapaEmbedUrl}
              onChange={(e) => cambiarCampo('mapaEmbedUrl', e.target.value)}
              className="w-full p-2 bg-white border border-amber-300 rounded-xs text-xs"
            />
          </div>
        )}

        <div className="w-full h-80 sm:h-96 rounded-xs overflow-hidden border border-gray-200">
          <iframe
            title="Ubicación Taller de Costura"
            src={datos.mapaEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  );
}
