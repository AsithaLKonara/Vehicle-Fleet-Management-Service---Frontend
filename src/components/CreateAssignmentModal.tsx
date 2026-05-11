'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAssignment } from '@/services/assignmentService';
import { getVehicles } from '@/services/vehicleService';
import { getUsers } from '@/services/userService';
import { XMarkIcon, TruckIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const assignmentSchema = z.object({
  vehicleId: z.string().min(1, 'Selection of an active vehicle is required'),
  driverId: z.string().min(1, 'Selection of an authorized driver is required'),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateAssignmentModal({ isOpen, onClose }: CreateAssignmentModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
  });

  const { data: availableVehicles, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['vehicles', 'AVAILABLE'],
    queryFn: () => getVehicles({ status: 'AVAILABLE' }),
    enabled: isOpen,
  });

  const { data: allUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    enabled: isOpen,
  });

  const drivers = allUsers?.filter(u => u.role === 'FLEET_STAFF') || [];

  const mutation = useMutation({
    mutationFn: createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      reset();
      onClose();
    },
  });

  const onSubmit = (data: AssignmentFormData) => {
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
                <h2 className="text-3xl font-bold text-white tracking-tight">New <span className="gradient-text">Dispatch</span></h2>
                <p className="text-text-dim text-sm font-medium">Coordinate vehicle allocation for authorized staff.</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-text-dim hover:text-white transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Asset Allocation</label>
                <div className="relative group">
                  <TruckIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                  <select 
                    {...register('vehicleId')}
                    className="input-field w-full pl-12 appearance-none cursor-pointer"
                    disabled={isLoadingVehicles}
                  >
                    <option value="">{isLoadingVehicles ? 'Scanning registry...' : 'Select available vehicle'}</option>
                    {availableVehicles?.map(v => (
                      <option key={v.id} value={v.id} className="bg-surface text-white">
                        {v.plateNumber} — {v.make} {v.model}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.vehicleId && <p className="text-red-400 text-xs font-bold mt-1 ml-1">{errors.vehicleId.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Operator Assignment</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                  <select 
                    {...register('driverId')}
                    className="input-field w-full pl-12 appearance-none cursor-pointer"
                    disabled={isLoadingUsers}
                  >
                    <option value="">{isLoadingUsers ? 'Retrieving workforce...' : 'Select authorized driver'}</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id} className="bg-surface text-white">
                        {d.name} ({d.email})
                      </option>
                    ))}
                  </select>
                </div>
                {errors.driverId && <p className="text-red-400 text-xs font-bold mt-1 ml-1">{errors.driverId.message}</p>}
              </div>

              {mutation.isError && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold"
                >
                  <ShieldCheckIcon className="w-5 h-5 flex-shrink-0" />
                  Conflict detected. The selected asset may have already been dispatched.
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
                      Executing Dispatch...
                    </div>
                  ) : (
                    'Confirm Assignment'
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
