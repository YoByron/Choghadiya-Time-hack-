export type ChoghadiyaName = 'Udveg' | 'Char' | 'Labh' | 'Amrit' | 'Kaal' | 'Shubh' | 'Rog';

export interface Period {
  name: ChoghadiyaName;
  meaning: string;
  effect: 'Good' | 'Bad' | 'Neutral';
  works: string;
  start: Date;
  end: Date;
  isDay: boolean;
}