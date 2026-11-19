import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { notificar } from './Notificaciones';

const API_URL = 'https://tienda-costura-backend.onrender.com/api/productos';

const ESTADO_INICIAL = {
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'Servicio',
    imagen_url: '',
};

export default function AdminProductos({
    alGuardarProducto,
    productoEditando,
    alCancelarEdicion,
}) {
    const [producto, setProducto] = useState(ESTADO_INICIAL);
    const [modoImagen, setModoImagen] = useState('archivo'); // 'archivo' | 'url'
    const [mensaje, setMensaje] = useState('');
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (productoEditando) {
            setProducto({
                nombre: productoEditando.nombre || '',
                descripcion: productoEditando.descripcion || '',
                precio: productoEditando.precio || '',
                categoria: productoEditando.categoria || 'Servicio',
                imagen_url: productoEditando.imagen_url || '',
            });
            setMensaje('');
        } else {
            setProducto(ESTADO_INICIAL);
        }
    }, [productoEditando]);

    // Convierte y optimiza la imagen subida desde la PC/celular para no requerir link externo
    const manejarArchivoImagen = (e) => {
        const archivo = e.target.files?.[0];
        if (!archivo) return;

        if (!archivo.type.startsWith('image/')) {
            notificar(
                'Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).',
                'error'
            );
            return;
        }

        const lector = new FileReader();
        lector.onload = (evento) => {
            const img = new Image();
            img.onload = () => {
                // Redimensionamos la imagen a máximo 700px para que sea ligera y rápida de guardar
                const MAX_ANCHO = 700;
                const MAX_ALTO = 700;
                let ancho = img.width;
                let alto = img.height;

                if (ancho > alto) {
                    if (ancho > MAX_ANCHO) {
                        alto = Math.round((alto * MAX_ANCHO) / ancho);
                        ancho = MAX_ANCHO;
                    }
                } else {
                    if (alto > MAX_ALTO) {
                        ancho = Math.round((ancho * MAX_ALTO) / alto);
                        alto = MAX_ALTO;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = ancho;
                canvas.height = alto;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, ancho, alto);

                // Convertimos a formato comprimido JPEG (Base64)
                const dataUrl = canvas.toDataURL('image/jpeg', 0.78);
                setProducto((prev) => ({ ...prev, imagen_url: dataUrl }));
            };
            img.src = evento.target.result;
        };
        lector.readAsDataURL(archivo);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');
        setGuardando(true);

        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };

        try {
            if (productoEditando) {
                await axios.put(
                    `${API_URL}/${productoEditando.id}`,
                    producto,
                    config
                );
                setMensaje('¡Producto actualizado con éxito!');
                notificar('¡Producto actualizado con éxito en el catálogo!');
                if (alCancelarEdicion) alCancelarEdicion();
            } else {
                await axios.post(API_URL, producto, config);
                setMensaje('¡Producto agregado al catálogo con éxito!');
                notificar('¡Nuevo producto publicado en el catálogo!');
                setProducto(ESTADO_INICIAL);
            }

            if (alGuardarProducto) alGuardarProducto();
        } catch (err) {
            notificar(
                err.response?.data?.error ||
                    'Error al guardar el producto. Verifica tu sesión de administrador.',
                'error'
            );
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div
            id="form-admin-producto"
            className="bg-white p-8 rounded-sm shadow-2xs border border-[#e8dfd1] max-w-2xl mx-auto my-8"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#b38f48] font-semibold">
                        Administración de Catálogo
                    </span>
                    <h2 className="text-xl font-medium text-gray-800 mt-1">
                        {productoEditando
                            ? `✏️ Editando Producto #${productoEditando.id}`
                            : '🛠️ Agregar Nuevo Producto al Catálogo'}
                    </h2>
                </div>
                {productoEditando && (
                    <button
                        type="button"
                        onClick={alCancelarEdicion}
                        className="text-xs uppercase tracking-wider text-gray-500 hover:text-gray-800 border border-gray-300 px-3 py-1.5 rounded-xs cursor-pointer"
                    >
                        Cancelar edición
                    </button>
                )}
            </div>

            {mensaje && (
                <div className="bg-green-50 text-green-700 p-3 rounded-xs mb-4 text-xs">
                    {mensaje}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                        Nombre del Servicio / Producto
                    </label>
                    <input
                        type="text"
                        required
                        value={producto.nombre}
                        onChange={(e) =>
                            setProducto({ ...producto, nombre: e.target.value })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                        Descripción
                    </label>
                    <textarea
                        value={producto.descripcion}
                        onChange={(e) =>
                            setProducto({
                                ...producto,
                                descripcion: e.target.value,
                            })
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                        rows={3}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                            Precio ($)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={producto.precio}
                            onChange={(e) =>
                                setProducto({
                                    ...producto,
                                    precio: e.target.value,
                                })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                            Categoría
                        </label>
                        <select
                            value={producto.categoria}
                            onChange={(e) =>
                                setProducto({
                                    ...producto,
                                    categoria: e.target.value,
                                })
                            }
                            className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                        >
                            <option value="Servicio">Servicio</option>
                            <option value="Tela">Tela</option>
                            <option value="Accesorio">Accesorio</option>
                        </select>
                    </div>
                </div>

                {/* Selector de Imagen: Subir archivo desde la PC/Celular o pegar Link */}
                <div className="border border-gray-200 rounded-xs p-4 bg-[#faf9f6]">
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs uppercase tracking-wider text-gray-700 font-semibold">
                            Imagen del Producto (Opcional)
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setModoImagen('archivo')}
                                className={`px-3 py-1 text-[11px] uppercase tracking-wider rounded-xs border cursor-pointer ${
                                    modoImagen === 'archivo'
                                        ? 'bg-[#c8a45d] text-white border-[#c8a45d]'
                                        : 'bg-white text-gray-600 border-gray-300'
                                }`}
                            >
                                📁 Subir desde mi equipo
                            </button>
                            <button
                                type="button"
                                onClick={() => setModoImagen('url')}
                                className={`px-3 py-1 text-[11px] uppercase tracking-wider rounded-xs border cursor-pointer ${
                                    modoImagen === 'url'
                                        ? 'bg-[#c8a45d] text-white border-[#c8a45d]'
                                        : 'bg-white text-gray-600 border-gray-300'
                                }`}
                            >
                                🔗 Usar Link (URL)
                            </button>
                        </div>
                    </div>

                    {modoImagen === 'archivo' ? (
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={manejarArchivoImagen}
                                className="w-full text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xs file:border-0 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:bg-[#1c1b18] file:text-white hover:file:bg-gray-800 file:cursor-pointer cursor-pointer bg-white p-2 border border-gray-300 rounded-xs"
                            />
                            <p className="text-[11px] text-gray-500 mt-1.5">
                                Selecciona una foto desde tu computadora o celular (se comprime automáticamente). También puedes dejarlo vacío.
                            </p>
                        </div>
                    ) : (
                        <input
                            type="text"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={
                                producto.imagen_url?.startsWith('data:')
                                    ? ''
                                    : producto.imagen_url
                            }
                            onChange={(e) =>
                                setProducto({
                                    ...producto,
                                    imagen_url: e.target.value,
                                })
                            }
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                        />
                    )}

                    {/* Vista previa en vivo de la imagen cargada */}
                    {producto.imagen_url && (
                        <div className="mt-3 flex items-center gap-4 bg-white p-2.5 border border-gray-200 rounded-xs">
                            <img
                                src={producto.imagen_url}
                                alt="Vista previa"
                                className="w-16 h-16 object-contain rounded-xs border border-gray-100 bg-[#f9f8f6]"
                            />
                            <div className="flex-1 text-xs text-gray-600">
                                <p className="font-medium text-gray-800">
                                    Imagen lista para guardar
                                </p>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setProducto({ ...producto, imagen_url: '' })
                                    }
                                    className="text-red-500 hover:underline mt-1 cursor-pointer"
                                >
                                    Quitar imagen
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={guardando}
                    className="w-full bg-[#c8a45d] hover:bg-[#b59049] text-white py-3 rounded-xs transition text-xs uppercase tracking-[0.16em] font-medium cursor-pointer"
                >
                    {guardando
                        ? 'Guardando...'
                        : productoEditando
                        ? 'Guardar Cambios (PUT)'
                        : 'Publicar Producto (POST)'}
                </button>
            </form>
        </div>
    );
}
