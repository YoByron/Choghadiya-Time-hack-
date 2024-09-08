import React from 'react';
import { motion } from 'framer-motion';

interface SandglassProps {
  size: number;
  color: string;
}

export const Sandglass: React.FC<SandglassProps> = ({ size, color }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2V22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M5 4C5 2.89543 5.89543 2 7 2H17C18.1046 2 19 2.89543 19 4V6C19 9.31371 16.3137 12 13 12H11C7.68629 12 5 9.31371 5 6V4Z" stroke={color} strokeWidth="2" />
      <path d="M5 20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V18C19 14.6863 16.3137 12 13 12H11C7.68629 12 5 14.6863 5 18V20Z" stroke={color} strokeWidth="2" />
      <motion.path
        d="M7 4H17"
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.path
        d="M7 20H17"
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: 1 }}
        animate={{ pathLength: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
};

export default Sandglass;