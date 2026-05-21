import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Получаем CSRF токен
const getCSRFToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

// Добавляем CSRF токен в запросы
api.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

// Добавляем перехватчик для ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Функция для получения CSRF токена
export const getCSRF = async () => {
  try {
    await api.get('/auth/csrf/');
  } catch (error) {
    console.error('CSRF error:', error);
  }
};

export const auth = {
  register: (data) => {
    console.log('Sending registration data:', data);
    return api.post('/auth/register/', data);
  },
  login: (data) => {
    console.log('Sending login data:', data);
    return api.post('/auth/login/', data);
  },
  logout: () => api.post('/auth/logout/'),
  me: () => {
    console.log('Checking auth...');
    return api.get('/auth/me/');
  },
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