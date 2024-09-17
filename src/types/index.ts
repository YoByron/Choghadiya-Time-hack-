export type ChoghadiyaPeriod = 'Udveg' | 'Char' | 'Labh' | 'Amrit' | 'Kaal' | 'Shubh' | 'Rog';

export interface Period {
  name: ChoghadiyaPeriod;
  meaning: string;
  start: Date;
  end: Date;
  effect: 'Good' | 'Bad' | 'Neutral';
  works: string;
  isDay: boolean;
  color?: string;
}

// ... (other type definitions)