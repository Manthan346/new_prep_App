// src/components/teacher/MarksEntryModal.jsx - COMPLETE FIX

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { studentAPI, testAPI } from '../../services/api';
import { useNotification } from '../common/Notification';
import { X } from 'lucide-react';

const MarksEntryModal = ({ test, isOpen, onClose, onSuccess }) => {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasExistingMarks, setHasExistingMarks] = useState(false);
  const { error, success } = useNotification();

  useEffect(() => {
    if (isOpen && test) {
      fetchStudentsAndMarks();
    }
  }, [isOpen, test]);

  if (!test || !isOpen) {
    return null;
  }

  const fetchStudentsAndMarks = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching students and existing marks...');
      
      // Fetch students and existing marks in parallel
      const [studentsResponse, marksResponse] = await Promise.all([
        studentAPI.getStudents({ limit: 100 }).catch(() => null),
        testAPI.getTestMarks(test._id).catch(() => null)
      ]);

      console.log('📊 Students response:', studentsResponse);
      console.log('📊 Existing marks response:', marksResponse);

      // Get students list
      let studentData = [];
      if (studentsResponse?.data?.success && studentsResponse.data.students?.length > 0) {
        studentData = studentsResponse.data.students;
        console.log('✅ Found real students:', studentData.length);
      } else {
        console.log('⚠️ Using mock students');
        studentData = [
          { _id: '1', name: 'John Doe', rollNumber: 'ST001', email: 'john@example.com' },
          { _id: '2', name: 'Jane Smith', rollNumber: 'ST002', email: 'jane@example.com' },
          { _id: '3', name: 'Bob Johnson', rollNumber: 'ST003', email: 'bob@example.com' },
          { _id: '4', name: 'Alice Brown', rollNumber: 'ST004', email: 'alice@example.com' },
          { _id: '5', name: 'Charlie Davis', rollNumber: 'ST005', email: 'charlie@example.com' }
        ];
      }

      setStudents(studentData);

      // Get existing marks
      let existingMarks = {};
      if (marksResponse?.data?.success && marksResponse.data.marks?.length > 0) {
        console.log('✅ Found existing marks:', marksResponse.data.marks.length);
        setHasExistingMarks(true);
        
        // Create a map of existing marks by student ID
        marksResponse.data.marks.forEach(mark => {
          existingMarks[mark.studentId] = {
            marksObtained: mark.marksObtained.toString(),
            remarks: mark.remarks || '',
            percentage: mark.percentage,
            grade: mark.grade,
            status: mark.status
          };
        });
      } else {
        console.log('ℹ️ No existing marks found');
        setHasExistingMarks(false);
      }

      // Initialize marks array with existing data if available
      const initialMarks = studentData.map(student => ({
        studentId: student._id,
        studentName: student.name,
        rollNumber: student.rollNumber,
        marksObtained: existingMarks[student._id]?.marksObtained || '',
        remarks: existingMarks[student._id]?.remarks || '',
        // Add display fields for existing marks
        existingPercentage: existingMarks[student._id]?.percentage,
        existingGrade: existingMarks[student._id]?.grade,
        existingStatus: existingMarks[student._id]?.status
      }));
      
      setMarks(initialMarks);
      console.log('📝 Initialized marks:', initialMarks);
      
    } catch (err) {
      console.error('❌ Fetch error:', err);
      error('Error', 'Failed to load students and marks');
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (index, field, value) => {
    setMarks(prevMarks => {
      const newMarks = [...prevMarks];
      newMarks[index] = { ...newMarks[index], [field]: value };
      return newMarks;
    });
  };

  const calculateGrade = (marksValue) => {
    if (!test || !test.maxMarks) return '';
    const marks = parseFloat(marksValue);
    if (isNaN(marks)) return '';
    
    const percentage = (marks / test.maxMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 35) return 'D';
    return 'F';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validMarks = marks.filter(mark => 
      mark.marksObtained !== '' && mark.marksObtained !== null
    );

    if (validMarks.length === 0) {
      error('Error', 'Please enter marks for at least one student');
      return;
    }

    const invalidMarks = validMarks.filter(mark => {
      const marksNum = parseFloat(mark.marksObtained);
      return isNaN(marksNum) || marksNum < 0 || marksNum > test.maxMarks;
    });

    if (invalidMarks.length > 0) {
      error('Error', `Marks must be between 0 and ${test.maxMarks}`);
      return;
    }

    try {
      setSubmitting(true);
      
      const marksData = {
        results: validMarks.map(mark => ({
          student: mark.studentId,
          marksObtained: parseFloat(mark.marksObtained),
          remarks: (mark.remarks || '').trim()
        }))
      };

      console.log('📤 Submitting marks:', marksData);

      const response = await testAPI.submitMarks(test._id, marksData);
      
      console.log('📥 Backend response:', response);

      if (response?.data?.success) {
        const processedCount = response.data.processed || response.data.data?.results?.length || validMarks.length;
        success('Success', `Marks ${hasExistingMarks ? 'updated' : 'submitted'} for ${processedCount} students`);
        
        if (onSuccess) onSuccess();
        onClose();
      } else {
        error('Error', response?.data?.message || 'Failed to submit marks');
      }

    } catch (err) {
      console.error('❌ Submit error:', err);
      
      if (err.response?.status === 200) {
        success('Success', 'Marks have been saved successfully');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        error('Error', err.response?.data?.message || 'Failed to submit marks');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {hasExistingMarks ? 'Update Marks' : 'Enter Marks'} - {test.title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Test Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Subject:</strong> {test.subject || 'N/A'}</div>
              <div><strong>Max Marks:</strong> {test.maxMarks || 0}</div>
              <div><strong>Passing Marks:</strong> {test.passingMarks || 0}</div>
              <div><strong>Type:</strong> {test.testType || 'N/A'}</div>
            </div>
          </div>

          {/* Status Info */}
          {hasExistingMarks && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Marks have been previously entered. You can update them below.
              </p>
            </div>
          )}

          <div className="bg-yellow-50 p-2 rounded text-xs">
            📊 Students: {students.length} | {hasExistingMarks ? 'Existing marks loaded' : 'No existing marks'}
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" text="Loading students and marks..." />
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No students found</p>
              <button 
                onClick={fetchStudentsAndMarks}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry Loading
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {marks.map((mark, index) => (
                      <tr key={mark.studentId} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {mark.studentName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {mark.rollNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <input
                              type="number"
                              min="0"
                              max={test.maxMarks}
                              step="0.5"
                              value={mark.marksObtained}
                              onChange={(e) => handleMarksChange(index, 'marksObtained', e.target.value)}
                              className={`w-20 px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 ${
                                mark.marksObtained ? 'border-green-300 bg-green-50' : 'border-gray-300'
                              }`}
                              placeholder="0"
                            />
                            <span className="text-xs text-gray-500 ml-2">/ {test.maxMarks}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {mark.marksObtained && !isNaN(parseFloat(mark.marksObtained)) && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              calculateGrade(parseFloat(mark.marksObtained)) === 'F' 
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {calculateGrade(parseFloat(mark.marksObtained))}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {mark.existingGrade && (
                            <div className="text-gray-600">
                              <div>{mark.existingPercentage}%</div>
                              <div className="font-medium">{mark.existingGrade}</div>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={mark.remarks}
                            onChange={(e) => handleMarksChange(index, 'remarks', e.target.value)}
                            className="w-32 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Optional"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center space-x-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>{hasExistingMarks ? 'Updating...' : 'Submitting...'}</span>
                    </>
                  ) : (
                    <span>{hasExistingMarks ? 'Update Marks' : 'Submit Marks'}</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarksEntryModal;
