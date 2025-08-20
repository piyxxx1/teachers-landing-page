import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (passwords: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', passwords),
  logout: () => api.post('/auth/logout'),
};

// Courses API
export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getById: (id: string) => api.get(`/courses/${id}`),
  create: (data: FormData) => api.post('/courses', data),
  update: (id: string, data: FormData) => api.put(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
  toggleStatus: (id: string) => api.patch(`/courses/${id}/toggle`),
};

// Webinars API
export const webinarsAPI = {
  getAll: () => api.get('/webinars'),
  getById: (id: string) => api.get(`/webinars/${id}`),
  create: (data: FormData) => api.post('/webinars', data),
  update: (id: string, data: FormData) => api.put(`/webinars/${id}`, data),
  delete: (id: string) => api.delete(`/webinars/${id}`),
  toggleStatus: (id: string) => api.patch(`/webinars/${id}/toggle`),
};

// Slider API
export const sliderAPI = {
  getAll: () => api.get('/slider'),
  getById: (id: string) => api.get(`/slider/${id}`),
  create: (data: FormData) => api.post('/slider', data),
  update: (id: string, data: FormData) => api.put(`/slider/${id}`, data),
  delete: (id: string) => api.delete(`/slider/${id}`),
  toggleStatus: (id: string) => api.patch(`/slider/${id}/toggle`),
};

export default api;
