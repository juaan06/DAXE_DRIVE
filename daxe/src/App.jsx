import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { VISTAS } from '../controllers/vistas.js';
import LoginView from '../views/login.jsx';

function ActualizarTitulo() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = pathname === VISTAS.CREAR_CUENTA
      ? 'DAXE | Crear cuenta'
      : 'DAXE | Iniciar sesión';
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ActualizarTitulo />
      <Routes>
        <Route path={VISTAS.LOGIN} element={<LoginView modo="login" />} />
        <Route path={VISTAS.CREAR_CUENTA} element={<LoginView modo="crear-cuenta" />} />
        <Route path="*" element={<Navigate to={VISTAS.LOGIN} replace />} />
      </Routes>
    </HashRouter>
  );
}
