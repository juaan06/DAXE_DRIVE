import { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { VISTAS } from '../controllers/vistas.js';
import LoginView from '../views/login.jsx';
import CrearCuentaView from '../views/crearCuenta.jsx';
import DashboardView from '../views/dashboard.jsx';
import MapaView from '../views/mapa.jsx';
import DemoDashboardView from '../views/demoDashboard.jsx';
import { getCurrentUser, syncProfile } from './services/authService.js';

function ActualizarTitulo() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === VISTAS.CREAR_CUENTA) {
      document.title = 'DAXE | Crear cuenta';
      return;
    }

    if (pathname === VISTAS.DASHBOARD) {
      document.title = 'DAXE | Dashboard';
      return;
    }

    if (pathname === VISTAS.MAPA) {
      document.title = 'DAXE | Mapa y rutas';
      return;
    }

    if (pathname === VISTAS.DEMO) {
      document.title = 'DAXE | Vista de demostración';
      return;
    }

    document.title = 'DAXE | Iniciar sesión';
  }, [pathname]);

  return null;
}

function ProtectedRoute({ children }) {
  const [estado, setEstado] = useState('loading');

  useEffect(() => {
    let activo = true;

    async function verificarSesion() {
      const token = localStorage.getItem('daxe_token');

      if (!token) {
        if (activo) setEstado('unauthorized');
        return;
      }

      try {
        const data = await getCurrentUser();

        if (!activo) {
          return;
        }

        if (data.success) {
          try {
            await syncProfile();
          } catch {
            // la sesión sigue siendo válida aunque el perfil no se sincronice
          }

          setEstado('authorized');
          return;
        }

        localStorage.removeItem('daxe_token');
        localStorage.removeItem('daxe_user');
        setEstado('unauthorized');
      } catch {
        if (activo) {
          localStorage.removeItem('daxe_token');
          localStorage.removeItem('daxe_user');
          setEstado('unauthorized');
        }
      }
    }

    verificarSesion();

    return () => {
      activo = false;
    };
  }, []);

  if (estado === 'loading') {
    return <div className="grid min-h-svh place-items-center bg-[#090a0f] text-white">Cargando...</div>;
  }

  if (estado === 'unauthorized') {
    return <Navigate to={VISTAS.LOGIN} replace />;
  }

  return children;
}

export default function App() {
  return (
    <HashRouter>
      <ActualizarTitulo />
      <Routes>
        <Route path={VISTAS.LOGIN} element={<LoginView />} />
        <Route path={VISTAS.CREAR_CUENTA} element={<CrearCuentaView />} />
        <Route path={VISTAS.MAPA} element={<MapaView />} />
        <Route path={VISTAS.DEMO} element={<DemoDashboardView />} />
        <Route
          path={VISTAS.DASHBOARD}
          element={(
            <ProtectedRoute>
              <DashboardView />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to={VISTAS.LOGIN} replace />} />
      </Routes>
    </HashRouter>
  );
}
