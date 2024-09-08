'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  customColors: Record<string, string>;
  setCustomColors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFamily: string;
  setFontFamily: (family: string) => void;
  layout: string;
  setLayout: (layout: string) => void;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customColors, setCustomColors] = useState({
    Good: '#4CAF50',
    Bad: '#F44336',
    Neutral: '#9E9E9E',
  });
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Sans-serif');
  const [layout, setLayout] = useState('Default');
  const [borderRadius, setBorderRadius] = useState(4);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const parsedTheme = JSON.parse(savedTheme);
      setIsDarkMode(parsedTheme.isDarkMode);
      setCustomColors(parsedTheme.customColors);
      setFontSize(parsedTheme.fontSize);
      setFontFamily(parsedTheme.fontFamily);
      setLayout(parsedTheme.layout);
      setBorderRadius(parsedTheme.borderRadius);
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    const theme = { isDarkMode, customColors, fontSize, fontFamily, layout, borderRadius };
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [isDarkMode, customColors, fontSize, fontFamily, layout, borderRadius]);

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      customColors,
      setCustomColors,
      fontSize,
      setFontSize,
      fontFamily,
      setFontFamily,
      layout,
      setLayout,
      borderRadius,
      setBorderRadius
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
