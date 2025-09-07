// src/components/teacher/CreateTestModal.jsx

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { testAPI } from '../../services/api';
import { useNotification } from '../common/Notification';
import { X, Save } from 'lucide-react';

const CreateTestModal = ({ isOpen, onClose, onSuccess, initial }) => {
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    subject: '',
    testType: 'midterm',
    testDate: '',
    examTime: '09:00',
    duration: '180',
    venue: '',
    maxMarks: '100',
    passingMarks: '40',
    instructions: '',
    syllabus: ''
  });

  console.log('CreateTestModal render - isOpen:', isOpen, 'initial:', !!initial);

  useEffect(() => {
    if (initial && isOpen) {
      setForm({
        title: initial.title || '',
        subject: initial.subject || '',
        testType: initial.testType || 'midterm',
        testDate: initial.testDate ? initial.testDate.split('T')[0] : '',
        examTime: initial.examTime || '09:00',
        duration: initial.duration?.toString() || '180',
        venue: initial.venue || '',
        maxMarks: initial.maxMarks?.toString() || '100',
        passingMarks: initial.passingMarks?.toString() || '40',
        instructions: initial.instructions || '',
        syllabus: initial.syllabus || ''
      });
    } else if (!initial && isOpen) {
      // Reset form for new test
      setForm({
        title: '',
        subject: '',
        testType: 'midterm',
        testDate: '',
        examTime: '09:00',
        duration: '180',
        venue: '',
        maxMarks: '100',
        passingMarks: '40',
        instructions: '',
        syllabus: ''
      });
    }
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('Form submitted:', form);
    
    // Validation
    const requiredFields = ['title', 'subject', 'testDate', 'venue', 'maxMarks', 'passingMarks'];
    const errors = [];
    
    requiredFields.forEach(field => {
      if (!form[field]?.toString().trim()) {
        errors.push(`${field} is required`);
      }
    });
    
    if (parseInt(form.passingMarks) >= parseInt(form.maxMarks)) {
      errors.push('Passing marks must be less than maximum marks');
    }
    
    if (errors.length > 0) {
      error('Validation Error', errors.join(', '));
      return;
    }
    
    setLoading(true);
    try {
      const testData = {
        title: form.title.trim(),
        subject: form.subject.trim(),
        testType: form.testType,
        maxMarks: Number(form.maxMarks),
        passingMarks: Number(form.passingMarks),
        testDate: form.testDate,
        examTime: form.examTime,
        duration: Number(form.duration),
        venue: form.venue.trim(),
        instructions: form.instructions.trim(),
        syllabus: form.syllabus.trim()
      };

      if (initial) {
        await testAPI.updateTest(initial._id, testData);
        success('Success', 'Test updated successfully');
      } else {
        await testAPI.createTest(testData);
        success('Success', 'Test created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Create/Update test error:', err);
      error('Error', err.response?.data?.message || 'Failed to save test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {initial ? 'Edit Test' : 'Create New Test'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            type="button"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="e.g., Mathematics Final Exam"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="e.g., Mathematics"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Type *
            </label>
            <select
              name="testType"
              value={form.testType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
              <option value="supplementary">Supplementary</option>
              <option value="practical">Practical</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Date *
              </label>
              <input
                name="testDate"
                type="date"
                value={form.testDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                name="examTime"
                type="time"
                value={form.examTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (min)
              </label>
              <select
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="90">90 minutes</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
                <option value="240">4 hours</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Venue *
            </label>
            <input
              name="venue"
              value={form.venue}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., Hall A, Room 101"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Marks *
              </label>
              <input
                name="maxMarks"
                type="number"
                min="1"
                value={form.maxMarks}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passing Marks *
              </label>
              <input
                name="passingMarks"
                type="number"
                min="0"
                value={form.passingMarks}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <textarea
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Special instructions for students..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Syllabus Coverage
              </label>
              <textarea
                name="syllabus"
                value={form.syllabus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Chapters/topics covered..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>{initial ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{initial ? 'Update Test' : 'Create Test'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTestModal;
