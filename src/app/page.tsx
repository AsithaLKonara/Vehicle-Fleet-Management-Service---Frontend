'use client';

import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/services/dashboardService';
import StatCard from '@/components/StatCard';
import { 
  UsersIcon, 
  TruckIcon, 
  ClipboardDocumentCheckIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getStats,
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-surface rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-surface rounded-2xl"></div>
          ))}
        </div>
        <div className="h-64 bg-surface rounded-2xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-400">
        <p>Failed to load dashboard metrics. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white">Operational Overview</h1>
        <p className="text-text-dim mt-2">Real-time metrics for your vehicle fleet and workforce.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={<UsersIcon className="w-6 h-6" />} 
          color="primary"
        />
        <StatCard 
          title="Total Vehicles" 
          value={stats?.totalVehicles || 0} 
          icon={<TruckIcon className="w-6 h-6" />} 
          color="primary"
        />
        <StatCard 
          title="Active Assignments" 
          value={stats?.activeAssignments || 0} 
          icon={<ClipboardDocumentCheckIcon className="w-6 h-6" />} 
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-2xl space-y-6">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-white">Vehicle Status Distribution</h2>
          </div>
          
          <div className="space-y-4">
            {stats?.statusDistribution.map((item) => (
              <div key={item.status} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-dim uppercase tracking-wider">{item.status}</span>
                  <span className="text-white font-bold">{item.count}</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${(item.count / (stats.totalVehicles || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-full bg-primary/10">
            <TruckIcon className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white">Ready for Operations</h2>
          <p className="text-text-dim max-w-xs">
            All systems are running smoothly. Access your modules using the navigation menu.
          </p>
        </div>
      </div>
    </div>
  );
}
