'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon,
  TagIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const getRoleStyles = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-500/20 text-purple-400 border-purple-500/20';
      case 'FLEET_MANAGER': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'FLEET_STAFF': return 'bg-green-500/20 text-green-400 border-green-500/20';
      default: return 'bg-white/10 text-text-dim border-white/10';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {users.map((user, idx) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          whileHover={{ y: -4 }}
          className="glass p-6 rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all duration-300 group"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary/20 to-accent-cyan/10 flex items-center justify-center text-primary shadow-inner">
                <UserCircleIcon className="w-10 h-10" />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-xl font-bold text-white tracking-tight truncate">{user.name}</h3>
                <span className={`inline-block px-2 py-0.5 rounded-lg text-[9px] font-black tracking-[0.1em] uppercase border mt-1 ${getRoleStyles(user.role)}`}>
                  {user.role.replace('_', ' ')}
                </span>
              </div>
            </div>
            <button className="p-2 rounded-xl hover:bg-white/5 text-text-muted hover:text-white transition-colors">
              <EllipsisHorizontalIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-text-dim group-hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <EnvelopeIcon className="w-4 h-4 opacity-70" />
              </div>
              <span className="text-sm font-medium truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-text-dim group-hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <TagIcon className="w-4 h-4 opacity-70" />
              </div>
              <span className="text-xs font-mono opacity-50">#{user.id.slice(0, 8)}</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
            <button className="flex-1 glass-light hover:bg-white/10 py-2.5 rounded-xl text-xs font-bold text-white transition-all">
              Edit Profile
            </button>
            <button className="w-12 h-10 flex items-center justify-center glass-light hover:bg-red-400/10 hover:text-red-400 rounded-xl transition-all">
              <ShieldCheckIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      ))}

      {users.length === 0 && (
        <div className="col-span-full py-32 text-center space-y-6">
           <div className="w-24 h-24 bg-surface-light rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 rotate-12 group-hover:rotate-0 transition-transform duration-500">
             <UsersIcon className="w-12 h-12 text-text-muted" />
           </div>
           <div className="space-y-2">
             <h3 className="text-3xl font-bold text-white tracking-tight">No workforce found</h3>
             <p className="text-text-dim text-lg">Your organization matrix is currently empty.</p>
           </div>
        </div>
      )}
    </div>
  );
}
