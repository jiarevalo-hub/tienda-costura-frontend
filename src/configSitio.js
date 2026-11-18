export const CLAVE_STORAGE_SITIO = 'config_sitio_costura_v1';

export const CONFIG_POR_DEFECTO = {
  general: {
    monograma: 'TC',
    logoImagen: '', // Si sube imagen desde su PC, reemplaza al monograma
    nombreTienda: 'Taller de Costura',
    subtituloTienda: 'Alta Costura & Diseño',
    whatsapp: '593997447443',
    descripcionFooter:
      'Arreglos profesionales, confección personalizada y amor por el detalle.',
    horarioResumen: 'Lun - Vie: 09:00 - 18:30 | Sáb: 09:00 - 14:00',
  },
  inicio: {
    heroImagen:
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1920&q=80',
    heroTitulo: 'Tu ropa, a tu medida',
    heroSubtitulo:
      'Arreglos profesionales, confección personalizada y amor por el detalle.',
    heroBoton: 'Ver Nuestro Catálogo',
    tarjetas: [
      {
        icono: '✂️',
        titulo: 'Arreglos Profesionales',
        descripcion:
          'Bastas, entalles, cambios de cierre y ajustes precisos para todo tipo de prendas.',
        destino: 'servicios',
        textoEnlace: 'Ver servicios →',
      },
      {
        icono: '👗',
        titulo: 'Confección a Medida',
        descripcion:
          'Creación de prendas exclusivas, vestidos de gala y trajes hechos para tu silueta.',
        destino: 'servicios',
        textoEnlace: 'Ver servicios →',
      },
      {
        icono: '🧵',
        titulo: 'Tienda de Telas y Costura',
        descripcion:
          'Explora nuestro catálogo online de telas, accesorios y servicios con pedido directo.',
        destino: 'tienda',
        textoEnlace: 'Ir a la tienda →',
      },
    ],
  },
  servicios: {
    etiqueta: 'Especialistas en Costura',
    titulo: 'Nuestros Servicios',
    subtitulo:
      'Trabajamos cada prenda con dedicación artesanal, maquinaria especializada y atención a cada costura.',
    lista: [
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
        titulo: 'Cambio de Cierres y Forros',
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
    ],
    pasosTitulo: '¿Cómo trabajamos tu prenda?',
    pasos: [
      {
        titulo: 'Recepción y Medidas',
        descripcion:
          'Evaluamos tu prenda o diseño y tomamos medidas precisas en nuestro taller.',
      },
      {
        titulo: 'Confección y Prueba',
        descripcion:
          'Realizamos el trabajo con hilos y terminaciones de alta resistencia y ajuste perfecto.',
      },
      {
        titulo: 'Entrega Puntual',
        descripcion:
          'Tu prenda queda lista, planchada y revisada en la fecha acordada.',
      },
    ],
  },
  nosotros: {
    etiqueta: 'Nuestra Esencia',
    titulo: 'Sobre Nosotros',
    imagen:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80',
    subtituloHistoria: 'Tradición y Detalle',
    tituloHistoria: 'Pasión por el arte de la costura y el buen vestir',
    parrafo1:
      'Nuestro Taller de Costura nació con la misión de ofrecer un servicio donde cada prenda recibe un trato único. Sabemos que la ropa que usas cuenta tu historia y refleja tu personalidad; por eso cuidamos cada corte, cada puntada y cada acabado.',
    parrafo2:
      'Combinamos técnicas tradicionales de sastrería y modistería con materiales de primera calidad, brindando tanto arreglos cotidianos como confecciones exclusivas a medida.',
    estadisticas: [
      { valor: '100%', etiqueta: 'Garantía de Ajuste' },
      { valor: '+500', etiqueta: 'Clientes Felices' },
      { valor: 'A Medida', etiqueta: 'Atención Personal' },
    ],
    valores: [
      {
        titulo: '✨ Calidad Artesanal',
        descripcion:
          'Cuidamos las telas delicadas y utilizamos hilos y avíos duraderos para acabados invisibles.',
      },
      {
        titulo: '⏱️ Compromiso y Puntualidad',
        descripcion:
          'Respetamos los tiempos de entrega acordados para que tengas tu prenda lista para tu ocasión especial.',
      },
      {
        titulo: '🤝 Asesoría Personalizada',
        descripcion:
          'Te orientamos sobre el mejor entalle, tipo de tela o diseño según tu estilo y necesidad.',
      },
    ],
  },
  contacto: {
    etiqueta: 'Estamos para servirte',
    titulo: 'Contacto y Ubicación',
    subtitulo:
      '¿Necesitas una cotización, agendar una toma de medidas o consultar por una prenda? Escríbenos o visítanos.',
    descripcionTaller:
      'Atención presencial para toma de medidas, pruebas de calce y recepción de prendas.',
    horarioLinea1: 'Lunes a Viernes: 09:00 a 18:30',
    horarioLinea2: 'Sábados: 09:00 a 14:00',
    mapaEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d382.24703278594563!2d-79.2037961653221!3d-3.1385501552637516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ccd186eff876d1%3A0x4bb27305ce084e87!2sartesanias!5e0!3m2!1ses!2sec!4v1794928402447!5m2!1ses!2sec',
    mapaExternoUrl:
      'https://www.google.com/maps?q=-3.1385501552637516,-79.2037961653221',
  },
};

export function obtenerConfigSitio() {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE_SITIO);
    if (!guardado) return CONFIG_POR_DEFECTO;
    const parseado = JSON.parse(guardado);
    return {
      general: { ...CONFIG_POR_DEFECTO.general, ...(parseado.general || {}) },
      inicio: { ...CONFIG_POR_DEFECTO.inicio, ...(parseado.inicio || {}) },
      servicios: {
        ...CONFIG_POR_DEFECTO.servicios,
        ...(parseado.servicios || {}),
      },
      nosotros: {
        ...CONFIG_POR_DEFECTO.nosotros,
        ...(parseado.nosotros || {}),
      },
      contacto: {
        ...CONFIG_POR_DEFECTO.contacto,
        ...(parseado.contacto || {}),
      },
    };
  } catch {
    return CONFIG_POR_DEFECTO;
  }
}

// Utilidad para convertir archivo de imagen del equipo a Base64 optimizado
export function convertirArchivoABase64(archivo, maxDimension = 1200) {
  return new Promise((resolve, reject) => {
    if (!archivo || !archivo.type.startsWith('image/')) {
      reject(new Error('Selecciona un archivo de imagen válido.'));
      return;
    }
    const lector = new FileReader();
    lector.onload = (evento) => {
      const img = new Image();
      img.onload = () => {
        let ancho = img.width;
        let alto = img.height;
        if (ancho > alto) {
          if (ancho > maxDimension) {
            alto = Math.round((alto * maxDimension) / ancho);
            ancho = maxDimension;
          }
        } else if (alto > maxDimension) {
          ancho = Math.round((ancho * maxDimension) / alto);
          alto = maxDimension;
        }
        const canvas = document.createElement('canvas');
        canvas.width = ancho;
        canvas.height = alto;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, ancho, alto);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = evento.target.result;
    };
    lector.onerror = reject;
    lector.readAsDataURL(archivo);
  });
}
