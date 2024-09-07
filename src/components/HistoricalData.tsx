import React from 'react';
import { useHistoricalData } from '../hooks/useHistoricalData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HistoricalData: React.FC = () => {
  const { data } = useHistoricalData();

  if (!data || data.length === 0) {
    return <div>Loading historical data...</div>;
  }

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Historical Data</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="goodPeriods" fill="#8884d8" name="Good Periods" />
          <Bar dataKey="badPeriods" fill="#82ca9d" name="Bad Periods" />
          <Bar dataKey="neutralPeriods" fill="#ffc658" name="Neutral Periods" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalData;