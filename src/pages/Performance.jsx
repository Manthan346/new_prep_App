import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, LabelList, Legend
} from 'recharts';
import { generateChartColors } from '../utils/helpers.js';
import { studentAPI, dashboardAPI } from '../services/api';

// No demo data; will fetch from backend

const PerformanceChart = ({ data, type = 'bar' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No performance data available
      </div>
    );
  }

  // Transform data for charts with robust subject name detection
  const chartData = data.map(item => {
    const subjectName =
      (item && typeof item.subject === 'object' && (item.subject?.name || item.subject?.code)) ||
      item?.subjectName ||
      item?.name ||
      (typeof item?.subject === 'string' ? item.subject : null) ||
      'Unknown';

    return {
      name: subjectName,
      percentage: item.percentage || 0,
      passRate: item.passRate || 0,
      totalTests: item.totalTests || 0,
      passedTests: item.passedTests || 0
    };
  });

  const colors = generateChartColors(chartData.length);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="percentage" name="Percentage" fill={colors[0]} radius={[4, 4, 0, 0]}>
          <LabelList dataKey="name" position="top" style={{ fontSize: 10, fill: '#374151' }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="percentage"
          stroke={colors[0]}
          strokeWidth={2}
          dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="percentage"
          label={({ name, percentage }) => `${name}: ${percentage}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );

  switch (type) {
    case 'line':
      return renderLineChart();
    case 'pie':
      return renderPieChart();
    case 'bar':
    default:
      return renderBarChart();
  }
};

const Performance = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subjectPerformance, setSubjectPerformance] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [overall, setOverall] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await studentAPI.getPerformance();
        const data = resp.data || {};
        // subjectPerformance is returned as array with subject, totals, percentage, passRate
        let subjPerf = data.subjectPerformance || data.subjectStats || [];
        // Build graph from overallResults if available
        const results = data.overallResults || [];
        let perTest = results.slice().reverse().map(r => ({
          testName: r?.test?.title || 'Test',
          percentage: (() => {
            const max = r?.test?.maxMarks || 0;
            const pct = max > 0 ? (r.marksObtained / max) * 100 : (r.percentage || 0);
            return parseFloat(Number(pct).toFixed(1));
          })(),
          marksObtained: r.marksObtained,
          maxMarks: r?.test?.maxMarks || 0,
        }));
        // Fallback to dashboard API if empty
        if ((!subjPerf || subjPerf.length === 0) || (!perTest || perTest.length === 0)) {
          try {
            const dash = await dashboardAPI.getStudentDashboard();
            const d = dash.data?.data || {};
            if ((!subjPerf || subjPerf.length === 0) && d.subjectStats) {
              subjPerf = d.subjectStats;
            }
            if ((!perTest || perTest.length === 0) && Array.isArray(d.graphData)) {
              perTest = d.graphData;
            }
          } catch {}
        }
        setSubjectPerformance(subjPerf || []);
        setGraphData(perTest || []);
        setOverall(data.performance || null);
      } catch (e) {
        setError('Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <h1 className="text-3xl font-bold text-center mb-6">Performance Charts</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-lg">Loading performance data...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-6 bg-red-50 rounded-lg">{error}</div>
      ) : (
        <div className="space-y-8">
          {subjectPerformance && subjectPerformance.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Subject Performance Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectPerformance.map((stat, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="font-medium mb-1">{stat.subject?.name || stat.subject || 'Unknown'}</div>
                    <div className="text-2xl font-bold text-blue-600">{Number(stat.percentage || 0).toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">{stat.totalTests || 0} tests • Pass rate {Number(stat.passRate || 0).toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </section>
          )}
          <section>
            <h2 className="text-xl font-semibold mb-2">Subject-wise Performance (Bar)</h2>
            <PerformanceChart data={subjectPerformance} type="bar" />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Subject-wise Performance (Line)</h2>
            <PerformanceChart data={subjectPerformance} type="line" />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Subject-wise Distribution (Pie)</h2>
            <PerformanceChart data={subjectPerformance} type="pie" />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Per-Test Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="testName" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </section>
        </div>
      )}
    </div>
  );
};

export default Performance;
