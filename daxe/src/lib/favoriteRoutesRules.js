export function validateFavoriteRoute(route = {}) {
  const errors = [];

  const name = String(route.name || '').trim();
  const origin = String(route.origin || '').trim();
  const destination = String(route.destination || '').trim();
  const distanceKm = Number(route.distanceKm ?? route.distance_km ?? 0);
  const durationMin = Number(route.durationMin ?? route.duration_min ?? 0);

  if (!name) {
    errors.push('El nombre de la ruta es obligatorio.');
  }

  if (!origin) {
    errors.push('La ubicación de origen es obligatoria.');
  }

  if (!destination) {
    errors.push('La ubicación de destino es obligatoria.');
  }

  if (origin && destination && origin.toLowerCase() === destination.toLowerCase()) {
    errors.push('El origen y destino deben ser diferentes.');
  }

  if (Number.isFinite(distanceKm) && distanceKm > 0 && distanceKm < 0.1) {
    errors.push('La distancia debe ser mayor a 0.1 km.');
  }

  if (Number.isFinite(durationMin) && durationMin > 0 && durationMin < 1) {
    errors.push('La duración debe ser mayor a 1 minuto.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    normalized: {
      name,
      origin,
      destination,
      distanceKm: Number.isFinite(distanceKm) ? distanceKm : 0,
      durationMin: Number.isFinite(durationMin) ? durationMin : 0,
    },
  };
}
