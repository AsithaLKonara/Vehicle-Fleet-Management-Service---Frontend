'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVehicles } from '@/services/vehicleService';
import VehicleTable from '@/components/VehicleTable';
import CreateVehicleModal from '@/components/CreateVehicleModal';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, PlusIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import EditVehicleModal from '@/components/EditVehicleModal';
import MaintenanceModal from '@/components/MaintenanceModal';

export default function VehiclesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [maintenanceVehicle, setMaintenanceVehicle] = useState<any>(null);
  
  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['vehicles', search, status],
    queryFn: () => getVehicles({ search, status: status || undefined }),
  });

  return (
    <div className="p-4 md:p-12 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <h1 className="text-5xl font-bold tracking-tight text-white leading-none">Vehicle <span className="gradient-text">Fleet</span></h1>
          <p className="text-text-dim text-lg">Monitor and manage all company assets in real-time.</p>
        </motion.div>
        {user?.role !== 'FLEET_STAFF' && (
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <PlusIcon className="w-5 h-5" />
            Register Vehicle
          </motion.button>
        )}
      </div>

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1 group">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by plate, make, or model..." 
            className="input-field w-full pl-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="relative group min-w-[180px]">
            <AdjustmentsHorizontalIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
            <select 
              className="input-field w-full pl-12 appearance-none cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[400px] bg-surface rounded-[2rem] animate-pulse"></div>
            ))}
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass border-red-500/20 p-12 rounded-[2rem] text-center space-y-4"
          >
            <p className="text-red-400 text-xl font-bold">Connection lost</p>
            <p className="text-text-dim">Failed to load vehicle data. Please verify your network connection.</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary inline-flex mt-4"
            >
              Retry Connection
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <VehicleTable 
              vehicles={vehicles || []} 
              onEdit={(v) => { setSelectedVehicle(v); setIsEditModalOpen(true); }}
              onMaintenance={(v) => setMaintenanceVehicle(v)}
            />
            
            {maintenanceVehicle && (
              <MaintenanceModal 
                vehicleId={maintenanceVehicle.id}
                vehicleName={`${maintenanceVehicle.make} ${maintenanceVehicle.model}`}
                isOpen={!!maintenanceVehicle}
                onClose={() => setMaintenanceVehicle(null)}
              />
            )}

            {selectedVehicle && user?.role !== 'FLEET_STAFF' && (
              <EditVehicleModal 
                vehicle={selectedVehicle}
                isOpen={isEditModalOpen}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setSelectedVehicle(null);
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <CreateVehicleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
