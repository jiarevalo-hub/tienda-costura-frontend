import React from 'react';

export default function SobreNosotros({ irAVista }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Encabezado */}
      <div className="text-center mb-14">
        <span className="text-xs uppercase tracking-[0.25em] text-[#b38f48] font-semibold">
          Nuestra Esencia
        </span>
        <h1 className="text-3xl sm:text-4xl font-light text-gray-800 mt-2 tracking-wide">
          Sobre Nosotros
        </h1>
        <div className="w-16 h-0.5 bg-[#c8a45d] mx-auto mt-4" />
      </div>

      {/* Bloque principal con imagen e historia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white p-8 sm:p-12 rounded-sm border border-gray-200 shadow-2xs mb-12">
        <div className="overflow-hidden rounded-xs h-80 sm:h-96">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80"
            alt="Taller de Costura"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#b38f48] font-semibold">
            Tradición y Detalle
          </span>
          <h2 className="text-2xl font-light text-gray-800 mt-2 mb-4">
            Pasión por el arte de la costura y el buen vestir
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Nuestro Taller de Costura nació con la misión de ofrecer un servicio donde cada prenda recibe un trato único. Sabemos que la ropa que usas cuenta tu historia y refleja tu personalidad; por eso cuidamos cada corte, cada puntada y cada acabado.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Combinamos técnicas tradicionales de sastrería y modistería con materiales de primera calidad, brindando tanto arreglos cotidianos como confecciones exclusivas a medida.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-center">
            <div>
              <span className="block text-2xl font-semibold text-[#c8a45d]">100%</span>
              <span className="text-[11px] uppercase tracking-wider text-gray-500">Garantía de Ajuste</span>
            </div>
            <div>
              <span className="block text-2xl font-semibold text-[#c8a45d]">+500</span>
              <span className="text-[11px] uppercase tracking-wider text-gray-500">Clientes Felices</span>
            </div>
            <div>
              <span className="block text-2xl font-semibold text-[#c8a45d]">A Medida</span>
              <span className="text-[11px] uppercase tracking-wider text-gray-500">Atención Personal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Valores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-sm border border-gray-200 text-center">
          <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-800 mb-2">
            ✨ Calidad Artesanal
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Cuidamos las telas delicadas y utilizamos hilos y avíos duraderos para acabados invisibles.
          </p>
        </div>
        <div className="bg-white p-6 rounded-sm border border-gray-200 text-center">
          <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-800 mb-2">
            ⏱️ Compromiso y Puntualidad
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Respetamos los tiempos de entrega acordados para que tengas tu prenda lista para tu ocasión especial.
          </p>
        </div>
        <div className="bg-white p-6 rounded-sm border border-gray-200 text-center">
          <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-800 mb-2">
            🤝 Asesoría Personalizada
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Te orientamos sobre el mejor entalle, tipo de tela o diseño según tu estilo y necesidad.
          </p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => irAVista('contacto')}
          className="bg-[#c8a45d] hover:bg-[#b59049] text-white text-xs uppercase tracking-[0.18em] px-8 py-3.5 rounded-xs transition cursor-pointer"
        >
          Contáctanos
        </button>
      </div>
    </div>
  );
}
