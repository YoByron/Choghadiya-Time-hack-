import React, { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';

interface AlertCustomizerProps {
  onClose: () => void;
}

const AlertCustomizer: React.FC<AlertCustomizerProps> = ({ onClose }) => {
  const [newAlert, setNewAlert] = useState({ period: '', sound: '', vibration: '' });
  const { alerts, addAlert, removeAlert, updateAlert } = useAlerts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAlert(newAlert);
    setNewAlert({ period: '', sound: '', vibration: '' });
  };

  return (
    <div>
      <h2>Alert Customizer</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newAlert.period}
          onChange={(e) => setNewAlert({ ...newAlert, period: e.target.value })}
          placeholder="Choghadiya Period"
          required
        />
        <input
          type="text"
          value={newAlert.sound}
          onChange={(e) => setNewAlert({ ...newAlert, sound: e.target.value })}
          placeholder="Alert Sound"
          required
        />
        <input
          type="text"
          value={newAlert.vibration}
          onChange={(e) => setNewAlert({ ...newAlert, vibration: e.target.value })}
          placeholder="Vibration Pattern"
          required
        />
        <button type="submit">Add Alert</button>
      </form>
      <ul>
        {alerts.map((alert) => (
          <li key={alert.id}>
            {alert.period} - Sound: {alert.sound}, Vibration: {alert.vibration}
            <button onClick={() => removeAlert(alert.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default AlertCustomizer;