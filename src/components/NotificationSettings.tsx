import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Import these types from a shared types file or ChoghadiyaApp.tsx
import { Period, ChoghadiyaName } from '../types';

interface NotificationSettingsProps {
  periods: Period[];
  preferences: Record<ChoghadiyaName, boolean>;
  onToggle: (periodName: ChoghadiyaName) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  periods,
  preferences,
  onToggle,
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Notification Settings</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {periods.map((period) => (
            <div key={period.name} className="flex items-center justify-between">
              <label htmlFor={`notify-${period.name}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Notify for {period.name}
              </label>
              <Switch
                id={`notify-${period.name}`}
                checked={preferences[period.name] || false}
                onCheckedChange={() => onToggle(period.name)}
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSettings;