import React from 'react';

interface SwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: () => void;
}

export const Switch: React.FC<SwitchProps> = ({ id, checked, onCheckedChange }) => {
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          checked={checked}
          onChange={onCheckedChange}
        />
        <div className={`block w-14 h-8 rounded-full ${checked ? 'bg-green-400' : 'bg-gray-600'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${checked ? 'transform translate-x-6' : ''}`}></div>
      </div>
    </label>
  );
};
