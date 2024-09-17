"use client";

import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Menu, Calendar, Sun, Moon, Bell, Settings, Flame, Search, Filter, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import ChoghadiyaDetailModal from './ChoghadiyaDetailModal';
import NotificationSettings from './NotificationSettings';
import ThemeCustomizer from './ThemeCustomizer';
import SunCalc from 'suncalc';
import { exportToCalendar } from '../utils/calendarExport';
import ChoghadiyaCircle from './ChoghadiyaCircle';
import { useTheme } from '../contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays, subDays, isSameDay, startOfDay } from 'date-fns';
import { Sandglass } from './Sandglass';
import Header from './Header';
import CurrentPeriodDisplay from './CurrentPeriodDisplay';
import WeekdayButtons from './WeekdayButtons';
import { formatTime, formatRemainingTime } from '../utils/timeUtils';
import PeriodList from './PeriodList';
import WeeklyChart from './WeeklyChart';
import { calculateChoghadiyaPeriods, useChoghadiyaLogic } from '../utils/choghadiyaUtils';
import { Period } from '../types';
import '../styles/calendar.css';
import HistoricalData from './HistoricalData';
import NotificationManager from './NotificationManager';
import PersonalizedRecommendations from './PersonalizedRecommendations';
import VedicAstrologyInsights from './VedicAstrologyInsights';
import TaskPlanner from './TaskPlanner';
import CommunityForum from './CommunityForum';
import { CustomColors } from '../contexts/ThemeContext';

//const TaskPlanner = lazy(() => import('./TaskPlanner'));
const ReminderSystem = lazy(() => import('./ReminderSystem'));
const AlertCustomizer = lazy(() => import('./AlertCustomizer'));
const VoiceCommands = lazy(() => import('./VoiceCommands'));
const Gamification = lazy(() => import('./Gamification'));
const MeditationTimer = lazy(() => import('./MeditationTimer'));

type DayOfWeek = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
type ChoghadiyaName = 'Udveg' | 'Char' | 'Labh' | 'Amrit' | 'Kaal' | 'Shubh' | 'Rog';

const DAY_CHOGHADIYA: Record<DayOfWeek, ChoghadiyaName[]> = {
  Sun: ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'],
  Mon: ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit'],
  Tue: ['Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'],
  Wed: ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh'],
  Thu: ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'],
  Fri: ['Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char'],
  Sat: ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal']
};

const NIGHT_CHOGHADIYA: Record<DayOfWeek, ChoghadiyaName[]> = {
  Sun: ['Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh'],
  Mon: ['Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char'],
  Tue: ['Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal'],
  Wed: ['Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg'],
  Thu: ['Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit'],
  Fri: ['Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog'],
  Sat: ['Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh']
};

const CHOGHADIYA_MEANINGS: Record<ChoghadiyaName, { meaning: string; effect: 'Good' | 'Bad' | 'Neutral'; works: string }> = {
  Udveg: { meaning: 'Anxiety', effect: 'Bad', works: 'Government related work' },
  Amrit: { meaning: 'Nectar', effect: 'Good', works: 'All type of works' },
  Rog: { meaning: 'Illness', effect: 'Bad', works: 'Attack, War, Fights, Debate' },
  Labh: { meaning: 'Profit', effect: 'Good', works: 'Start Business, Education, etc.' },
  Shubh: { meaning: 'Auspicious', effect: 'Good', works: 'Marriage, Religious activities' },
  Char: { meaning: 'Moving', effect: 'Good', works: 'Travel' },
  Kaal: { meaning: 'Death', effect: 'Bad', works: 'Wealth building activities' }
};

