import React from 'react';
import { useVedicAstrology } from '../hooks/useVedicAstrology';

interface VedicAstrologyInsightsProps {
  currentPeriod: {
    name: string;
    effect: string;
    works: string;
  } | null;
  currentDate: Date;
}

const VedicAstrologyInsights: React.FC<VedicAstrologyInsightsProps> = ({ currentPeriod, currentDate }) => {
  const { planetaryPositions, nakshatras, yogas } = useVedicAstrology(currentDate);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Vedic Astrology Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Current Choghadiya Period</h3>
          {currentPeriod ? (
            <>
              <p>{currentPeriod.name} - {currentPeriod.effect}</p>
              <p>Recommended activities: {currentPeriod.works}</p>
            </>
          ) : (
            <p>No current period information available</p>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Planetary Positions</h3>
          <ul>
            {planetaryPositions.map((planet, index) => (
              <li key={index}>{planet.name}: {planet.sign}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Nakshatras</h3>
          <p>Current Nakshatra: {nakshatras.current}</p>
          <p>Moon Nakshatra: {nakshatras.moon}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Yogas</h3>
          <ul>
            {yogas.map((yoga, index) => (
              <li key={index}>{yoga}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VedicAstrologyInsights;