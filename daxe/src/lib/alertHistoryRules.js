export function buildAlertSummary(alert = {}) {
  const type = String(alert.type || 'general').toLowerCase();
  const message = String(alert.message || '').trim();
  const severity = String(alert.severity || 'info');
  const createdAt = alert.createdAt ? new Date(alert.createdAt) : new Date();

  const titles = {
    pico: 'Pico y Placa',
    clima: 'Clima vial',
    bloqueo: 'Bloqueo o cierre',
    general: 'Alerta general',
  };

  return {
    title: titles[type] || titles.general,
    severity,
    text: message || 'Se registró una nueva alerta de movilidad.',
    createdAt,
    createdAtLabel: createdAt.toLocaleString('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
  };
}

export function buildPicoPlacaNotification({
  plate = '',
  date = '',
  time = '',
  reason = '',
  status = '',
  day_name = '',
} = {}) {
  const normalizedPlate = String(plate || '').trim().toUpperCase();
  const normalizedDate = String(date || '').trim();
  const normalizedTime = String(time || '').trim();
  const normalizedReason = String(reason || '').trim();
  const normalizedStatus = String(status || '').trim().toLowerCase();

  if (!normalizedPlate || !normalizedDate || !normalizedTime) {
    return null;
  }

  const shouldNotify = normalizedStatus === 'restricted' || normalizedReason.toLowerCase().includes('pico y placa activo');
  if (!shouldNotify) {
    return null;
  }

  return {
    type: 'pico',
    severity: 'high',
    message: `Pico y Placa activo para la placa ${normalizedPlate} el ${normalizedDate} a las ${normalizedTime}${day_name ? ` (${day_name})` : ''}. ${normalizedReason || 'Debe evitar circular en el horario restringido.'}`,
  };
}
