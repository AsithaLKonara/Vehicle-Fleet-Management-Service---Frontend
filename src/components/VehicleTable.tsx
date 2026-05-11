'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TruckIcon, MapPinIcon, IdentificationIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

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
}

export default function VehicleTable({ vehicles }: VehicleTableProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'ASSIGNED': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'MAINTENANCE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      default: return 'bg-white/10 text-text-dim border-white/10';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {vehicles.map((vehicle, idx) => (
        <motion.div
          key={vehicle.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          whileHover={{ y: -5 }}
          className="glass rounded-3xl overflow-hidden group border border-white/5 hover:border-primary/30 transition-all duration-300"
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
            {vehicle.type && (
              <div className="absolute bottom-4 left-4">
                <span className="px-2 py-1 rounded-lg bg-black/40 text-white/80 text-[10px] font-medium backdrop-blur-sm border border-white/10">
                  {vehicle.type}
                </span>
              </div>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {vehicle.make} {vehicle.model}
                  <span className="text-text-muted font-medium ml-2 text-sm">({vehicle.year})</span>
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-text-dim">
                  <IdentificationIcon className="w-4 h-4" />
                  <span className="text-sm font-mono tracking-wider">{vehicle.plateNumber}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <MapPinIcon className="w-5 h-5 text-text-dim group-hover:text-primary transition-colors" />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
              <button className="btn-primary py-2 px-3 text-xs">
                View Details
              </button>
              <button className="glass-light hover:bg-white/10 py-2 px-3 text-xs rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2">
                <WrenchScrewdriverIcon className="w-4 h-4" />
                Service
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      {vehicles.length === 0 && (
        <div className="col-span-full py-24 text-center space-y-4">
          <div className="w-20 h-20 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-6">
            <TruckIcon className="w-10 h-10 text-text-muted" />
          </div>
          <h3 className="text-2xl font-bold text-white">No vehicles found</h3>
          <p className="text-text-dim">Try adjusting your filters or register a new vehicle to get started.</p>
        </div>
      )}
    </div>
  );
}
