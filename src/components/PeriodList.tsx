import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Flame, Clock } from 'lucide-react';
import { formatTime } from '../utils/timeUtils';
import { Period } from '../types'; // Add this import

interface PeriodListProps {
  periods: Period[];
  isDay: boolean;
  handlePeriodClick: (period: Period) => void;
  getPeriodStyle: (period: Period) => string;
  sunriseOrSunset: Date;
}

const PeriodList: React.FC<PeriodListProps> = ({ periods, isDay, handlePeriodClick, getPeriodStyle, sunriseOrSunset }) => {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-4 flex items-center">
        {isDay ? <Sun className="mr-2 text-yellow-500" size={28} /> : <Moon className="mr-2 text-blue-400" size={28} />}
        {isDay ? 'Day' : 'Night'} Choghadiya
      </h3>
      <div className="text-sm mb-4 flex items-center">
        <Clock className="mr-2" size={16} />
        {isDay ? 'Sunrise' : 'Sunset'}: {formatTime(sunriseOrSunset)}
      </div>
      {periods.length > 0 ? (
        <div className="space-y-4">
          {periods.map((period, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handlePeriodClick(period)}
              className={`${getPeriodStyle(period)} hover:scale-105 transition-transform duration-200`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg flex items-center">
                  <Flame className="mr-2" size={20} />
                  {period.name}
                </span>
                <span className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  {formatTime(period.start)} - {formatTime(period.end)}
                </span>
              </div>
              <p className="text-sm opacity-80">{period.meaning}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No periods available for this time.</p>
      )}
    </section>
  );
};

export default PeriodList;