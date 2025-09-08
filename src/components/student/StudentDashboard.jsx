import React, { useEffect, useState } from 'react';
import { studentAPI } from '../../services/api';
import Card from '../common/Card';
import PerformanceCard from '../common/PerformanceCard';
import MarksGraph from '../common/MarksGraph';
import { Calendar, BookOpen, TrendingUp, Award } from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.role === 'student') {
      fetchStudentDashboard();
    }
  }, [user.role]);

  const fetchStudentDashboard = async () => {
    try {
      // use studentAPI helper which points to the correct dashboard endpoints
      const resp = await studentAPI.getDashboard();
      // studentAPI.getDashboard() returns the axios response
      setDashboardData(resp.data.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const { 
    performance, 
    recentResults, 
    upcomingTests, 
    graphData, 
    stats,
    subjectStats 
  } = dashboardData || {};

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600 mt-2">Here's your academic progress overview</p>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-4 gap-4">
     
        <PerformanceCard
          title="Total Tests"
          value={stats?.totalTests || 0}
          icon={<Award className="h-6 w-6" />}
          color="bg-green-600"
        />
        <PerformanceCard
          title="Completed Tests"
          value={stats?.completedTests || 0}
          icon={<Calendar className="h-6 w-6" />}
          color="bg-purple-600"
        />
    
      </div>

      {/* Overall Performance Graph */}
      {graphData && graphData.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Overall Performance Trend</h2>
          <MarksGraph data={graphData} />
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Test Results</h2>
          {recentResults?.length > 0 ? (
            <div className="space-y-3">
              {recentResults.map((result, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{result.test.title}</div>
                    <div className="text-sm text-gray-600">{result.test.subject.name}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${result.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                      {result.marksObtained}/{result.test.maxMarks}
                    </div>
                    <div className="text-sm text-gray-600">
                      {((result.marksObtained / result.test.maxMarks) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent results available</p>
          )}
        </Card>

        {/* Upcoming Tests */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Tests</h2>
          {upcomingTests?.length > 0 ? (
            <div className="space-y-3">
              {upcomingTests.map((test, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <div>
                    <div className="font-medium">{test.title}</div>
                    <div className="text-sm text-gray-600">{test.subject.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {new Date(test.testDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Max: {test.maxMarks}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming tests</p>
          )}
        </Card>
      </div>

      {/* Subject Statistics */}
      {subjectStats && subjectStats.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Subject Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectStats.map((stat, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">{typeof stat.subject === 'string' ? stat.subject : (stat.subject?.name || 'Unknown')}</h3>
                <div className="text-2xl font-bold text-blue-600">{stat.average}%</div>
                <div className="text-sm text-gray-600">{stat.totalTests} tests</div>
              </div>
            ))}
          </div>
        </Card>
       
      )}
      
    </div>
  );
};

export default Dashboard;
