import React, { useState } from 'react';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../firebase';
import { notificar } from './Notificaciones';

const API_URL = 'https://tienda-costura-backend.onrender.com/api/auth';
const API_CLIENTES_URL = 'https://tienda-costura-backend.onrender.com/api/clientes';

export default function AuthModal({ alIniciarSesionExitoso, alCerrar }) {
    const [esRegistro, setEsRegistro] = useState(false);
    const [formData, setFormData] = useState({ nombre: '', correo: '', password: '' });
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [cargandoSocial, setCargandoSocial] = useState(false);

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
                    notificar('¡Bienvenido, Administrador! Panel de gestión desbloqueado.');
                } else {
                    notificar(`¡Bienvenido(a) de nuevo, ${usuario.nombre}!`);
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

    const iniciarConProveedor = async (proveedor, nombreProveedor) => {
        setError('');
        setMensajeExito('');
        setCargandoSocial(true);

        try {
            const resultado = await signInWithPopup(auth, proveedor);
            const user = resultado.user;
            const tokenFirebase = await user.getIdToken();

            const usuarioVerificado = {
                id: user.uid,
                nombre: user.displayName || user.email?.split('@')[0] || 'Cliente',
                correo: user.email,
                foto: user.photoURL,
                rol: 'cliente',
                proveedor: nombreProveedor,
                verificado: user.emailVerified,
            };

            // Guardamos también al cliente en el backend si no estaba registrado
            try {
                await axios.post(API_CLIENTES_URL, {
                    nombre: usuarioVerificado.nombre,
                    telefono: user.phoneNumber || '',
                    correo: usuarioVerificado.correo,
                });
            } catch {
                // Si ya existe o el endpoint no requiere duplicados, continuamos normalmente
            }

            localStorage.setItem('token', tokenFirebase);
            localStorage.setItem('usuario', JSON.stringify(usuarioVerificado));

            notificar(
                `¡Bienvenido(a), ${usuarioVerificado.nombre}! Correo verificado con ${nombreProveedor}.`
            );

            if (alIniciarSesionExitoso) alIniciarSesionExitoso(usuarioVerificado);
        } catch (err) {
            console.error(`Error al iniciar con ${nombreProveedor}:`, err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Se cerró la ventana antes de completar el inicio de sesión.');
            } else if (err.code === 'auth/operation-not-allowed') {
                setError(`El inicio de sesión con ${nombreProveedor} aún no está habilitado en tu consola de Firebase (Authentication -> Sign-in method).`);
            } else {
                setError(`No se pudo iniciar sesión con ${nombreProveedor}. Verifica tu configuración en Firebase.`);
            }
        } finally {
            setCargandoSocial(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-sm shadow-xl border border-gray-200 w-full relative">
            {alCerrar && (
                <button
                    onClick={alCerrar}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg leading-none cursor-pointer"
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

            {/* Botones de Inicio Rápido con Correo Verificado (Google / Facebook) */}
            <div className="space-y-2.5 mb-5">
                <button
                    type="button"
                    disabled={cargandoSocial}
                    onClick={() => iniciarConProveedor(googleProvider, 'Google')}
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-xs transition text-xs font-medium cursor-pointer"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                            fill="#EA4335"
                            d="M12 5c1.617 0 3.082.593 4.223 1.568l3.158-3.158C17.454 1.61 14.967.5 12 .5 7.392.5 3.418 3.138 1.503 7.007l3.694 2.866C6.085 7.197 8.803 5 12 5z"
                        />
                        <path
                            fill="#4285F4"
                            d="M23.49 12.275c0-.85-.076-1.667-.218-2.45H12v4.636h6.442c-.278 1.495-1.12 2.762-2.387 3.61v3.001h3.865c2.26-2.082 3.57-5.148 3.57-8.797z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.197 14.127A7.01 7.01 0 0 1 4.8 11.8c0-.807.143-1.582.397-2.327L1.503 6.607A11.49 11.49 0 0 0 .5 11.8c0 1.855.444 3.608 1.003 5.193l3.694-2.866z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23.5c3.24 0 5.957-1.073 7.942-2.908l-3.865-3.001c-1.074.72-2.448 1.145-4.077 1.145-3.197 0-5.915-2.157-6.885-5.06L1.42 16.542C3.335 20.41 7.392 23.5 12 23.5z"
                        />
                    </svg>
                    <span>Continuar con Google (Gmail)</span>
                </button>

                <button
                    type="button"
                    disabled={cargandoSocial}
                    onClick={() => iniciarConProveedor(facebookProvider, 'Facebook')}
                    className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white py-2.5 px-4 rounded-xs transition text-xs font-medium cursor-pointer"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Continuar con Facebook</span>
                </button>
            </div>

            <div className="relative flex py-2 items-center mb-4">
                <div className="grow border-t border-gray-200" />
                <span className="shrink mx-3 text-[11px] uppercase tracking-widest text-gray-400">
                    o con tu correo
                </span>
                <div className="grow border-t border-gray-200" />
            </div>

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
                    className="w-full bg-[#c8a45d] hover:bg-[#b59049] text-white py-3 rounded-xs transition text-xs uppercase tracking-[0.18em] font-medium cursor-pointer"
                >
                    {esRegistro ? 'Registrarse' : 'Entrar'}
                </button>
            </form>

            <div className="mt-5 text-center">
                <button
                    onClick={() => { setEsRegistro(!esRegistro); setError(''); setMensajeExito(''); }}
                    className="text-xs text-[#a37f38] hover:underline font-medium cursor-pointer"
                >
                    {esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
                </button>
            </div>
        </div>
    );
}
