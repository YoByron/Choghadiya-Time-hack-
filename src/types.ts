export type ChoghadiyaName = 'Udveg' | 'Char' | 'Labh' | 'Amrit' | 'Kaal' | 'Shubh' | 'Rog';

export interface Period {
  name: ChoghadiyaName;
  start: Date;
  end: Date;
  isDay: boolean;
  effect: 'Good' | 'Bad' | 'Neutral';
  meaning: string;
  works: string;
}