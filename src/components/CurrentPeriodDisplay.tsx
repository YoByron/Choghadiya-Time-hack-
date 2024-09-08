import React from 'react';
import { motion } from 'framer-motion';
import { Period } from '../types';

interface CurrentPeriodDisplayProps {
  currentPeriod: Period | null;
  remainingTime: string;
}

const CurrentPeriodDisplay: React.FC<CurrentPeriodDisplayProps> = ({ currentPeriod, remainingTime }) => {
  if (!currentPeriod) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4"
    >
      <h3 className="text-lg font-semibold mb-2">Current Period</h3>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">{currentPeriod.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{currentPeriod.effect}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">{remainingTime}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">remaining</p>
        </div>
      </div>
      <motion.div
        className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${(currentPeriod.end.getTime() - Date.now()) / (currentPeriod.end.getTime() - currentPeriod.start.getTime()) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default CurrentPeriodDisplay;