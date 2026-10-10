import assert from 'node:assert/strict';
import { normalizePlannedRoute } from '../src/services/routePlanningService.js';

const route = normalizePlannedRoute({
  origin: 'Parque de Berrío, Medellín',
  destination: 'Parque Lleras, Medellín',
  distanceKm: 12.3,
  durationMin: 32,
  coordinates: [[6.2442, -75.5812], [6.25, -75.57]],
});

assert.deepEqual(route.coordinates, [[6.2442, -75.5812], [6.25, -75.57]], 'Las coordenadas deben quedar en orden latitud/longitud para Leaflet');
assert.equal(route.distanceKm, 12.3, 'Debe conservar la distancia en kilómetros');
assert.equal(route.durationMin, 32, 'Debe conservar la duración en minutos');
assert.equal(route.origin, 'Parque de Berrío, Medellín', 'Debe conservar el origen resuelto');

assert.throws(
  () => normalizePlannedRoute({ ...route, coordinates: [[6, -75]], distanceKm: 0 }),
  /incompletos o no válidos/,
  'Debe rechazar una respuesta incompleta antes de dibujarla o guardarla',
);

console.log('routePlanningService test passed');
