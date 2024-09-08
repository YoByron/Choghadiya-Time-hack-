import React from 'react';
import { motion } from 'framer-motion';
import { Period } from '../types';
import { formatTime } from '../utils/timeUtils';

interface ChoghadiyaCircleProps {
  periods: Period[];
  currentPeriod: Period | null;
}

const ChoghadiyaCircle: React.FC<ChoghadiyaCircleProps> = ({ periods, currentPeriod }) => {
  const getColor = (effect: 'Good' | 'Bad' | 'Neutral') => {
    switch (effect) {
      case 'Good': return '#4CAF50';
      case 'Bad': return '#F44336';
      case 'Neutral': return '#9E9E9E';
    }
  };

  const renderClockFace = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map(hour => {
      const angle = (hour / 24) * 360 - 90;
      const x = 150 + 130 * Math.cos(angle * Math.PI / 180);
      const y = 150 + 130 * Math.sin(angle * Math.PI / 180);
      return (
        <text key={hour} x={x} y={y} textAnchor="middle" fontSize="12" fill="#333">
          {hour}
        </text>
      );
    });
  };

  const renderPeriodArc = (period: Period, index: number) => {
    const startTime = period.start.getHours() + period.start.getMinutes() / 60;
    const endTime = period.end.getHours() + period.end.getMinutes() / 60;
    const startAngle = (startTime / 24) * 360 - 90;
    const endAngle = (endTime / 24) * 360 - 90;
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    const startX = 150 + 100 * Math.cos(startAngle * Math.PI / 180);
    const startY = 150 + 100 * Math.sin(startAngle * Math.PI / 180);
    const endX = 150 + 100 * Math.cos(endAngle * Math.PI / 180);
    const endY = 150 + 100 * Math.sin(endAngle * Math.PI / 180);

    return (
      <motion.path
        key={`${period.name}-${period.start.toISOString()}`}
        d={`M 150 150 L ${startX} ${startY} A 100 100 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
        fill={getColor(period.effect)}
        stroke="#fff"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.05 }}
      />
    );
  };

  const renderCurrentTimeHand = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const angle = ((hours + minutes / 60) / 24) * 360 - 90;
    const handLength = 90;
    const endX = 150 + handLength * Math.cos(angle * Math.PI / 180);
    const endY = 150 + handLength * Math.sin(angle * Math.PI / 180);

    return (
      <motion.line
        x1="150"
        y1="150"
        x2={endX}
        y2={endY}
        stroke="#FFD700"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
    );
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      <h3 className="text-2xl font-bold mb-4">Choghadiya Clock</h3>
      <svg width="350" height="350" viewBox="0 0 300 300">
        <circle cx="150" cy="150" r="145" fill="#f0f0f0" />
        {renderClockFace()}
        {periods.map(renderPeriodArc)}
        {renderCurrentTimeHand()}
        <circle cx="150" cy="150" r="5" fill="#333" />
        {currentPeriod && (
          <text x="150" y="200" textAnchor="middle" fontSize="14" fill="#333" fontWeight="bold">
            {currentPeriod.name}
          </text>
        )}
      </svg>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {periods.map((period) => (
          <div key={`legend-${period.name}-${period.start.toISOString()}`} className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: getColor(period.effect) }}
            />
            <span className="text-sm">
              {period.name} ({formatTime(period.start)} - {formatTime(period.end)})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChoghadiyaCircle;