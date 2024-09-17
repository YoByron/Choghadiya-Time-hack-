export type DayOfWeek = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
export type ChoghadiyaPeriod = 'Udveg' | 'Char' | 'Labh' | 'Amrit' | 'Kaal' | 'Shubh' | 'Rog';

export type Period = {
  name: ChoghadiyaPeriod;
  meaning: string;
  effect: 'Good' | 'Bad' | 'Neutral';
  works: string;
  start: Date;
  end: Date;
  isDay: boolean;
  color?: string;
};

export const DAY_CHOGHADIYA: { [key in DayOfWeek]: ChoghadiyaPeriod[] } = {
  Sun: ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'],
  Mon: ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh'],
  Tue: ['Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'],
  Wed: ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char'],
  Thu: ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal'],
  Fri: ['Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'],
  Sat: ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit']
};

export const NIGHT_CHOGHADIYA: { [key in DayOfWeek]: ChoghadiyaPeriod[] } = {
  Sun: ['Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal'],
  Mon: ['Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg'],
  Tue: ['Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit'],
  Wed: ['Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog'],
  Thu: ['Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char'],
  Fri: ['Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh'],
  Sat: ['Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh']
};

export const CHOGHADIYA_MEANINGS: Record<ChoghadiyaPeriod, { meaning: string; effect: 'Good' | 'Bad'; works: string }> = {
  Udveg: { meaning: 'Anxiety', effect: 'Bad', works: 'Avoid important tasks' },
  Char: { meaning: 'Movement', effect: 'Good', works: 'Travel, communication' },
  Labh: { meaning: 'Profit', effect: 'Good', works: 'Financial activities' },
  Amrit: { meaning: 'Nectar', effect: 'Good', works: 'Auspicious activities' },
  Kaal: { meaning: 'Death', effect: 'Bad', works: 'Avoid major decisions' },
  Shubh: { meaning: 'Auspicious', effect: 'Good', works: 'Start new projects' },
  Rog: { meaning: 'Disease', effect: 'Bad', works: 'Rest and recuperation' }
};

export function calculateChoghadiyaPeriods(
  date: Date,
  sunrise: Date,
  sunset: Date
): Period[] {
  const dayOfWeek = getDayOfWeek(date);
  const dayChoghadiya = DAY_CHOGHADIYA[dayOfWeek];
  const nightChoghadiya = NIGHT_CHOGHADIYA[dayOfWeek];

  const periods: Period[] = [];

  // Calculate day periods
  const dayDuration = (sunset.getTime() - sunrise.getTime()) / 8;
  for (let i = 0; i < 8; i++) {
    const start = new Date(sunrise.getTime() + i * dayDuration);
    const end = new Date(start.getTime() + dayDuration);
    const name = dayChoghadiya[i];
    periods.push({
      name,
      meaning: CHOGHADIYA_MEANINGS[name].meaning,
      start,
      end,
      isDay: true,
      effect: getEffectForChoghadiya(name),
      works: getWorksForChoghadiya(name)
    });
  }

  // Calculate night periods
  const nightDuration = (
    sunrise.getTime() +
    24 * 60 * 60 * 1000 -
    sunset.getTime()
  ) / 8;
  for (let i = 0; i < 8; i++) {
    const start = new Date(sunset.getTime() + i * nightDuration);
    const end = new Date(start.getTime() + nightDuration);
    const name = nightChoghadiya[i];
    periods.push({
      name,
      meaning: CHOGHADIYA_MEANINGS[name].meaning,
      start,
      end,
      isDay: false,
      effect: getEffectForChoghadiya(name),
      works: getWorksForChoghadiya(name)
    });
  }

  return periods;
}

function getEffectForChoghadiya(choghadiya: ChoghadiyaPeriod): 'Good' | 'Bad' | 'Neutral' {
  return CHOGHADIYA_MEANINGS[choghadiya].effect;
}

function getWorksForChoghadiya(choghadiya: ChoghadiyaPeriod): string {
  return CHOGHADIYA_MEANINGS[choghadiya].works;
}

const getDayChoghadiya = (dayOfWeek: number): string[] => {
  const dayChoghadiya = [
    ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'],
    ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit'],
    ['Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'],
    ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh'],
    ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'],
    ['Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char'],
    ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal']
  ];
  return dayChoghadiya[dayOfWeek];
};

const getNightChoghadiya = (dayOfWeek: number): string[] => {
  const nightChoghadiya = [
    ['Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh'],
    ['Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char'],
    ['Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal'],
    ['Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg'],
    ['Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit'],
    ['Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog'],
    ['Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh']
  ];
  return nightChoghadiya[dayOfWeek];
};

function getDayOfWeek(date: Date): DayOfWeek {
  const days: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
}
