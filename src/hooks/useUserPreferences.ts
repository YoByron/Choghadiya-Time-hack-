import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  name: string;
  category: string;
}

interface Preferences {
  favoriteActivity: string;
  // Add other preference fields as needed
}

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<Preferences>({ favoriteActivity: '' });
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Load preferences from localStorage or API
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }

    // Load activities from API or static data
    // This is a placeholder. Replace with actual data fetching logic
    setActivities([
      { id: '1', name: 'Meditation', category: 'Wellness' },
      { id: '2', name: 'Work', category: 'Productivity' },
      { id: '3', name: 'Exercise', category: 'Health' },
      // Add more activities as needed
    ]);
  }, []);

  const updatePreference = (key: keyof Preferences, value: string) => {
    setPreferences(prev => {
      const newPreferences = { ...prev, [key]: value };
      localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
      return newPreferences;
    });
  };

  const addActivity = (activity: Activity) => {
    setActivities(prev => [...prev, activity]);
  };

  return { preferences, updatePreference, activities, addActivity };
};