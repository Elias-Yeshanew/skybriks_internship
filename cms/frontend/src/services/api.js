import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9001',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-redirect on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Auth ────────────────────────────────────────────
export const authService = {
  register: (data) => api.post('/api/register', data),
  login: (data) => api.post('/api/login', data),
  getMe: () => api.get('/api/users/me'),
  getUsers: () => api.get('/api/users'),
  updateUser: (id, data) => api.put(`/api/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
};

// ── Students ────────────────────────────────────────
export const studentService = {
  getAll: (page = 0, size = 10) => api.get(`/api/students?page=${page}&size=${size}`),
  getById: (id) => api.get(`/api/students/${id}`),
  create: (data) => api.post('/api/students', data),
  update: (id, data) => api.put(`/api/students/${id}`, data),
  delete: (id) => api.delete(`/api/students/${id}`),
  search: (q) => api.get(`/api/students/search?q=${q}`),
};

// ── Marks ───────────────────────────────────────────
export const marksService = {
  getAll: () => api.get('/api/marks'),
  getByStudent: (studentId) => api.get(`/api/marks/student/${studentId}`),
  add: (studentId, data) => api.post(`/api/marks/student/${studentId}`, data),
  update: (id, data) => api.put(`/api/marks/${id}`, data),
  delete: (id) => api.delete(`/api/marks/${id}`),
};

// ── Fees ────────────────────────────────────────────
export const feeService = {
  getAll: () => api.get('/api/fees'),
  getByStudent: (studentId) => api.get(`/api/fees/${studentId}`),
  create: (studentId, data) => api.post(`/api/fees/student/${studentId}`, data),
  update: (id, data) => api.put(`/api/fees/${id}`, data),
  delete: (id) => api.delete(`/api/fees/${id}`),
};

// ── Documents ───────────────────────────────────────
export const documentService = {
  getAll: () => api.get('/api/documents'),
  getByStudent: (studentId) => api.get(`/api/documents/student/${studentId}`),
  generateBonafide: (data) => api.post('/api/documents/bonafide', data),
  generateTC: (data) => api.post('/api/documents/transfer-certificate', data),
  generateMarksheet: (data) => api.post('/api/documents/marksheet', data),
  getBonafide: (id) => api.get(`/api/documents/bonafide/${id}`),
  getTC: (id) => api.get(`/api/documents/transfer-certificate/${id}`),
  getMarksheet: (id) => api.get(`/api/documents/marksheet/${id}`),
};

// ── Dashboard ───────────────────────────────────────
export const dashboardService = {
  getStats: () => api.get('/api/dashboard'),
};
