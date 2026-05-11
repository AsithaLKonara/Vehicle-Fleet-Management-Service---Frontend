'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '@/services/userService';
import { XMarkIcon, UserIcon, EnvelopeIcon, KeyIcon, IdentificationIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const userSchema = z.object({
  name: z.string().min(2, 'A professional full name is required'),
  email: z.string().email('Invalid corporate email address'),
  password: z.string().min(6, 'Access credentials must be at least 6 characters'),
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-md" 
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass w-full max-w-lg rounded-[2.5rem] p-10 relative z-10 space-y-8 shadow-2xl border border-white/10"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold text-white tracking-tight">Onboard <span className="gradient-text">Operator</span></h2>
                <p className="text-text-dim text-sm font-medium">Provision new credentials for the workforce matrix.</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-text-dim hover:text-white transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Full Identity</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                  <input 
                    {...register('name')}
                    className="input-field w-full pl-12" 
                    placeholder="e.g. Alexander Pierce"
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs font-bold mt-1 ml-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Communication Endpoint</label>
                <div className="relative group">
                  <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                  <input 
                    {...register('email')}
                    type="email"
                    className="input-field w-full pl-12" 
                    placeholder="operator@ultradrive.com"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs font-bold mt-1 ml-1">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Security Key</label>
                  <div className="relative group">
                    <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input 
                      {...register('password')}
                      type="password"
                      className="input-field w-full pl-12" 
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && <p className="text-red-400 text-xs font-bold mt-1 ml-1">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Clearance Level</label>
                  <div className="relative group">
                    <IdentificationIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                    <select 
                      {...register('role')}
                      className="input-field w-full pl-12 appearance-none cursor-pointer"
                    >
                      <option value="ADMIN" className="bg-surface text-white">Administrator</option>
                      <option value="FLEET_MANAGER" className="bg-surface text-white">Fleet Manager</option>
                      <option value="FLEET_STAFF" className="bg-surface text-white">Fleet Staff</option>
                    </select>
                  </div>
                  {errors.role && <p className="text-red-400 text-xs font-bold mt-1 ml-1">{errors.role.message}</p>}
                </div>
              </div>

              {mutation.isError && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold"
                >
                  <ShieldCheckIcon className="w-5 h-5 flex-shrink-0" />
                  Registry conflict. This endpoint may already be provisioned in the system.
                </motion.div>
              )}

              <div className="pt-4">
                <button 
                  type="submit" 
                  className="btn-primary w-full py-4 text-lg"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Provisioning...
                    </div>
                  ) : (
                    'Finalize Onboarding'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
