'use client';

import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '@/services/auditService';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, ClockIcon, UserIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function AuditLogPage() {
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: getAuditLogs,
  });

  return (
    <div className="p-4 md:p-12 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight text-white leading-none">Audit <span className="gradient-text">History</span></h1>
          <p className="text-text-dim text-lg font-medium">Full traceability for every administrative action and system mutation.</p>
        </div>
        <button className="glass-light hover:bg-white/10 py-3 px-6 rounded-2xl text-white font-medium transition-all flex items-center gap-2">
          <ArrowPathIcon className="w-5 h-5" />
          Refresh Stream
        </button>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-24 bg-surface rounded-3xl"></div>
          ))}
        </div>
      ) : error ? (
        <div className="glass border-red-500/20 p-12 rounded-[2.5rem] text-center space-y-4">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheckIcon className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Access Denied</h2>
          <p className="text-text-dim max-w-md mx-auto">This log repository contains sensitive operational data. Only administrative operators with direct clearance can view this stream.</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {logs?.map((log, idx) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/20 transition-all group flex flex-col md:flex-row items-center gap-8"
            >
              <div className="flex items-center gap-6 flex-1 w-full md:w-auto">
                {/* Status Indicator */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  log.action === 'CREATE' ? 'bg-green-500/10 text-green-400' :
                  log.action === 'UPDATE' ? 'bg-blue-500/10 text-blue-400' :
                  log.action === 'DELETE' ? 'bg-red-500/10 text-red-400' :
                  'bg-white/5 text-white'
                }`}>
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>

                <div className="flex-1 space-y-1 overflow-hidden">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black tracking-widest uppercase border ${
                      log.action === 'CREATE' ? 'border-green-500/20 text-green-400' :
                      log.action === 'UPDATE' ? 'border-blue-500/20 text-blue-400' :
                      log.action === 'DELETE' ? 'border-red-500/20 text-red-400' :
                      'border-white/10 text-white'
                    }`}>
                      {log.action}
                    </span>
                    <h3 className="text-white font-bold tracking-tight text-lg">{log.entity} <span className="text-text-muted font-normal text-sm opacity-50">#{log.entityId.slice(0, 8)}</span></h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-text-dim font-medium">
                    <div className="flex items-center gap-1.5">
                      <UserIcon className="w-4 h-4 opacity-50" />
                      {log.user.name}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="w-4 h-4 opacity-50" />
                      {format(new Date(log.createdAt), 'MMM d, HH:mm:ss')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata Preview */}
              <div className="w-full md:w-72 bg-black/20 p-4 rounded-2xl border border-white/5 group-hover:border-primary/10 transition-colors">
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Metadata payload</p>
                 <div className="text-[11px] font-mono text-text-dim group-hover:text-white/80 transition-colors line-clamp-2 break-all">
                    {JSON.stringify(log.metadata)}
                 </div>
              </div>
            </motion.div>
          ))}

          {logs?.length === 0 && (
            <div className="py-24 text-center space-y-4">
              <div className="w-20 h-20 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-6">
                <ClockIcon className="w-10 h-10 text-text-muted" />
              </div>
              <h3 className="text-2xl font-bold text-white">No activity recorded</h3>
              <p className="text-text-dim">Your operational stream is currently quiet.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
