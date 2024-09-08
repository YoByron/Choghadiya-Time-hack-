import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ChoghadiyaName } from '../types';

interface NotificationSettingsProps {
  preferences: Record<ChoghadiyaName, boolean>;
  onToggle: (periodName: ChoghadiyaName) => void;
  reminderTime: number;
  setReminderTime: (time: number) => void;
  onSave: () => void;
  onClose: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  preferences,
  onToggle,
  reminderTime,
  setReminderTime,
  onSave,
  onClose,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Notification Preferences</h3>
      {Object.entries(preferences).map(([periodName, isEnabled]) => (
        <div key={periodName} className="flex items-center justify-between">
          <span>{periodName}</span>
          <Switch
            id={`switch-${periodName}`}
            checked={isEnabled}
            onCheckedChange={() => onToggle(periodName as ChoghadiyaName)}
          />
        </div>
      ))}
      <div className="space-y-2">
        <h4 className="text-md font-medium">Reminder Time</h4>
        <Slider
          value={[reminderTime]}
          onValueChange={(value) => setReminderTime(value[0])}
          min={1}
          max={60}
          step={1}
        />
        <p className="text-sm text-gray-500">
          Remind me {reminderTime} minutes before a period starts
        </p>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default NotificationSettings;