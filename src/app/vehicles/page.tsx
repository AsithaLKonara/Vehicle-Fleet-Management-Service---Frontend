'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVehicles } from '@/services/vehicleService';
import VehicleTable from '@/components/VehicleTable';
import CreateVehicleModal from '@/components/CreateVehicleModal';

export default function VehiclesPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['vehicles', search],
    queryFn: () => getVehicles({ search }),
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Vehicle Fleet</h1>
          <p className="text-text-dim mt-2">Monitor and manage all company vehicles in real-time.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          Register Vehicle
        </button>
      </div>

      <div className="flex gap-4">
        <input 
          type="text" 
          placeholder="Search by plate, make, or model..." 
          className="input-field flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 animate-pulse">
          <div className="h-64 bg-surface rounded-xl"></div>
        </div>
      ) : error ? (
        <div className="glass border-red-500/50 p-6 rounded-xl text-red-400">
          <p>Failed to load vehicles. Please try again later.</p>
        </div>
      ) : (
        <VehicleTable vehicles={vehicles || []} />
      )}

      <CreateVehicleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
