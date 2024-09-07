"use client";

import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Menu, Calendar, Sun, Moon, Bell, Settings, Flame, Search, Filter } from 'lucide-react';
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
} from "@/components/ui/dropdown-menu";

// Lazy-loaded components
const TaskPlanner = lazy(() => import('./TaskPlanner'));
const PersonalizedRecommendations = lazy(() => import('./PersonalizedRecommendations'));
const ReminderSystem = lazy(() => import('./ReminderSystem'));
const CommunityForum = lazy(() => import('./CommunityForum'));
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

const calculateChoghadiyaPeriods = (sunrise: Date, sunset: Date, currentDate: Date) => {
  const periods = [];
  const dayDuration = (sunset.getTime() - sunrise.getTime()) / 8;
  const nightDuration = (24 * 60 * 60 * 1000 - (sunset.getTime() - sunrise.getTime())) / 8;
  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][currentDate.getDay()] as DayOfWeek;
  
  // Day periods
  for (let i = 0; i < 8; i++) {
    const start = new Date(sunrise.getTime() + i * dayDuration);
    const end = new Date(start.getTime() + dayDuration);
    const name = DAY_CHOGHADIYA[dayOfWeek][i];
    periods.push({
      name,
      ...CHOGHADIYA_MEANINGS[name],
      start,
      end,
      isDay: true
    });
  }
  
  // Night periods
  for (let i = 0; i < 8; i++) {
    const start = new Date(sunset.getTime() + i * nightDuration);
    const end = new Date(start.getTime() + nightDuration);
    const name = NIGHT_CHOGHADIYA[dayOfWeek][i];
    periods.push({
      name,
      ...CHOGHADIYA_MEANINGS[name],
      start,
      end,
      isDay: false
    });
  }
  
  return periods;
};

interface Period {
  name: ChoghadiyaName;
  meaning: string;
  effect: 'Good' | 'Bad' | 'Neutral';
  works: string;
  start: Date;
  end: Date;
  isDay: boolean;
}

