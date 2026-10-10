import { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateDrivingRoute } from '../services/routePlanningService.js';

function FitRoute({ coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 1) {
      map.fitBounds(coordinates, { padding: [28, 28] });
    }
  }, [coordinates, map]);

  return null;
}

export default function RoutePlanner({ onRouteCalculated }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setRoute(null);

    try {
      const calculatedRoute = await calculateDrivingRoute(origin, destination);
      setRoute(calculatedRoute);
      onRouteCalculated?.({
        origin: calculatedRoute.origin,
        destination: calculatedRoute.destination,
        distanceKm: calculatedRoute.distanceKm,
        durationMin: calculatedRoute.durationMin,
      });
    } catch (routeError) {
      setError(routeError?.message || 'No se pudo calcular la ruta.');
    } finally {
      setLoading(false);
    }
  };

  const routeCoordinates = route?.coordinates || [];
  const mapCenter = routeCoordinates[0] || [6.2442, -75.5812];

  return (
    <section className="mt-6 rounded-2xl border border-blue-500/40 bg-[#090a0f] p-4" aria-labelledby="route-planner-title">
      <div className="mb-4">
        <p className="text-sm text-blue-300">OpenStreetMap · rutas en automóvil</p>
        <h4 id="route-planner-title" className="text-xl font-bold text-white">Planificador de ruta</h4>
        <p className="mt-1 text-sm text-[#d1d5db]">Busca direcciones del Valle de Aburrá y calcula distancia y tiempo estimado.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <label className="grid gap-2 text-sm text-[#d1d5db]">
          Origen
          <input
            type="text"
            value={origin}
            onChange={(event) => setOrigin(event.target.value)}
            placeholder="Ej. Medellín, Colombia"
            maxLength={300}
            required
            className="rounded-xl border border-violet-500/40 bg-[#0d111b] px-3 py-2 text-white outline-none focus:border-violet-400"
          />
        </label>
        <label className="grid gap-2 text-sm text-[#d1d5db]">
          Destino
          <input
            type="text"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="Ej. El Poblado, Medellín, Colombia"
            maxLength={300}
            required
            className="rounded-xl border border-violet-500/40 bg-[#0d111b] px-3 py-2 text-white outline-none focus:border-violet-400"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="self-end rounded-xl border border-violet-500 bg-linear-to-r from-violet-600 to-blue-600 px-4 py-2 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Calculando…' : 'Calcular ruta'}
        </button>
      </form>

      {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}

      {route && (
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-lg border border-violet-500/40 bg-[#0d111b] px-3 py-2 text-white">Distancia: <strong>{route.distanceKm} km</strong></span>
          <span className="rounded-lg border border-blue-500/40 bg-[#0d111b] px-3 py-2 text-white">Tiempo estimado: <strong>{route.durationMin} min</strong></span>
          {onRouteCalculated && (
            <span className="self-center text-xs text-emerald-200">Origen, destino y duración se copiarán al formulario de rutas favoritas.</span>
          )}
        </div>
      )}

      <div className="mt-4 h-90 overflow-hidden rounded-xl border border-violet-500/40">
        <MapContainer center={mapCenter} zoom={12} scrollWheelZoom className="h-full w-full" aria-label="Mapa de rutas del Valle de Aburrá">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {routeCoordinates.length > 1 && (
            <>
              <FitRoute coordinates={routeCoordinates} />
              <Polyline positions={routeCoordinates} pathOptions={{ color: '#8b5cf6', weight: 6, opacity: 0.9 }} />
              <CircleMarker center={routeCoordinates[0]} radius={8} pathOptions={{ color: '#fff', fillColor: '#22c55e', fillOpacity: 1 }}>
                <Popup>Origen: {origin}</Popup>
              </CircleMarker>
              <CircleMarker center={routeCoordinates[routeCoordinates.length - 1]} radius={8} pathOptions={{ color: '#fff', fillColor: '#3b82f6', fillOpacity: 1 }}>
                <Popup>Destino: {destination}</Popup>
              </CircleMarker>
            </>
          )}
        </MapContainer>
      </div>
      <p className="mt-2 text-xs text-[#9ca3af]">La ruta y el tiempo provienen de servicios públicos de OpenStreetMap/Nominatim y OSRM; no incluyen tráfico en tiempo real.</p>
    </section>
  );
}
