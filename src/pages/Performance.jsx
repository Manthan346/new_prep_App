import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { generateChartColors } from '../utils/helpers.js';

// Demo data to use instead of fetching from backend
const demoData = [
  { subject: { name: 'Mathematics' }, percentage: 85, passRate: 90, totalTests: 10, passedTests: 9 },
  { subject: { name: 'Physics' }, percentage: 78, passRate: 80, totalTests: 8, passedTests: 6 },
  { subject: { name: 'Chemistry' }, percentage: 92, passRate: 95, totalTests: 12, passedTests: 11 },
  { subject: { name: 'English' }, percentage: 88, passRate: 89, totalTests: 7, passedTests: 6 },
  { subject: { name: 'Computer Science' }, percentage: 95, passRate: 98, totalTests: 5, passedTests: 5 },
];

const PerformanceChart = ({ data, type = 'bar' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No performance data available
      </div>
    );
  }

  // Transform data for charts
  const chartData = data.map(item => ({
    name: item.subject?.name || item.subject?.code || 'Unknown',
    percentage: item.percentage || 0,
    passRate: item.passRate || 0,
    totalTests: item.totalTests || 0,
    passedTests: item.passedTests || 0
  }));

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
        <Bar dataKey="percentage" fill={colors[0]} radius={[4, 4, 0, 0]} />
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subjectPerformance, setSubjectPerformance] = useState(demoData);

  // Removed fetching, directly using demoData
  // You can remove useEffect entirely or keep for future fetching

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
          <section>
            <h2 className="text-xl font-semibold mb-2">Bar Chart</h2>
            <PerformanceChart data={subjectPerformance} type="bar" />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Line Chart</h2>
            <PerformanceChart data={subjectPerformance} type="line" />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Pie Chart</h2>
            <PerformanceChart data={subjectPerformance} type="pie" />
          </section>
        </div>
      )}
    </div>
  );
};

export default Performance;
