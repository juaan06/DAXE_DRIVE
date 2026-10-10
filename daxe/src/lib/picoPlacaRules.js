const DAYS = {
  1: { name: 'Lunes', digits: [1, 2] },
  2: { name: 'Martes', digits: [3, 4] },
  3: { name: 'Miércoles', digits: [5, 6] },
  4: { name: 'Jueves', digits: [7, 8] },
  5: { name: 'Viernes', digits: [9, 0] },
};

function normalizeTime(inputTime) {
  if (!inputTime) {
    return { hours: 0, minutes: 0, totalMinutes: 0 };
  }

  const [hours = '0', minutes = '0'] = String(inputTime).split(':');
  const parsedHours = Number.parseInt(hours, 10) || 0;
  const parsedMinutes = Number.parseInt(minutes, 10) || 0;

  return {
    hours: parsedHours,
    minutes: parsedMinutes,
    totalMinutes: parsedHours * 60 + parsedMinutes,
  };
}

function getPlateDigit(plate, type) {
  const cleanPlate = String(plate || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (!cleanPlate) {
    return null;
  }

  const digits = cleanPlate.match(/\d/g);
  if (!digits || digits.length === 0) {
    return null;
  }

  const lastDigit = Number.parseInt(digits[digits.length - 1], 10);

  if (type === 'moto') {
    const firstDigit = Number.parseInt(digits[0], 10);
    return Number.isNaN(firstDigit) ? lastDigit : firstDigit;
  }

  return Number.isNaN(lastDigit) ? null : lastDigit;
}

export function evaluatePicoYPlaca({ plate, type = 'particular', date, time }) {
  const cleanType = String(type || 'particular').toLowerCase();
  const cleanPlate = String(plate || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  if (!cleanPlate) {
    return {
      isRestricted: false,
      status: 'missing-plate',
      reason: 'Falta la placa para validar la restricción.',
      restrictedDigits: [],
      targetDigit: null,
      zoneExempt: false,
      dayName: null,
    };
  }

  const dateValue = date ? new Date(`${date}T00:00:00`) : new Date();
  const day = dateValue.getDay();

  if (day === 0 || day === 6) {
    return {
      isRestricted: false,
      status: 'weekend',
      reason: 'No hay Pico y Placa los fines de semana.',
      restrictedDigits: [],
      targetDigit: getPlateDigit(cleanPlate, cleanType),
      zoneExempt: false,
      dayName: 'Fin de semana',
    };
  }

  const schedule = DAYS[day];
  if (!schedule) {
    return {
      isRestricted: false,
      status: 'no-rule',
      reason: 'No hay regla activa para este día.',
      restrictedDigits: [],
      targetDigit: getPlateDigit(cleanPlate, cleanType),
      zoneExempt: false,
      dayName: 'No aplica',
    };
  }

  const targetDigit = getPlateDigit(cleanPlate, cleanType);
  const timeValue = normalizeTime(time);
  const inRestrictedWindow = (timeValue.totalMinutes >= 7 * 60 && timeValue.totalMinutes < 9 * 60 + 30)
    || (timeValue.totalMinutes >= 16 * 60 && timeValue.totalMinutes < 19 * 60 + 30);

  const isRestricted = inRestrictedWindow && schedule.digits.includes(targetDigit);

  return {
    isRestricted,
    status: isRestricted ? 'restricted' : 'allowed',
    reason: isRestricted ? 'Pico y Placa activo' : 'Fuera de horario o no aplica para esta placa.',
    restrictedDigits: schedule.digits,
    targetDigit,
    zoneExempt: false,
    dayName: schedule.name,
    scheduleWindow: {
      morning: '07:00 - 09:30',
      afternoon: '16:00 - 19:30',
    },
  };
}
