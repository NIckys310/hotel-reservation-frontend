const currency = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export const formatMoney = (value) => currency.format(Number(value || 0));

export const formatDate = (isoDate) => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (isoDateTime) =>
  isoDateTime ? new Date(isoDateTime).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }) : '';

export const toIsoDate = (date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

export const addDays = (isoDate, days) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return toIsoDate(new Date(year, month - 1, day + days));
};

export const STATUS_LABELS = {
  CONFIRMED: 'Confirmada',
  CHECKED_IN: 'Hospedado (check-in)',
  CHECKED_OUT: 'Finalizada (check-out)',
};

export const ROOM_TYPES = [
  { value: '', label: 'Todos los tipos' },
  { value: 'SINGLE', label: 'Sencilla' },
  { value: 'DOUBLE', label: 'Doble' },
  { value: 'SUITE', label: 'Suite' },
];

export const serviceQuantity = (service, nights) => (service.chargedPerDay ? nights : 1);
