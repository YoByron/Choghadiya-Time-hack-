import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface Reminder {
  id: string;
  text: string;
  time: Date;
}

const ReminderSystem: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState({ text: '', time: new Date() });
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      reminders.forEach(reminder => {
        if (reminder.time <= now) {
          toast({
            title: "Reminder",
            description: reminder.text,
          });
          setReminders(prev => prev.filter(r => r.id !== reminder.id));
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [reminders, toast]);

  const addReminder = () => {
    if (newReminder.text && newReminder.time) {
      setReminders([...reminders, { ...newReminder, id: Date.now().toString() }]);
      setNewReminder({ text: '', time: new Date() });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Reminder System</h2>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          value={newReminder.text}
          onChange={(e) => setNewReminder({ ...newReminder, text: e.target.value })}
          placeholder="Reminder text"
        />
        <Input
          type="datetime-local"
          value={newReminder.time.toISOString().slice(0, 16)}
          onChange={(e) => setNewReminder({ ...newReminder, time: new Date(e.target.value) })}
        />
        <Button onClick={addReminder}>Add Reminder</Button>
      </div>
      <ul>
        {reminders.map(reminder => (
          <li key={reminder.id} className="mb-2">
            {reminder.text} - {reminder.time.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReminderSystem;