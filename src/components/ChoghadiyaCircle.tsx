import React from 'react';
import { motion } from 'framer-motion';

interface ChoghadiyaCircleProps {
  periods: any[];
  currentPeriod: any;
}

const ChoghadiyaCircle: React.FC<ChoghadiyaCircleProps> = ({ periods, currentPeriod }) => {
  const radius = 150;
  const center = { x: radius, y: radius };

  return (
    <svg width={radius * 2} height={radius * 2}>
      {periods.map((period, index) => {
        const angle = (index / periods.length) * 2 * Math.PI;
        const x = center.x + radius * Math.cos(angle);
        const y = center.y + radius * Math.sin(angle);

        return (
          <motion.g key={index}>
            <motion.line
              x1={center.x}
              y1={center.y}
              x2={x}
              y2={y}
              stroke={period.effect === 'Good' ? 'green' : 'red'}
              strokeWidth={2}
            />
            <motion.circle
              cx={x}
              cy={y}
              r={10}
              fill={period === currentPeriod ? 'yellow' : 'white'}
              stroke={period.effect === 'Good' ? 'green' : 'red'}
            />
            <motion.text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={8}
            >
              {period.name}
            </motion.text>
          </motion.g>
        );
      })}
    </svg>
  );
};

export default ChoghadiyaCircle;