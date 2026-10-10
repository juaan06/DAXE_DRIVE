import assert from 'node:assert/strict';
import { validateFavoriteRoute } from '../src/lib/favoriteRoutesRules.js';

const validRoute = validateFavoriteRoute({
  name: 'Casa - Trabajo',
  origin: 'Laureles',
  destination: 'El Poblado',
  distanceKm: 6.5,
  durationMin: 18,
});

assert.equal(validRoute.isValid, true, 'Una ruta válida debe pasar');
assert.equal(validRoute.errors.length, 0, 'No debe tener errores');

const invalidRoute = validateFavoriteRoute({
  name: '',
  origin: '',
  destination: '',
});

assert.equal(invalidRoute.isValid, false, 'Una ruta sin datos debe fallar');
assert.ok(invalidRoute.errors.length >= 1, 'Debe reportar errores');

console.log('favoriteRoutes test passed');
