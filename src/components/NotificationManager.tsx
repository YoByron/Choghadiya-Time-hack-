import React, { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Period } from '../types';

interface NotificationManagerProps {
  currentPeriod: Period | null;
  nextPeriod: Period | null;
  preferences: Record<string, boolean>;
  reminderTime: number;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({
  currentPeriod,
  nextPeriod,
  preferences,
  reminderTime,
}) => {
  useEffect(() => {
    if (currentPeriod && preferences[currentPeriod.name]) {
      toast({
        title: 'Period Started',
        description: `The ${currentPeriod.name} period has started.`,
      });
    }
  }, [currentPeriod, preferences]);

  useEffect(() => {
    if (nextPeriod && preferences[nextPeriod.name]) {
      const timeUntilNext = nextPeriod.start.getTime() - Date.now();
      const reminderTimeMs = reminderTime * 60 * 1000;

      if (timeUntilNext <= reminderTimeMs) {
        const timer = setTimeout(() => {
          toast({
            title: 'Upcoming Period',
            description: `The ${nextPeriod.name} period will start in ${reminderTime} minutes.`,
          });
        }, timeUntilNext - reminderTimeMs);

        return () => clearTimeout(timer);
      }
    }
  }, [nextPeriod, preferences, reminderTime]);

  return null; // This component doesn't render anything
};

export default NotificationManager;
