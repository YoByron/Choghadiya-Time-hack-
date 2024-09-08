import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, CheckSquare, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Period } from '../types';
import { formatTime } from '../utils/timeUtils';

interface Task {
  id: string;
  title: string;
  description: string;
  period: string;
  completed: boolean;
}

interface TaskPlannerProps {
  periods: Period[];
  onClose: () => void;
  onTaskComplete: (taskName: string) => void;
}

const TaskPlanner: React.FC<TaskPlannerProps> = ({ periods, onClose, onTaskComplete }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', period: '' });
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.title && newTask.period) {
      const task: Task = {
        id: Date.now().toString(),
        ...newTask,
        completed: false,
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', description: '', period: '' });
      toast({
        title: "Task Added",
        description: `"${task.title}" has been added to your tasks.`,
      });
    }
  };

  const handleCompleteTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    const completedTask = updatedTasks.find(task => task.id === taskId && task.completed);
    if (completedTask) {
      onTaskComplete(completedTask.title);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "The task has been removed from your list.",
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return task.period === filter;
  });

  const getRecommendedTasks = () => {
    const currentPeriod = periods.find(period => {
      const now = new Date();
      return now >= period.start && now < period.end;
    });

    if (!currentPeriod) return [];

    return tasks.filter(task => 
      task.period === currentPeriod.name && !task.completed
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full"
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Calendar className="w-6 h-6 mr-2 text-blue-500" />
        Task Planner
      </h2>

      <div className="space-y-4 mb-6">
        <Input
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <Input
          placeholder="Task description (optional)"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <Select value={newTask.period} onValueChange={(value) => setNewTask({ ...newTask, period: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select Choghadiya period" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((period) => (
              <SelectItem key={`${period.name}-${period.start.toISOString()}`} value={period.name}>
                {period.name} ({formatTime(period.start)} - {formatTime(period.end)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAddTask} className="w-full">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="mb-4">
        <Label htmlFor="filter">Filter tasks:</Label>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger id="filter">
            <SelectValue placeholder="Filter tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            {periods.map((period) => (
              <SelectItem key={`filter-${period.name}-${period.start.toISOString()}`} value={period.name}>
                {period.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 mb-6">
        {filteredTasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => handleCompleteTask(task.id)}
              />
              <div className="ml-3">
                <Label htmlFor={`task-${task.id}`} className={task.completed ? 'line-through' : ''}>
                  {task.title}
                </Label>
                {task.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {task.period}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Recommended Tasks for Current Period</h3>
        <div className="space-y-2">
          {getRecommendedTasks().map((task) => (
            <div key={`recommended-${task.id}`} className="flex items-center p-2 bg-blue-100 dark:bg-blue-900 rounded">
              <CheckSquare className="w-4 h-4 mr-2 text-blue-500" />
              <span>{task.title}</span>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={onClose} className="mt-6">Close</Button>
    </motion.div>
  );
};

export default TaskPlanner;