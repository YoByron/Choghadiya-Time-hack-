import React from 'react';
import { motion } from 'framer-motion';
import { Period } from '../types';

interface ChoghadiyaCircleProps {
  periods: Period[];
  currentPeriod: Period | null;
  onPeriodClick: (period: Period) => void;
}

const ChoghadiyaCircle: React.FC<ChoghadiyaCircleProps> = ({ periods, currentPeriod, onPeriodClick }) => {
  const circleSize = 300;
  const centerX = circleSize / 2;
  const centerY = circleSize / 2;
  const radius = circleSize / 2 - 20;

  const dayPeriods = periods.filter(p => p.isDay);
  const nightPeriods = periods.filter(p => !p.isDay);

  return (
    <svg width={circleSize} height={circleSize} viewBox={`0 0 ${circleSize} ${circleSize}`}>
      {/* Day semicircle */}
      <path d={`M ${centerX} ${centerY} a ${radius} ${radius} 0 0 1 0 -${radius}`} fill="#FFD700" opacity="0.2" />
      {/* Night semicircle */}
      <path d={`M ${centerX} ${centerY} a ${radius} ${radius} 0 0 0 0 -${radius}`} fill="#191970" opacity="0.2" />

      {[...dayPeriods, ...nightPeriods].map((period, index) => {
        const angle = (index / periods.length) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        return (
          <motion.g 
            key={index} 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }}
            onClick={() => onPeriodClick(period)}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={x}
              cy={y}
              r={10}
              fill={period === currentPeriod ? '#4CAF50' : period.isDay ? '#FFA500' : '#4169E1'}
            />
            <text
              x={x}
              y={y + 20}
              textAnchor="middle"
              fill={period === currentPeriod ? '#4CAF50' : '#000'}
              fontSize="12"
            >
              {period.name}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
};

export default ChoghadiyaCircle;