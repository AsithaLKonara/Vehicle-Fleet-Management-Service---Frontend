'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center space-y-8">
      <div className="relative">
        {/* Logo Shimmer */}
        <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center font-bold text-white text-3xl shadow-2xl shadow-primary/40 relative z-10">
          U
        </div>
        {/* Pulsing rings */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-primary rounded-[2rem] -z-0"
        />
        <motion.div 
          animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute inset-0 bg-accent-cyan rounded-[2rem] -z-0"
        />
      </div>
      
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold text-white tracking-widest uppercase">Initializing Stream</h2>
        <div className="flex gap-1 justify-center">
          {[0, 1, 2].map(i => (
            <motion.div 
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
