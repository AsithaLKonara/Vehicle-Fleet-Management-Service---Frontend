'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getVehicleServices } from '@/services/serviceRecordService';
import { 
  XMarkIcon, 
  TruckIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  IdentificationIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  purchaseCost: number;
  status: string;
  type?: string;
  imageUrl?: string;
}

interface VehicleDetailsModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

export default function VehicleDetailsModal({ vehicle, isOpen, onClose }: VehicleDetailsModalProps) {
  const { data: services, isLoading } = useQuery({
    queryKey: ['vehicle-services', vehicle.id],
    queryFn: () => getVehicleServices(vehicle.id),
    enabled: isOpen,
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="glass w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col"
        >
          {/* Header Image */}
          <div className="relative h-64 w-full flex-shrink-0">
            {vehicle.imageUrl ? (
              <Image src={vehicle.imageUrl} alt={vehicle.make} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-surface to-surface-dark flex items-center justify-center">
                <TruckIcon className="w-24 h-24 text-white/10" />
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent"></div>
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-2xl text-white transition-all z-10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <div className="absolute bottom-8 left-8">
              <span className="px-4 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block shadow-lg shadow-primary/40">
                {vehicle.status}
              </span>
              <h2 className="text-5xl font-bold text-white tracking-tighter">{vehicle.make} {vehicle.model}</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Col: Metadata */}
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Vehicle Specifications</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="glass-light p-4 rounded-2xl flex items-center gap-4">
                    <IdentificationIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-[10px] text-text-muted font-bold uppercase">Plate Number</p>
                      <p className="text-white font-mono font-bold">{vehicle.plateNumber}</p>
                    </div>
                  </div>
                  <div className="glass-light p-4 rounded-2xl flex items-center gap-4">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-[10px] text-text-muted font-bold uppercase">Model Year</p>
                      <p className="text-white font-bold">{vehicle.year}</p>
                    </div>
                  </div>
                  <div className="glass-light p-4 rounded-2xl flex items-center gap-4">
                    <CurrencyDollarIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-[10px] text-text-muted font-bold uppercase">Acquisition Cost</p>
                      <p className="text-white font-bold">${vehicle.purchaseCost.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="glass p-6 rounded-[2rem] bg-linear-to-br from-primary/5 to-transparent border border-primary/10">
                 <h4 className="text-lg font-bold text-white mb-2">Fleet Health Score</h4>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-primary w-[85%]"></div>
                 </div>
                 <p className="text-sm text-text-dim font-medium leading-relaxed">This asset is operating at optimal efficiency with no pending maintenance alerts.</p>
              </section>
            </div>

            {/* Right Col: Maintenance History */}
            <div className="lg:col-span-2 space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Service History Registry</h3>
                  <div className="p-2 bg-white/5 rounded-xl">
                    <WrenchScrewdriverIcon className="w-5 h-5 text-text-muted" />
                  </div>
               </div>

               {isLoading ? (
                 <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl"></div>)}
                 </div>
               ) : services && services.length > 0 ? (
                 <div className="space-y-4">
                    {services.map((record) => (
                      <div key={record.id} className="glass-light p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
                         <div className="flex justify-between items-start">
                            <div className="space-y-1">
                               <h4 className="text-white font-bold text-lg">{record.title}</h4>
                               <div className="flex items-center gap-2 text-text-dim text-xs">
                                  <ClockIcon className="w-3 h-3" />
                                  {new Date(record.serviceDate).toLocaleDateString()}
                               </div>
                            </div>
                            <span className="text-primary font-black tracking-tighter text-xl">${record.cost}</span>
                         </div>
                         {record.description && (
                           <p className="mt-4 text-sm text-text-dim font-medium leading-relaxed">{record.description}</p>
                         )}
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="py-20 text-center glass-light rounded-[3rem] border border-dashed border-white/10">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ClockIcon className="w-8 h-8 text-text-muted opacity-30" />
                    </div>
                    <p className="text-text-muted font-bold uppercase text-[10px] tracking-[0.2em]">No records found</p>
                 </div>
               )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
