'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  TruckIcon, 
  UserIcon, 
  CalendarIcon, 
  CheckBadgeIcon,
  ArrowPathRoundedSquareIcon,
  ClockIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { Assignment } from '@/services/assignmentService';


interface AssignmentTableProps {
  assignments: Assignment[];
  onReturn: (id: string) => void;
  isProcessing?: boolean;
}

export default function AssignmentTable({ assignments, onReturn, isProcessing }: AssignmentTableProps) {
  return (
    <div className="space-y-4">
      {assignments.map((assignment, idx) => (
        <motion.div
          key={assignment.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="glass p-6 rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all duration-300 group flex flex-col xl:flex-row items-center gap-8"
        >
          {/* Vehicle Info */}
          <div className="flex items-center gap-6 flex-1 min-w-0 w-full xl:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <TruckIcon className="w-8 h-8" />
            </div>
            <div className="overflow-hidden">
              <h3 className="text-xl font-bold text-white tracking-tight truncate">
                {assignment.vehicle.make} {assignment.vehicle.model}
              </h3>
              <div className="flex items-center gap-2 text-text-dim text-sm font-mono mt-1">
                <span className="opacity-60">PLATE:</span>
                <span className="text-primary-light font-bold tracking-widest">{assignment.vehicle.plateNumber}</span>
              </div>
            </div>
          </div>

          {/* Driver & Assignee Info */}
          <div className="flex flex-col md:flex-row items-center gap-8 flex-[1.5] w-full xl:w-auto">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-surface-light to-surface flex items-center justify-center text-text-dim border border-white/5">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-bold text-sm truncate">{assignment.driver.name}</p>
                <p className="text-xs text-text-muted font-medium truncate">{assignment.driver.email}</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
              <ClockIcon className="w-4 h-4 text-text-muted" />
              <div className="text-xs">
                <p className="text-text-muted font-bold uppercase tracking-widest">Dispatched</p>
                <p className="text-white font-bold mt-0.5">{format(new Date(assignment.assignedAt), 'MMM d, HH:mm')}</p>
              </div>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center gap-6 w-full xl:w-auto justify-between xl:justify-end">
            <div className="flex flex-col items-end">
              {assignment.returnedAt ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20">
                  <CheckBadgeIcon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Completed</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                  <ArrowPathRoundedSquareIcon className="w-4 h-4 animate-spin-slow" />
                  <span className="text-[10px] font-black uppercase tracking-widest">In Transit</span>
                </div>
              )}
              {assignment.returnedAt && (
                <p className="text-[10px] text-text-muted font-medium mt-1.5">
                  Returned {format(new Date(assignment.returnedAt), 'MMM d')}
                </p>
              )}
            </div>

            {!assignment.returnedAt && (
              <button 
                onClick={() => onReturn(assignment.id)}
                disabled={isProcessing}
                className="btn-primary py-3 px-6 whitespace-nowrap shadow-none border border-primary/20 hover:shadow-primary/30"
                data-testid={`return-button-${assignment.id}`}
              >
                Mark Returned
              </button>
            )}
          </div>
        </motion.div>
      ))}

      {assignments.length === 0 && (
        <div className="py-32 text-center space-y-6">
          <div className="w-24 h-24 bg-surface-light rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 border border-white/5">
            <ClipboardDocumentListIcon className="w-12 h-12 text-text-muted opacity-40" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-white tracking-tight">Assignment Stream Clear</h3>
            <p className="text-text-dim text-lg">No active dispatch records found in the registry.</p>
          </div>
        </div>
      )}
    </div>
  );
}
