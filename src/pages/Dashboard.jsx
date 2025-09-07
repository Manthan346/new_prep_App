import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import StudentDashboard from '../components/student/StudentDashboard';

import AdminDashboard from '../components/admin/AdminDashboard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNotification } from '../components/common/Notification';

const Dashboard = () => {
  const { user } = useAuth();
  const { error } = useNotification();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      error('Error', 'User information not available');
    }
  }, [user, error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
  
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-900">
              Unknown user role
            </h2>
            <p className="mt-2 text-gray-600">
              Please contact the administrator.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {user?.role === 'student' && `${user.department} - Year ${user.year}`}
              {user?.role === 'teacher' && `Employee ID: ${user.employeeId}`}
              {user?.role === 'admin' && 'System Administrator'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${'bg-green-100 text-green-800'}`}>
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Role-specific dashboard */}
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
