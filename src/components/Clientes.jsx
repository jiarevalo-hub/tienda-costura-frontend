import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_CLIENTES_URL = 'https://tienda-costura-backend.onrender.com/api/clientes';
const API_USUARIOS_URL = 'https://tienda-costura-backend.onrender.com/api/auth/usuarios';

export default function Clientes() {
    const [subPestana, setSubPestana] = useState('clientes'); // 'clientes' | 'usuarios'

    // Estados para Clientes
    const [clientes, setClientes] = useState([]);
    const [formData, setFormData] = useState({ nombre: '', telefono: '', correo: '' });
    const [clienteEditandoId, setClienteEditandoId] = useState(null);
    const [idBusquedaCliente, setIdBusquedaCliente] = useState('');

    // Estados para Usuarios
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioEditandoId, setUsuarioEditandoId] = useState(null);
    const [formUsuario, setFormUsuario] = useState({ nombre: '', correo: '', rol: 'cliente' });
    const [idBusquedaUsuario, setIdBusquedaUsuario] = useState('');

    // ==================== MÉTODOS DE CLIENTES ====================

    // GET /api/clientes
    const obtenerClientes = async () => {
        try {
            const respuesta = await axios.get(API_CLIENTES_URL);
            setClientes(respuesta.data);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    };

    // GET /api/clientes/:id
    const buscarClientePorId = async (e) => {
        e.preventDefault();
        if (!idBusquedaCliente.trim()) {
            obtenerClientes();
            return;
        }
        try {
            const respuesta = await axios.get(`${API_CLIENTES_URL}/${idBusquedaCliente.trim()}`);
            setClientes(respuesta.data ? [respuesta.data] : []);
        } catch (error) {
            alert(error.response?.data?.error || 'Cliente no encontrado con ese ID.');
        }
    };

    // POST /api/clientes o PUT /api/clientes/:id
    const handleSubmitCliente = async (e) => {
        e.preventDefault();
        try {
            if (clienteEditandoId) {
                await axios.put(`${API_CLIENTES_URL}/${clienteEditandoId}`, formData);
                setClienteEditandoId(null);
            } else {
                await axios.post(API_CLIENTES_URL, formData);
            }
            setFormData({ nombre: '', telefono: '', correo: '' });
            obtenerClientes();
        } catch (error) {
            console.error('Error al guardar cliente:', error);
            alert('No se pudo guardar el cliente.');
        }
    };

    // Preparar edición de cliente
    const iniciarEdicionCliente = (cliente) => {
        setClienteEditandoId(cliente.id);
        setFormData({
            nombre: cliente.nombre || '',
            telefono: cliente.telefono || '',
            correo: cliente.correo || '',
        });
    };

    // DELETE /api/clientes/:id
    const eliminarCliente = async (id, nombre) => {
        if (!window.confirm(`¿Deseas eliminar al cliente "${nombre}"?`)) return;
        try {
            await axios.delete(`${API_CLIENTES_URL}/${id}`);
            setClientes(clientes.filter((c) => c.id !== id));
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            alert('No se pudo eliminar el cliente.');
        }
    };

    // ==================== MÉTODOS DE USUARIOS ====================

    // GET /api/auth/usuarios
    const obtenerUsuarios = async () => {
        try {
            const respuesta = await axios.get(API_USUARIOS_URL);
            setUsuarios(respuesta.data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    // GET /api/auth/usuarios/:id
    const buscarUsuarioPorId = async (e) => {
        e.preventDefault();
        if (!idBusquedaUsuario.trim()) {
            obtenerUsuarios();
            return;
        }
        try {
            const respuesta = await axios.get(`${API_USUARIOS_URL}/${idBusquedaUsuario.trim()}`);
            setUsuarios(respuesta.data ? [respuesta.data] : []);
        } catch (error) {
            alert(error.response?.data?.error || 'Usuario no encontrado con ese ID.');
        }
    };

    // PUT /api/auth/usuarios/:id
    const handleSubmitUsuario = async (e) => {
        e.preventDefault();
        if (!usuarioEditandoId) return;
        try {
            await axios.put(`${API_USUARIOS_URL}/${usuarioEditandoId}`, formUsuario);
            setUsuarioEditandoId(null);
            setFormUsuario({ nombre: '', correo: '', rol: 'cliente' });
            obtenerUsuarios();
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            alert('No se pudo actualizar el usuario.');
        }
    };

    // DELETE /api/auth/usuarios/:id
    const eliminarUsuario = async (id, nombre) => {
        if (!window.confirm(`¿Deseas eliminar la cuenta de usuario "${nombre}"?`)) return;
        try {
            await axios.delete(`${API_USUARIOS_URL}/${id}`);
            setUsuarios(usuarios.filter((u) => u.id !== id));
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            alert('No se pudo eliminar el usuario.');
        }
    };

    useEffect(() => {
        obtenerClientes();
        obtenerUsuarios();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 font-sans">
            {/* Encabezado */}
            <div className="text-center mb-8">
                <span className="text-xs uppercase tracking-[0.25em] text-[#b38f48] font-semibold">
                    Panel de Gestión (CRUD Completo)
                </span>
                <h1 className="text-2xl sm:text-3xl font-light text-gray-800 mt-2 tracking-wide">
                    Directorio de Clientes y Usuarios
                </h1>
                <div className="w-16 h-0.5 bg-[#c8a45d] mx-auto mt-4" />
            </div>

            {/* Selector de pestaña: Clientes vs Usuarios */}
            <div className="flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3 mb-8 sm:mb-10">
                <button
                    onClick={() => setSubPestana('clientes')}
                    className={`w-full sm:w-auto px-6 py-2.5 text-xs uppercase tracking-[0.16em] rounded-xs border transition cursor-pointer ${
                        subPestana === 'clientes'
                            ? 'bg-[#c8a45d] text-white border-[#c8a45d] font-semibold'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#c8a45d]'
                    }`}
                >
                    👥 Clientes ({clientes.length})
                </button>
                <button
                    onClick={() => setSubPestana('usuarios')}
                    className={`w-full sm:w-auto px-6 py-2.5 text-xs uppercase tracking-[0.16em] rounded-xs border transition cursor-pointer ${
                        subPestana === 'usuarios'
                            ? 'bg-[#c8a45d] text-white border-[#c8a45d] font-semibold'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#c8a45d]'
                    }`}
                >
                    🔐 Cuentas de Usuario ({usuarios.length})
                </button>
            </div>

            {subPestana === 'clientes' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario Crear / Editar Cliente (POST y PUT) */}
                    <div className="bg-white p-6 rounded-sm shadow-2xs border border-gray-200 h-fit">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-semibold uppercase tracking-wider text-gray-800">
                                {clienteEditandoId
                                    ? `✏️ Editar Cliente #${clienteEditandoId}`
                                    : '➕ Nuevo Cliente'}
                            </h2>
                            {clienteEditandoId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setClienteEditandoId(null);
                                        setFormData({ nombre: '', telefono: '', correo: '' });
                                    }}
                                    className="text-xs text-gray-500 hover:text-gray-800 underline cursor-pointer"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmitCliente} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nombre}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nombre: e.target.value })
                                    }
                                    className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                                    Teléfono
                                </label>
                                <input
                                    type="text"
                                    value={formData.telefono}
                                    onChange={(e) =>
                                        setFormData({ ...formData, telefono: e.target.value })
                                    }
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
                                    onChange={(e) =>
                                        setFormData({ ...formData, correo: e.target.value })
                                    }
                                    className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#c8a45d] hover:bg-[#b59049] text-white py-2.5 rounded-xs transition text-xs uppercase tracking-[0.16em] font-medium cursor-pointer"
                            >
                                {clienteEditandoId ? 'Actualizar Cliente (PUT)' : 'Guardar Cliente (POST)'}
                            </button>
                        </form>
                    </div>

                    {/* Tabla de Clientes (GET, GET/:id, PUT/:id, DELETE/:id) */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-sm shadow-2xs border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <h2 className="text-base font-semibold uppercase tracking-wider text-gray-800">
                                Lista de Clientes Registrados
                            </h2>

                            {/* Buscador por ID (GET /api/clientes/:id) */}
                            <form onSubmit={buscarClientePorId} className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={idBusquedaCliente}
                                    onChange={(e) => setIdBusquedaCliente(e.target.value)}
                                    placeholder="Buscar por ID..."
                                    className="p-1.5 px-3 border border-gray-300 rounded-xs text-xs w-36 focus:outline-none focus:border-[#c8a45d]"
                                />
                                <button
                                    type="submit"
                                    className="bg-[#1c1b18] text-white px-3 py-1.5 rounded-xs text-xs uppercase tracking-wider cursor-pointer"
                                >
                                    Buscar
                                </button>
                                {idBusquedaCliente && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIdBusquedaCliente('');
                                            obtenerClientes();
                                        }}
                                        className="text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
                                    >
                                        Todos
                                    </button>
                                )}
                            </form>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#faf9f6] border-b border-gray-200">
                                        <th className="p-3 text-xs uppercase tracking-wider font-semibold text-gray-600">
                                            ID
                                        </th>
                                        <th className="p-3 text-xs uppercase tracking-wider font-semibold text-gray-600">
                                            Nombre
                                        </th>
                                        <th className="p-3 text-xs uppercase tracking-wider font-semibold text-gray-600">
                                            Teléfono
                                        </th>
                                        <th className="p-3 text-xs uppercase tracking-wider font-semibold text-gray-600">
                                            Correo
                                        </th>
                                        <th className="p-3 text-xs uppercase tracking-wider font-semibold text-gray-600 text-right">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientes.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="p-6 text-center text-gray-500 text-sm"
                                            >
                                                No hay clientes registrados.
                                            </td>
                                        </tr>
                                    ) : (
                                        clientes.map((cliente) => (
                                            <tr
                                                key={cliente.id}
                                                className="border-b border-gray-100 hover:bg-gray-50"
                                            >
                                                <td className="p-3 text-sm text-gray-500">
                                                    #{cliente.id}
                                                </td>
                                                <td className="p-3 text-sm text-gray-800 font-medium">
                                                    {cliente.nombre}
                                                </td>
                                                <td className="p-3 text-sm text-gray-600">
                                                    {cliente.telefono || 'N/A'}
                                                </td>
                                                <td className="p-3 text-sm text-gray-600">
                                                    {cliente.correo || 'N/A'}
                                                </td>
                                                <td className="p-3 text-sm text-right space-x-2 whitespace-nowrap">
                                                    <button
                                                        onClick={() => iniciarEdicionCliente(cliente)}
                                                        className="text-xs px-2.5 py-1 rounded-xs bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 cursor-pointer"
                                                    >
                                                        ✏️ Editar
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            eliminarCliente(cliente.id, cliente.nombre)
                                                        }
                                                        className="text-xs px-2.5 py-1 rounded-xs bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 cursor-pointer"
                                                    >
                                                        🗑️ Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                /* PESTAÑA DE GESTIÓN DE USUARIOS (/api/auth/usuarios) */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario Editar Usuario (PUT /api/auth/usuarios/:id) */}
                    <div className="bg-white p-6 rounded-sm shadow-2xs border border-gray-200 h-fit">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-semibold uppercase tracking-wider text-gray-800">
                                {usuarioEditandoId
                                    ? `✏️ Editar Usuario #${usuarioEditandoId}`
                                    : '🔐 Selecciona un Usuario'}
                            </h2>
                            {usuarioEditandoId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUsuarioEditandoId(null);
                                        setFormUsuario({ nombre: '', correo: '', rol: 'cliente' });
                                    }}
                                    className="text-xs text-gray-500 hover:text-gray-800 underline cursor-pointer"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>

                        {!usuarioEditandoId ? (
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Haz clic en el botón <b>"✏️ Editar"</b> de cualquier usuario en la tabla para modificar su nombre, correo o cambiar su rol entre <b>Cliente</b> y <b>Admin</b>.
                            </p>
                        ) : (
                            <form onSubmit={handleSubmitUsuario} className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formUsuario.nombre}
                                        onChange={(e) =>
                                            setFormUsuario({ ...formUsuario, nombre: e.target.value })
                                        }
                                        className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                                        Correo
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formUsuario.correo}
                                        onChange={(e) =>
                                            setFormUsuario({ ...formUsuario, correo: e.target.value })
                                        }
                                        className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                                        Rol en el sistema
                                    </label>
                                    <select
                                        value={formUsuario.rol}
                                        onChange={(e) =>
                                            setFormUsuario({ ...formUsuario, rol: e.target.value })
                                        }
                                        className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                                    >
                                        <option value="cliente">cliente</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#c8a45d] hover:bg-[#b59049] text-white py-2.5 rounded-xs transition text-xs uppercase tracking-[0.16em] font-medium cursor-pointer"
                                >
                                    Guardar Cambios (PUT)
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Tabla de Usuarios (GET, GET/:id, PUT/:id, DELETE/:id) */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-sm shadow-2xs border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <h2 className="text-base font-semibold uppercase tracking-wider text-gray-800">
                                Usuarios Registrados
                            </h2>

                            <form onSubmit={buscarUsuarioPorId} className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={idBusquedaUsuario}
                                    onChange={(e) => setIdBusquedaUsuario(e.target.value)}
                                    placeholder="Buscar por ID..."
                                    className="p-1.5 px-3 border border-gray-300 rounded-xs text-xs w-36 focus:outline-none focus:border-[#c8a45d]"
                                />
                                <button
                                    type="submit"
                                    className="bg-[#1c1b18] text-white px-3 py-1.5 rounded-xs text-xs uppercase tracking-wider cursor-pointer"
                                >
                                    Buscar
                                </button>
                                {idBusquedaUsuario && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIdBusquedaUsuario('');
                                            obtenerUsuarios();
                                        }}
                                        className="text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
                                    >
                                        Todos
                                    </button>
                                )}
                            </form>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#faf9f6] border-b border-gray-200">
                                        <th className="p-3 text-xs uppercase tracking-wider font-semibold text-gray-600">
                                            ID
                                        </th>
                                        <th className="p-3 text-xs uppercase tracking-wider font-semibold text-gray-600">
                                            Nombre
                                        </th>
                                        <th className="p-3 text-xs uppercase tracking-wider font-semibold text-gray-600">
                                            Correo
                                        </th>
                                        <th className="p-3 text-xs uppercase tracking-wider font-semibold text-gray-600">
                                            Rol
                                        </th>
                                        <th className="p-3 text-xs uppercase tracking-wider font-semibold text-gray-600 text-right">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="p-6 text-center text-gray-500 text-sm"
                                            >
                                                No hay usuarios encontrados.
                                            </td>
                                        </tr>
                                    ) : (
                                        usuarios.map((usr) => (
                                            <tr
                                                key={usr.id}
                                                className="border-b border-gray-100 hover:bg-gray-50"
                                            >
                                                <td className="p-3 text-sm text-gray-500">
                                                    #{usr.id}
                                                </td>
                                                <td className="p-3 text-sm text-gray-800 font-medium">
                                                    {usr.nombre}
                                                </td>
                                                <td className="p-3 text-sm text-gray-600">
                                                    {usr.correo}
                                                </td>
                                                <td className="p-3 text-sm">
                                                    <span
                                                        className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded font-semibold ${
                                                            usr.rol === 'admin'
                                                                ? 'bg-[#f5efe2] text-[#a37f38]'
                                                                : 'bg-gray-100 text-gray-600'
                                                        }`}
                                                    >
                                                        {usr.rol}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-sm text-right space-x-2 whitespace-nowrap">
                                                    <button
                                                        onClick={() => {
                                                            setUsuarioEditandoId(usr.id);
                                                            setFormUsuario({
                                                                nombre: usr.nombre || '',
                                                                correo: usr.correo || '',
                                                                rol: usr.rol || 'cliente',
                                                            });
                                                        }}
                                                        className="text-xs px-2.5 py-1 rounded-xs bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 cursor-pointer"
                                                    >
                                                        ✏️ Editar
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            eliminarUsuario(usr.id, usr.nombre)
                                                        }
                                                        className="text-xs px-2.5 py-1 rounded-xs bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 cursor-pointer"
                                                    >
                                                        🗑️ Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
