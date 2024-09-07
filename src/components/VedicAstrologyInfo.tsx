import React from 'react';
import { useVedicAstrology } from '../hooks/useVedicAstrology';

const VedicAstrologyInfo: React.FC = () => {
  const { planetaryPositions, nakshatra } = useVedicAstrology();

  return (
    <div>
      <h2>Vedic Astrology Information</h2>
      <h3>Current Nakshatra: {nakshatra}</h3>
      <h3>Planetary Positions:</h3>
      <ul>
        {planetaryPositions.map((position, index) => (
          <li key={index}>
            {position.planet}: {position.sign} {position.degree}°
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VedicAstrologyInfo;