import { useState, useEffect } from 'react';

interface HistoricalDataPoint {
  date: string;
  goodPeriods: number;
  badPeriods: number;
  neutralPeriods: number;
}

export const useHistoricalData = () => {
  const [data, setData] = useState<HistoricalDataPoint[]>([]);

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    // For now, we'll use mock data
    const mockData: HistoricalDataPoint[] = [
      { date: '2023-05-01', goodPeriods: 4, badPeriods: 2, neutralPeriods: 2 },
      { date: '2023-05-02', goodPeriods: 3, badPeriods: 3, neutralPeriods: 2 },
      { date: '2023-05-03', goodPeriods: 5, badPeriods: 1, neutralPeriods: 2 },
      { date: '2023-05-04', goodPeriods: 2, badPeriods: 4, neutralPeriods: 2 },
      { date: '2023-05-05', goodPeriods: 3, badPeriods: 2, neutralPeriods: 3 },
    ];

    setData(mockData);
  }, []);

  return { data };
};