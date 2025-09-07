// src/components/common/PerformanceCard.jsx
import React from 'react';

const PerformanceCard = ({ title, value, icon, color = 'bg-blue-600' }) => (
  <div className={`flex items-center p-4 rounded-lg text-white ${color}`}>
    <div className="mr-4">
      {icon}
    </div>
    <div>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </div>
);

export default PerformanceCard;
