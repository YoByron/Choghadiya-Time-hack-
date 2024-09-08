import React from 'react';
import { motion } from 'framer-motion';
import { Sandglass } from './Sandglass';
import { formatTime, formatRemainingTime } from '../utils/timeUtils';
import { Period } from '../types'; // Import the Period type

interface CurrentPeriodDisplayProps {
  currentPeriod: Period | null;
  remainingTime: number;
}

const CurrentPeriodDisplay: React.FC<CurrentPeriodDisplayProps> = ({ currentPeriod, remainingTime }) => {
  if (!currentPeriod) return null;

  const gradientClass = 
    currentPeriod.effect === 'Good' ? 'from-green-400 to-blue-500' :
    currentPeriod.effect === 'Bad' ? 'from-red-400 to-pink-500' :
    'from-yellow-400 to-orange-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-6 p-6 bg-gradient-to-r ${gradientClass} rounded-lg text-white shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-bold mb-2">{currentPeriod.name}</h3>
          <p className="text-xl opacity-80">{formatTime(currentPeriod.start)} - {formatTime(currentPeriod.end)}</p>
        </div>
        <Sandglass size={80} color="white" />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-2xl font-semibold">{currentPeriod.effect}</p>
          <p className="text-lg opacity-80">{currentPeriod.meaning}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            <Sandglass size={24} color="white" />
            <span className="ml-2 text-2xl font-bold">{formatRemainingTime(remainingTime)}</span>
          </div>
          <p className="text-sm opacity-80 mt-1">remaining</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentPeriodDisplay;