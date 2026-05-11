'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssignments, returnVehicle } from '@/services/assignmentService';
import AssignmentTable from '@/components/AssignmentTable';
import CreateAssignmentModal from '@/components/CreateAssignmentModal';

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
    if (confirm('Are you sure you want to mark this vehicle as returned?')) {
      returnMutation.mutate(id);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Assignments</h1>
          <p className="text-text-dim mt-2">Manage vehicle distributions and track usage history.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          New Assignment
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 animate-pulse">
          <div className="h-64 bg-surface rounded-xl"></div>
        </div>
      ) : error ? (
        <div className="glass border-red-500/50 p-6 rounded-xl text-red-400">
          <p>Failed to load assignments. Please try again later.</p>
        </div>
      ) : (
        <AssignmentTable 
          assignments={assignments || []} 
          onReturn={handleReturn}
        />
      )}

      <CreateAssignmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
