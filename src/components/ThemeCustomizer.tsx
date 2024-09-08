import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Paintbrush, Type, Layout, Save, Undo, Palette } from 'lucide-react';

interface ThemeCustomizerProps {
  customColors: Record<string, string>;
  setCustomColors: (colors: Record<string, string>) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
  setLayout: (layout: string) => void;
  setBorderRadius: (radius: number) => void;
  onClose: () => void;
}

const fontOptions = ['Sans-serif', 'Serif', 'Monospace', 'Cursive', 'Fantasy'];
const layoutOptions = ['Default', 'Compact', 'Expanded', 'Grid'];

const presetThemes = {
  Classic: {
    Good: '#4CAF50',
    Bad: '#F44336',
    Neutral: '#9E9E9E',
  },
  Green: {
    Good: '#2E7D32',
    Bad: '#C62828',
    Neutral: '#757575',
  },
  Red: {
    Good: '#D32F2F',
    Bad: '#1976D2',
    Neutral: '#616161',
  },
  Dark: {
    Good: '#81C784',
    Bad: '#E57373',
    Neutral: '#BDBDBD',
  },
  Galaxy: {
    Good: '#7E57C2',
    Bad: '#FF7043',
    Neutral: '#4DB6AC',
  },
};

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  customColors,
  setCustomColors,
  isDarkMode,
  toggleDarkMode,
  setFontSize: setGlobalFontSize,
  setFontFamily: setGlobalFontFamily,
  setLayout: setGlobalLayout,
  setBorderRadius: setGlobalBorderRadius,
  onClose,
}) => {
  const [colors, setColors] = useState(customColors);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Sans-serif');
  const [layout, setLayout] = useState('Default');
  const [borderRadius, setBorderRadius] = useState(4);

  const handleColorChange = (effect: string, color: string) => {
    setColors((prevColors) => ({ ...prevColors, [effect]: color }));
  };

  const handleSave = () => {
    setCustomColors(colors);
    setGlobalFontSize(fontSize);
    setGlobalFontFamily(fontFamily);
    setGlobalLayout(layout);
    setGlobalBorderRadius(borderRadius);
    onClose();
  };

  const handleReset = () => {
    setColors(presetThemes.Classic);
    setFontSize(16);
    setFontFamily('Sans-serif');
    setLayout('Default');
    toggleDarkMode(); // Changed from setDarkMode(false)
    setBorderRadius(4);
  };

  const handleDarkModeChange = useCallback(() => {
    toggleDarkMode(); // Changed from setDarkMode(checked)
  }, [toggleDarkMode]);

  const applyPresetTheme = (themeName: keyof typeof presetThemes) => {
    setColors(presetThemes[themeName]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Paintbrush className="w-6 h-6 mr-2 text-blue-500" />
        Theme Customizer
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Preset Themes
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(presetThemes).map((themeName) => (
              <Button
                key={themeName}
                onClick={() => applyPresetTheme(themeName as keyof typeof presetThemes)}
                variant="outline"
                className="w-full"
              >
                {themeName}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Custom Color Scheme</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(colors).map(([effect, color]) => (
              <div key={effect}>
                <Label htmlFor={`color-${effect}`}>{effect}</Label>
                <Input
                  id={`color-${effect}`}
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(effect, e.target.value)}
                  className="w-full h-10 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Type className="w-5 h-5 mr-2" />
            Typography
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
              <Slider
                id="font-size"
                min={12}
                max={24}
                step={1}
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
              />
            </div>
            <div>
              <Label htmlFor="font-family">Font Family</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger id="font-family">
                  <SelectValue placeholder="Select a font family" />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Layout className="w-5 h-5 mr-2" />
            Layout
          </h3>
          <Select value={layout} onValueChange={setLayout}>
            <SelectTrigger id="layout">
              <SelectValue placeholder="Select a layout" />
            </SelectTrigger>
            <SelectContent>
              {layoutOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">Dark Mode</Label>
          <Switch
            id="dark-mode"
            checked={isDarkMode}
            onCheckedChange={toggleDarkMode}
          />
        </div>

        <div>
          <Label htmlFor="border-radius">Border Radius: {borderRadius}px</Label>
          <Slider
            id="border-radius"
            min={0}
            max={20}
            step={1}
            value={[borderRadius]}
            onValueChange={(value) => setBorderRadius(value[0])}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <Button onClick={handleReset} variant="outline" className="flex items-center">
          <Undo className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleSave} className="flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </motion.div>
  );
};

export default ThemeCustomizer;