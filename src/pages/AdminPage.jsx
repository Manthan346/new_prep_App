import React from 'react';
import AdminDashboard from '../components/admin/AdminDashboard';

const AdminPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Panel
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          System administration and management
        </p>
      </div>

      <AdminDashboard />
    </div>
  );
};

export default AdminPage;
