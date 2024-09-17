'use client';
import React, { useState, useCallback } from 'react';
import { Sun, Moon, Calendar, BarChart2, Clock, BookOpen, Settings, Menu } from 'lucide-react';
import MeditationTimer from './MeditationTimer';
import HistoricalData from './HistoricalData';
import { useTheme } from '../contexts/ThemeContext';
import { useChoghadiya } from '../hooks/useChoghadiya';
import WeekView from './WeekView';


type ViewType = 'daily' | 'weekly' | 'meditation' | 'historical' | 'settings';

const ChoghadiyaApp = () => {
  const { isDarkMode, toggleDarkMode } = useTheme(); // Changed this line
  const { currentDate } = useChoghadiya();
  const [activeView, setActiveView] = useState<ViewType>('daily');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleViewChange = useCallback((view: ViewType) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  }, []);

  const navItems = [
    { view: 'daily', icon: Calendar, label: 'Daily' },
    { view: 'weekly', icon: BarChart2, label: 'Weekly' },
    { view: 'meditation', icon: Clock, label: 'Meditation' },
    { view: 'historical', icon: BookOpen, label: 'Historical' },
    { view: 'settings', icon: Settings, label: 'Settings' },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'weekly':
        return <WeekView />;
      case 'meditation':
        return <MeditationTimer onClose={() => setActiveView('daily')} />;
      case 'historical':
        return <HistoricalData periods={[]} />; // You need to provide the correct periods data here
      case 'settings':
        return <div>Settings View</div>;
      case 'daily':
      default:
        return <div>Daily View</div>;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mr-4 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Choghadiya</h1>
          </div>
          <nav className="hidden lg:flex space-x-2">
            {navItems.map(({ view, icon: Icon, label }) => (
              <NavButton
                key={view}
                view={view as ViewType}
                icon={Icon}
                label={label}
                activeView={activeView}
                onClick={handleViewChange}
              />
            ))}
          </nav>
          <button
            onClick={toggleDarkMode} // Changed this line
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-800 shadow-lg">
          {navItems.map(({ view, icon: Icon, label }) => (
            <NavButton
              key={view}
              view={view as ViewType}
              icon={Icon}
              label={label}
              activeView={activeView}
              onClick={handleViewChange}
              isMobile
            />
          ))}
        </div>
      )}

      <main className="container mx-auto mt-8 px-4">
        {renderView()}
      </main>
    </div>
  );
};

interface NavButtonProps {
  view: ViewType;
  icon: React.ElementType;
  label: string;
  activeView: ViewType;
  onClick: (view: ViewType) => void;
  isMobile?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ view, icon: Icon, label, activeView, onClick, isMobile }) => (
  <button
    onClick={() => onClick(view)}
    className={`
      ${isMobile ? 'w-full justify-start' : 'rounded-lg'}
      ${activeView === view ? 'bg-white text-indigo-600' : 'hover:bg-white hover:bg-opacity-20'}
      p-2 flex items-center transition-colors duration-200
    `}
  >
    <Icon className={`w-5 h-5 ${isMobile ? 'mr-3' : 'mr-1'}`} />
    <span className={isMobile ? '' : 'hidden sm:inline'}>{label}</span>
  </button>
);

export default ChoghadiyaApp;