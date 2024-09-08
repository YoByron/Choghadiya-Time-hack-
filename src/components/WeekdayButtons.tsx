import React from 'react';
import { Button } from '@/components/ui/button';
import { isSameDay, startOfDay } from 'date-fns';

interface WeekdayButtonsProps {
  currentDate: Date;
  handleWeekdayClick: (dayIndex: number) => void;
}

const WeekdayButtons: React.FC<WeekdayButtonsProps> = ({ currentDate, handleWeekdayClick }) => {
  const isToday = (date: Date) => isSameDay(date, new Date());

  return (
    <div className="flex justify-between bg-green-600 text-white p-2 mb-4">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
        <Button
          key={day}
          variant="ghost"
          className={`text-sm ${isToday(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + index)) ? 'font-bold bg-green-700' : ''} ${index === currentDate.getDay() ? 'underline' : ''}`}
          onClick={() => handleWeekdayClick(index)}
        >
          {day}
        </Button>
      ))}
    </div>
  );
};

export default WeekdayButtons;