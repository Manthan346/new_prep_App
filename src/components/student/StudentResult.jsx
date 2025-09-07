import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import MarksGraph from '../common/MarksGraph';
import PerformanceCard from '../common/PerformanceCard';
import { BarChart3, TrendingUp, Award, Target } from 'lucide-react';

const StudentResult = () => {
  const [results, setResults] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const [resultsRes, performanceRes] = await Promise.all([
        api.get('/dashboard/student/results'),
        api.get('/dashboard/student/performance')
      ]);

      setResults(resultsRes.data.results || []);
      setPerformance(performanceRes.data);
      setError('');
    } catch (err) {
      console.error('Error fetching student data:', err);
      setError('Failed to load your marks data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading your performance data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-6 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  const { subjectPerformance = [], student } = performance || {};

  // Calculate overall stats
  const totalTests = results.length;
  const passedTests = results.filter(r => r.isPassed).length;
  const totalMarks = results.reduce((sum, r) => sum + r.marksObtained, 0);
  const totalMaxMarks = results.reduce((sum, r) => sum + r.test.maxMarks, 0);
  const overallPercentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Academic Performance</h1>
        <p className="text-gray-600 mt-2">Track your progress and achievements</p>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <PerformanceCard
          title="Total Tests"
          value={totalTests}
          icon={<Award className="h-6 w-6" />}
          color="bg-blue-600"
        />
        <PerformanceCard
          title="Passed Tests"
          value={passedTests}
          icon={<Target className="h-6 w-6" />}
          color="bg-green-600"
        />
        <PerformanceCard
          title="Pass Rate"
          value={`${totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="bg-purple-600"
        />
        <PerformanceCard
          title="Overall Average"
          value={`${overallPercentage.toFixed(1)}%`}
          icon={<BarChart3 className="h-6 w-6" />}
          color="bg-orange-600"
        />
      </div>

      {/* Subject-wise Performance */}
      {subjectPerformance.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-gray-500">No test results available yet.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {subjectPerformance.map(({ subject, results: subjectResults, graphData, ...stats }) => (
            <Card key={subject._id} className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {subject.name} ({subject.code})
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>Tests: {stats.totalTests}</span>
                  <span>Average: {stats.percentage?.toFixed(1)}%</span>
                  <span>Pass Rate: {stats.passRate?.toFixed(1)}%</span>
                </div>
              </div>

              {/* Performance Graph */}
              {graphData && graphData.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Performance Trend</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <MarksGraph data={graphData} />
                  </div>
                </div>
              )}

              {/* Test Results Table */}
              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold mb-3">Test Results</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">Test</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Score</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Max</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Percentage</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectResults.map((result) => {
                      const percentage = ((result.marksObtained / result.test.maxMarks) * 100);
                      return (
                        <tr key={result._id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-medium">
                            {result.test.title}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {result.marksObtained}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {result.test.maxMarks}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <span className={`font-semibold ${
                              percentage >= 90 ? 'text-green-600' :
                              percentage >= 75 ? 'text-blue-600' :
                              percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {percentage.toFixed(1)}%
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                              result.isPassed 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {result.isPassed ? 'Passed' : 'Failed'}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {new Date(result.test.testDate).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentResult;
