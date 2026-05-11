'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TruckIcon, MapPinIcon, IdentificationIcon, WrenchScrewdriverIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import VehicleDetailsModal from './VehicleDetailsModal';
import { useAuth } from '@/context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteVehicle } from '@/services/vehicleService';

interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  purchaseCost: number;
  status: 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE' | 'INACTIVE';
  type?: string;
  imageUrl?: string;
}

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onMaintenance: (vehicle: Vehicle) => void;
}

export default function VehicleTable({ vehicles, onEdit, onMaintenance }: VehicleTableProps) {
  const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to decommission this asset from the fleet registry?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'ASSIGNED': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'MAINTENANCE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      default: return 'bg-white/10 text-text-dim border-white/10';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.map((vehicle, idx) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -5 }}
            className="glass rounded-3xl overflow-hidden group border border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col"
          >
            {/* Vehicle Image */}
            <div className="relative h-48 w-full bg-surface-light overflow-hidden">
              {vehicle.imageUrl ? (
                <Image 
                  src={vehicle.imageUrl} 
                  alt={`${vehicle.make} ${vehicle.model}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-surface-light to-surface">
                  <TruckIcon className="w-16 h-16 text-text-muted opacity-20" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyles(vehicle.status)} backdrop-blur-md`}>
                  {vehicle.status}
                </span>
              </div>
              
              {user?.role !== 'FLEET_STAFF' && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => onEdit(vehicle)}
                    className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-xl text-white transition-all"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(vehicle.id)}
                    className="p-2 bg-red-500/40 hover:bg-red-500/60 backdrop-blur-md rounded-xl text-white transition-all"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="p-6 space-y-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start">
                <div className="overflow-hidden">
                  <h3 className="text-xl font-bold text-white tracking-tight truncate">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-text-dim">
                    <IdentificationIcon className="w-4 h-4" />
                    <span className="text-sm font-mono tracking-wider">{vehicle.plateNumber}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-5 h-5 text-text-dim" />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4 mt-auto">
                <button 
                  onClick={() => setViewVehicle(vehicle)}
                  className="btn-primary py-2 px-3 text-xs"
                >
                  View Details
                </button>
                <button 
                  onClick={() => onMaintenance(vehicle)}
                  className="glass-light hover:bg-white/10 py-2 px-3 text-xs rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2"
                >
                  <WrenchScrewdriverIcon className="w-4 h-4" />
                  Service
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {viewVehicle && (
        <VehicleDetailsModal 
          vehicle={viewVehicle}
          isOpen={!!viewVehicle}
          onClose={() => setViewVehicle(null)}
        />
      )}
    </>
  );
}
