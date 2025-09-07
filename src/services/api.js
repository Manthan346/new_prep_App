import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data);
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/signup') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  verify: () => api.get('/auth/verify'),
  logout: () => api.post('/auth/logout'),
};

// Admin API
export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  getTeachers: (params) => api.get('/admin/teachers', { params }),
  createTeacher: (data) => api.post('/admin/teachers', data),
  getSubjects: (params) => api.get('/admin/subjects', { params }),
  createSubject: (data) => api.post('/admin/subjects', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getDashboard: () => api.get('/admin/dashboard'),
  getStats: () => api.get('/admin/stats'),
};

// Test API
export const testAPI = {
  getTests: (params) => api.get('/tests', { params }),
  getTest: (id) => api.get(`/tests/${id}`),
  createTest: (data) => api.post('/tests', data),
  updateTest: (id, data) => api.put(`/tests/${id}`, data),
  deleteTest: (id) => api.delete(`/tests/${id}`),

  getTestMarks: (id) => api.get(`/tests/${id}/marks`),   // Single declaration only
  submitMarks: (id, data) => api.post(`/tests/${id}/marks`, data),
  getTestResults: (id, params) => api.get(`/tests/${id}/results`, { params }),
  getTestStatistics: (id) => api.get(`/tests/${id}/statistics`),

  // Student's results APIs
  getMyResults: () => api.get('/students/my-results'),
  getStudentResults: (id) => api.get(`/students/${id}/results`),
  getMyTestResult: (id) => api.get(`/students/test/${id}/result`),
  getResultAnalysis: () => api.get('/students/results/analysis'),

  getUpcomingTests: (params) => api.get('/tests', { params: { ...params, upcoming: true } }),
  getPastTests: (params) => api.get('/tests', { params: { ...params, past: true } }),
};

// Student API
export const studentAPI = {
  getStudents: (params) => api.get('/students', { params }),
  getStudent: (id) => api.get(`/students/${id}`),
  createStudent: (data) => api.post('/students', data),
  updateStudent: (id, data) => api.put(`/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/students/${id}`),

  getDashboard: () => api.get('/students/dashboard'),
  getPerformance: (id) => (id ? api.get(`/students/${id}/performance`) : api.get('/students/performance')),

  getResults: (params) => api.get('/students/results', { params }),
  getMyResults: () => api.get('/students/my-results'),
  getMyTestResult: (id) => api.get(`/students/test/${id}/result`),
  getResultAnalysis: () => api.get('/students/results/analysis'),

  updateProfile: (data) => api.put('/students/profile', data),
  changePassword: (data) => api.put('/students/password', data),
};

// Subject API
export const subjectAPI = {
  getSubjects: (params) => api.get('/subjects', { params }),
  getSubject: (id) => api.get(`/subjects/${id}`),
  createSubject: (data) => api.post('/subjects', data),
  updateSubject: (id, data) => api.put(`/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/subjects/${id}`),

  getSubjectTests: (id, params) => api.get(`/subjects/${id}/tests`, { params }),
  getSubjectStudents: (id, params) => api.get(`/subjects/${id}/students`, { params }),
};

// Dashboard API
export const dashboardAPI = {
  getStudentDashboard: () => api.get('/dashboard/student'),
  getTeacherDashboard: () => api.get('/dashboard/teacher'),
  getAdminDashboard: () => api.get('/dashboard/admin'),

  getRecentActivity: () => api.get('/dashboard/activity'),
  getQuickStats: () => api.get('/dashboard/stats'),
  getNotifications: () => api.get('/dashboard/notifications'),
};

// Department API (if applicable)
export const departmentAPI = {
  getDepartments: (params) => api.get('/departments', { params }),
  getDepartment: (id) => api.get(`/departments/${id}`),
  createDepartment: (data) => api.post('/departments', data),
  updateDepartment: (id, data) => api.put(`/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/departments/${id}`),
};

// Reports API
export const reportsAPI = {
  getStudentReport: (id, params) => api.get(`/reports/student/${id}`, { params }),
  getTestReport: (id, params) => api.get(`/reports/test/${id}`, { params }),
  getSubjectReport: (id, params) => api.get(`/reports/subject/${id}`, { params }),
  getDepartmentReport: (id, params) => api.get(`/reports/department/${id}`, { params }),
  export: (type, id, format) => api.get(`/reports/${type}/${id}/export/${format}`, { responseType: 'blob' }),
};

// Notification API
export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

export default api;
