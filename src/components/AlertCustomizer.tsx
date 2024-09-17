import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Volume2, Clock, Palette, Vibrate, Music } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AlertCustomizerProps {
  onClose: () => void;
}

const AlertCustomizer: React.FC<AlertCustomizerProps> = ({ onClose }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [volume, setVolume] = useState(70);
  const [alertTone, setAlertTone] = useState('default');
  const [alertColor, setAlertColor] = useState('#3B82F6');
  const [advanceNoticeTime, setAdvanceNoticeTime] = useState(5);
  const [customMessage, setCustomMessage] = useState('');
  const [repeatInterval, setRepeatInterval] = useState(0);
  const { toast } = useToast();

  const alertTones = [
    { value: 'default', label: 'Default' },
    { value: 'chime', label: 'Chime' },
    { value: 'bell', label: 'Bell' },
    { value: 'digital', label: 'Digital' },
    { value: 'cosmic', label: 'Cosmic' },
  ];

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedPreferences = localStorage.getItem('alertPreferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      setSoundEnabled(preferences.soundEnabled);
      setVibrationEnabled(preferences.vibrationEnabled);
      setVolume(preferences.volume);
      setAlertTone(preferences.alertTone);
      setAlertColor(preferences.alertColor);
      setAdvanceNoticeTime(preferences.advanceNoticeTime);
      setCustomMessage(preferences.customMessage);
      setRepeatInterval(preferences.repeatInterval);
    }
  }, []);

  const savePreferences = () => {
    const preferences = {
      soundEnabled,
      vibrationEnabled,
      volume,
      alertTone,
      alertColor,
      advanceNoticeTime,
      customMessage,
      repeatInterval,
    };
    localStorage.setItem('alertPreferences', JSON.stringify(preferences));
    toast({
      title: "Alert preferences saved",
      description: "Your custom alert settings have been saved successfully.",
    });
    onClose();
  };

  const testAlert = () => {
    // Play the selected alert tone
    const audio = new Audio(`/alert-tones/${alertTone}.mp3`);
    audio.volume = volume / 100;
    audio.play();

    // Vibrate if enabled
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(200);
    }

    // Show a toast with the custom style
    toast({
      title: "Test Alert",
      description: customMessage || "This is a test alert with your current settings.",
      style: { backgroundColor: alertColor, color: '#ffffff' },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Bell className="w-6 h-6 mr-2 text-blue-500" />
        Alert Customizer
      </h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="sound-enabled" className="flex items-center">
            <Volume2 className="w-5 h-5 mr-2" />
            Sound Enabled
          </Label>
          <Switch
            id="sound-enabled"
            checked={soundEnabled}
            onCheckedChange={(checked: boolean) => setSoundEnabled(checked) as any}
          />
        </div>

        {soundEnabled && (
          <>
            <div>
              <Label htmlFor="volume">Volume: {volume}%</Label>
              <Slider
                id="volume"
                min={0}
                max={100}
                step={1}
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
              />
            </div>

            <div>
              <Label htmlFor="alert-tone">Alert Tone</Label>
              <Select value={alertTone} onValueChange={setAlertTone}>
                <SelectTrigger id="alert-tone">
                  <SelectValue placeholder="Select an alert tone" />
                </SelectTrigger>
                <SelectContent>
                  {alertTones.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="flex items-center justify-between">
          <Label htmlFor="vibration-enabled" className="flex items-center">
            <Vibrate className="w-5 h-5 mr-2" />
            Vibration Enabled
          </Label>
          <Switch
            id="vibration-enabled"
            checked={vibrationEnabled}
            onCheckedChange={(checked) => setVibrationEnabled(checked)}
          />
        </div>

        <div>
          <Label htmlFor="alert-color" className="flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Alert Color
          </Label>
          <Input
            id="alert-color"
            type="color"
            value={alertColor}
            onChange={(e) => setAlertColor(e.target.value)}
            className="w-full h-10 cursor-pointer"
          />
        </div>

        <div>
          <Label htmlFor="advance-notice" className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Advance Notice: {advanceNoticeTime} minutes
          </Label>
          <Slider
            id="advance-notice"
            min={0}
            max={30}
            step={1}
            value={[advanceNoticeTime]}
            onValueChange={(value) => setAdvanceNoticeTime(value[0])}
          />
        </div>

        <div>
          <Label htmlFor="custom-message" className="flex items-center">
            <Music className="w-5 h-5 mr-2" />
            Custom Alert Message
          </Label>
          <Input
            id="custom-message"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Enter a custom alert message"
          />
        </div>

        <div>
          <Label htmlFor="repeat-interval">Repeat Interval (minutes, 0 for no repeat)</Label>
          <Input
            id="repeat-interval"
            type="number"
            min={0}
            value={repeatInterval}
            onChange={(e) => setRepeatInterval(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <Button onClick={testAlert} variant="outline" className="flex items-center">
          <Bell className="w-4 h-4 mr-2" />
          Test Alert
        </Button>
        <Button onClick={savePreferences} className="flex items-center">
          <Bell className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </motion.div>
  );
};

export default AlertCustomizer;
