import React, { useState } from 'react';
import axios from 'axios';

const API_CLIENTES_URL = 'https://tienda-costura-backend.onrender.com/api/clientes';
const NUMERO_WHATSAPP = '593997447443';

// 📍 Ubicación exacta de tu emprendimiento en Google Maps
const MAPA_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d382.24703278594563!2d-79.2037961653221!3d-3.1385501552637516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ccd186eff876d1%3A0x4bb27305ce084e87!2sartesanias!5e0!3m2!1ses!2sec!4v1794928402447!5m2!1ses!2sec';
const MAPA_EXTERNO_URL =
  'https://www.google.com/maps?q=-3.1385501552637516,-79.2037961653221';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    mensaje: '',
  });
  const [estadoEnvio, setEstadoEnvio] = useState('');
  const [enviando, setEnviando] = useState(false);

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
      `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`,
      '_blank'
    );

    setEstadoEnvio('¡Gracias por contactarnos! Hemos registrado tus datos y abierto WhatsApp para atenderte.');
    setFormData({ nombre: '', telefono: '', correo: '', mensaje: '' });
    setEnviando(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Encabezado */}
      <div className="text-center mb-14">
        <span className="text-xs uppercase tracking-[0.25em] text-[#b38f48] font-semibold">
          Estamos para servirte
        </span>
        <h1 className="text-3xl sm:text-4xl font-light text-gray-800 mt-2 tracking-wide">
          Contacto y Ubicación
        </h1>
        <div className="w-16 h-0.5 bg-[#c8a45d] mx-auto mt-4 mb-4" />
        <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
          ¿Necesitas una cotización, agendar una toma de medidas o consultar por una prenda? Escríbenos o visítanos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Información de contacto */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-2xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-[#f9f5ec] text-[#c8a45d] flex items-center justify-center text-xl shrink-0">
              📍
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-800 mb-1">
                Nuestro Taller
              </h3>
              <p className="text-gray-500 text-xs">
                Atención presencial para toma de medidas, pruebas de calce y recepción de prendas.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-2xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-[#f9f5ec] text-[#c8a45d] flex items-center justify-center text-xl shrink-0">
              📞
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-800 mb-1">
                WhatsApp y Teléfono
              </h3>
              <p className="text-gray-600 text-sm mb-2">+{NUMERO_WHATSAPP}</p>
              <a
                href={`https://wa.me/${NUMERO_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-widest text-[#b38f48] font-semibold hover:underline"
              >
                Iniciar chat directo →
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-2xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-[#f9f5ec] text-[#c8a45d] flex items-center justify-center text-xl shrink-0">
              🕒
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-800 mb-1">
                Horario de Atención
              </h3>
              <p className="text-gray-600 text-sm">Lunes a Viernes: 09:00 a 18:30</p>
              <p className="text-gray-600 text-sm">Sábados: 09:00 a 14:00</p>
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
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
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
            href={MAPA_EXTERNO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs uppercase tracking-[0.15em] text-[#a37f38] border border-[#c8a45d] hover:bg-[#c8a45d] hover:text-white px-4 py-2 rounded-xs transition font-medium w-fit"
          >
            Abrir en Google Maps ↗
          </a>
        </div>

        <div className="w-full h-80 sm:h-96 rounded-xs overflow-hidden border border-gray-200">
          <iframe
            title="Ubicación Taller de Costura"
            src={MAPA_EMBED_URL}
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
