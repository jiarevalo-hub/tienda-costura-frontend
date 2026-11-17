import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://tienda-costura-backend.onrender.com/api/productos';

export default function AdminProductos({ alCrearProducto }) {
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: 'Servicio',
        imagen_url: ''
    });
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');

        const token = localStorage.getItem('token');

        try {
            await axios.post(API_URL, producto, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMensaje('¡Producto agregado al catálogo con éxito!');
            setProducto({ nombre: '', descripcion: '', precio: '', categoria: 'Servicio', imagen_url: '' });
            if (alCrearProducto) alCrearProducto();
        } catch (err) {
            alert(err.response?.data?.error || 'Error al crear el producto. Asegúrate de ser administrador.');
        }
    };

    return (
        <div className="bg-white p-8 rounded-sm shadow-2xs border border-[#e8dfd1] max-w-2xl mx-auto my-8">
            <div className="mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#b38f48] font-semibold">
                    Administración
                </span>
                <h2 className="text-xl font-medium text-gray-800 mt-1">
                    🛠️ Panel Admin: Agregar al Catálogo
                </h2>
            </div>

            {mensaje && <div className="bg-green-50 text-green-700 p-3 rounded-xs mb-4 text-xs">{mensaje}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                        Nombre del Servicio / Producto
                    </label>
                    <input
                        type="text"
                        required
                        value={producto.nombre}
                        onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                        Descripción
                    </label>
                    <textarea
                        value={producto.descripcion}
                        onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })}
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
                            onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                            Categoría
                        </label>
                        <select
                            value={producto.categoria}
                            onChange={(e) => setProducto({ ...producto, categoria: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                        >
                            <option value="Servicio">Servicio</option>
                            <option value="Tela">Tela</option>
                            <option value="Accesorio">Accesorio</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                        URL de la Imagen
                    </label>
                    <input
                        type="text"
                        value={producto.imagen_url}
                        onChange={(e) => setProducto({ ...producto, imagen_url: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#c8a45d] hover:bg-[#b59049] text-white py-3 rounded-xs transition text-xs uppercase tracking-[0.16em] font-medium"
                >
                    Publicar Producto
                </button>
            </form>
        </div>
    );
}
