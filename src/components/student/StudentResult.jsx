// src/components/student/StudentResults.jsx

import React, { useState, useEffect } from 'react';
import { testAPI } from '../../services/api';
import { useNotification } from '../common/Notification';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  FileText,
  TrendingUp,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  Eye,
  X
} from 'lucide-react';

const StudentResults = () => {
  const { user } = useAuth();
  const { error } = useNotification();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    fetchMyResults();
  }, []);

  const fetchMyResults = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching my results...');
      console.log('🧑‍💻 Current user:', user);
      
      // Use the dedicated endpoint for current student
      const response = await testAPI.getMyResults();
      console.log('📊 Results API response:', response);
      
      if (response?.data?.success) {
        setResults(response.data.results || []);
        console.log('✅ Loaded real student results:', response.data.results?.length);
      } else {
        console.log('⚠️ No results from API, using mock data');
        // Mock data fallback
        const mockResults = [
          {
            _id: '1',
            test: {
              _id: 'test1',
              title: 'Mathematics Final Exam',
              subject: 'Mathematics',
              testType: 'final',
              testDate: '2025-09-13',
              maxMarks: 100,
              passingMarks: 40
            },
            student: user?._id || 'current-user',
            marksObtained: 85,
            percentage: 85,
            grade: 'A',
            status: 'passed',
            remarks: 'Excellent performance',
            submittedAt: '2025-09-06'
          },
          {
            _id: '2',
            test: {
              _id: 'test2',
              title: 'Physics Midterm',
              subject: 'Physics',
              testType: 'midterm',
              testDate: '2025-09-10',
              maxMarks: 80,
              passingMarks: 32
            },
            student: user?._id || 'current-user',
            marksObtained: 65,
            percentage: 81.25,
            grade: 'A',
            status: 'passed',
            remarks: 'Good work',
            submittedAt: '2025-09-05'
          },
          {
            _id: '3',
            test: {
              _id: 'test3',
              title: 'Chemistry Quiz',
              subject: 'Chemistry',
              testType: 'quiz',
              testDate: '2025-09-08',
              maxMarks: 50,
              passingMarks: 20
            },
            student: user?._id || 'current-user',
            marksObtained: 35,
            percentage: 70,
            grade: 'B+',
            status: 'passed',
            remarks: '',
            submittedAt: '2025-09-04'
          }
        ];
        setResults(mockResults);
      }
    } catch (err) {
      console.error('❌ Fetch results error:', err);
      error('Error', 'Failed to load your results');
      
      // Still show mock data for development
      const mockResults = [
        {
          _id: '1',
          test: {
            _id: 'test1',
            title: 'Mathematics Final Exam',
            subject: 'Mathematics',
            testType: 'final',
            testDate: '2025-09-13',
            maxMarks: 100,
            passingMarks: 40
          },
          student: user?._id || 'current-user',
          marksObtained: 85,
          percentage: 85,
          grade: 'A',
          status: 'passed',
          remarks: 'Excellent performance',
          submittedAt: '2025-09-06'
        }
      ];
      setResults(mockResults);
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

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-800',
      'C+': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    return status === 'passed' 
      ? 'text-green-600' 
      : 'text-red-600';
  };

  // Calculate overall statistics
  const stats = {
    totalTests: results.length,
    passedTests: results.filter(r => r.status === 'passed').length,
    averagePercentage: results.length > 0 
      ? (results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(1)
      : 0,
    highestScore: results.length > 0 
      ? Math.max(...results.map(r => r.percentage))
      : 0
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading your results..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Test Results</h2>
          <p className="text-sm text-gray-600">View your exam scores and performance</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Tests</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalTests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Passed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.passedTests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Average %</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.averagePercentage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Best Score</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.highestScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Results</h3>
        </div>
        
        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
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
                {results.map((result) => (
                  <tr key={result._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {result.test?.title || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.test?.subject || 'N/A'} • {result.test?.testType || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(result.test?.testDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <span className="font-semibold">{result.marksObtained || 0}</span>
                        <span className="text-gray-500">/{result.test?.maxMarks || 0}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {result.percentage || 0}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(result.grade)}`}>
                        {result.grade || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {result.status === 'passed' ? (
                          <CheckCircle className={`h-4 w-4 mr-1 ${getStatusColor(result.status)}`} />
                        ) : (
                          <XCircle className={`h-4 w-4 mr-1 ${getStatusColor(result.status)}`} />
                        )}
                        <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                          {result.status ? result.status.charAt(0).toUpperCase() + result.status.slice(1) : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedResult(result)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Results Yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your test results will appear here once they are graded.
            </p>
          </div>
        )}
      </div>

      {/* Result Details Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Test Result Details</h3>
              <button
                onClick={() => setSelectedResult(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{selectedResult.test?.title || 'Test'}</h4>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <div><strong>Subject:</strong> {selectedResult.test?.subject || 'N/A'}</div>
                  <div><strong>Type:</strong> {selectedResult.test?.testType || 'N/A'}</div>
                  <div><strong>Date:</strong> {formatDate(selectedResult.test?.testDate)}</div>
                  <div><strong>Result Date:</strong> {formatDate(selectedResult.submittedAt)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-green-50 p-4 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedResult.marksObtained || 0}/{selectedResult.test?.maxMarks || 0}
                  </div>
                  <div className="text-sm text-gray-600">Marks Obtained</div>
                </div>
                <div className="text-center bg-blue-50 p-4 rounded">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedResult.percentage || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Percentage</div>
                </div>
              </div>

              <div className="text-center">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${getGradeColor(selectedResult.grade)}`}>
                  Grade: {selectedResult.grade || 'N/A'}
                </span>
              </div>

              {selectedResult.remarks && (
                <div className="bg-yellow-50 p-4 rounded">
                  <strong>Teacher's Remarks:</strong>
                  <p className="mt-1 text-gray-700">{selectedResult.remarks}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentResults;
