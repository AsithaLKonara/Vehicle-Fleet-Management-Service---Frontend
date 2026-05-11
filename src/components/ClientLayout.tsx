'use client';

import { useAuth } from '@/context/AuthContext';
import Navigation from './Navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      {user && <Navigation />}
      <main className={`flex-1 transition-all duration-300 ${user ? 'pl-64' : 'pl-0'}`}>
        {children}
      </main>
    </div>
  );
}
