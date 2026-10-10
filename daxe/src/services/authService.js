const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

async function request(endpoint, payload = {}, method = 'POST', token = null) {
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
    data: {},
    message: 'Error inesperado al procesar la respuesta.',
  }));

  if (!response.ok) {
    throw new Error(result.message || 'No se pudo completar la solicitud.');
  }

  return result;
}

export async function registerUser(payload) {
  return request('/api/auth/register', payload, 'POST');
}

export async function loginUser(payload) {
  return request('/api/auth/login', payload, 'POST');
}

export async function getCurrentUser() {
  const token = localStorage.getItem('daxe_token');
  return request('/api/auth/me', {}, 'GET', token);
}

export async function syncProfile() {
  const token = localStorage.getItem('daxe_token');
  return request('/api/profile/sync', {}, 'POST', token);
}

export async function getProfile() {
  const token = localStorage.getItem('daxe_token');
  return request('/api/profile/me', {}, 'GET', token);
}

export async function updateProfile(data) {
  const token = localStorage.getItem('daxe_token');
  return request('/api/profile/update', data, 'PATCH', token);
}

export async function logoutUser() {
  const token = localStorage.getItem('daxe_token');
  return request('/api/auth/logout', {}, 'POST', token);
}
