'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HomeIcon, ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-12">
      <div className="relative">
        <motion.div 
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-[12rem] font-black text-white/5 tracking-tighter"
        >
          404
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center border border-red-500/20 shadow-2xl shadow-red-500/10">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-400" />
          </div>
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">Route Not Found</h1>
        <p className="text-text-dim text-lg font-medium">The operational sector you are attempting to access does not exist or has been decommissioned.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Link href="/" className="btn-primary py-4 px-8 group">
          <HomeIcon className="w-5 h-5" />
          Return to Hub
        </Link>
        <button 
          onClick={() => window.history.back()}
          className="glass-light hover:bg-white/10 text-white font-bold py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Previous Sector
        </button>
      </div>
    </div>
  );
}
