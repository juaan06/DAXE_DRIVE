import { Link } from 'react-router-dom';
import { VISTAS } from '../controllers/vistas.js';
import RoutePlanner from '../src/components/RoutePlanner.jsx';

export default function MapaView() {
  return (
    <main className="min-h-svh bg-[#090a0f] px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.24em] text-violet-300">DAXE · MODO INVITADO</p>
            <h1 className="mt-2 text-3xl font-semibold">Explora una ruta</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#d1d5db]">
              Prueba el mapa sin configurar una cuenta. Para guardar rutas favoritas, inicia sesión.
            </p>
          </div>
          <Link
            to={VISTAS.LOGIN}
            className="rounded-xl border border-violet-500 bg-violet-600/20 px-4 py-2 text-sm font-semibold text-violet-100 transition hover:bg-violet-600/30"
          >
            Iniciar sesión
          </Link>
          <Link
            to={VISTAS.DEMO}
            className="rounded-xl border border-blue-500/60 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-100 transition hover:bg-blue-500/20"
          >
            Ver dashboard de demostración
          </Link>
        </header>

        <RoutePlanner />
      </div>
    </main>
  );
}
