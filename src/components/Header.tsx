import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Calendar as CalendarIcon, MoreVertical, Bell, Sun, Moon, Settings, Users, Clock, Palette, Search, MapPin } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import LocationPicker from './LocationPicker';

interface HeaderProps {
  openFeature: (feature: string) => void;
  handleDateChange: (date: Date | null) => void;
  currentDate: Date;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  openNotificationSettings: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setLocation: (lat: number, lon: number) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  openFeature, 
  handleDateChange, 
  currentDate, 
  toggleDarkMode, 
  isDarkMode, 
  openNotificationSettings,
  searchTerm,
  setSearchTerm,
  setLocation
}) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  const CustomInput = React.forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Calendar"
        className="text-white hover:bg-white/20"
        onClick={onClick}
        ref={ref}
      >
        <CalendarIcon className="h-6 w-6" />
      </Button>
    )
  );

  CustomInput.displayName = 'CustomInput';

  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-t-lg shadow-md">
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Menu" className="text-white hover:bg-white/20">
              <Menu className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
            <DropdownMenuItem onClick={() => openFeature('Theme Customizer')} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Palette className="mr-2 h-4 w-4" />
              <span>Theme Customizer</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openFeature('Voice Commands')} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Settings className="mr-2 h-4 w-4" />
              <span>Voice Commands</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openFeature('Gamification')} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Users className="mr-2 h-4 w-4" />
              <span>Gamification</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openFeature('Alert Customizer')} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Bell className="mr-2 h-4 w-4" />
              <span>Alert Customizer</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2 border-t border-gray-200 dark:border-gray-600" />
            <DropdownMenuItem onClick={() => openFeature('Task Planner')} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Clock className="mr-2 h-4 w-4" />
              <span>Task Planner</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openFeature('Meditation Timer')} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Clock className="mr-2 h-4 w-4" />
              <span>Meditation Timer</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <h1 className="text-2xl sm:text-3xl font-bold ml-2">Choghadiya</h1>
      </div>
      <div className="flex items-center space-x-2">
        {isSearchVisible ? (
          <div className="relative">
            <Input
              type="text"
              placeholder="Search periods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-2 py-1 rounded-full bg-white/20 text-white placeholder-white/70 focus:bg-white/30"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
          </div>
        ) : (
          <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setIsSearchVisible(true)} className="text-white hover:bg-white/20">
            <Search className="h-6 w-6" />
          </Button>
        )}
        <div className="relative">
          <DatePicker
            selected={currentDate}
            onChange={(date) => {
              handleDateChange(date);
              setIsCalendarOpen(false);
            }}
            customInput={<CustomInput />}
            onCalendarOpen={() => setIsCalendarOpen(true)}
            onCalendarClose={() => setIsCalendarOpen(false)}
            popperModifiers={[
              {
                name: 'offset',
                options: {
                  offset: [0, 4],
                },
              },
              {
                name: 'preventOverflow',
                options: {
                  boundary: 'viewport',
                  padding: 8,
                },
              },
            ]}
            popperPlacement="bottom-end"
            calendarClassName="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
            dayClassName={() => "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full"}
            monthClassName={() => "text-lg font-bold text-gray-800 dark:text-gray-200"}
            weekDayClassName={() => "text-gray-500 dark:text-gray-400"}
            fixedHeight
          />
        </div>
        <Button onClick={toggleDarkMode} variant="ghost" size="icon" aria-label="Toggle dark mode" className="text-white hover:bg-white/20">
          {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>
        <Button onClick={openNotificationSettings} variant="ghost" size="icon" aria-label="Notification Settings" className="text-white hover:bg-white/20">
          <Bell className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Location" 
          onClick={() => setIsLocationPickerOpen(true)} 
          className="text-white hover:bg-white/20"
        >
          <MapPin className="h-6 w-6" />
        </Button>
      </div>
      {isLocationPickerOpen && (
        <LocationPicker 
          onClose={() => setIsLocationPickerOpen(false)}
          setLocation={setLocation}
        />
      )}
    </div>
  );
};

export default Header;