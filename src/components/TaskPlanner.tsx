import React, { useState } from 'react';

interface Period {
  name: string;
  start: Date;
  end: Date;
  effect: "Good" | "Bad" | "Neutral";
}

interface TaskPlannerProps {
  periods: Period[];
  onClose: () => void;
  onTaskComplete: (taskName: string) => void;
}

const TaskPlanner: React.FC<TaskPlannerProps> = ({ periods, onClose, onTaskComplete }) => {
  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState('work');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentTime = new Date();
    const suitablePeriods = periods.filter(period => {
      if (period.start <= currentTime && period.end > currentTime) {
        switch (taskType) {
          case 'work':
            return ['Labh', 'Amrit', 'Shubh'].includes(period.name);
          case 'personal':
            return ['Char', 'Amrit', 'Shubh'].includes(period.name);
          case 'health':
            return ['Amrit', 'Shubh'].includes(period.name);
          default:
            return true;
        }
      }
      return false;
    });

    if (suitablePeriods.length > 0) {
      console.log(`Task "${taskName}" planned for ${suitablePeriods[0].name} period`);
    } else {
      console.log(`Task "${taskName}" planned, but no suitable period found`);
    }

    onTaskComplete(taskName);
    setTaskName('');
  };

  return (
    <div>
      <h2>Task Planner</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task name"
          required
        />
        <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="health">Health</option>
        </select>
        <button type="submit">Plan Task</button>
      </form>
    </div>
  );
};

export default TaskPlanner;