const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
const BASE = `${API_URL}/api/hotel`;
const AUTH = `${API_URL}/api/auth`;

async function request(path, options = {}, base = BASE) {
  let response;
  try {
    response = await fetch(`${base}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Intenta de nuevo en unos segundos.');
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message || `Error del servidor (${response.status})`);
  }
  return body;
}

export const hotelApi = {
  checkAvailability: (checkIn, checkOut, type) => {
    const params = new URLSearchParams({ checkIn, checkOut });
    if (type) params.append('type', type);
    return request(`/disponibilidad?${params}`);
  },
  createReservation: (reservation) =>
    request('/reservar', { method: 'POST', body: JSON.stringify(reservation) }),
  addService: (reservationId, serviceType, quantity) =>
    request(`/servicios/${encodeURIComponent(reservationId)}`, {
      method: 'POST',
      body: JSON.stringify({ serviceType, quantity }),
    }),
  checkIn: (reservationId) => request(`/checkin/${encodeURIComponent(reservationId)}`, { method: 'PUT' }),
  checkOut: (reservationId) => request(`/checkout/${encodeURIComponent(reservationId)}`, { method: 'PUT' }),
  getReservation: (reservationId) => request(`/reserva/${encodeURIComponent(reservationId)}`),
  getReservations: () => request('/reservas'),
  getServiceCatalog: () => request('/servicios'),
};

export const authApi = {
  login: (username, password) =>
    request('/login', { method: 'POST', body: JSON.stringify({ username, password }) }, AUTH),
  register: (fullName, username, password) =>
    request('/register', { method: 'POST', body: JSON.stringify({ fullName, username, password }) }, AUTH),
};
