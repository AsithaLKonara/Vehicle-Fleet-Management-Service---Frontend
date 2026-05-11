'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/userService';
import UserTable from '@/components/UserTable';
import CreateUserModal from '@/components/CreateUserModal';

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">User Management</h1>
          <p className="text-text-dim mt-2">Manage system administrators, managers, and staff members.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          Add New User
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 animate-pulse">
          <div className="h-64 bg-surface rounded-xl"></div>
        </div>
      ) : error ? (
        <div className="glass border-red-500/50 p-6 rounded-xl text-red-400">
          <p>Failed to load users. Please check your permissions or try again.</p>
        </div>
      ) : (
        <UserTable users={users || []} />
      )}

      <CreateUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
