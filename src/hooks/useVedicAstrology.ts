import { useState, useEffect } from 'react';

interface PlanetaryPosition {
  planet: string;
  sign: string;
  degree: number;
}

interface VedicAstrologyData {
  planetaryPositions: PlanetaryPosition[];
  nakshatra: string;
}

export const useVedicAstrology = (): VedicAstrologyData => {
  const [astroData, setAstroData] = useState<VedicAstrologyData>({
    planetaryPositions: [],
    nakshatra: '',
  });

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    // For now, we'll use mock data
    const mockData: VedicAstrologyData = {
      planetaryPositions: [
        { planet: 'Sun', sign: 'Aries', degree: 15 },
        { planet: 'Moon', sign: 'Taurus', degree: 22 },
        { planet: 'Mars', sign: 'Gemini', degree: 8 },
        { planet: 'Mercury', sign: 'Cancer', degree: 3 },
        { planet: 'Jupiter', sign: 'Leo', degree: 17 },
        { planet: 'Venus', sign: 'Virgo', degree: 29 },
        { planet: 'Saturn', sign: 'Libra', degree: 11 },
      ],
      nakshatra: 'Rohini',
    };

    setAstroData(mockData);
  }, []);

  return astroData;
};