import { useState, useEffect } from 'react';
import { Activity } from '../types';

interface Preference {
 favoriteActivity: string;
}

// Remove the local Activity interface

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<Preferences>({ favoriteActivity: '' });
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Fetch user preferences and activities from an API or local storage
    // For now, we'll use dummy data
    setPreferences({ favoriteActivity: 'Reading' });
    setActivities([
      { name: 'Reading', suitablePeriods: ['Shubh', 'Labh'] },
      { name: 'Exercise', suitablePeriods: ['Char', 'Amrit'] },
    ]);
  }, []);

  return { userPreferences: { preferences, activities } };
};