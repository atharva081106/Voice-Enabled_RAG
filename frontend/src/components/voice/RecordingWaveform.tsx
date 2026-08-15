import React from 'react';
import { motion } from 'framer-motion';

export const RecordingWaveform: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-1 mt-4" style={{ height: '40px' }}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ height: ['10px', '30px', '10px'] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          style={{
            width: '6px',
            backgroundColor: 'var(--primary-color)',
            borderRadius: '999px'
          }}
        />
      ))}
    </div>
  );
};
