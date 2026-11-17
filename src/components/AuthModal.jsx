import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://tienda-costura-backend.onrender.com/api/auth';

export default function AuthModal({ alIniciarSesionExitoso, alCerrar }) {
    const [esRegistro, setEsRegistro] = useState(false);
    const [formData, setFormData] = useState({ nombre: '', correo: '', password: '' });
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');

        const endpoint = esRegistro ? `${API_URL}/registro` : `${API_URL}/login`;

        try {
            const respuesta = await axios.post(endpoint, formData);

            if (!esRegistro) {
                const { token, usuario } = respuesta.data;
                localStorage.setItem('token', token);
                localStorage.setItem('usuario', JSON.stringify(usuario));

                if (usuario.rol === 'admin') {
                    alert('¡Bienvenido, Administrador! Panel de productos desbloqueado.');
                } else {
                    alert(`¡Bienvenido de nuevo, ${usuario.nombre}!`);
                }

                if (alIniciarSesionExitoso) alIniciarSesionExitoso(usuario);
            } else {
                setMensajeExito('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
                setEsRegistro(false);
                setFormData({ nombre: '', correo: '', password: '' });
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Ocurrió un error en la autenticación.');
        }
    };

    return (
        <div className="bg-white p-8 rounded-sm shadow-xl border border-gray-200 w-full relative">
            {alCerrar && (
                <button
                    onClick={alCerrar}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg leading-none"
                    aria-label="Cerrar"
                >
                    ✕
                </button>
            )}

            <div className="text-center mb-6">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#b38f48] font-semibold">
                    Taller de Costura
                </span>
                <h2 className="text-2xl font-light text-gray-800 mt-1">
                    {esRegistro ? 'Crear Cuenta de Cliente' : 'Iniciar Sesión'}
                </h2>
                <div className="w-12 h-0.5 bg-[#c8a45d] mx-auto mt-3" />
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-xs mb-4 text-xs">{error}</div>}
            {mensajeExito && <div className="bg-green-50 text-green-700 p-3 rounded-xs mb-4 text-xs">{mensajeExito}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {esRegistro && (
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                            Nombre completo
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.correo}
                        onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                    />
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xs text-sm focus:outline-none focus:border-[#c8a45d]"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#c8a45d] hover:bg-[#b59049] text-white py-3 rounded-xs transition text-xs uppercase tracking-[0.18em] font-medium"
                >
                    {esRegistro ? 'Registrarse' : 'Entrar'}
                </button>
            </form>

            <div className="mt-5 text-center">
                <button
                    onClick={() => { setEsRegistro(!esRegistro); setError(''); setMensajeExito(''); }}
                    className="text-xs text-[#a37f38] hover:underline font-medium"
                >
                    {esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
                </button>
            </div>
        </div>
    );
}
