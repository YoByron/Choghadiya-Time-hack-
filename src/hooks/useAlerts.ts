import { useState, useEffect } from 'react';

interface Alert {
  id: string;
  period: string;
  sound: string;
  vibration: string;
}

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Load alerts from local storage when the component mounts
    const savedAlerts = localStorage.getItem('choghadiyaAlerts');
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  const addAlert = (alert: Omit<Alert, 'id'>) => {
    const newAlert = { ...alert, id: Date.now().toString() };
    const updatedAlerts = [...alerts, newAlert];
    setAlerts(updatedAlerts);
    localStorage.setItem('choghadiyaAlerts', JSON.stringify(updatedAlerts));
  };

  const removeAlert = (id: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== id);
    setAlerts(updatedAlerts);
    localStorage.setItem('choghadiyaAlerts', JSON.stringify(updatedAlerts));
  };

  const updateAlert = (id: string, updatedAlert: Partial<Alert>) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === id ? { ...alert, ...updatedAlert } : alert
    );
    setAlerts(updatedAlerts);
    localStorage.setItem('choghadiyaAlerts', JSON.stringify(updatedAlerts));
  };

  return { alerts, addAlert, removeAlert, updateAlert };
};
