import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Period } from '../types';

interface HistoricalDataProps {
  periods: Period[];
}

interface DataPoint {
  date: string;
  good: number;
  bad: number;
  neutral: number;
}

const HistoricalData: React.FC<HistoricalDataProps> = ({ periods }) => {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    // This is a mock implementation. In a real scenario, you'd fetch this data from an API or database.
    const mockHistoricalData: DataPoint[] = [
      { date: '2023-05-01', good: 10, bad: 5, neutral: 9 },
      { date: '2023-05-02', good: 8, bad: 7, neutral: 9 },
      { date: '2023-05-03', good: 12, bad: 3, neutral: 9 },
      { date: '2023-05-04', good: 9, bad: 6, neutral: 9 },
      { date: '2023-05-05', good: 11, bad: 4, neutral: 9 },
    ];
    setData(mockHistoricalData);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-6">
      <h3 className="text-lg font-semibold mb-4">Historical Data</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="good" stroke="#4CAF50" />
          <Line type="monotone" dataKey="bad" stroke="#F44336" />
          <Line type="monotone" dataKey="neutral" stroke="#2196F3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalData;