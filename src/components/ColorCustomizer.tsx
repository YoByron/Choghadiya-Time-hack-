import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const CHOGHADIYA_PERIODS = ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'];

const ColorCustomizer: React.FC = () => {
  const { customColors, setCustomColors } = useTheme();

  const handleColorChange = (periodName: string, color: string) => {
    setCustomColors(prev => ({ ...prev, [periodName]: color }));
  };

  return (
    <div className="color-customizer">
      {CHOGHADIYA_PERIODS.map((periodName) => (
        <div key={periodName} className="color-picker">
          <label htmlFor={`color-${periodName}`}>{periodName}</label>
          <input
            type="color"
            id={`color-${periodName}`}
            value={customColors[periodName] || '#ffffff'}
            onChange={(e) => handleColorChange(periodName, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default ColorCustomizer;
