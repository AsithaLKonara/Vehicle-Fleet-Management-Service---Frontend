'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssignments, returnVehicle } from '@/services/assignmentService';
import AssignmentTable from '@/components/AssignmentTable';
import CreateAssignmentModal from '@/components/CreateAssignmentModal';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function AssignmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: assignments, isLoading, error } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAssignments,
  });

  const returnMutation = useMutation({
    mutationFn: returnVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const handleReturn = (id: string) => {
    // We could use a more premium confirmation modal here, but for now we'll stick to a clean UI trigger
    returnMutation.mutate(id);
  };

  return (
    <div className="p-4 md:p-12 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <h1 className="text-5xl font-bold tracking-tight text-white leading-none">Operational <span className="gradient-text">Assignments</span></h1>
          <p className="text-text-dim text-lg font-medium">Coordinate logistics and track real-time asset distribution.</p>
        </motion.div>
        <div className="flex gap-4 w-full md:w-auto">
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex-1 md:flex-none"
          >
            <PlusIcon className="w-5 h-5" />
            Dispatch Vehicle
          </motion.button>
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="h-24 bg-surface rounded-[2rem] animate-pulse"></div>
             ))}
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass border-red-500/20 p-16 rounded-[3rem] text-center space-y-6"
          >
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
               <ExclamationTriangleIcon className="w-12 h-12 text-red-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">Sync Failure</h2>
              <p className="text-text-dim max-w-md mx-auto text-lg">We were unable to establish a secure handshake with the assignment registry. Attempt a manual reconnection.</p>
            </div>
            <button onClick={() => window.location.reload()} className="btn-primary inline-flex gap-2">
              <ArrowPathIcon className="w-5 h-5" />
              Reconnect Registry
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AssignmentTable 
              assignments={assignments || []} 
              onReturn={handleReturn}
              isProcessing={returnMutation.isPending}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <CreateAssignmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
