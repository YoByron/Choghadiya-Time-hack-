import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface WeeklyChartProps {
  data: any[];
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Weekly Choghadiya Pattern</h3>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="good" stroke="#8884d8" />
        <Line type="monotone" dataKey="bad" stroke="#82ca9d" />
        <Line type="monotone" dataKey="neutral" stroke="#ffc658" />
      </LineChart>
    </div>
  );
};

export default WeeklyChart;