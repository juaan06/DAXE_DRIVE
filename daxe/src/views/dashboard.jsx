import { useNavigate } from 'react-router-dom';
import { VISTAS } from '../../controllers/vistas.js';

export default function DashboardView() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('daxe_user') || '{}');

  const cerrarSesion = async () => {
    try {
      await fetch('http://127.0.0.1:8000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignoramos el error de logout del servidor para limpiar la sesión local
    }

    localStorage.removeItem('daxe_token');
    localStorage.removeItem('daxe_user');
    navigate(VISTAS.LOGIN, { replace: true });
  };

  return (
    <main className="min-h-svh bg-[#090a0f] px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl rounded-[24px] border border-violet-500/60 bg-[#11121b]/80 p-8 shadow-[0_0_40px_rgba(109,40,217,0.20)]">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.24em] text-violet-300">DAXE</p>
            <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>
          </div>

          <button
            type="button"
            onClick={cerrarSesion}
            className="rounded-xl border border-violet-500 bg-violet-600/20 px-4 py-2 text-sm font-semibold text-violet-100 transition hover:bg-violet-600/30"
          >
            Cerrar sesión
          </button>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-blue-500/40 bg-[#0d111b] p-5">
            <p className="text-sm text-blue-300">Usuario</p>
            <h2 className="mt-2 text-2xl font-bold">{usuario?.email || 'Usuario DAXE'}</h2>
          </div>

          <div className="rounded-2xl border border-violet-500/40 bg-[#0d111b] p-5">
            <p className="text-sm text-violet-300">Estado</p>
            <h2 className="mt-2 text-2xl font-bold text-emerald-400">Sesión activa</h2>
          </div>
        </section>
      </div>
    </main>
  );
}
