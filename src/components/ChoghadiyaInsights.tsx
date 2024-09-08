import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';
import { Period, Activity } from '../types';

interface ChoghadiyaInsightsProps {
  periods: Period[];
  completedActivities: Activity[];
}

const ChoghadiyaInsights: React.FC<ChoghadiyaInsightsProps> = ({ periods, completedActivities }) => {
  const data = {
    labels: periods.map(p => p.name),
    datasets: [{
      label: 'Activities Completed',
      data: periods.map(p => 
        completedActivities.filter(a => a.suitablePeriods.includes(p.name)).length
      ),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Choghadiya Insights</h3>
      </CardHeader>
      <CardContent>
        <Bar data={data} options={{ responsive: true }} />
      </CardContent>
    </Card>
  );
};

export default ChoghadiyaInsights;