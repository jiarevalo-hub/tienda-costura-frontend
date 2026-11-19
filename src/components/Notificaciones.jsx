import React, { useState, useEffect } from 'react';

// Eventos personalizados para mostrar notificaciones y confirmaciones propias de la página
export function notificar(mensaje, tipo = 'exito') {
  window.dispatchEvent(
    new CustomEvent('app:notificar', {
      detail: { id: Date.now() + Math.random(), mensaje, tipo },
    })
  );
}

export function confirmarAccion({
  titulo = 'Confirmar acción',
  mensaje = '¿Estás seguro de continuar?',
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  peligro = false,
}) {
  return new Promise((resolve) => {
    window.dispatchEvent(
      new CustomEvent('app:confirmar', {
        detail: {
          titulo,
          mensaje,
          textoConfirmar,
          textoCancelar,
          peligro,
          resolver: resolve,
        },
      })
    );
  });
}

export default function ContenedorNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [modalConfirmacion, setModalConfirmacion] = useState(null);

  useEffect(() => {
    const manejarNotificacion = (e) => {
      const nueva = e.detail;
      setNotificaciones((prev) => [...prev, nueva]);
      setTimeout(() => {
        setNotificaciones((prev) => prev.filter((n) => n.id !== nueva.id));
      }, 4200);
    };

    const manejarConfirmacion = (e) => {
      setModalConfirmacion(e.detail);
    };

    window.addEventListener('app:notificar', manejarNotificacion);
    window.addEventListener('app:confirmar', manejarConfirmacion);
    return () => {
      window.removeEventListener('app:notificar', manejarNotificacion);
      window.removeEventListener('app:confirmar', manejarConfirmacion);
    };
  }, []);

  const responderConfirmacion = (respuesta) => {
    if (modalConfirmacion?.resolver) {
      modalConfirmacion.resolver(respuesta);
    }
    setModalConfirmacion(null);
  };

  return (
    <>
      {/* Bandeja de Notificaciones Flotantes de la Página (Toasts) */}
      <div className="fixed top-20 right-4 sm:right-6 z-[70] flex flex-col gap-2.5 max-w-sm w-[calc(100%-2rem)] pointer-events-none">
        {notificaciones.map((n) => {
          const esError = n.tipo === 'error';
          const esAviso = n.tipo === 'aviso';
          return (
            <div
              key={n.id}
              className={`pointer-events-auto animate-scale-in bg-white border-l-4 rounded-sm shadow-xl p-4 flex items-start justify-between gap-3 border ${
                esError
                  ? 'border-l-red-500 border-red-200'
                  : esAviso
                  ? 'border-l-amber-500 border-amber-200'
                  : 'border-l-[#c8a45d] border-[#e8dfd1]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-base leading-none mt-0.5">
                  {esError ? '⚠️' : esAviso ? '🔔' : '✨'}
                </span>
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-[#a37f38]">
                    {esError
                      ? 'Aviso del Sistema'
                      : esAviso
                      ? 'Notificación'
                      : 'Taller de Costura'}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-800 mt-0.5 leading-snug">
                    {n.mensaje}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setNotificaciones((prev) =>
                    prev.filter((item) => item.id !== n.id)
                  )
                }
                className="text-gray-400 hover:text-gray-700 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Propio de Confirmación (Reemplaza al window.confirm del navegador) */}
      {modalConfirmacion && (
        <div
          onClick={() => responderConfirmacion(false)}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-scale-in bg-white border border-[#e6dec8] rounded-md shadow-2xl max-w-md w-full p-6 sm:p-7 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#c8a45d] to-transparent" />

            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#faf6ed] border border-[#e6d8bc] text-[#c8a45d] flex items-center justify-center text-xl">
              {modalConfirmacion.peligro ? '🗑️' : '✂️'}
            </div>

            <span className="text-[10px] uppercase tracking-[0.25em] text-[#b38f48] font-semibold">
              Taller de Costura
            </span>
            <h3 className="font-editorial text-2xl font-semibold text-gray-900 mt-1 mb-2">
              {modalConfirmacion.titulo}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 whitespace-pre-line">
              {modalConfirmacion.mensaje}
            </p>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => responderConfirmacion(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs uppercase tracking-wider font-medium cursor-pointer"
              >
                {modalConfirmacion.textoCancelar}
              </button>
              <button
                type="button"
                onClick={() => responderConfirmacion(true)}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-sm text-white text-xs uppercase tracking-wider font-semibold cursor-pointer ${
                  modalConfirmacion.peligro
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'btn-gold'
                }`}
              >
                {modalConfirmacion.textoConfirmar}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
