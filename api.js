import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления CSRF токена
api.interceptors.request.use((config) => {
  const csrftoken = document.cookie.match(/csrftoken=([\w-]+)/);
  if (csrftoken) {
    config.headers['X-CSRFToken'] = csrftoken[1];
  }
  return config;
});

export const auth = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  me: () => api.get('/auth/me/'),
};

export const transport = {
  getAll: () => api.get('/transport-types/'),
};

export const applications = {
  getAll: () => api.get('/applications/'),
  create: (data) => api.post('/applications/', data),
  updateStatus: (id, status) => api.patch(`/applications/${id}/change_status/`, { status }),
};

export const reviews = {
  getAll: () => api.get('/reviews/'),
  create: (data) => api.post('/reviews/', data),
};

export default api;