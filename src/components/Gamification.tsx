import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Target, Zap, Award } from 'lucide-react';

interface GamificationProps {
  onClose: () => void;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
}

const Gamification: React.FC<GamificationProps> = ({ onClose }) => {
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'login_streak',
      name: 'Consistent Seeker',
      description: 'Log in for 7 consecutive days',
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      progress: 3,
      maxProgress: 7,
    },
    {
      id: 'task_completion',
      name: 'Task Master',
      description: 'Complete 10 tasks during auspicious periods',
      icon: <Star className="w-6 h-6 text-blue-500" />,
      progress: 4,
      maxProgress: 10,
    },
    {
      id: 'period_alignment',
      name: 'Harmony Seeker',
      description: 'Align 5 activities with their ideal Choghadiya periods',
      icon: <Target className="w-6 h-6 text-green-500" />,
      progress: 2,
      maxProgress: 5,
    },
  ]);

  useEffect(() => {
    // Simulating experience gain over time
    const timer = setInterval(() => {
      setExperience((prev) => {
        const newExp = prev + 10;
        if (newExp >= 100) {
          setLevel((prevLevel) => prevLevel + 1);
          return 0;
        }
        return newExp;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleCompleteTask = () => {
    setAchievements((prev) =>
      prev.map((achievement) =>
        achievement.id === 'task_completion'
          ? { ...achievement, progress: Math.min(achievement.progress + 1, achievement.maxProgress) }
          : achievement
      )
    );
    setExperience((prev) => Math.min(prev + 20, 99));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Zap className="w-6 h-6 mr-2 text-yellow-500" />
        Gamification
      </h2>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Level {level}</span>
          <span>{experience}/100 XP</span>
        </div>
        <Progress value={experience} className="w-full" />
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Daily Streak</h3>
        <div className="flex items-center">
          <Badge variant="secondary" className="text-lg">
            {streak} days
          </Badge>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            Keep logging in daily to increase your streak!
          </span>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Achievements</h3>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center">
              {achievement.icon}
              <div className="ml-3 flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{achievement.name}</span>
                  <span className="text-sm">
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
                <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <Button onClick={handleCompleteTask}>Simulate Task Completion</Button>
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </div>
    </motion.div>
  );
};

export default Gamification;