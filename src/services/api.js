// src/services/api.js

import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
          break;
        case 403:
        case 404:
        case 500:
          console.error(data.message);
          break;
        default:
          console.error(data.message || 'Unknown error');
      }
    } else if (error.request) {
      console.error('Network error:', error.message);
    } else {
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Student API
export const studentAPI = {
  getDashboard: () => api.get('/dashboard/student/dashboard'),
  getResults: (params = {}) => api.get('/dashboard/student/results', { params }),
  getPerformance: () => api.get('/dashboard/student/performance'),
  getAllStudents: (params = {}) => api.get('/dashboard/student/', { params }),
  getStudentPerformance: (studentId) => api.get(`/dashboard/student/performance/${studentId}`),
};

// Test API
export const testAPI = {
  getAllTests: (params = {}) => api.get('/tests', { params }),
  // alias to avoid import errors
  getTests: (params = {}) => api.get('/tests', { params }),
  getTest: (id) => api.get(`/tests/${id}`),
  createTest: (data) => api.post('/tests', data),
  updateTest: (id, data) => api.put(`/tests/${id}`, data),
  deleteTest: (id) => api.delete(`/tests/${id}`),
  addMarks: (testId, marks) => api.post(`/tests/${testId}/marks`, { marks }),
  getTestResults: (testId) => api.get(`/tests/${testId}/results`),
};

// Subject API
export const subjectAPI = {
  getAllSubjects: (params = {}) => api.get('/subjects', { params }),
  createSubject: (data) => api.post('/subjects', data),
  updateSubject: (id, data) => api.put(`/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/subjects/${id}`),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyToken: () => api.get('/auth/verify'),
  refreshToken: () => api.post('/auth/refresh'),
};

// Dashboard API (admin)
export const dashboardAPI = {
  getAdminDashboard: () => api.get('/dashboard'),
};

// Utility functions
export const apiUtils = {
  setAuthToken: (token) => localStorage.setItem('token', token),
  removeAuthToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
};

export default api;
