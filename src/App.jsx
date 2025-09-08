import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { NotificationProvider } from './components/common/Notification';

// Import pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Tests from './pages/Tests';
import AdminPage from './pages/AdminPage';
import StudentsPage from './pages/StudentsPage';
import Performance from './pages/Performance';
import Announcements from './pages/Announcements';
import AnnouncementApplicants from './pages/AnnouncementApplicants';
import AllJobsAndApplicants from './components/admin/AllJobsAndApplicants';
import AptitudePrep from './pages/AptitudePrep';


// Import components
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  

  return children;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests"
        element={
          <ProtectedRoute>
            <Layout>
              <Tests />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AdminPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher']}>
            <Layout>
              <StudentsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/performance"
          element={
            <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
              <Layout>
                <Performance />
              </Layout>
            </ProtectedRoute>
          }
      />



      <Route
        path="/aptitude-prep"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
            <Layout>
              <AptitudePrep />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/announcements"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
            <Layout>
              <Announcements />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/announcements/applicants"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AnnouncementApplicants />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/jobs-applicants"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AllJobsAndApplicants />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-gray-600 mb-4">Page not found</p>
              <a href="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <Theme>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <div className="App">
              <AppRoutes />
            </div>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </Theme>
  );
};

export default App;
