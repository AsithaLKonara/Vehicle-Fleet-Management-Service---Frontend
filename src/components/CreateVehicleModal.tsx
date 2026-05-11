'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVehicle } from '@/services/vehicleService';
import { XMarkIcon } from '@heroicons/react/24/outline';

const vehicleSchema = z.object({
  plateNumber: z.string().min(3, 'Plate number is required'),
  make: z.string().min(2, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  type: z.string().min(1, 'Type is required'),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface CreateVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateVehicleModal({ isOpen, onClose }: CreateVehicleModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });

  const mutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      reset();
      onClose();
    },
  });

  const onSubmit = (data: VehicleFormData) => {
    mutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="glass w-full max-w-md rounded-2xl p-8 relative z-10 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Register Vehicle</h2>
          <button onClick={onClose} className="text-text-dim hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-dim">Plate Number</label>
            <input 
              {...register('plateNumber')}
              className="input-field w-full uppercase" 
              placeholder="ABC-1234"
            />
            {errors.plateNumber && <p className="text-red-400 text-xs">{errors.plateNumber.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-dim">Make</label>
              <input 
                {...register('make')}
                className="input-field w-full" 
                placeholder="Toyota"
              />
              {errors.make && <p className="text-red-400 text-xs">{errors.make.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-dim">Model</label>
              <input 
                {...register('model')}
                className="input-field w-full" 
                placeholder="Hiace"
              />
              {errors.model && <p className="text-red-400 text-xs">{errors.model.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-text-dim">Vehicle Type</label>
            <select 
              {...register('type')}
              className="input-field w-full"
            >
              <option value="">Select Type</option>
              <option value="VAN">Van</option>
              <option value="TRUCK">Truck</option>
              <option value="CAR">Car</option>
              <option value="MOTORCYCLE">Motorcycle</option>
            </select>
            {errors.type && <p className="text-red-400 text-xs">{errors.type.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-text-dim">Vehicle Image URL</label>
            <input 
              {...register('imageUrl')}
              className="input-field w-full" 
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && <p className="text-red-400 text-xs">{errors.imageUrl.message}</p>}
          </div>

          {mutation.isError && (
            <p className="text-red-400 text-sm text-center">Failed to register vehicle. Plate might already exist.</p>
          )}

          <button 
            type="submit" 
            className="btn-primary w-full py-3"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Registering...' : 'Register Vehicle'}
          </button>
        </form>
      </div>
    </div>
  );
}
