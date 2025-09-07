import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import { useNotification } from '../common/Notification';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp,
  User,
  GraduationCap
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

import MarksStatsCard from '../common/MarksStatsCard'; // Import the new marks stats card

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error } = useNotification();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getAdminDashboard();
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      error('Error', 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No dashboard data available</p>
      </div>
    );
  }

  const { stats, recentUsers, recentTests, gradeDistribution } = dashboardData;

  const statCards = [
    {
      name: 'Total Students',
      value: stats.totalStudents,
      icon: GraduationCap,
      color: 'text-blue-600',
      change: 'Active students'
    },
    


    {
      name: 'Tests',
      value: stats.totalTests,
      icon: FileText,
      color: 'text-yellow-600',
      change: 'Total tests'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
        {statCards.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="ml-2 text-sm text-gray-500">
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}

        {/* Render the MarksStatsCard separately here */}
   
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentUsers?.length > 0 ? (
              recentUsers.map((user) => (
                <div 
                  key={user._id} 
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {user.email} • {user.role}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent users</p>
            )}
          </div>
        </div>

        {/* Recent Tests */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Tests</h3>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentTests?.length > 0 ? (
              recentTests.map((test) => (
                <div 
                  key={test._id} 
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{test.title}</p>
                    <p className="text-xs text-gray-500">
                      {test.subject?.name} • by {test.createdBy?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(test.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent tests</p>
            )}
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      {gradeDistribution && Object.keys(gradeDistribution).length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">System-wide Grade Distribution</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
            {Object.entries(gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-500">Grade {grade}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
