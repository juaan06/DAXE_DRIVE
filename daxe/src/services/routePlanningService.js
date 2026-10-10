const API_URL = import.meta.env?.VITE_API_URL || 'http://127.0.0.1:8000';

export function normalizePlannedRoute(route = {}) {
  const coordinates = Array.isArray(route.coordinates)
    ? route.coordinates
      .filter((coordinate) => Array.isArray(coordinate) && coordinate.length >= 2)
      .map(([latitude, longitude]) => [Number(latitude), Number(longitude)])
      .filter(([latitude, longitude]) => Number.isFinite(latitude)
        && Number.isFinite(longitude)
        && Math.abs(latitude) <= 90
        && Math.abs(longitude) <= 180)
    : [];
  const distanceKm = Number(route.distanceKm);
  const durationMin = Number(route.durationMin);
  const origin = String(route.origin || '').trim();
  const destination = String(route.destination || '').trim();

  if (coordinates.length < 2 || !Number.isFinite(distanceKm) || distanceKm <= 0
    || !Number.isInteger(durationMin) || durationMin < 1 || !origin || !destination) {
    throw new Error('El servidor devolvió datos de ruta incompletos o no válidos.');
  }

  return { coordinates, distanceKm, durationMin, origin, destination };
}

export async function calculateDrivingRoute(origin, destination) {
  const normalizedOrigin = String(origin || '').trim();
  const normalizedDestination = String(destination || '').trim();
  if (!normalizedOrigin || !normalizedDestination) {
    throw new Error('Escribe un origen y un destino para calcular la ruta.');
  }

  const response = await fetch(`${API_URL}/api/routes/plan`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ origin: normalizedOrigin, destination: normalizedDestination }),
    signal: AbortSignal.timeout(60000),
  });

  const result = await response.json().catch(() => ({
    success: false,
    data: {},
    message: 'El servidor devolvió una respuesta no válida.',
  }));

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'No se pudo calcular la ruta.');
  }

  return normalizePlannedRoute(result.data);
}
