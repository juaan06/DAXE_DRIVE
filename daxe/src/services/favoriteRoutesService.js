const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

async function request(endpoint, payload = {}, method = 'GET', token = null) {
  const headers = {
    Accept: 'application/json',
  };

  if (payload && Object.keys(payload).length > 0) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    credentials: 'include',
    body: Object.keys(payload).length > 0 ? JSON.stringify(payload) : undefined,
  });

  const result = await response.json().catch(() => ({
    success: false,
    data: [],
    message: 'Error inesperado al procesar la respuesta.',
  }));

  if (!response.ok) {
    throw new Error(result.message || 'No se pudo completar la solicitud.');
  }

  return result;
}

export async function getFavoriteRoutes() {
  const token = localStorage.getItem('daxe_token');
  return request('/api/routes/favorites', {}, 'GET', token);
}

export async function createFavoriteRoute(data) {
  const token = localStorage.getItem('daxe_token');
  return request('/api/routes/favorites', data, 'POST', token);
}

export async function deleteFavoriteRoute(routeId) {
  const token = localStorage.getItem('daxe_token');
  const query = new URLSearchParams({ id: routeId }).toString();
  return request(`/api/routes/favorites?${query}`, {}, 'DELETE', token);
}
