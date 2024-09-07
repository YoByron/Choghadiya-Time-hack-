import { useState, useEffect, useMemo } from 'react';
import { calculateChoghadiyaPeriods, Period, DayOfWeek, ChoghadiyaPeriod, CHOGHADIYA_MEANINGS, DAY_CHOGHADIYA } from '../utils/choghadiyaCalculations';

export const useChoghadiya = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sunrise, setSunrise] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 6, 5, 0, 0));
  const [sunset, setSunset] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 18, 39, 0, 0));
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null);

  const periods = useMemo(() => calculateChoghadiyaPeriods(sunrise, sunset, currentDate), [sunrise, sunset, currentDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentPeriod = periods.find(period => now >= period.start && now < period.end) || null;
      setCurrentPeriod(currentPeriod);
    }, 1000);
  
    return () => clearInterval(timer);
  }, [periods]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
    // Simulate API call for sunrise/sunset times
    setTimeout(() => {
      setSunrise(new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 6, 5, 0, 0));
      setSunset(new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 18, 39, 0, 0));
    }, 500);
  };

  const getDominantChoghadiya = async (date: Date) => {
    // This is a placeholder implementation. Replace with actual logic to get the dominant Choghadiya.
    return {
      day: { name: 'Labh' },
      night: { name: 'Shubh' }
    };
  };

  return {
    currentDate,
    sunrise,
    sunset,
    currentPeriod,
    periods,
    navigateDate,
    getDominantChoghadiya,
    setCurrentDate
  };
};
