'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  HomeIcon, 
  TruckIcon, 
  UsersIcon, 
  ClipboardDocumentIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Vehicles', href: '/vehicles', icon: TruckIcon },
    { name: 'Users', href: '/users', icon: UsersIcon, roles: ['ADMIN'] },
    { name: 'Assignments', href: '/assignments', icon: ClipboardDocumentIcon },
    { name: 'Audit Logs', href: '/audit', icon: ClipboardDocumentIcon, roles: ['ADMIN'] },
  ];

  const filteredItems = navItems.filter(item => 
    !item.roles || item.roles.includes(user.role)
  );

  return (
    <nav className="fixed left-0 top-0 h-full w-64 glass border-r border-white/10 p-6 flex flex-col space-y-8 z-50">
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">U</div>
        <h1 className="text-xl font-bold text-white">UltraDrive</h1>
      </div>

      <div className="flex-1 flex flex-col space-y-1">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-text-dim hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="pt-6 border-t border-white/10 space-y-4">
        <div className="px-4">
          <p className="text-xs font-bold text-text-dim uppercase tracking-widest">Signed in as</p>
          <p className="text-white font-medium truncate">{user.name}</p>
          <p className="text-xs text-primary font-bold uppercase mt-1">{user.role}</p>
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
}
