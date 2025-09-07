// src/pages/Tests.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { testAPI } from '../services/api';
import { useNotification } from '../components/common/Notification';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CreateTestModal from '../components/teacher/CreateTestModal';
import MarksEntryModal from '../components/teacher/MarksEntryModal';
import {
  Plus,
  FileText,
  Users,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  MapPin,
  BookOpen
} from 'lucide-react';

// Helper functions
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

const getTestTypeColor = (type) => {
  const colors = {
    midterm: 'bg-yellow-100 text-yellow-800',
    final: 'bg-red-100 text-red-800',
    supplementary: 'bg-purple-100 text-purple-800',
    practical: 'bg-blue-100 text-blue-800',
    quiz: 'bg-green-100 text-green-800'
  };
  return colors[type?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

const getExamStatus = (examDate) => {
  if (!examDate) return { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };
  
  const today = new Date();
  const examDay = new Date(examDate);
  
  if (examDay < today) {
    return { text: 'Completed', color: 'bg-green-100 text-green-800' };
  } else if (examDay.toDateString() === today.toDateString()) {
    return { text: 'Today', color: 'bg-blue-100 text-blue-800' };
  } else {
    return { text: 'Upcoming', color: 'bg-yellow-100 text-yellow-800' };
  }
};

const Tests = () => {
  const { user } = useAuth();
  const notif = useNotification();

  // State
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  // Check user permissions
  const canManage = ['admin', 'teacher'].includes(user?.role?.toLowerCase());

  // Load tests
  const loadTests = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching tests...');
      const response = await testAPI.getTests({ page: 1, limit: 100 });
      console.log('📊 Tests API response:', response);
      
      if (response?.data?.success) {
        setTests(response.data.tests || []);
        console.log('✅ Loaded tests:', response.data.tests?.length);
      } else {
        setTests([]);
      }
    } catch (err) {
      console.error('❌ Load tests error:', err);
      notif.error('Error', 'Failed to load tests');
      setTests([]);
    } finally {
      setLoading(false);
    }
  }, [notif]);

  useEffect(() => {
    loadTests();
  }, [loadTests]);

  // Handlers
  const handleCreateTest = useCallback(() => {
    console.log('🆕 Opening create modal');
    setSelectedTest(null);
    setShowCreateModal(true);
  }, []);

  const handleEditTest = useCallback((test) => {
    console.log('✏️ Opening edit modal for:', test.title);
    setSelectedTest(test);
    setShowEditModal(true);
  }, []);

  const handleEnterMarks = useCallback((test) => {
    console.log('📝 Opening marks modal for:', test.title);
    setSelectedTest(test);
    setShowMarksModal(true);
  }, []);

  const handleDeleteTest = useCallback(async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;

    try {
      await testAPI.deleteTest(testId);
      notif.success('Success', 'Test deleted successfully');
      loadTests();
    } catch (err) {
      console.error('❌ Delete test error:', err);
      notif.error('Error', 'Failed to delete test');
    }
  }, [notif, loadTests]);

  const closeAllModals = useCallback(() => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowMarksModal(false);
    setSelectedTest(null);
  }, []);

  const handleModalSuccess = useCallback(() => {
    loadTests();
    closeAllModals();
  }, [loadTests, closeAllModals]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'student' ? 'My Tests' : 'Test Management'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {user?.role === 'student' 
              ? 'View your test results and upcoming tests' 
              : 'Create, manage tests and enter marks'}
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleCreateTest}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Test</span>
          </button>
        )}
      </div>

      {/* Tests Content */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading tests..." />
          </div>
        ) : tests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tests.map((test) => {
                  const status = getExamStatus(test.testDate);
                  return (
                    <tr key={test._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {test.title}
                          </div>
                          {test.venue && (
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {test.venue}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTestTypeColor(test.testType)}`}>
                            {test.testType ? test.testType.charAt(0).toUpperCase() + test.testType.slice(1) : 'N/A'}
                          </span>
                          <div className="text-sm text-gray-500 mt-1">
                            {test.subject || 'N/A'}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center text-gray-900">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {formatDate(test.testDate)}
                          </div>
                          {test.examTime && (
                            <div className="flex items-center mt-1 text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {test.examTime} • {test.duration || 0} min
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">Max: {test.maxMarks || 0}</div>
                          <div className="text-gray-500">Pass: {test.passingMarks || 0}</div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEnterMarks(test)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {canManage && (
                            <>
                              <button
                                onClick={() => handleEnterMarks(test)}
                                className="text-green-600 hover:text-green-900"
                                title="Enter Marks"
                              >
                                <Users className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleEditTest(test)}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Edit Test"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTest(test._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Test"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Tests Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {canManage 
                ? 'Get started by creating your first test.' 
                : 'No tests available yet.'}
            </p>
            {canManage && (
              <button
                onClick={handleCreateTest}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create First Test</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTestModal
        isOpen={showCreateModal}
        onClose={closeAllModals}
        onSuccess={handleModalSuccess}
        initial={null}
      />

      <CreateTestModal
        isOpen={showEditModal}
        onClose={closeAllModals}
        onSuccess={handleModalSuccess}
        initial={selectedTest}
      />

      <MarksEntryModal
        test={selectedTest}
        isOpen={showMarksModal}
        onClose={closeAllModals}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default Tests;