const ChoghadiyaApp = () => {
  const { isDarkMode, toggleDarkMode, customColors, setCustomColors } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sunrise, setSunrise] = useState(new Date(currentDate.setHours(6, 5, 0, 0)));
  const [sunset, setSunset] = useState(new Date(currentDate.setHours(18, 39, 0, 0)));
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState<Record<ChoghadiyaName, boolean>>({} as Record<ChoghadiyaName, boolean>);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [showAlertCustomizer, setShowAlertCustomizer] = useState(false);
  const [showTaskPlanner, setShowTaskPlanner] = useState(false);
  const [showMeditationTimer, setShowMeditationTimer] = useState(false);
  const [showPersonalizedRecommendations, setShowPersonalizedRecommendations] = useState(false);
  const [showReminderSystem, setShowReminderSystem] = useState(false);
  const [showCommunityForum, setShowCommunityForum] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { toast } = useToast();

  const periods = useMemo(() => calculateChoghadiyaPeriods(sunrise, sunset, currentDate), [sunrise, sunset, currentDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentPeriod = periods.find(period => now >= period.start && now < period.end) || null;
      setCurrentPeriod(currentPeriod);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [periods]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const times = SunCalc.getTimes(new Date(), latitude, longitude);
        setSunrise(times.sunrise);
        setSunset(times.sunset);
      });
    }
  }, [currentDate]);

  useEffect(() => {
    const checkNotifications = setInterval(() => {
      const now = new Date();
      periods.forEach(period => {
        if (notificationPreferences[period.name] && 
            now >= new Date(period.start.getTime() - 5 * 60000) && 
            now < period.start) {
          new Notification(`${period.name} Choghadiya period starting soon!`, {
            body: `From ${formatTime(period.start)} to ${formatTime(period.end)}`,
            icon: '/path/to/icon.png' // Add an appropriate icon
          });
        }
      });
    }, 60000);

    return () => clearInterval(checkNotifications);
  }, [periods, notificationPreferences]);

  const navigateDate = (direction: 'prev' | 'next') => {
    setIsLoading(true);
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
    // Simulate API call for sunrise/sunset times
    setTimeout(() => {
      setSunrise(new Date(newDate.setHours(6, 5, 0, 0)));
      setSunset(new Date(newDate.setHours(18, 39, 0, 0)));
      setIsLoading(false);
    }, 500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleNotification = (periodName: ChoghadiyaName) => {
    setNotificationPreferences(prevPrefs => ({
      ...prevPrefs,
      [periodName]: !prevPrefs[periodName]
    }));
  };

  const getPeriodStyle = (period: Period) => {
    const baseStyle = "flex flex-col justify-between p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer";
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
      // Fallback for browsers that don't support the Web Share API
      alert(`Share this link: ${window.location.href}`);
    }
  };

  const handlePeriodClick = (period: Period) => {
    setSelectedPeriod(period);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPeriod(null);
  };

  const toggleVoiceCommands = () => setShowVoiceCommands(!showVoiceCommands);
  const toggleGamification = () => setShowGamification(!showGamification);
  const toggleAlertCustomizer = () => setShowAlertCustomizer(!showAlertCustomizer);
  const toggleTaskPlanner = () => setShowTaskPlanner(!showTaskPlanner);
  const toggleMeditationTimer = () => setShowMeditationTimer(!showMeditationTimer);
  const togglePersonalizedRecommendations = () => setShowPersonalizedRecommendations(!showPersonalizedRecommendations);
  const toggleReminderSystem = () => setShowReminderSystem(!showReminderSystem);
  const toggleCommunityForum = () => setShowCommunityForum(!showCommunityForum);

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

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-gray-100 dark:bg-gray-900 font-sans transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-xl">
          <CardHeader className="flex justify-between items-center bg-green-800 text-white p-4">
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Features</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowNotificationSettings(true)}>
                    Notification Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowThemeCustomizer(true)}>
                    Theme Customizer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleVoiceCommands}>
                    Voice Commands
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleGamification}>
                    Gamification
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleAlertCustomizer}>
                    Alert Customizer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTaskPlanner}>
                    Task Planner
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleMeditationTimer}>
                    Meditation Timer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={togglePersonalizedRecommendations}>
                    Personalized Recommendations
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleReminderSystem}>
                    Reminder System
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleCommunityForum}>
                    Community Forum
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <h1 className="text-2xl sm:text-3xl font-bold ml-2">Choghadiya</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" aria-label="Calendar">
                <Calendar className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Toggle dark mode" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
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
            <div className="mb-4 flex items-center">
              <Input
                type="text"
                placeholder="Search periods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mr-2"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="all">All</option>
                <option value="Good">Good</option>
                <option value="Bad">Bad</option>
                <option value="Neutral">Neutral</option>
              </select>
            </div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h2>
              {currentPeriod && (
                <p className="text-lg sm:text-xl">
                  Current Period: <span className="font-semibold">{currentPeriod.name}</span> ({formatTime(currentPeriod.start)} - {formatTime(currentPeriod.end)})
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section aria-labelledby="day-choghadiya-heading">
                <h3 id="day-choghadiya-heading" className="text-xl sm:text-2xl font-bold mb-4 flex items-center">
                  <Sun className="mr-2" size={24} />
                  Day Choghadiya
                </h3>
                <div className="space-y-4">
                  {filteredPeriods.filter(p => p.isDay).map((period, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() => handlePeriodClick(period)}
                      className={getPeriodStyle(period)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg flex items-center">
                          <Flame className="mr-2" size={16} />
                          {period.name}
                        </span>
                        <span className="text-sm">{formatTime(period.start)} - {formatTime(period.end)}</span>
                      </div>
                      <p className="text-sm">{period.meaning}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
              <section aria-labelledby="night-choghadiya-heading">
                <h3 id="night-choghadiya-heading" className="text-xl sm:text-2xl font-bold mb-4 flex items-center">
                  <Moon className="mr-2" size={24} />
                  Night Choghadiya
                </h3>
                <div className="space-y-4">
                  {filteredPeriods.filter(p => !p.isDay).map((period, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() => handlePeriodClick(period)}
                      className={getPeriodStyle(period)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg flex items-center">
                          <Flame className="mr-2" size={16} />
                          {period.name}
                        </span>
                        <span className="text-sm">{formatTime(period.start)} - {formatTime(period.end)}</span>
                      </div>
                      <p className="text-sm">{period.meaning}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <Button onClick={() => exportToCalendar(periods)} className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200">
                Export to Calendar
              </Button>
              <Button onClick={handleShareChoghadiya} className="bg-green-500 hover:bg-green-600 text-white transition-colors duration-200">
                Share
              </Button>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Weekly Choghadiya Pattern</h3>
              <LineChart width={600} height={300} data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="good" stroke="#8884d8" />
                <Line type="monotone" dataKey="bad" stroke="#82ca9d" />
                <Line type="monotone" dataKey="neutral" stroke="#ffc658" />
              </LineChart>
            </div>
          </CardContent>
        </Card>
      </div>
      <ChoghadiyaCircle periods={periods} currentPeriod={currentPeriod} />
      <AnimatePresence>
        {showNotificationSettings && (
          <NotificationSettings 
            periods={periods}
            preferences={notificationPreferences}
            onToggle={toggleNotification}
            isOpen={showNotificationSettings}
            onClose={() => setShowNotificationSettings(false)}
          />
        )}
        {showThemeCustomizer && (
          <ThemeCustomizer 
            customColors={customColors}
            setCustomColors={setCustomColors}
          />
        )}
        {showVoiceCommands && (
          <Suspense fallback={<div>Loading...</div>}>
            <VoiceCommands onClose={toggleVoiceCommands} />
          </Suspense>
        )}
        {showGamification && (
          <Suspense fallback={<div>Loading...</div>}>
            <Gamification onClose={toggleGamification} />
          </Suspense>
        )}
        {showAlertCustomizer && (
          <Suspense fallback={<div>Loading...</div>}>
            <AlertCustomizer onClose={toggleAlertCustomizer} />
          </Suspense>
        )}
        {showTaskPlanner && (
          <Suspense fallback={<div>Loading...</div>}>
            <TaskPlanner periods={periods} onClose={toggleTaskPlanner} onTaskComplete={handleTaskCompletion} />
          </Suspense>
        )}
        {showMeditationTimer && (
          <Suspense fallback={<div>Loading...</div>}>
            <MeditationTimer onClose={toggleMeditationTimer} />
          </Suspense>
        )}
        {showPersonalizedRecommendations && (
          <Suspense fallback={<div>Loading...</div>}>
            <PersonalizedRecommendations onClose={togglePersonalizedRecommendations} />
          </Suspense>
        )}
        {showReminderSystem && (
          <Suspense fallback={<div>Loading...</div>}>
            <ReminderSystem onClose={toggleReminderSystem} />
          </Suspense>
        )}
        {showCommunityForum && (
          <Suspense fallback={<div>Loading...</div>}>
            <CommunityForum onClose={toggleCommunityForum} />
          </Suspense>
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