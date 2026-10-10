import assert from 'node:assert/strict';
import { buildPicoPlacaNotification } from '../src/lib/alertHistoryRules.js';

const restricted = buildPicoPlacaNotification({
  plate: 'ABC123',
  date: '2026-10-10',
  time: '08:15',
  is_restricted: true,
  reason: 'Pico y Placa activo',
  status: 'restricted',
  day_name: 'Sábado',
});

assert.ok(restricted, 'Debe crear una notificación cuando hay restricción');
assert.equal(restricted.type, 'pico', 'El tipo debe ser Pico y Placa');
assert.equal(restricted.severity, 'high', 'La severidad debe ser alta');
assert.match(restricted.message, /ABC123/i, 'Debe incluir la placa');
assert.match(restricted.message, /Pico y Placa/i, 'Debe incluir la restricción');

const allowed = buildPicoPlacaNotification({
  plate: 'ABC123',
  date: '2026-10-10',
  time: '12:00',
  is_restricted: false,
  reason: 'Fuera de horario o no aplica para esta placa.',
  status: 'allowed',
  day_name: 'Sábado',
});

assert.equal(allowed, null, 'No debe crear una notificación cuando no hay restricción');

console.log('picoPlacaNotifications test passed');
