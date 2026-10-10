import { Link } from 'react-router-dom';
import { VISTAS } from '../controllers/vistas.js';

const vehiculosDemo = [
  { id: 'vehicle-demo-1', type: 'Particular', name: 'Renault Logan', plate: 'ABC123', detail: 'Gris · 2022' },
  { id: 'vehicle-demo-2', type: 'Moto', name: 'Yamaha FZ', plate: 'XYZ45F', detail: 'Azul · 2023' },
];

const rutasDemo = [
  { id: 'route-demo-1', name: 'Casa – Trabajo', origin: 'Laureles, Medellín', destination: 'El Poblado, Medellín', distance: '8,4 km', duration: '24 min' },
  { id: 'route-demo-2', name: 'Fin de semana', origin: 'Estadio, Medellín', destination: 'Parque Arví, Medellín', distance: '18,2 km', duration: '46 min' },
];

const alertasDemo = [
  { id: 'alert-demo-1', title: 'Pico y Placa', severity: 'ALTA', message: 'Recuerda revisar la restricción de tu vehículo antes de salir.', time: 'Hoy, 7:00 a. m.', color: 'border-amber-500/50 bg-amber-500/10 text-amber-200' },
  { id: 'alert-demo-2', title: 'Ruta favorita', severity: 'INFO', message: 'Tu ruta Casa – Trabajo está lista para consultar.', time: 'Ayer, 5:30 p. m.', color: 'border-blue-500/50 bg-blue-500/10 text-blue-200' },
];

export default function DemoDashboardView() {
  return (
    <main className="min-h-svh bg-[#090a0f] px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl rounded-3xl border border-violet-500/60 bg-[#11121b]/90 p-5 shadow-[0_0_40px_rgba(109,40,217,0.20)] sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.24em] text-violet-300">DAXE</p>
            <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>
          </div>
          <Link to={VISTAS.LOGIN} className="rounded-xl border border-violet-500 bg-violet-600/20 px-4 py-2 text-sm font-semibold text-violet-100 transition hover:bg-violet-600/30">
            Ir a iniciar sesión
          </Link>
        </div>

        <div role="status" className="mb-6 rounded-xl border border-blue-500/50 bg-blue-500/10 p-4 text-sm text-blue-100">
          <strong>Vista de demostración.</strong> Estos datos son ficticios. No has iniciado sesión y nada se guarda en la base de datos.
        </div>

        <section className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl border border-blue-500/40 bg-[#0d111b] p-5">
            <div className="flex items-center gap-4">
              <div aria-hidden="true" className="grid h-16 w-16 place-items-center rounded-full border border-violet-500 bg-violet-500/20 text-2xl font-bold text-violet-200">ED</div>
              <div>
                <p className="text-sm text-blue-300">Usuario de ejemplo</p>
                <h2 className="text-xl font-bold">Evelin Demo</h2>
              </div>
            </div>
            <p className="mt-4 text-sm text-[#d1d5db]">demo@daxe.local</p>
            <div className="mt-5 rounded-xl border border-violet-500/30 bg-[#090a0f] p-4">
              <p className="text-sm text-violet-300">Estado de la sesión</p>
              <p className="mt-1 font-bold text-emerald-400">Solo vista previa</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl border border-violet-500/30 bg-[#090a0f] p-3"><p className="text-2xl font-bold">2</p><p className="text-xs text-[#d1d5db]">Vehículos</p></div>
              <div className="rounded-xl border border-violet-500/30 bg-[#090a0f] p-3"><p className="text-2xl font-bold">2</p><p className="text-xs text-[#d1d5db]">Rutas guardadas</p></div>
            </div>
          </div>

          <section aria-labelledby="demo-vehicles-title" className="rounded-2xl border border-violet-500/40 bg-[#0d111b] p-5">
            <p className="text-sm text-blue-300">Gestión de transporte</p>
            <h2 id="demo-vehicles-title" className="text-2xl font-bold">Mis vehículos</h2>
            <div className="mt-4 space-y-3">
              {vehiculosDemo.map((vehicle) => (
                <article key={vehicle.id} className="rounded-xl border border-violet-500/30 bg-[#090a0f] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">{vehicle.type}</p>
                  <h3 className="mt-1 text-lg font-bold">{vehicle.name}</h3>
                  <p className="text-sm text-[#d1d5db]">{vehicle.plate} · {vehicle.detail}</p>
                </article>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="text-sm text-blue-300">Consulta de ejemplo · Pico y Placa</p>
              <p className="mt-1 font-semibold text-emerald-200">Sin restricción en este momento</p>
              <p className="mt-1 text-xs text-[#d1d5db]">Resultado ilustrativo; no corresponde a una consulta real.</p>
            </div>
          </section>
        </section>

        <section aria-labelledby="demo-routes-title" className="mt-5 rounded-2xl border border-violet-500/40 bg-[#0d111b] p-5">
          <p className="text-sm text-blue-300">Tus trayectos frecuentes</p>
          <h2 id="demo-routes-title" className="text-2xl font-bold">Rutas favoritas</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {rutasDemo.map((route) => (
              <article key={route.id} className="rounded-xl border border-violet-500/30 bg-[#090a0f] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">{route.name}</p>
                <h3 className="mt-2 font-semibold">{route.origin} → {route.destination}</h3>
                <p className="mt-1 text-sm text-[#d1d5db]">{route.distance} · {route.duration}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="demo-alerts-title" className="mt-5 rounded-2xl border border-blue-500/40 bg-[#0d111b] p-5">
          <p className="text-sm text-blue-300">Avisos para tus recorridos</p>
          <h2 id="demo-alerts-title" className="text-2xl font-bold">Historial de movilidad</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {alertasDemo.map((alert) => (
              <article key={alert.id} className={`rounded-xl border p-4 ${alert.color}`}>
                <div className="flex items-center justify-between gap-3"><h3 className="font-bold">{alert.title}</h3><span className="text-xs font-bold">{alert.severity}</span></div>
                <p className="mt-2 text-sm">{alert.message}</p>
                <p className="mt-2 text-xs opacity-80">{alert.time}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-violet-500/30 bg-[#090a0f] p-4">
          <p className="text-sm text-[#d1d5db]">Al configurar Supabase podrás crear tu cuenta y guardar tus propios datos.</p>
          <Link to={VISTAS.MAPA} className="font-semibold text-blue-300 hover:text-blue-200 hover:underline">Volver al mapa</Link>
        </div>
      </div>
    </main>
  );
}
