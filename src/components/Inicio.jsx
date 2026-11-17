import React from 'react';

export default function Inicio({ irAVista }) {
  return (
    <div>
      {/* SECCIÓN HERO (Idéntica al diseño de referencia) */}
      <section
        className="relative w-full h-[540px] md:h-[620px] flex items-center justify-center text-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        {/* Capa oscura rgba(0, 0, 0, 0.5) */}
        <div className="absolute inset-0 bg-black/55 z-0" />

        {/* Contenido central del Hero */}
        <div className="relative z-10 px-6 max-w-3xl mx-auto text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.04em] mb-4 drop-shadow-xs">
            Tu ropa, a tu medida
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-100 font-light tracking-wide mb-8">
            Arreglos profesionales, confección personalizada y amor por el detalle.
          </p>
          <button
            onClick={() => irAVista('tienda')}
            className="inline-block bg-[#c8a45d] hover:bg-[#b59049] text-white text-xs sm:text-sm font-medium uppercase tracking-[0.18em] px-8 py-4 rounded-xs shadow-md transition duration-300 cursor-pointer"
          >
            Ver Nuestro Catálogo
          </button>
        </div>
      </section>

      {/* 3 Tarjetas de resumen inferiores (como en la imagen de referencia) */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            onClick={() => irAVista('servicios')}
            className="bg-white p-8 rounded-sm border border-gray-200 shadow-2xs text-center hover:shadow-md hover:border-[#c8a45d] transition cursor-pointer"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#f9f5ec] text-[#c8a45d] flex items-center justify-center text-2xl">
              ✂️
            </div>
            <h3 className="text-base font-semibold text-gray-800 tracking-[0.12em] uppercase mb-2">
              Arreglos Profesionales
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Bastas, entalles, cambios de cierre y ajustes precisos para todo tipo de prendas.
            </p>
            <span className="text-xs uppercase tracking-widest text-[#b38f48] font-semibold">
              Ver servicios →
            </span>
          </div>

          <div
            onClick={() => irAVista('servicios')}
            className="bg-white p-8 rounded-sm border border-gray-200 shadow-2xs text-center hover:shadow-md hover:border-[#c8a45d] transition cursor-pointer"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#f9f5ec] text-[#c8a45d] flex items-center justify-center text-2xl">
              👗
            </div>
            <h3 className="text-base font-semibold text-gray-800 tracking-[0.12em] uppercase mb-2">
              Confección a Medida
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Creación de prendas exclusivas, vestidos de gala y trajes hechos para tu silueta.
            </p>
            <span className="text-xs uppercase tracking-widest text-[#b38f48] font-semibold">
              Ver servicios →
            </span>
          </div>

          <div
            onClick={() => irAVista('tienda')}
            className="bg-white p-8 rounded-sm border border-gray-200 shadow-2xs text-center hover:shadow-md hover:border-[#c8a45d] transition cursor-pointer"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#f9f5ec] text-[#c8a45d] flex items-center justify-center text-2xl">
              🧵
            </div>
            <h3 className="text-base font-semibold text-gray-800 tracking-[0.12em] uppercase mb-2">
              Tienda de Telas y Costura
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Explora nuestro catálogo online de telas, accesorios y servicios con pedido directo.
            </p>
            <span className="text-xs uppercase tracking-widest text-[#b38f48] font-semibold">
              Ir a la tienda →
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
