import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useChoghadiya } from '../hooks/useChoghadiya';

interface Period {
  name: string;
  start: Date;
  end: Date;
  effect: "Good" | "Bad" | "Neutral";
}

interface QuickAddTaskProps {
  onClose: () => void;
  periods: Period[];
}

const QuickAddTask: React.FC<QuickAddTaskProps> = ({ onClose, periods }) => {
  const [newTask, setNewTask] = useState({ title: '', type: '' });
  const { addTask } = useTasks();

  const getSuitablePeriod = (taskType: string) => {
    const currentTime = new Date();
    const suitablePeriods = periods.filter(period => {
      if (period.start <= currentTime && period.end > currentTime) {
        switch (taskType) {
          case 'work':
            return ['Labh', 'Amrit', 'Shubh'].includes(period.name);
          case 'personal':
            return ['Char', 'Labh', 'Amrit'].includes(period.name);
          case 'spiritual':
            return ['Amrit', 'Shubh'].includes(period.name);
          default:
            return true;
        }
      }
      return false;
    });

    return suitablePeriods.length > 0 ? suitablePeriods[0].name : 'Any period';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const suitablePeriod = getSuitablePeriod(newTask.type);
    addTask({ ...newTask, suggestedPeriod: suitablePeriod });
    setNewTask({ title: '', type: '' });
    onClose();
  };

  return (
    <div className="quick-add-task">
      <h3 className="text-lg font-semibold mb-2">Quick Add Task</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Enter task title"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <select
          value={newTask.type}
          onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          required
        >
          <option value="">Select Task Type</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="spiritual">Spiritual</option>
        </select>
        <div className="flex justify-between">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add Task
          </button>
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuickAddTask;