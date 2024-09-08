import { useState, useEffect, useMemo } from 'react';
import SunCalc from 'suncalc';
import { Period, ChoghadiyaName } from '../types';

const DAY_CHOGHADIYA: Record<string, ChoghadiyaName[]> = {
  Sun: ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'],
  Mon: ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit'],
  Tue: ['Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'],
  Wed: ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh'],
  Thu: ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'],
  Fri: ['Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char'],
  Sat: ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal']
};

const NIGHT_CHOGHADIYA: Record<string, ChoghadiyaName[]> = {
  Sun: ['Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh'],
  Mon: ['Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char'],
  Tue: ['Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal'],
  Wed: ['Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg'],
  Thu: ['Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit'],
  Fri: ['Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog'],
  Sat: ['Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh']
};

const CHOGHADIYA_MEANINGS: Record<ChoghadiyaName, { meaning: string; effect: 'Good' | 'Bad' | 'Neutral'; works: string }> = {
  Udveg: { meaning: 'Anxiety', effect: 'Bad', works: 'Government related work' },
  Amrit: { meaning: 'Nectar', effect: 'Good', works: 'All type of works' },
  Rog: { meaning: 'Illness', effect: 'Bad', works: 'Attack, War, Fights, Debate' },
  Labh: { meaning: 'Profit', effect: 'Good', works: 'Start Business, Education, etc.' },
  Shubh: { meaning: 'Auspicious', effect: 'Good', works: 'Marriage, Religious activities' },
  Char: { meaning: 'Moving', effect: 'Good', works: 'Travel' },
  Kaal: { meaning: 'Death', effect: 'Bad', works: 'Wealth building activities' }
};

export const calculateChoghadiyaPeriods = (sunrise: Date, sunset: Date, currentDate: Date): Period[] => {
  const periods: Period[] = [];
  const dayDuration = (sunset.getTime() - sunrise.getTime()) / 8;
  const nightDuration = (24 * 60 * 60 * 1000 - (sunset.getTime() - sunrise.getTime())) / 8;
  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][currentDate.getDay()];
  const dayChoghadiya = DAY_CHOGHADIYA[dayOfWeek];
  const nightChoghadiya = NIGHT_CHOGHADIYA[dayOfWeek];

  // Day periods
  for (let i = 0; i < 8; i++) {
    const start = new Date(sunrise.getTime() + i * dayDuration);
    const end = new Date(start.getTime() + dayDuration);
    periods.push({
      name: dayChoghadiya[i],
      start,
      end,
      isDay: true,
      effect: CHOGHADIYA_MEANINGS[dayChoghadiya[i]].effect,
      meaning: CHOGHADIYA_MEANINGS[dayChoghadiya[i]].meaning,
      works: CHOGHADIYA_MEANINGS[dayChoghadiya[i]].works
    });
  }

  // Night periods
  for (let i = 0; i < 8; i++) {
    const start = new Date(sunset.getTime() + i * nightDuration);
    const end = new Date(start.getTime() + nightDuration);
    periods.push({
      name: nightChoghadiya[i],
      start,
      end,
      isDay: false,
      effect: CHOGHADIYA_MEANINGS[nightChoghadiya[i]].effect,
      meaning: CHOGHADIYA_MEANINGS[nightChoghadiya[i]].meaning,
      works: CHOGHADIYA_MEANINGS[nightChoghadiya[i]].works
    });
  }

  return periods;
};

export const useChoghadiyaLogic = (currentDate: Date) => {
  const [sunrise, setSunrise] = useState(new Date(currentDate.setHours(6, 5, 0, 0)));
  const [sunset, setSunset] = useState(new Date(currentDate.setHours(18, 39, 0, 0)));
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [notificationPreferences, setNotificationPreferences] = useState<Record<ChoghadiyaName, boolean>>({} as Record<ChoghadiyaName, boolean>);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const periods = useMemo(() => calculateChoghadiyaPeriods(sunrise, sunset, currentDate), [sunrise, sunset, currentDate]);

  useEffect(() => {
    // Update sunrise and sunset times based on the current date
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const times = SunCalc.getTimes(currentDate, latitude, longitude);
        setSunrise(times.sunrise);
        setSunset(times.sunset);
      });
    }
  }, [currentDate]);

  return {
    sunrise,
    setSunrise,
    sunset,
    setSunset,
    currentPeriod,
    setCurrentPeriod,
    remainingTime,
    setRemainingTime,
    notificationPreferences,
    setNotificationPreferences,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    selectedPeriod,
    setSelectedPeriod,
    isModalOpen,
    setIsModalOpen,
    periods,
  };
};