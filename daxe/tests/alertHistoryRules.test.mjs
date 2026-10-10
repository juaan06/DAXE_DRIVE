import assert from 'node:assert/strict';
import { buildAlertSummary } from '../src/lib/alertHistoryRules.js';

const summary = buildAlertSummary({
  type: 'pico',
  message: 'Restricción activa para su placa',
  severity: 'high',
  createdAt: '2026-10-10T08:15:00',
});

assert.equal(summary.title, 'Pico y Placa', 'El tipo pico debe reflejar el título correcto');
assert.equal(summary.severity, 'high', 'La severidad debe mantenerse');
assert.ok(summary.text.includes('Restricción activa'), 'Debe conservar el texto de la alerta');

console.log('alertHistoryRules test passed');
