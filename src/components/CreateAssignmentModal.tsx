'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAssignment } from '@/services/assignmentService';
import { getVehicles } from '@/services/vehicleService';
import { getUsers } from '@/services/userService';
import { XMarkIcon } from '@heroicons/react/24/outline';

const assignmentSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle is required'),
  driverId: z.string().min(1, 'Driver is required'),
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

  const { data: availableVehicles } = useQuery({
    queryKey: ['vehicles', 'AVAILABLE'],
    queryFn: () => getVehicles({ status: 'AVAILABLE' }),
    enabled: isOpen,
  });

  const { data: allUsers } = useQuery({
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="glass w-full max-w-md rounded-2xl p-8 relative z-10 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">New Assignment</h2>
          <button onClick={onClose} className="text-text-dim hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-dim">Available Vehicle</label>
            <select 
              {...register('vehicleId')}
              className="input-field w-full"
            >
              <option value="">Select a vehicle</option>
              {availableVehicles?.map(v => (
                <option key={v.id} value={v.id}>
                  {v.plateNumber} - {v.make} {v.model}
                </option>
              ))}
            </select>
            {errors.vehicleId && <p className="text-red-400 text-xs">{errors.vehicleId.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-text-dim">Assign to Driver</label>
            <select 
              {...register('driverId')}
              className="input-field w-full"
            >
              <option value="">Select a driver</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.email})
                </option>
              ))}
            </select>
            {errors.driverId && <p className="text-red-400 text-xs">{errors.driverId.message}</p>}
          </div>

          {mutation.isError && (
            <p className="text-red-400 text-sm text-center">Failed to create assignment. The vehicle might have just been assigned.</p>
          )}

          <button 
            type="submit" 
            className="btn-primary w-full py-3"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Assigning...' : 'Assign Vehicle'}
          </button>
        </form>
      </div>
    </div>
  );
}
