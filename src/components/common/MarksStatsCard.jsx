import React from 'react';
import { TrendingUp } from 'lucide-react';

const MarksStatsCard = ({ marksStats }) => {
  if (!marksStats) return null;

  const { marksEntriesCount, averageMarks, maxMarks, minMarks } = marksStats;

  return (
    <div className="grid grid-cols-1 gap-4 text-sm text-gray-700">
  <div className="text-center p-4 bg-red-50 rounded">
    <div className="text-xl font-bold">{marksEntriesCount}</div>
    <div>Total Entries</div>
  </div>
  <div className="text-center p-4 bg-red-50 rounded">
    <div className="text-xl font-bold">{averageMarks.toFixed(1)}</div>
    <div>Average Marks</div>
  </div>
  <div className="text-center p-4 bg-red-50 rounded">
    <div className="text-xl font-bold">{maxMarks}</div>
    <div>Highest Marks</div>
  </div>
  <div className="text-center p-4 bg-red-50 rounded">
    <div className="text-xl font-bold">{minMarks}</div>
    <div>Lowest Marks</div>
  </div>
</div>

  );
};

export default MarksStatsCard;
