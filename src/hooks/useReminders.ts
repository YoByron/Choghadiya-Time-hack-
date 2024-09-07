import { useState, useEffect } from 'react';

interface Reminder {
  id: string;
  activity: string;
  period: string;
  recurring: boolean;
}

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    // Load reminders from local storage when the component mounts
    const savedReminders = localStorage.getItem('choghadiyaReminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder = { ...reminder, id: Date.now().toString() };
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    localStorage.setItem('choghadiyaReminders', JSON.stringify(updatedReminders));
  };

  const removeReminder = (id: string) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);
    localStorage.setItem('choghadiyaReminders', JSON.stringify(updatedReminders));
  };

  return { reminders, addReminder, removeReminder };
};