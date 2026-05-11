'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVehicle } from '@/services/vehicleService';
import { XMarkIcon, TruckIcon, IdentificationIcon, PhotoIcon, TagIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const vehicleSchema = z.object({
  plateNumber: z.string().min(3, 'A unique plate number is required for asset identification'),
  make: z.string().min(2, 'Manufacturer identity is required'),
  model: z.string().min(1, 'Model classification is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  purchaseCost: z.number().min(0, 'Purchase cost must be non-negative'),
  type: z.string().min(1, 'Vehicle type classification is required'),
  imageUrl: z.string().url('Invalid image endpoint URL').optional().or(z.literal('')),
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
    mutation.mutate({
      ...data,
      status: 'AVAILABLE',
    });
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
                <h2 className="text-3xl font-bold text-white tracking-tight">Register <span className="gradient-text">Asset</span></h2>
                <p className="text-text-dim text-sm font-medium">Add a new high-performance vehicle to the operational fleet.</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-text-dim hover:text-white transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Unique Identifier</label>
                <div className="relative group">
                  <IdentificationIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                  <input 
                    {...register('plateNumber')}
                    className="input-field w-full pl-12 uppercase tracking-widest font-mono" 
                    placeholder="e.g. ABC-1234"
                  />
                </div>
                {errors.plateNumber && <p className="text-red-400 text-xs font-bold mt-1 ml-1">{errors.plateNumber.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Manufacturer</label>
                  <input 
                    {...register('make')}
                    className="input-field w-full" 
                    placeholder="Toyota"
                  />
                  {errors.make && <p className="text-red-400 text-xs font-bold mt-1 ml-1">{errors.make.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Model Name</label>
                  <input 
                    {...register('model')}
                    className="input-field w-full" 
                    placeholder="Hiace"
                  />
                  {errors.model && <p className="text-red-400 text-xs font-bold mt-1 ml-1">{errors.model.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Manufacturing Year</label>
                  <input 
                    {...register('year', { valueAsNumber: true })}
                    type="number"
                    className="input-field w-full" 
                    placeholder="2024"
                  />
                  {errors.year && <p className="text-red-400 text-xs font-bold mt-1 ml-1">{errors.year.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Purchase Cost (USD)</label>
                  <input 
                    {...register('purchaseCost', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="input-field w-full" 
                    placeholder="25000.00"
                  />
                  {errors.purchaseCost && <p className="text-red-400 text-xs font-bold mt-1 ml-1">{errors.purchaseCost.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Classification</label>
                  <div className="relative group">
                    <TagIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                    <select 
                      {...register('type')}
                      className="input-field w-full pl-12 appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-surface">Select Classification</option>
                      <option value="VAN" className="bg-surface">Van</option>
                      <option value="TRUCK" className="bg-surface">Truck</option>
                      <option value="CAR" className="bg-surface">Car</option>
                      <option value="MOTORCYCLE" className="bg-surface">Motorcycle</option>
                    </select>
                  </div>
                  {errors.type && <p className="text-red-400 text-xs font-bold mt-1 ml-1">{errors.type.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Visual Asset URL</label>
                  <div className="relative group">
                    <PhotoIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input 
                      {...register('imageUrl')}
                      className="input-field w-full pl-12" 
                      placeholder="https://..."
                    />
                  </div>
                  {errors.imageUrl && <p className="text-red-400 text-xs font-bold mt-1 ml-1">{errors.imageUrl.message}</p>}
                </div>
              </div>

              {mutation.isError && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold"
                >
                  <ShieldCheckIcon className="w-5 h-5 flex-shrink-0" />
                  Asset conflict. The plate number is already registered in the registry.
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
                      Processing Registry...
                    </div>
                  ) : (
                    'Finalize Registration'
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
