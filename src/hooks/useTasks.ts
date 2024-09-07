import { useState, useCallback } from 'react';

interface Task {
  title: string;
  type: string;
  suggestedPeriod?: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback((newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, []);

  const completeTask = useCallback((index: number) => {
    setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
  }, []);

  return { tasks, addTask, completeTask };
};