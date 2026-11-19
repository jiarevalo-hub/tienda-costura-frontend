import React, { useState, useEffect } from 'react';
import Inicio from './components/Inicio';
import Servicios from './components/Servicios';
import Contacto from './components/Contacto';
import SobreNosotros from './components/SobreNosotros';
import Catalogo from './components/Catalogo';
import Clientes from './components/Clientes';
import Seguimiento from './components/Seguimiento';
import AuthModal from './components/AuthModal';
import AdminProductos from './components/AdminProductos';
import ContenedorNotificaciones, {
  notificar,
  confirmarAccion,
} from './components/Notificaciones';
import {
  CLAVE_STORAGE_SITIO,
  CONFIG_POR_DEFECTO,
  obtenerConfigSitio,
  convertirArchivoABase64,
} from './configSitio';

const ITEMS_MENU_BASE = [
  { id: 'inicio', ruta: '/inicio', label: 'Inicio', icono: '🏠' },
  { id: 'servicios', ruta: '/servicios', label: 'Servicios', icono: '✂️' },
  { id: 'seguimiento', ruta: '/seguimiento', label: 'Seguimiento', icono: '📦' },
  { id: 'contacto', ruta: '/contacto', label: 'Contacto', icono: '📍' },
  { id: 'nosotros', ruta: '/nosotros', label: 'Sobre Nosotros', icono: '✨' },
  { id: 'tienda', ruta: '/tienda', label: 'Tienda', icono: '🛍️' },
];

function obtenerVistaDesdeUrl() {
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  if (path === '/servicios') return 'servicios';
  if (path === '/seguimiento' || path === '/pedidos') return 'seguimiento';
  if (path === '/contacto') return 'contacto';
  if (path === '/nosotros' || path === '/sobre-nosotros') return 'nosotros';
  if (path === '/tienda' || path === '/catalogo') return 'tienda';
  if (path === '/clientes' || path === '/usuarios') return 'clientes';
  return 'inicio';
}

