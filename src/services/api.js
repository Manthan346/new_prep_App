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
  getAllStudents: (params = {}) => api.get('/students/', { params }),
  getDashboard: () => api.get('/dashboard/student'),
  getPerformance: () => api.get('/students/performance'),
  getMyResults: (params = {}) => api.get('/students/my-results', { params }),
};

// Dashboard API
export const dashboardAPI = {
  // backend exposes GET /api/dashboard/student
  getStudentDashboard: () => api.get('/dashboard/student'),
  getTeacherDashboard: () => api.get('/dashboard/teacher'),
  getAdminDashboard: () => api.get('/dashboard/admin'),
};

// Tests API
export const testAPI = {
  getTests: (params) => api.get('/tests', { params }),
  getTest: (id) => api.get(`/tests/${id}`),
  createTest: (data) => api.post('/tests', data),
  updateTest: (id, data) => api.put(`/tests/${id}`, data),
  deleteTest: (id) => api.delete(`/tests/${id}`),

  // marks endpoints
  addOrUpdateMarks: (id, data) => api.post(`/tests/${id}/marks`, data),
  getTestResults: (id) => api.get(`/tests/${id}/results`),
  getTestStatistics: (id) => api.get(`/tests/${id}/statistics`),
};

// Subjects API (only GET exists on backend)
export const subjectAPI = {
  getAllSubjects: (params = {}) => api.get('/subjects', { params }),
  getSubjectById: (id) => api.get(`/subjects/${id}`),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyToken: () => api.get('/auth/verify'),
};

// Announcements API
export const announcementsAPI = {
  list: (params = {}) => api.get('/announcements', { params }),
  get: (id) => api.get(`/announcements/${id}`),
  getAnnouncementDetails: (id) => api.get(`/announcements/${id}`),
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  remove: (id) => api.delete(`/announcements/${id}`),
  apply: (id) => api.post(`/announcements/${id}/apply`),
  uploadResume: (id, formData) => api.post(`/announcements/${id}/upload-resume`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getApplicants: (id) => api.get(`/announcements/${id}/applicants`),
  getApplications: (id) => api.get(`/announcements/${id}/applications`),
  getAllJobsAndApplicants: () => api.get('/announcements/jobs/all-applicants'),
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
