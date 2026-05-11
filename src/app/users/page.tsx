'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/userService';
import UserTable from '@/components/UserTable';
import CreateUserModal from '@/components/CreateUserModal';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlusIcon, UsersIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  return (
    <div className="p-4 md:p-12 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <h1 className="text-5xl font-bold tracking-tight text-white leading-none">Workforce <span className="gradient-text">Matrix</span></h1>
          <p className="text-text-dim text-lg font-medium">Coordinate system administrators, managers, and operational staff.</p>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          <UserPlusIcon className="w-5 h-5" />
          Onboard Operator
        </motion.button>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="h-20 bg-surface rounded-3xl animate-pulse"></div>
             ))}
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass border-red-500/20 p-12 rounded-[2.5rem] text-center space-y-6"
          >
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
               <ShieldCheckIcon className="w-10 h-10 text-red-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Synchronization Error</h2>
              <p className="text-text-dim max-w-md mx-auto">We encountered an issue retrieving the workforce registry. Verify your administrative clearance level and try again.</p>
            </div>
            <button onClick={() => window.location.reload()} className="btn-primary inline-flex">Retry Handshake</button>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <UserTable users={users || []} />
          </motion.div>
        )}
      </AnimatePresence>

      <CreateUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
