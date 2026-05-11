'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '@/services/userService';
import { XMarkIcon } from '@heroicons/react/24/outline';

const userSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'FLEET_MANAGER', 'FLEET_STAFF']),
});

type UserFormData = z.infer<typeof userSchema>;

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'FLEET_STAFF',
    }
  });

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      reset();
      onClose();
    },
  });

  const onSubmit = (data: UserFormData) => {
    mutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="glass w-full max-w-md rounded-2xl p-8 relative z-10 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Create New User</h2>
          <button onClick={onClose} className="text-text-dim hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-dim">Full Name</label>
            <input 
              {...register('name')}
              className="input-field w-full" 
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-text-dim">Email Address</label>
            <input 
              {...register('email')}
              type="email"
              className="input-field w-full" 
              placeholder="john@fleet.com"
            />
            {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-text-dim">Initial Password</label>
            <input 
              {...register('password')}
              type="password"
              className="input-field w-full" 
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-text-dim">System Role</label>
            <select 
              {...register('role')}
              className="input-field w-full"
            >
              <option value="ADMIN">Administrator</option>
              <option value="FLEET_MANAGER">Fleet Manager</option>
              <option value="FLEET_STAFF">Fleet Staff</option>
            </select>
            {errors.role && <p className="text-red-400 text-xs">{errors.role.message}</p>}
          </div>

          {mutation.isError && (
            <p className="text-red-400 text-sm text-center">Failed to create user. Email might already be in use.</p>
          )}

          <button 
            type="submit" 
            className="btn-primary w-full py-3"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
}