const ChoghadiyaApp = () => {
  const { isDarkMode, toggleDarkMode, customColors, setCustomColors, fontSize, setFontSize, fontFamily, setFontFamily } = useTheme();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { toast } = useToast();
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [reminderTime, setReminderTime] = useState(15); // Default to 15 minutes
  const [userPreferences, setUserPreferences] = useState<string[]>([]);

  const {
    sunrise,
    setSunrise,
    sunset,
    setSunset,
    currentPeriod,
    setCurrentPeriod,
    remainingTime,
    setRemainingTime,
    notificationPreferences,
    setNotificationPreferences,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    selectedPeriod,
    setSelectedPeriod,
    isModalOpen,
    setIsModalOpen,
    periods,
  } = useChoghadiyaLogic(currentDate);

  const filteredPeriods = useMemo(() => {
    return periods.filter(period => 
      period.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === 'all' || period.effect === filter)
    );
  }, [periods, searchTerm, filter]);

  const weeklyData = useMemo(() => {
    // Generate weekly data for chart
    // This is a placeholder implementation
    return [
      { name: 'Mon', good: 4, bad: 2, neutral: 2 },
      { name: 'Tue', good: 3, bad: 3, neutral: 2 },
      { name: 'Wed', good: 5, bad: 1, neutral: 2 },
      { name: 'Thu', good: 4, bad: 2, neutral: 2 },
      { name: 'Fri', good: 3, bad: 3, neutral: 2 },
      { name: 'Sat', good: 2, bad: 4, neutral: 2 },
      { name: 'Sun', good: 4, bad: 2, neutral: 2 },
    ];
  }, []);

  const handleTaskCompletion = (taskName: string) => {
    toast({
      title: "Task Completed",
      description: `You've completed the task: ${taskName}`,
    });
  };

  const openFeature = (feature: string) => {
    setActiveFeature(feature);
  };

  const closeFeature = () => {
    setActiveFeature(null);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setCurrentDate(date);
      // Recalculate sunrise and sunset times for the new date
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          const times = SunCalc.getTimes(date, latitude, longitude);
          setSunrise(times.sunrise);
          setSunset(times.sunset);
        });
      } else {
        // Fallback to default times if geolocation is not available
        setSunrise(new Date(date.setHours(6, 5, 0, 0)));
        setSunset(new Date(date.setHours(18, 39, 0, 0)));
      }
    }
  };

  const elapsedTime = useMemo(() => {
    if (!currentPeriod) return '00:00:00';
    const now = new Date();
    const diff = now.getTime() - currentPeriod.start.getTime();
    const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }, [currentPeriod]);

  // Apply the theme styles
  const themeStyle = {
    fontSize: `${fontSize}px`,
    fontFamily: fontFamily,
  } as React.CSSProperties;

  const handleWeekdayClick = (dayIndex: number) => {
    const today = startOfDay(new Date());
    const clickedDate = startOfDay(new Date(currentDate));
    clickedDate.setDate(clickedDate.getDate() - clickedDate.getDay() + dayIndex);
    setCurrentDate(clickedDate);
  };

  const handlePeriodClick = (period: Period) => {
    setSelectedPeriod(period);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPeriod(null);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => direction === 'next' ? addDays(prevDate, 1) : subDays(prevDate, 1));
  };

  const getPeriodStyle = (period: Period) => {
    const baseStyle = "flex flex-col justify-between p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:scale-105";
    const effect = period.effect;
    const colorStyle = customColors[effect] || 
      (effect === 'Good' ? 'bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:hover:bg-green-800' : 
       effect === 'Bad' ? 'bg-red-50 hover:bg-red-100 dark:bg-red-900 dark:hover:bg-red-800' : 
       'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700');
    return `${baseStyle} ${colorStyle}`;
  };

  const handleShareChoghadiya = async () => {
    const shareData = {
      title: 'Choghadiya Periods',
      text: 'Check out today\'s Choghadiya periods!',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Choghadiya shared successfully');
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      alert(`Share this link: ${window.location.href}`);
    }
  };

  const toggleNotification = (periodName: ChoghadiyaName) => {
    setNotificationPreferences(prevPrefs => ({
      ...prevPrefs,
      [periodName]: !prevPrefs[periodName]
    }));
  };

  console.log('Rendering CurrentPeriodDisplay:', { currentPeriod, remainingTime });

  console.log('Filtered Periods:', filteredPeriods);

  useEffect(() => {
    if (location) {
      const { lat, lon } = location;
      const times = SunCalc.getTimes(currentDate, lat, lon);
      setSunrise(times.sunrise);
      setSunset(times.sunset);
    }
  }, [location, currentDate]);

  const handleSetLocation = (lat: number, lon: number) => {
    setLocation({ lat, lon });
  };

  const handleSaveNotificationSettings = () => {
    // Save notification settings to local storage or backend
    localStorage.setItem('notificationPreferences', JSON.stringify(notificationPreferences));
    localStorage.setItem('reminderTime', reminderTime.toString());
    closeFeature();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextPeriod = periods.find(p => p.start > now);
      if (nextPeriod && (nextPeriod.start.getTime() - now.getTime()) <= 60000) { // 1 minute before next period
        toast({
          title: "Period Changing Soon",
          description: `${nextPeriod.name} period will start in 1 minute.`,
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(timer);
  }, [periods]);

  useEffect(() => {
    console.log('Current Date:', currentDate);
    console.log('Current Period:', currentPeriod);
    console.log('Periods:', periods);
  }, [currentDate, currentPeriod, periods]);

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-gray-100 dark:bg-gray-900 font-sans transition-colors duration-300`} style={themeStyle}>
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto shadow-xl rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
          <Header
            openFeature={openFeature}
            handleDateChange={handleDateChange}
            currentDate={currentDate}
            toggleDarkMode={toggleDarkMode}
            isDarkMode={isDarkMode}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setLocation={handleSetLocation}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Features</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={() => openFeature('Theme Customizer')}>
                    Theme Customizer
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => openFeature('Gamification')}>
                    Gamification
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => openFeature('Alert Customizer')}>
                    Alert Customizer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => openFeature('Task Planner')}>
                    Task Planner
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => openFeature('Meditation Timer')}>
                    Meditation Timer
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => openFeature('Vedic Astrology Insights')}>
                    Vedic Astrology Insights
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => openFeature('Reminder System')}>
                    Reminder System
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => openFeature('Personalized Recommendations')}>
                    Personalized Recommendations
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => openFeature('Community Forum')}>
                    Community Forum
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={() => openFeature('Help')}>
                    Help
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => openFeature('About')}>
                    About Choghadiya
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </Header>
          <CardContent className="p-6 bg-gray-50 dark:bg-gray-800">
            {showOnboarding && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4 p-4 bg-blue-100 rounded-lg"
              >
                <h2 className="text-lg font-bold mb-2">Welcome to Choghadiya App!</h2>
                <p>This app helps you plan your activities based on auspicious time periods.</p>
                <Button onClick={() => setShowOnboarding(false)} className="mt-2">Got it!</Button>
              </motion.div>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPeriod?.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <CurrentPeriodDisplay currentPeriod={currentPeriod} remainingTime={formatRemainingTime(remainingTime)} />
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-between mb-4">
              <Button onClick={() => navigateDate('prev')} variant="ghost" size="icon">
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <h2 className="text-xl font-serif font-bold">
                {format(currentDate, 'EEE, MMMM d, yyyy')}
              </h2>
              <Button onClick={() => navigateDate('next')} variant="ghost" size="icon">
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            <WeekdayButtons currentDate={currentDate} handleWeekdayClick={handleWeekdayClick} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Sun className="h-6 w-6 mr-2 text-yellow-500" />
                  Day Choghadiya
                </h3>
                <PeriodList
                  periods={filteredPeriods.filter(p => p.isDay)}
                  isDay={true}
                  handlePeriodClick={handlePeriodClick}
                  getPeriodStyle={getPeriodStyle}
                  sunriseOrSunset={sunrise}
                />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Moon className="h-6 w-6 mr-2 text-blue-500" />
                  Night Choghadiya
                </h3>
                <PeriodList
                  periods={filteredPeriods.filter(p => !p.isDay)}
                  isDay={false}
                  handlePeriodClick={handlePeriodClick}
                  getPeriodStyle={getPeriodStyle}
                  sunriseOrSunset={sunset}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <Button onClick={() => exportToCalendar(periods)} className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200">
                Export to Calendar
              </Button>
              <Button onClick={handleShareChoghadiya} className="bg-green-500 hover:bg-green-600 text-white transition-colors duration-200">
                Share
              </Button>
            </div>
            <WeeklyChart data={weeklyData} />
            <HistoricalData periods={periods} />
            <VedicAstrologyInsights currentPeriod={currentPeriod} currentDate={currentDate} />
          </CardContent>
        </Card>
      </div>
      <ChoghadiyaCircle periods={periods} currentPeriod={currentPeriod} onPeriodClick={handlePeriodClick} />
      <NotificationManager
        currentPeriod={currentPeriod}
        nextPeriod={periods[periods.findIndex(p => p === currentPeriod) + 1] || null}
        preferences={notificationPreferences}
        reminderTime={reminderTime}
      />
      <AnimatePresence>
        {activeFeature && (
          <Dialog open={!!activeFeature} onOpenChange={() => setActiveFeature(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{activeFeature}</DialogTitle>
              </DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  {activeFeature === 'Theme Customizer' && (
                    <ThemeCustomizer 
                      customColors={customColors}
                      setCustomColors={setCustomColors}
                      isDarkMode={isDarkMode}
                      toggleDarkMode={toggleDarkMode}
                      setFontSize={setFontSize}
                      setFontFamily={setFontFamily}
                      onClose={() => setActiveFeature(null)}
                    />
                  )}
                  {activeFeature === 'Gamification' && (
                    <Gamification onClose={() => setActiveFeature(null)} />
                  )}
                  {activeFeature === 'Alert Customizer' && (
                    <AlertCustomizer onClose={() => setActiveFeature(null)} />
                  )}
                  {activeFeature === 'Task Planner' && (
                    <TaskPlanner
                      periods={periods}
                      onClose={() => setActiveFeature(null)}
                      onTaskComplete={handleTaskCompletion}
                    />
                  )}
                  {activeFeature === 'Meditation Timer' && (
                    <MeditationTimer onClose={() => setActiveFeature(null)} />
                  )}
                  {activeFeature === 'Vedic Astrology Insights' && (
                    <VedicAstrologyInsights currentPeriod={currentPeriod} currentDate={currentDate} />
                  )}
                  {activeFeature === 'Reminder System' && (
                    <ReminderSystem />
                  )}
                  {activeFeature === 'Personalized Recommendations' && (
                    <PersonalizedRecommendations
                      currentPeriod={currentPeriod}
                      currentDate={currentDate}
                      userPreferences={userPreferences}
                    />
                  )}
                  {activeFeature === 'Community Forum' && (
                    <CommunityForum />
                  )}
                  {activeFeature === 'Help' && (
                    <div>
                      <h2>Help</h2>
                      <p>This is the help section for the Choghadiya App.</p>
                      {/* Add more help content here */}
                    </div>
                  )}
                  {activeFeature === 'About' && (
                    <div>
                      <h2>About Choghadiya</h2>
                      <p>Choghadiya is an ancient Vedic time division system used for determining auspicious times for various activities.</p>
                      {/* Add more information about Choghadiya here */}
                    </div>
                  )}
                </Suspense>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
      {selectedPeriod && (
        <ChoghadiyaDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          period={selectedPeriod}
        />
      )}
    </div>
  );
};

export default ChoghadiyaApp;