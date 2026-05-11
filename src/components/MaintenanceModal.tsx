'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addVehicleService } from '@/services/serviceRecordService';
import { motion, AnimatePresence } from 'framer-motion';
import { WrenchScrewdriverIcon, XMarkIcon } from '@heroicons/react/24/outline';

const serviceSchema = z.object({
  title: z.string().min(1, 'Service title is required'),
  description: z.string().optional(),
  serviceDate: z.string().min(1, 'Date is required'),
  cost: z.coerce.number().min(0, 'Cost must be non-negative'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface MaintenanceModalProps {
  vehicleId: string;
  vehicleName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function MaintenanceModal({ vehicleId, vehicleName, isOpen, onClose }: MaintenanceModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
        serviceDate: new Date().toISOString().split('T')[0]
    }
  });

  const mutation = useMutation({
    mutationFn: (data: ServiceFormData) => addVehicleService(vehicleId, {
        ...data,
        serviceDate: new Date(data.serviceDate).toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-services', vehicleId] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      reset();
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
        >
          <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/20 rounded-2xl">
                  <WrenchScrewdriverIcon className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Maintenance Record</h2>
                  <p className="text-text-dim text-sm font-medium">{vehicleName}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-text-muted transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Service Title</label>
                <input 
                  {...register('title')}
                  className="input-field w-full" 
                  placeholder="Engine Oil Change"
                />
                {errors.title && <p className="text-red-400 text-[10px] font-bold ml-1 uppercase">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Service Date</label>
                  <input 
                    {...register('serviceDate')}
                    type="date"
                    className="input-field w-full" 
                  />
                  {errors.serviceDate && <p className="text-red-400 text-[10px] font-bold ml-1 uppercase">{errors.serviceDate.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Cost (USD)</label>
                  <input 
                    {...register('cost')}
                    type="number"
                    step="0.01"
                    className="input-field w-full" 
                    placeholder="150.00"
                  />
                  {errors.cost && <p className="text-red-400 text-[10px] font-bold ml-1 uppercase">{errors.cost.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Work Description</label>
                <textarea 
                  {...register('description')}
                  className="input-field w-full min-h-[100px] py-3" 
                  placeholder="Details of the work performed..."
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary w-full py-4 text-lg"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Processing...' : 'Register Maintenance'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
