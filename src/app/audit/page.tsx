'use client';

import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '@/services/auditService';
import { format } from 'date-fns';

export default function AuditLogPage() {
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: getAuditLogs,
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white">Audit Logs</h1>
        <p className="text-text-dim mt-2">Historical record of system activities and data mutations.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-surface rounded-xl"></div>
          ))}
        </div>
      ) : error ? (
        <div className="glass border-red-500/50 p-6 rounded-xl text-red-400">
          <p>Failed to load audit logs. Administrative privileges required.</p>
        </div>
      ) : (
        <div className="overflow-hidden glass rounded-2xl border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-text-dim text-xs uppercase tracking-widest border-b border-white/10">
                <th className="px-6 py-4 font-bold">Timestamp</th>
                <th className="px-6 py-4 font-bold">Performer</th>
                <th className="px-6 py-4 font-bold">Action</th>
                <th className="px-6 py-4 font-bold">Entity</th>
                <th className="px-6 py-4 font-bold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {logs?.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-text-dim whitespace-nowrap">
                    {format(new Date(log.createdAt), 'MMM d, HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{log.user.name}</span>
                      <span className="text-xs text-text-dim">{log.user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-tighter ${
                      log.action === 'CREATE' ? 'bg-green-500/20 text-green-400' :
                      log.action === 'UPDATE' ? 'bg-blue-500/20 text-blue-400' :
                      log.action === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                      'bg-white/10 text-white'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {log.entity}
                    <p className="text-[10px] text-text-dim font-mono truncate max-w-[100px]">
                      {log.entityId}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate text-xs text-text-dim group-hover:text-white transition-colors">
                      {JSON.stringify(log.metadata)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
