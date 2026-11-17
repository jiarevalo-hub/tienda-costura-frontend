import React, { useState, useEffect } from 'react';
import Inicio from './components/Inicio';
import Servicios from './components/Servicios';
import Contacto from './components/Contacto';
import SobreNosotros from './components/SobreNosotros';
import Catalogo from './components/Catalogo';
import AuthModal from './components/AuthModal';
import AdminProductos from './components/AdminProductos';

const NUMERO_WHATSAPP = '593997447443';

const ITEMS_MENU = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'contacto', label: 'Contacto' },
  { id: 'nosotros', label: 'Sobre Nosotros' },
  { id: 'tienda', label: 'Tienda' },
];

function App() {
  const [vistaActual, setVistaActual] = useState('inicio');
  const [usuario, setUsuario] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [recargarCatalogo, setRecargarCatalogo] = useState(0);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (e) {
        console.error('Error al leer usuario guardado:', e);
      }
    }
  }, []);

  const irAVista = (nuevaVista) => {
    setVistaActual(nuevaVista);
    setMenuMovilAbierto(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-gray-800">
      {/* Barra superior de navegación */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          {/* Logo estilo monograma dorado */}
          <button
            onClick={() => irAVista('inicio')}
            className="flex items-center gap-3 group cursor-pointer focus:outline-none"
          >
            <div className="bg-[#f9f6f0] border border-[#e8dfd1] px-4 py-2 rounded flex items-center gap-2 shadow-2xs">
              <span className="font-serif italic text-2xl text-[#c8a45d] font-semibold tracking-tight">
                TC
              </span>
              <div className="text-left leading-tight">
                <span className="block text-[11px] uppercase tracking-[0.2em] text-gray-700 font-semibold">
                  Taller de Costura
                </span>
                <span className="block text-[9px] tracking-[0.15em] text-[#b38f48] uppercase">
                  Alta Costura &amp; Diseño
                </span>
              </div>
            </div>
          </button>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-[0.15em] uppercase">
            {ITEMS_MENU.map((item) => {
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

            {/* Botón de Sesión / Admin */}
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

          {/* Botón menú móvil */}
          <button
            onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
            className="md:hidden text-gray-700 p-2 focus:outline-none"
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

        {/* Menú desplegable móvil */}
        {menuMovilAbierto && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-3 text-xs uppercase tracking-[0.15em] text-gray-700">
            {ITEMS_MENU.map((item) => (
              <button
                key={item.id}
                onClick={() => irAVista(item.id)}
                className={`text-left py-1.5 ${
                  vistaActual === item.id ? 'text-[#c8a45d] font-semibold' : 'hover:text-[#c8a45d]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-gray-100">
              {usuario ? (
                <div className="flex items-center justify-between normal-case tracking-normal">
                  <span className="text-xs text-gray-600">
                    Hola, <b>{usuario.nombre}</b> ({usuario.rol})
                  </span>
                  <button
                    onClick={cerrarSesion}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs"
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
                  className="w-full bg-[#c8a45d] text-white py-2 rounded text-xs uppercase tracking-wider font-medium"
                >
                  Acceso / Registro
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Modal de Login / Registro */}
      {mostrarLogin && !usuario && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <AuthModal
              alIniciarSesionExitoso={(usr) => {
                setUsuario(usr);
                setMostrarLogin(false);
                if (usr.rol === 'admin') {
                  irAVista('tienda');
                }
              }}
              alCerrar={() => setMostrarLogin(false)}
            />
          </div>
        </div>
      )}

      {/* CONTENIDO DE LA VENTANA / VISTA ACTIVA */}
      <main className="flex-1">
        {vistaActual === 'inicio' && <Inicio irAVista={irAVista} />}

        {vistaActual === 'servicios' && <Servicios irAVista={irAVista} />}

        {vistaActual === 'contacto' && <Contacto />}

        {vistaActual === 'nosotros' && <SobreNosotros irAVista={irAVista} />}

        {vistaActual === 'tienda' && (
          <div>
            {usuario && usuario.rol === 'admin' && (
              <div className="max-w-7xl mx-auto px-6">
                <AdminProductos
                  alCrearProducto={() => setRecargarCatalogo((prev) => prev + 1)}
                />
              </div>
            )}
            <Catalogo key={recargarCatalogo} />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#1c1b18] text-gray-300 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="text-white uppercase tracking-[0.2em] text-xs font-semibold mb-3">
              Taller de Costura
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Arreglos profesionales, confección personalizada y amor por el detalle.
            </p>
          </div>
          <div>
            <h3 className="text-white uppercase tracking-[0.2em] text-xs font-semibold mb-3">
              Navegación Rápida
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-400">
              {ITEMS_MENU.map((item) => (
                <button
                  key={item.id}
                  onClick={() => irAVista(item.id)}
                  className="hover:text-[#c8a45d] transition cursor-pointer"
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
            <p className="text-gray-400 text-xs">WhatsApp: +{NUMERO_WHATSAPP}</p>
            <p className="text-gray-400 text-xs mt-1">Lun - Vie: 09:00 - 18:30 | Sáb: 09:00 - 14:00</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Taller de Costura. Todos los derechos reservados.
        </div>
      </footer>

      {/* BOTÓN FLOTANTE DE WHATSAPP */}
      <a
        href={`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(
          '¡Hola! Me gustaría consultar sobre sus servicios de costura.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Escríbenos por WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-105"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
          <path d="M16.004 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.257.59 4.46 1.71 6.404L3.2 28.8l6.564-1.693a12.74 12.74 0 0 0 6.24 1.627h.005c7.068 0 12.795-5.73 12.795-12.8 0-3.42-1.33-6.636-3.748-9.054A12.714 12.714 0 0 0 16.004 3.2zm0 23.386h-.004a10.6 10.6 0 0 1-5.405-1.48l-.388-.23-4.018 1.036 1.072-3.916-.252-.402a10.576 10.576 0 0 1-1.624-5.654c0-5.855 4.764-10.62 10.62-10.62 2.836 0 5.502 1.105 7.507 3.112a10.55 10.55 0 0 1 3.108 7.508c0 5.856-4.764 10.646-10.616 10.646zm5.826-7.96c-.318-.16-1.888-.932-2.18-1.038-.293-.107-.506-.16-.72.16-.212.32-.824 1.038-1.01 1.25-.186.214-.372.24-.69.08-.32-.16-1.348-.497-2.567-1.584-.949-.846-1.59-1.892-1.776-2.212-.186-.32-.02-.492.14-.65.144-.143.32-.373.48-.56.16-.186.212-.32.318-.532.107-.213.054-.4-.026-.56-.08-.16-.72-1.732-.985-2.372-.26-.622-.524-.538-.72-.548l-.612-.01c-.213 0-.559.08-.852.4-.292.32-1.118 1.092-1.118 2.664s1.145 3.09 1.305 3.303c.16.213 2.252 3.44 5.456 4.823.762.33 1.357.526 1.821.673.765.243 1.462.208 2.012.126.614-.092 1.888-.772 2.154-1.518.266-.746.266-1.385.186-1.518-.08-.133-.292-.213-.61-.373z" />
        </svg>
      </a>
    </div>
  );
}

export default App;
