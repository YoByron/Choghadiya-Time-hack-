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

export interface Activity {
  name: string;
  suitablePeriods: ChoghadiyaName[];
}

export interface VedicAstrologyData {
  moonSign: string;
  ascendant: string;
  planetaryPositions: Record<string, string>;
}