function App() {
  const [vistaActual, setVistaActual] = useState(() => obtenerVistaDesdeUrl());
  const [usuario, setUsuario] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [recargarCatalogo, setRecargarCatalogo] = useState(0);
  const [productoEditando, setProductoEditando] = useState(null);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  const [configSitio, setConfigSitio] = useState(() => obtenerConfigSitio());
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (e) {
        console.error('Error al leer usuario guardado:', e);
      }
    }

    // Si entra a la raíz "/", reflejamos "/inicio" en la barra de direcciones
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.history.replaceState({ vista: 'inicio' }, '', '/inicio');
    }

    // Escuchar botones Atrás / Adelante del navegador
    const manejarPopState = () => {
      setVistaActual(obtenerVistaDesdeUrl());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', manejarPopState);
    return () => window.removeEventListener('popstate', manejarPopState);
  }, []);

  const guardarConfigSitio = (nuevaConfig) => {
    setConfigSitio(nuevaConfig);
    try {
      localStorage.setItem(CLAVE_STORAGE_SITIO, JSON.stringify(nuevaConfig));
    } catch (e) {
      console.error('Error al guardar configuración del sitio:', e);
    }
  };

  const actualizarSeccion = (seccion, nuevosDatos) => {
    guardarConfigSitio({
      ...configSitio,
      [seccion]: nuevosDatos,
    });
  };

  const restaurarValoresOriginales = async () => {
    const confirmado = await confirmarAccion({
      titulo: 'Restaurar diseño original',
      mensaje:
        '¿Deseas restaurar todos los textos e imágenes de la página a sus valores originales?',
      textoConfirmar: 'Sí, restaurar',
      peligro: true,
    });
    if (confirmado) {
      localStorage.removeItem(CLAVE_STORAGE_SITIO);
      setConfigSitio(CONFIG_POR_DEFECTO);
      notificar('Se restauraron los valores originales de la página.');
    }
  };

  const subirLogoImagen = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    try {
      const base64 = await convertirArchivoABase64(archivo, 400);
      actualizarSeccion('general', {
        ...configSitio.general,
        logoImagen: base64,
      });
      notificar('Logo actualizado correctamente.');
    } catch (err) {
      notificar(err.message, 'error');
    }
  };

  const esAdmin = usuario && usuario.rol === 'admin';

  const itemsMenu = esAdmin
    ? [
        ...ITEMS_MENU_BASE,
        {
          id: 'clientes',
          ruta: '/clientes',
          label: 'Clientes / Usuarios',
          icono: '👥',
        },
      ]
    : ITEMS_MENU_BASE;

  const irAVista = (nuevaVista) => {
    setVistaActual(nuevaVista);
    setMenuMovilAbierto(false);
    const nuevaRuta = `/${nuevaVista}`;
    if (window.location.pathname !== nuevaRuta) {
      window.history.pushState({ vista: nuevaVista }, '', nuevaRuta);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setProductoEditando(null);
    setModoEdicion(false);
    if (vistaActual === 'clientes') {
      irAVista('inicio');
    }
  };

  const { general } = configSitio;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-gray-800 overflow-x-hidden">
      <ContenedorNotificaciones />
      {/* Barra superior exclusiva de Administrador (Adaptada para móvil y desktop) */}
      {esAdmin && (
        <div className="bg-[#1c1b18] text-white px-4 sm:px-6 py-2.5 border-b border-gray-800 z-50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#c8a45d]" />
                <span className="uppercase tracking-widest text-[#c8a45d] font-semibold">
                  Modo Administrador
                </span>
              </div>
              {modoEdicion && (
                <button
                  type="button"
                  onClick={restaurarValoresOriginales}
                  className="sm:hidden text-gray-300 hover:text-white underline text-[11px] cursor-pointer"
                >
                  ↺ Restaurar
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setModoEdicion(!modoEdicion)}
                className={`w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-xs text-xs uppercase tracking-wider font-semibold transition cursor-pointer ${
                  modoEdicion
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-[#c8a45d] hover:bg-[#b59049] text-white'
                }`}
              >
                {modoEdicion
                  ? '✓ Terminar Edición de Página'
                  : '✏️ Editar Toda la Página'}
              </button>

              {modoEdicion && (
                <button
                  type="button"
                  onClick={restaurarValoresOriginales}
                  className="hidden sm:inline text-gray-300 hover:text-white underline text-xs cursor-pointer"
                >
                  ↺ Restaurar original
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Editor de Encabezado y Logo cuando Modo Edición está activo */}
      {esAdmin && modoEdicion && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-3">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center text-xs">
            <div>
              <label className="text-amber-900 font-semibold block mb-1">
                ✏️ Siglas / Monograma:
              </label>
              <input
                type="text"
                value={general.monograma}
                onChange={(e) =>
                  actualizarSeccion('general', {
                    ...general,
                    monograma: e.target.value,
                  })
                }
                className="w-full p-2 bg-white border border-amber-300 rounded-xs"
              />
            </div>
            <div>
              <label className="text-amber-900 font-semibold block mb-1">
                ✏️ Nombre del Negocio:
              </label>
              <input
                type="text"
                value={general.nombreTienda}
                onChange={(e) =>
                  actualizarSeccion('general', {
                    ...general,
                    nombreTienda: e.target.value,
                  })
                }
                className="w-full p-2 bg-white border border-amber-300 rounded-xs"
              />
            </div>
            <div>
              <label className="text-amber-900 font-semibold block mb-1">
                ✏️ Subtítulo del Logo:
              </label>
              <input
                type="text"
                value={general.subtituloTienda}
                onChange={(e) =>
                  actualizarSeccion('general', {
                    ...general,
                    subtituloTienda: e.target.value,
                  })
                }
                className="w-full p-2 bg-white border border-amber-300 rounded-xs"
              />
            </div>
            <div>
              <label className="text-amber-900 font-semibold block mb-1">
                🖼️ Subir Imagen de Logo (opcional):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={subirLogoImagen}
                  className="text-[11px] bg-white border border-amber-300 rounded-xs p-1.5 w-full cursor-pointer"
                />
                {general.logoImagen && (
                  <button
                    type="button"
                    onClick={() =>
                      actualizarSeccion('general', {
                        ...general,
                        logoImagen: '',
                      })
                    }
                    className="text-red-600 hover:underline shrink-0 cursor-pointer"
                  >
                    Quitar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barra superior de navegación (Optimizada para celular y escritorio) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-[#e8dfd1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center gap-2">
          {/* Logo estilo monograma dorado o imagen subida */}
          <button
            onClick={() => irAVista('inicio')}
            className="flex items-center gap-2 sm:gap-3 group cursor-pointer focus:outline-none min-w-0"
          >
            <div className="bg-[#faf6ed] border border-[#dfd2b8] group-hover:border-[#c8a45d] transition px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm flex items-center gap-2 sm:gap-2.5 shadow-2xs">
              {general.logoImagen ? (
                <img
                  src={general.logoImagen}
                  alt={general.nombreTienda}
                  className="h-7 sm:h-9 w-auto object-contain shrink-0"
                />
              ) : (
                <span className="font-serif italic text-xl sm:text-2xl text-[#c8a45d] font-semibold tracking-tight shrink-0">
                  {general.monograma}
                </span>
              )}
              <div className="text-left leading-tight truncate">
                <span className="block text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-700 font-semibold truncate">
                  {general.nombreTienda}
                </span>
                <span className="block text-[8px] sm:text-[9px] tracking-[0.12em] sm:tracking-[0.15em] text-[#b38f48] uppercase truncate">
                  {general.subtituloTienda}
                </span>
              </div>
            </div>
          </button>

          {/* Navegación Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium tracking-[0.15em] uppercase">
            {itemsMenu.map((item) => {
              const activo = vistaActual === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => irAVista(item.id)}
                  className={`py-1 border-b-2 transition cursor-pointer ${
                    activo
                      ? 'text-[#c8a45d] border-[#c8a45d] font-semibold'
                      : 'text-gray-700 border-transparent hover:text-[#c8a45d]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {usuario ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200 normal-case tracking-normal">
                <span className="text-xs text-gray-600">
                  Hola, <b className="text-gray-900">{usuario.nombre}</b>{' '}
                  <span className="text-[10px] uppercase bg-[#f5efe2] text-[#a37f38] px-2 py-0.5 rounded font-semibold">
                    {usuario.rol}
                  </span>
                </span>
                <button
                  onClick={cerrarSesion}
                  className="bg-red-500 text-white px-3 py-1.5 rounded text-xs hover:bg-red-600 transition cursor-pointer"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => setMostrarLogin(true)}
                className="border border-[#c8a45d] text-[#a37f38] hover:bg-[#c8a45d] hover:text-white px-4 py-2 rounded text-xs tracking-[0.12em] uppercase transition font-medium cursor-pointer"
              >
                Acceso / Registro
              </button>
            )}
          </nav>

          {/* Controles rápidos móvil + Botón Hamburguesa */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => irAVista('tienda')}
              className={`px-2.5 py-1.5 rounded text-[11px] uppercase tracking-wider font-medium border transition ${
                vistaActual === 'tienda'
                  ? 'bg-[#c8a45d] text-white border-[#c8a45d]'
                  : 'border-[#e8dfd1] bg-[#f9f6f0] text-[#a37f38]'
              }`}
            >
              🛍️ Tienda
            </button>

            <button
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              className="text-gray-700 p-2 rounded hover:bg-gray-100 focus:outline-none"
              aria-label="Abrir menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuMovilAbierto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú desplegable móvil (Táctil y amplio) */}
        {menuMovilAbierto && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-gray-700 shadow-lg">
            {itemsMenu.map((item) => {
              const activo = vistaActual === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => irAVista(item.id)}
                  className={`flex items-center gap-3 text-left px-3 py-3 rounded-xs transition ${
                    activo
                      ? 'bg-[#f9f5ec] text-[#a37f38] font-semibold'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icono}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-3 mt-1 border-t border-gray-100">
              {usuario ? (
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xs normal-case tracking-normal">
                  <span className="text-xs text-gray-700 truncate pr-2">
                    Hola, <b>{usuario.nombre}</b> ({usuario.rol})
                  </span>
                  <button
                    onClick={cerrarSesion}
                    className="bg-red-500 text-white px-3 py-1.5 rounded text-xs shrink-0"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMostrarLogin(true);
                    setMenuMovilAbierto(false);
                  }}
                  className="w-full bg-[#c8a45d] text-white py-3 rounded-xs text-xs uppercase tracking-widest font-semibold"
                >
                  🔐 Acceso / Registro
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Modal de Login / Registro */}
      {mostrarLogin && !usuario && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-md my-auto">
            <AuthModal
              alIniciarSesionExitoso={(usr) => {
                setUsuario(usr);
                setMostrarLogin(false);
              }}
              alCerrar={() => setMostrarLogin(false)}
            />
          </div>
        </div>
      )}

      {/* CONTENIDO DE LA VENTANA / VISTA ACTIVA */}
      <main className="flex-1">
        {vistaActual === 'inicio' && (
          <Inicio
            irAVista={irAVista}
            datos={configSitio.inicio}
            modoEdicion={esAdmin && modoEdicion}
            actualizarSeccion={actualizarSeccion}
          />
        )}

        {vistaActual === 'servicios' && (
          <Servicios
            irAVista={irAVista}
            datos={configSitio.servicios}
            whatsapp={general.whatsapp}
            modoEdicion={esAdmin && modoEdicion}
            actualizarSeccion={actualizarSeccion}
          />
        )}

        {vistaActual === 'seguimiento' && (
          <Seguimiento
            esAdmin={esAdmin}
            nombreTienda={general.nombreTienda}
            whatsappTaller={general.whatsapp}
          />
        )}

        {vistaActual === 'contacto' && (
          <Contacto
            datos={configSitio.contacto}
            whatsapp={general.whatsapp}
            datosGeneral={general}
            modoEdicion={esAdmin && modoEdicion}
            actualizarSeccion={actualizarSeccion}
            actualizarGeneral={(nuevoGen) =>
              actualizarSeccion('general', nuevoGen)
            }
          />
        )}

        {vistaActual === 'nosotros' && (
          <SobreNosotros
            irAVista={irAVista}
            datos={configSitio.nosotros}
            modoEdicion={esAdmin && modoEdicion}
            actualizarSeccion={actualizarSeccion}
          />
        )}

        {vistaActual === 'tienda' && (
          <div>
            {esAdmin && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <AdminProductos
                  productoEditando={productoEditando}
                  alCancelarEdicion={() => setProductoEditando(null)}
                  alGuardarProducto={() => {
                    setProductoEditando(null);
                    setRecargarCatalogo((prev) => prev + 1);
                  }}
                />
              </div>
            )}
            <Catalogo
              key={recargarCatalogo}
              esAdmin={esAdmin}
              alSeleccionarParaEditar={(prod) => setProductoEditando(prod)}
            />
          </div>
        )}

        {vistaActual === 'clientes' && <Clientes />}
      </main>

      {/* FOOTER (Adaptable a móvil) */}
      <footer className="bg-[#1c1b18] text-gray-300 py-10 pb-24 sm:pb-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left text-sm">
          <div>
            <h3 className="text-white uppercase tracking-[0.2em] text-xs font-semibold mb-3">
              {general.nombreTienda}
            </h3>
            {esAdmin && modoEdicion ? (
              <textarea
                rows={2}
                value={general.descripcionFooter}
                onChange={(e) =>
                  actualizarSeccion('general', {
                    ...general,
                    descripcionFooter: e.target.value,
                  })
                }
                className="w-full p-2 bg-gray-800 border border-amber-400 text-white text-xs rounded-xs"
              />
            ) : (
              <p className="text-gray-400 text-xs leading-relaxed">
                {general.descripcionFooter}
              </p>
            )}
          </div>
          <div>
            <h3 className="text-white uppercase tracking-[0.2em] text-xs font-semibold mb-3">
              Navegación Rápida
            </h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-gray-400">
              {itemsMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => irAVista(item.id)}
                  className="hover:text-[#c8a45d] transition cursor-pointer py-1"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white uppercase tracking-[0.2em] text-xs font-semibold mb-3">
              Contacto Directo
            </h3>
            {esAdmin && modoEdicion ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={general.whatsapp}
                  onChange={(e) =>
                    actualizarSeccion('general', {
                      ...general,
                      whatsapp: e.target.value,
                    })
                  }
                  placeholder="WhatsApp (ej. 593997447443)"
                  className="w-full p-1.5 bg-gray-800 border border-amber-400 text-white text-xs rounded-xs"
                />
                <input
                  type="text"
                  value={general.horarioResumen}
                  onChange={(e) =>
                    actualizarSeccion('general', {
                      ...general,
                      horarioResumen: e.target.value,
                    })
                  }
                  placeholder="Horario de atención"
                  className="w-full p-1.5 bg-gray-800 border border-amber-400 text-xs text-white rounded-xs"
                />
              </div>
            ) : (
              <>
                <p className="text-gray-400 text-xs">WhatsApp: +{general.whatsapp}</p>
                <p className="text-gray-400 text-xs mt-1">{general.horarioResumen}</p>
              </>
            )}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {general.nombreTienda}. Todos los derechos reservados.
        </div>
      </footer>

      {/* BOTÓN FLOTANTE DE WHATSAPP (Ajustado en móvil para no tapar controles) */}
      <a
        href={`https://wa.me/${general.whatsapp}?text=${encodeURIComponent(
          '¡Hola! Me gustaría consultar sobre sus servicios de costura.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Escríbenos por WhatsApp"
        className="animate-whatsapp fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-110"
      >
        <svg className="w-6 h-6 sm:w-8 sm:h-8 fill-current" viewBox="0 0 32 32">
          <path d="M16.004 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.257.59 4.46 1.71 6.404L3.2 28.8l6.564-1.693a12.74 12.74 0 0 0 6.24 1.627h.005c7.068 0 12.795-5.73 12.795-12.8 0-3.42-1.33-6.636-3.748-9.054A12.714 12.714 0 0 0 16.004 3.2zm0 23.386h-.004a10.6 10.6 0 0 1-5.405-1.48l-.388-.23-4.018 1.036 1.072-3.916-.252-.402a10.576 10.576 0 0 1-1.624-5.654c0-5.855 4.764-10.62 10.62-10.62 2.836 0 5.502 1.105 7.507 3.112a10.55 10.55 0 0 1 3.108 7.508c0 5.856-4.764 10.646-10.616 10.646zm5.826-7.96c-.318-.16-1.888-.932-2.18-1.038-.293-.107-.506-.16-.72.16-.212.32-.824 1.038-1.01 1.25-.186.214-.372.24-.69.08-.32-.16-1.348-.497-2.567-1.584-.949-.846-1.59-1.892-1.776-2.212-.186-.32-.02-.492.14-.65.144-.143.32-.373.48-.56.16-.186.212-.32.318-.532.107-.213.054-.4-.026-.56-.08-.16-.72-1.732-.985-2.372-.26-.622-.524-.538-.72-.548l-.612-.01c-.213 0-.559.08-.852.4-.292.32-1.118 1.092-1.118 2.664s1.145 3.09 1.305 3.303c.16.213 2.252 3.44 5.456 4.823.762.33 1.357.526 1.821.673.765.243 1.462.208 2.012.126.614-.092 1.888-.772 2.154-1.518.266-.746.266-1.385.186-1.518-.08-.133-.292-.213-.61-.373z" />
        </svg>
      </a>
    </div>
  );
}

export default App;
