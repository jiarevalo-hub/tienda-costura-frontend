import React, { useState, useEffect } from 'react';
import axios from 'axios';

// URL de tu backend desplegado en Render
const API_URL = 'https://tienda-costura-backend.onrender.com/api/clientes';

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [formData, setFormData] = useState({ nombre: '', telefono: '', correo: '' });

    // Función para obtener los clientes de la API
    const obtenerClientes = async () => {
        try {
            const respuesta = await axios.get(API_URL);
            setClientes(respuesta.data);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    };

    useEffect(() => {
        obtenerClientes();
    }, []);

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, formData);
            setFormData({ nombre: '', telefono: '', correo: '' }); // Limpiar formulario
            obtenerClientes(); // Recargar la lista
        } catch (error) {
            console.error('Error al registrar cliente:', error);
            alert('No se pudo registrar el cliente.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 font-sans">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">✂️ Tienda de Costura - React</h1>

            {/* Formulario */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Registrar Nuevo Cliente</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Nombre completo</label>
                        <input
                            type="text"
                            required
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Teléfono</label>
                        <input
                            type="text"
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Correo electrónico</label>
                        <input
                            type="email"
                            value={formData.correo}
                            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition font-medium">
                        Guardar Cliente
                    </button>
                </form>
            </div>

            {/* Tabla de Clientes */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Clientes Registrados</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="p-3 text-sm font-semibold text-gray-600">ID</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Nombre</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Teléfono</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Correo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-gray-500">No hay clientes registrados aún.</td>
                                </tr>
                            ) : (
                                clientes.map((cliente) => (
                                    <tr key={cliente.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 text-sm text-gray-700">{cliente.id}</td>
                                        <td className="p-3 text-sm text-gray-700 font-medium">{cliente.nombre}</td>
                                        <td className="p-3 text-sm text-gray-700">{cliente.telefono || 'N/A'}</td>
                                        <td className="p-3 text-sm text-gray-700">{cliente.correo || 'N/A'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}