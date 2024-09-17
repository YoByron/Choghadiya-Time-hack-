import React from 'react';
import { CustomColors } from '../contexts/ThemeContext';

interface ColorCustomizerProps {
  customColors: CustomColors;
  setCustomColors: React.Dispatch<React.SetStateAction<CustomColors>>;
}

const ColorCustomizer: React.FC<ColorCustomizerProps> = ({ customColors, setCustomColors }) => {
  const handleColorChange = (periodName: keyof CustomColors, color: string) => {
    setCustomColors(prevColors => ({
      ...prevColors,
      [periodName]: color
    }));
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {(Object.keys(customColors) as Array<keyof CustomColors>).map((periodName) => (
        <div key={periodName}>
          <label htmlFor={`color-${periodName}`}>{periodName}</label>
          <input
            type="color"
            id={`color-${periodName}`}
            value={customColors[periodName]}
            onChange={(e) => handleColorChange(periodName, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default ColorCustomizer;
