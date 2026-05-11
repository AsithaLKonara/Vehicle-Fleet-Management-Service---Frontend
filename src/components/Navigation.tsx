'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  TruckIcon, 
  UsersIcon, 
  ClipboardDocumentIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

interface NavigationProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function Navigation({ isCollapsed, setIsCollapsed }: NavigationProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Vehicle Fleet', href: '/vehicles', icon: TruckIcon },
    { name: 'User Management', href: '/users', icon: UsersIcon, roles: ['ADMIN'] },
    { name: 'Assignments', href: '/assignments', icon: ClipboardDocumentIcon },
    { name: 'Audit History', href: '/audit', icon: ShieldCheckIcon, roles: ['ADMIN'] },
  ];

  const filteredItems = navItems.filter(item => 
    !item.roles || item.roles.includes(user.role)
  );

  return (
    <motion.nav 
      initial={false}
      animate={{ width: isCollapsed ? '96px' : '280px' }}
      className="fixed left-0 top-0 h-full glass border-r border-white/5 flex flex-col z-[100] transition-all duration-500"
    >
      {/* Sidebar Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30 z-[110] hover:scale-110 transition-transform"
      >
        {isCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
      </button>

      {/* Brand */}
      <div className={`p-8 flex items-center gap-4 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-primary/30 flex-shrink-0">U</div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xl font-bold tracking-tight text-white whitespace-nowrap"
            >
              UltraDrive
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <div className="flex-1 px-4 space-y-2 mt-4">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group ${
                isActive 
                  ? 'bg-primary/10 text-white shadow-inner' 
                  : 'text-text-muted hover:bg-white/5 hover:text-white'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-primary' : 'group-hover:text-white'}`} />
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-bold text-sm tracking-wide whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* User & Logout */}
      <div className={`p-6 border-t border-white/5 space-y-6 ${isCollapsed ? 'items-center flex flex-col' : ''}`}>
        {!isCollapsed ? (
          <div className="px-2 space-y-1">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">OPERATOR</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent-cyan flex items-center justify-center font-bold text-white shadow-lg">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-bold text-sm truncate">{user.name}</p>
                <p className="text-xs text-primary-light font-bold uppercase tracking-tighter">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent-cyan flex items-center justify-center font-bold text-white shadow-lg cursor-help group relative">
            {user.name.charAt(0)}
            {/* Tooltip */}
            <div className="absolute left-14 bg-surface px-4 py-2 rounded-xl border border-white/10 text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl">
              {user.name} ({user.role})
            </div>
          </div>
        )}

        <button 
          onClick={logout}
          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 group ${isCollapsed ? 'justify-center px-0' : ''}`}
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-sm tracking-wide whitespace-nowrap"
              >
                Terminate Session
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.nav>
  );
}
