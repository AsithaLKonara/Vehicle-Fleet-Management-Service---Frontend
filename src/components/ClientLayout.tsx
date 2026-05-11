'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isLandingPage = pathname === '/';

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const showNavigation = user && !isLandingPage;

  return (
    <div className="flex min-h-screen w-full">
      {showNavigation && <Navigation isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
      <main className={`flex-1 transition-all duration-500 ${showNavigation ? (isCollapsed ? 'pl-[96px]' : 'pl-[280px]') : 'pl-0'}`}>
        {children}
      </main>
    </div>
  );
}
