// src/components/student/StudentDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { testAPI, dashboardAPI } from '../../services/api';
import { useNotification } from '../common/Notification';
import LoadingSpinner from '../common/LoadingSpinner';
import StudentResult from './StudentResult';
import {
  BookOpen,
  FileText,
  TrendingUp,
  Calendar,
  Award,
  Users,
  Clock
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { error } = useNotification();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    upcomingTests: [],
    recentResults: [],
    stats: {
      totalTests: 0,
      completedTests: 0,
      averageScore: 0,
      passRate: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching dashboard data...');
      
      // Try to fetch real dashboard data
      try {
        const response = await dashboardAPI.getStudentDashboard();
        if (response?.data?.success) {
          setDashboardData({
            upcomingTests: response.data.data?.upcomingTests || [],
            recentResults: response.data.data?.recentResults || [],
            stats: response.data.data?.performance || {
              totalTests: 0,
              completedTests: 0,
              averageScore: 0,
              passRate: 0
            }
          });
          console.log('✅ Real dashboard data loaded');
          return;
        }
      } catch (err) {
        console.log('⚠️ Dashboard API failed, using mock data');
      }

      // Mock data fallback
      const mockData = {
        upcomingTests: [
          {
            _id: '1',
            title: 'Physics Final',
            subject: 'Physics',
            testDate: '2025-09-15',
            examTime: '10:00',
            venue: 'Room 101',
            duration: 180
          },
          {
            _id: '2',
            title: 'Chemistry Midterm',
            subject: 'Chemistry',
            testDate: '2025-09-20',
            examTime: '14:00',
            venue: 'Lab A',
            duration: 120
          }
        ],
        recentResults: [
          {
            _id: '1',
            test: { title: 'Math Final', subject: 'Mathematics' },
            marksObtained: 85,
            maxMarks: 100,
            percentage: 85,
            grade: 'A',
            status: 'passed'
          }
        ],
        stats: {
          totalTests: 5,
          completedTests: 3,
          averageScore: 78.5,
          passRate: 100
        }
      };
      setDashboardData(mockData);
      console.log('📋 Mock dashboard data loaded');
    } catch (err) {
      console.error('❌ Dashboard error:', err);
      error('Error', 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading && activeTab === 'overview') {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm text-gray-600">Here's your academic overview</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'results'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Results
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Tests</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {dashboardData.stats.totalTests || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Average Score</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {dashboardData.stats.averageScore || 0}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Pass Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {dashboardData.stats.passRate || 0}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {dashboardData.stats.completedTests || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Tests */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Upcoming Tests</h3>
            </div>
            <div className="p-6">
              {dashboardData.upcomingTests.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.upcomingTests.map((test) => (
                    <div key={test._id} className="border-l-4 border-blue-400 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{test.title}</h4>
                          <p className="text-sm text-gray-500">{test.subject}</p>
                          {test.venue && (
                            <p className="text-xs text-gray-400">Venue: {test.venue}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(test.testDate)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {test.examTime} • {test.duration} min
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">No upcoming tests</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Results */}
          {dashboardData.recentResults.length > 0 && (
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Results</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.recentResults.map((result) => (
                    <div key={result._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{result.test?.title}</h4>
                        <p className="text-sm text-gray-500">{result.test?.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {result.marksObtained}/{result.test?.maxMarks || result.maxMarks}
                        </p>
                        <p className="text-sm text-gray-500">{result.percentage}% • {result.grade}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <StudentResult />
      )}
    </div>
  );
};

export default StudentDashboard;
