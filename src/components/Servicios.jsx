import React from 'react';

const NUMERO_WHATSAPP = '593997447443';

const LISTA_SERVICIOS = [
  {
    icono: '✂️',
    titulo: 'Arreglos y Entalles',
    descripcion:
      'Ajustamos pantalones, camisas, chaquetas y faldas a tu medida exacta. Realizamos bastas invisibles, reducción de tallas y entalles modernos.',
    precioRef: 'Desde $5.00',
  },
  {
    icono: '👗',
    titulo: 'Alta Costura y Vestidos de Fiesta',
    descripcion:
      'Diseño y confección desde cero para novias, graduaciones, galas y eventos especiales con acabados finos y pruebas personalizadas.',
    precioRef: 'Cotización a medida',
  },
  {
    icono: '🧥',
    titulo: 'Cambio de Cierres yForros',
    descripcion:
      'Renovamos cierres invisibles, metálicos o de chaquetas, además de cambio completo de forros internos en sacos y abrigos.',
    precioRef: 'Desde $6.00',
  },
  {
    icono: '👔',
    titulo: 'Sastrería y Trajes Formales',
    descripcion:
      'Ajuste de hombros, mangas, largo de saco y confección de camisería y pantalones de vestir con corte clásico o slim fit.',
    precioRef: 'Desde $12.00',
  },
  {
    icono: '🪡',
    titulo: 'Transformación y Restauración',
    descripcion:
      'Dale una segunda vida a tus prendas favoritas: modernizamos cortes antiguos, reparamos rasgaduras y adaptamos diseños.',
    precioRef: 'Desde $8.00',
  },
  {
    icono: '🏢',
    titulo: 'Uniformes y Pedidos Especiales',
    descripcion:
      'Confección de uniformes corporativos, médicos o escolares con telas resistentes y excelente presentación.',
    precioRef: 'Precios por volumen',
  },
];

export default function Servicios({ irAVista }) {
  const consultarServicio = (nombreServicio) => {
    const mensaje = `¡Hola! ✂️ Me gustaría cotizar el servicio de *${nombreServicio}*.`;
    window.open(
      `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`,
      '_blank'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Encabezado */}
      <div className="text-center mb-14">
        <span className="text-xs uppercase tracking-[0.25em] text-[#b38f48] font-semibold">
          Especialistas en Costura
        </span>
        <h1 className="text-3xl sm:text-4xl font-light text-gray-800 mt-2 tracking-wide">
          Nuestros Servicios
        </h1>
        <div className="w-16 h-0.5 bg-[#c8a45d] mx-auto mt-4 mb-4" />
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          Trabajamos cada prenda con dedicación artesanal, maquinaria especializada y atención a cada costura.
        </p>
      </div>

      {/* Cuadrícula de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {LISTA_SERVICIOS.map((srv, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-sm border border-gray-200 shadow-2xs flex flex-col justify-between hover:shadow-md transition"
          >
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
          </div>
        ))}
      </div>

      {/* Proceso de trabajo */}
      <div className="bg-white border border-[#e8dfd1] rounded-sm p-8 sm:p-12 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-[#b38f48] font-semibold">
          Paso a Paso
        </span>
        <h2 className="text-2xl font-light text-gray-800 mt-2 mb-8">
          ¿Cómo trabajamos tu prenda?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="w-10 h-10 rounded-full bg-[#c8a45d] text-white font-semibold flex items-center justify-center mx-auto mb-3">
              1
            </div>
            <h4 className="font-medium text-gray-800 uppercase text-sm tracking-wider mb-1">
              Recepción y Medidas
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Evaluamos tu prenda o diseño y tomamos medidas precisas en nuestro taller.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-full bg-[#c8a45d] text-white font-semibold flex items-center justify-center mx-auto mb-3">
              2
            </div>
            <h4 className="font-medium text-gray-800 uppercase text-sm tracking-wider mb-1">
              Confección y Prueba
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Realizamos el trabajo con hilos y terminaciones de alta resistencia y ajuste perfecto.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-full bg-[#c8a45d] text-white font-semibold flex items-center justify-center mx-auto mb-3">
              3
            </div>
            <h4 className="font-medium text-gray-800 uppercase text-sm tracking-wider mb-1">
              Entrega Puntual
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Tu prenda queda lista, planchada y revisada en la fecha acordada.
            </p>
          </div>
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
