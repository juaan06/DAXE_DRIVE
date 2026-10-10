import assert from 'node:assert/strict';
import { evaluatePicoYPlaca } from '../src/lib/picoPlacaRules.js';

const result = evaluatePicoYPlaca({
  plate: 'ABC1232',
  type: 'particular',
  date: '2026-10-12',
  time: '08:15',
});

assert.equal(result.isRestricted, true, 'El día lunes con placa terminada en 2 debe estar restringida');
assert.equal(result.reason, 'Pico y Placa activo', 'Debe indicar que el pico y placa está activo');

const noRestriction = evaluatePicoYPlaca({
  plate: 'XYZ9876',
  type: 'particular',
  date: '2026-10-12',
  time: '10:30',
});

assert.equal(noRestriction.isRestricted, false, 'Fuera de horario no debe estar restringido');

console.log('picoPlacaRules test passed');
