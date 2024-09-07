import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';


interface ThemeCustomizerProps {
  customColors: Record<string, string>;
  setCustomColors: (colors: Record<string, string>) => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ customColors, setCustomColors }) => {
  const handleColorChange = (effect: string, color: string) => {
    setCustomColors({ ...customColors, [effect]: color });
  };

  return (
    <Card className="mt-4">
      <CardHeader>Theme Customization</CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <label className="w-24">Good periods:</label>
            <input 
              type="color" 
              value={customColors.Good || '#e6ffea'} 
              onChange={(e) => handleColorChange('Good', e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center">
            <label className="w-24">Bad periods:</label>
            <input 
              type="color" 
              value={customColors.Bad || '#ffe6e6'} 
              onChange={(e) => handleColorChange('Bad', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeCustomizer;