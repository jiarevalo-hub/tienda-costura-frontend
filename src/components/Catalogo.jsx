import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { notificar, confirmarAccion } from './Notificaciones';

const API_URL = 'https://tienda-costura-backend.onrender.com/api/productos';
const NUMERO_WHATSAPP = '593997447443';
const IMAGEN_POR_DEFECTO =
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80';

export default function Catalogo({ esAdmin, alSeleccionarParaEditar }) {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [categoriaActiva, setCategoriaActiva] = useState('Todos');
    const [busqueda, setBusqueda] = useState('');
    const [productoVistaPrevia, setProductoVistaPrevia] = useState(null);
    const [cantidadPrevia, setCantidadPrevia] = useState(1);

    const obtenerProductos = async () => {
        try {
            const respuesta = await axios.get(API_URL);
            setProductos(respuesta.data);
        } catch (error) {
            console.error('Error al cargar el catálogo:', error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerProductos();
    }, []);

    // Abrir modal de vista previa completa consultando GET /api/productos/:id
    const abrirVistaPrevia = async (producto) => {
        setProductoVistaPrevia(producto);
        setCantidadPrevia(1);
        try {
            const res = await axios.get(`${API_URL}/${producto.id}`);
            if (res.data) {
                setProductoVistaPrevia(res.data);
            }
        } catch {
            // Si falla la petición individual, conservamos el objeto del listado
        }
    };

    // Eliminar un producto del catálogo (DELETE /api/productos/:id)
    const eliminarProductoAdmin = async (id, nombre) => {
        const confirmado = await confirmarAccion({
            titulo: 'Eliminar del catálogo',
            mensaje: `¿Estás seguro de eliminar "${nombre}" del catálogo de la tienda?`,
            textoConfirmar: 'Sí, eliminar',
            peligro: true,
        });
        if (!confirmado) {
            return;
        }
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProductos(productos.filter((p) => p.id !== id));
            setCarrito(carrito.filter((item) => item.id !== id));
            if (productoVistaPrevia?.id === id) {
                setProductoVistaPrevia(null);
            }
            notificar(`"${nombre}" fue eliminado del catálogo.`);
        } catch (err) {
            notificar(
                err.response?.data?.error ||
                    'No se pudo eliminar el producto. Verifica tu sesión de administrador.',
                'error'
            );
        }
    };

    // Agregar producto al carrito (soporta cantidad personalizada desde la vista previa)
    const agregarAlCarrito = (producto, cantidadAgregar = 1) => {
        const existe = carrito.find((item) => item.id === producto.id);
        if (existe) {
            setCarrito(
                carrito.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + cantidadAgregar }
                        : item
                )
            );
        } else {
            setCarrito([...carrito, { ...producto, cantidad: cantidadAgregar }]);
        }
    };

    // Quitar del carrito
    const eliminarDelCarrito = (id) => {
        setCarrito(carrito.filter((item) => item.id !== id));
    };

    // Calcular el precio total y cantidad total de artículos
    const totalPrecio = carrito.reduce(
        (suma, item) => suma + Number(item.precio) * item.cantidad,
        0
    );
    const totalArticulos = carrito.reduce((suma, item) => suma + item.cantidad, 0);

    // Enviar pedido del carrito por WhatsApp
    const enviarPorWhatsApp = () => {
        if (carrito.length === 0) return;

        let mensaje =
            '¡Hola! ✂️ Me gustaría hacer el siguiente pedido desde la tienda web:\n\n';

        carrito.forEach((item, index) => {
            mensaje += `${index + 1}. *${item.nombre}* (Cant: ${item.cantidad}) - $${(
                item.precio * item.cantidad
            ).toFixed(2)}\n`;
        });

        mensaje += `\n*Total a pagar: $${totalPrecio.toFixed(
            2
        )}*\n\nPor favor, ¿me confirman los siguientes pasos? ¡Gracias!`;

        const urlWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(
            mensaje
        )}`;
        window.open(urlWhatsApp, '_blank');
    };

    // Consultar un producto directo desde la vista previa
    const consultarProductoWhatsApp = (producto, cantidad) => {
        const subtotal = (Number(producto.precio) * cantidad).toFixed(2);
        const mensaje = `¡Hola! ✂️ Estoy viendo en el catálogo el producto *${producto.nombre}* (Categoría: ${producto.categoria || 'General'}, Cant: ${cantidad} - $${subtotal}) y me gustaría más información.`;
        window.open(
            `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`,
            '_blank'
        );
    };

    const categorias = [
        'Todos',
        ...new Set(productos.map((p) => p.categoria).filter(Boolean)),
    ];

    const normalizarTexto = (texto = '') =>
        texto
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    const terminoNormalizado = normalizarTexto(busqueda.trim());

    const productosFiltrados = productos.filter((p) => {
        const coincideCategoria =
            categoriaActiva === 'Todos' || p.categoria === categoriaActiva;
        if (!coincideCategoria) return false;
        if (!terminoNormalizado) return true;

        const nombre = normalizarTexto(p.nombre);
        const descripcion = normalizarTexto(p.descripcion);
        const categoria = normalizarTexto(p.categoria);

        return (
            nombre.includes(terminoNormalizado) ||
            descripcion.includes(terminoNormalizado) ||
            categoria.includes(terminoNormalizado)
        );
    });

    if (cargando) {
        return (
            <div className="text-center py-16 text-gray-500 tracking-wide text-sm uppercase">
                Cargando catálogo de la tienda...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 font-sans animate-fade-up">
            {/* Encabezado de sección */}
            <div className="text-center mb-8 sm:mb-12">
                <span className="text-[11px] uppercase tracking-[0.28em] text-[#b38f48] font-semibold">
                    Tienda &amp; Catálogo
                </span>
                <h2 className="font-editorial text-4xl sm:text-5xl font-semibold text-gray-900 mt-1.5 tracking-wide">
                    Nuestros Productos y Servicios
                </h2>
                <div className="flex items-center justify-center gap-3 mt-3">
                    <span className="w-12 h-[1px] bg-[#c8a45d]" />
                    <span className="text-[#c8a45d] text-xs">◆</span>
                    <span className="w-12 h-[1px] bg-[#c8a45d]" />
                </div>
            </div>

            {/* Barra de búsqueda y Filtros por categoría */}
            <div className="max-w-xl mx-auto mb-6">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                        🔍
                    </span>
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar prendas, telas, arreglos o servicios..."
                        className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-xs text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#c8a45d] shadow-2xs transition"
                    />
                    {busqueda && (
                        <button
                            type="button"
                            onClick={() => setBusqueda('')}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 text-sm cursor-pointer"
                            title="Limpiar búsqueda"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {categorias.length > 1 && (
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categorias.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategoriaActiva(cat)}
                            className={`px-4 py-1.5 text-xs uppercase tracking-[0.15em] rounded-xs transition border cursor-pointer ${
                                categoriaActiva === cat
                                    ? 'bg-[#c8a45d] text-white border-[#c8a45d]'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#c8a45d]'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Catálogo de Productos (Ocupa 2 columnas en pantallas grandes) */}
                <div className="lg:col-span-2">
                    {productosFiltrados.length === 0 ? (
                        <div className="bg-[#faf9f6] border border-gray-200 rounded p-10 text-center text-gray-500 text-sm">
                            <p className="mb-3">
                                No se encontraron productos que coincidan con tu búsqueda
                                {busqueda ? ` "${busqueda}"` : ''}.
                            </p>
                            {(busqueda || categoriaActiva !== 'Todos') && (
                                <button
                                    onClick={() => {
                                        setBusqueda('');
                                        setCategoriaActiva('Todos');
                                    }}
                                    className="text-xs uppercase tracking-widest text-[#a37f38] hover:underline font-semibold cursor-pointer"
                                >
                                    Ver todos los productos
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {productosFiltrados.map((producto) => (
                                <div
                                    key={producto.id}
                                    className="card-atelier overflow-hidden flex flex-col group"
                                >
                                    {/* Contenedor de imagen completa */}
                                    <div
                                        onClick={() => abrirVistaPrevia(producto)}
                                        className="relative overflow-hidden h-64 bg-[#f9f8f6] p-3 flex items-center justify-center cursor-pointer border-b border-gray-100"
                                    >
                                        <img
                                            src={producto.imagen_url || IMAGEN_POR_DEFECTO}
                                            alt={producto.nombre}
                                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-end justify-center p-3">
                                            <span className="opacity-0 group-hover:opacity-100 transition bg-white/95 text-gray-800 text-[11px] uppercase tracking-[0.15em] font-medium px-3.5 py-1.5 rounded-xs shadow-sm">
                                                👁️ Vista previa completa
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a37f38] bg-[#f9f5ec] px-2.5 py-1 rounded-xs">
                                                    {producto.categoria}
                                                </span>
                                                <button
                                                    onClick={() => abrirVistaPrevia(producto)}
                                                    className="text-xs text-[#a37f38] hover:underline cursor-pointer"
                                                >
                                                    Ver detalle
                                                </button>
                                            </div>
                                            <h3
                                                onClick={() => abrirVistaPrevia(producto)}
                                                className="font-editorial text-2xl font-semibold text-gray-900 mt-2.5 hover:text-[#c8a45d] transition cursor-pointer"
                                            >
                                                {producto.nombre}
                                            </h3>
                                            <p className="text-gray-500 text-sm mt-1 leading-relaxed line-clamp-2">
                                                {producto.descripcion}
                                            </p>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-[#efe8da]">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-editorial text-2xl font-bold text-gray-900">
                                                    ${Number(producto.precio).toFixed(2)}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => abrirVistaPrevia(producto)}
                                                        className="border border-[#dfd4be] hover:border-[#c8a45d] text-gray-700 hover:text-[#a37f38] px-3 py-2 rounded-sm transition text-xs uppercase tracking-wider cursor-pointer"
                                                        title="Ver vista previa completa"
                                                    >
                                                        Vista Previa
                                                    </button>
                                                    <button
                                                        onClick={() => agregarAlCarrito(producto, 1)}
                                                        className="btn-gold px-4 py-2 rounded-sm text-xs uppercase tracking-[0.14em] font-semibold cursor-pointer"
                                                    >
                                                        Agregar
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Acciones exclusivas de Administrador (PUT y DELETE) */}
                                            {esAdmin && (
                                                <div className="mt-3 pt-3 border-t border-dashed border-gray-200 flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (alSeleccionarParaEditar) {
                                                                alSeleccionarParaEditar(producto);
                                                            }
                                                            document
                                                                .getElementById('form-admin-producto')
                                                                ?.scrollIntoView({ behavior: 'smooth' });
                                                        }}
                                                        className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-xs bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 cursor-pointer"
                                                    >
                                                        ✏️ Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            eliminarProductoAdmin(
                                                                producto.id,
                                                                producto.nombre
                                                            )
                                                        }
                                                        className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-xs bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 cursor-pointer"
                                                    >
                                                        🗑️ Eliminar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Carrito de Compras (Ocupa la columna derecha) */}
                <div
                    id="seccion-carrito"
                    className="bg-[#faf9f6] p-5 sm:p-6 rounded-sm shadow-2xs border border-gray-200 h-fit sticky top-24"
                >
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-800 mb-4 border-b border-gray-200 pb-3">
                        🛒 Tu Carrito de Pedidos
                    </h3>

                    {carrito.length === 0 ? (
                        <p className="text-gray-500 text-sm py-8 text-center">
                            El carrito está vacío.
                            <br />
                            <span className="text-xs text-gray-400">
                                ¡Agrega servicios o telas del catálogo!
                            </span>
                        </p>
                    ) : (
                        <div>
                            <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto mb-4">
                                {carrito.map((item) => (
                                    <li
                                        key={item.id}
                                        className="py-3 flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {item.nombre}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Cant: {item.cantidad} × $
                                                {Number(item.precio).toFixed(2)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => eliminarDelCarrito(item.id)}
                                            className="text-red-500 hover:text-red-700 text-xs font-medium ml-2 cursor-pointer"
                                        >
                                            Quitar
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between items-center text-base font-semibold text-gray-900">
                                    <span className="uppercase text-xs tracking-wider text-gray-600">
                                        Total a pagar:
                                    </span>
                                    <span className="text-lg text-[#a37f38]">
                                        ${totalPrecio.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={enviarPorWhatsApp}
                                className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white py-3 px-4 rounded-xs transition text-xs uppercase tracking-[0.14em] font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                            >
                                💬 Enviar Pedido por WhatsApp
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Barra flotante inferior de Carrito para Celular */}
            {carrito.length > 0 && (
                <div className="lg:hidden fixed bottom-4 left-4 right-20 z-40 bg-[#1c1b18] text-white px-4 py-3 rounded-sm shadow-xl flex items-center justify-between gap-2 border border-[#c8a45d]/50">
                    <div className="min-w-0">
                        <p className="text-[11px] text-[#c8a45d] uppercase tracking-wider font-semibold">
                            🛒 {totalArticulos} {totalArticulos === 1 ? 'artículo' : 'artículos'}
                        </p>
                        <p className="text-sm font-bold truncate">
                            Total: ${totalPrecio.toFixed(2)}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            document
                                .getElementById('seccion-carrito')
                                ?.scrollIntoView({ behavior: 'smooth' })
                        }
                        className="bg-[#c8a45d] text-white px-3.5 py-2 rounded-xs text-[11px] uppercase tracking-wider font-semibold shrink-0"
                    >
                        Ver Pedido
                    </button>
                </div>
            )}

            {/* MODAL DE VISTA PREVIA COMPLETA DEL PRODUCTO */}
            {productoVistaPrevia && (
                <div
                    onClick={() => setProductoVistaPrevia(null)}
                    className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-sm shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[92vh] overflow-y-auto relative grid grid-cols-1 md:grid-cols-2 my-auto"
                    >
                        <button
                            onClick={() => setProductoVistaPrevia(null)}
                            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-gray-100 text-gray-600 hover:text-gray-900 shadow-xs flex items-center justify-center text-base cursor-pointer"
                            aria-label="Cerrar vista previa"
                        >
                            ✕
                        </button>

                        {/* Columna Izquierda: Imagen completa del producto sin recortes */}
                        <div className="bg-[#f9f8f6] p-6 flex flex-col items-center justify-center min-h-[320px] md:min-h-[440px] border-b md:border-b-0 md:border-r border-gray-200">
                            <img
                                src={
                                    productoVistaPrevia.imagen_url || IMAGEN_POR_DEFECTO
                                }
                                alt={productoVistaPrevia.nombre}
                                className="max-w-full max-h-[400px] object-contain rounded-xs"
                            />
                            {productoVistaPrevia.imagen_url && (
                                <a
                                    href={productoVistaPrevia.imagen_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 text-[11px] uppercase tracking-widest text-[#a37f38] hover:underline"
                                >
                                    🔍 Ver imagen en tamaño original ↗
                                </a>
                            )}
                        </div>

                        {/* Columna Derecha: Toda la información y acciones del producto */}
                        <div className="p-6 sm:p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between pr-8">
                                    <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a37f38] bg-[#f9f5ec] px-3 py-1 rounded-xs">
                                        {productoVistaPrevia.categoria || 'Catálogo'}
                                    </span>
                                    <span className="text-[11px] text-gray-400">
                                        ID #{productoVistaPrevia.id}
                                    </span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mt-3">
                                    {productoVistaPrevia.nombre}
                                </h2>

                                <div className="text-2xl font-semibold text-[#a37f38] mt-3">
                                    ${Number(productoVistaPrevia.precio).toFixed(2)}
                                </div>

                                <div className="w-12 h-0.5 bg-[#c8a45d] my-5" />

                                <h4 className="text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold mb-2">
                                    Descripción completa
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                    {productoVistaPrevia.descripcion ||
                                        'Servicio o producto de alta calidad confeccionado y revisado en nuestro Taller de Costura.'}
                                </p>

                                <div className="mt-6 bg-[#faf9f6] border border-gray-200 rounded-xs p-3.5 text-xs text-gray-600 space-y-1.5">
                                    <p>✓ Atención y ajuste personalizado en nuestro taller.</p>
                                    <p>✓ Materiales e hilos de alta calidad y durabilidad.</p>
                                </div>
                            </div>

                            {/* Selector de cantidad y botones de acción */}
                            <div className="mt-8 pt-5 border-t border-gray-100 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-wider text-gray-600 font-medium">
                                        Cantidad:
                                    </span>
                                    <div className="flex items-center border border-gray-300 rounded-xs">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCantidadPrevia((c) => Math.max(1, c - 1))
                                            }
                                            className="px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        >
                                            −
                                        </button>
                                        <span className="px-4 py-1 text-sm font-medium text-gray-900">
                                            {cantidadPrevia}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setCantidadPrevia((c) => c + 1)}
                                            className="px-3 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        agregarAlCarrito(productoVistaPrevia, cantidadPrevia);
                                        setProductoVistaPrevia(null);
                                    }}
                                    className="w-full bg-[#c8a45d] hover:bg-[#b59049] text-white py-3 px-4 rounded-xs transition text-xs uppercase tracking-[0.16em] font-medium cursor-pointer"
                                >
                                    🛒 Agregar al Carrito ($
                                    {(
                                        Number(productoVistaPrevia.precio) * cantidadPrevia
                                    ).toFixed(2)}
                                    )
                                </button>

                                <button
                                    onClick={() =>
                                        consultarProductoWhatsApp(
                                            productoVistaPrevia,
                                            cantidadPrevia
                                        )
                                    }
                                    className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white py-2.5 px-4 rounded-xs transition text-xs uppercase tracking-[0.14em] font-medium cursor-pointer"
                                >
                                    💬 Consultar este producto por WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
