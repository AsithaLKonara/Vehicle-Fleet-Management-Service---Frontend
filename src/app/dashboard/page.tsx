'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/services/dashboardService';
import apiClient from '@/lib/apiClient';
import Link from 'next/link';
import { 
  UsersIcon, 
  TruckIcon, 
  ClipboardDocumentCheckIcon, 
  ChartBarIcon,
  ArrowUpIcon,
  BoltIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { Metadata } from 'next';

// This is a client component, metadata cannot be exported here.
// I will keep it in mind for layout or separate page file if needed.
// For now I'll add an internal title via useEffect if needed or just focus on the UI.

const COLORS = ['#8b5cf6', '#22d3ee', '#c084fc', '#f59e0b'];

export default function DashboardPage() {
  const [period, setPeriod] = React.useState('7D');
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getStats,
  });

  const trendData = stats?.utilizationTrends || [];

  if (isLoading) {
    return (
      <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-12 animate-pulse">
        <div className="h-12 w-64 bg-surface rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-surface rounded-[2rem]"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-surface rounded-[2rem]"></div>
          <div className="h-96 bg-surface rounded-[2rem]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="p-6 bg-red-500/10 rounded-full">
          <BoltIcon className="w-12 h-12 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Metrics unavailable</h2>
        <p className="text-text-dim max-w-xs text-center">Failed to connect to the fleet analytics service. Please verify your credentials.</p>
        <button onClick={() => window.location.reload()} className="btn-primary">Retry Sync</button>
      </div>
    );
  }

  const statItems = [
    { label: 'Total Workforce', value: stats?.totalUsers || 0, icon: UsersIcon, trend: '+12%', color: 'purple' },
    { label: 'Fleet Capacity', value: stats?.totalVehicles || 0, icon: TruckIcon, trend: '+5%', color: 'cyan' },
    { label: 'Active Tasks', value: stats?.activeAssignments || 0, icon: ClipboardDocumentCheckIcon, trend: '+18%', color: 'indigo' },
  ];

  const handleExport = async (type: 'vehicles' | 'assignments' | 'audit') => {
    try {
      const response = await apiClient.get(`/reports/${type}/export`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
      // In a real app, I'd show a toast here
    }
  };

  return (
    <div className="p-4 md:p-12 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight text-white leading-none">Operational <span className="gradient-text">Overview</span></h1>
          <p className="text-text-dim text-lg">Real-time intelligence for your fleet and workforce.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <button className="glass-light hover:bg-white/10 py-3 px-6 rounded-2xl text-white font-medium transition-all flex items-center gap-2">
              Export Report
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 glass p-2 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button onClick={() => handleExport('vehicles')} className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-xl text-sm text-white">Fleet Inventory (CSV)</button>
              <button onClick={() => handleExport('assignments')} className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-xl text-sm text-white">Dispatch History (CSV)</button>
              <button onClick={() => handleExport('audit')} className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-xl text-sm text-white">System Audit (CSV)</button>
            </div>
          </div>
          <Link href="/assignments" className="btn-primary">
            New Assignment
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statItems.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-8 rounded-[2rem] relative overflow-hidden group"
          >
            <div className="relative z-10 flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-1 rounded-lg text-xs font-bold">
                  <ArrowUpIcon className="w-3 h-3" />
                  {item.trend}
                </div>
              </div>
              <div>
                <p className="text-text-muted font-bold uppercase tracking-widest text-xs">{item.label}</p>
                <p className="text-5xl font-bold text-white tracking-tighter mt-1">{item.value}</p>
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/20 transition-all"></div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Trend Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass p-10 rounded-[2.5rem] space-y-8"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white tracking-tight">Fleet Utilization Trends</h3>
            <div className="flex gap-2">
              {['7D', '30D', '90D'].map(p => (
                <button 
                  key={p} 
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${period === p ? 'bg-primary text-white' : 'text-text-dim hover:bg-white/5'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#15101f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-10 rounded-[2.5rem] space-y-8"
        >
          <h3 className="text-2xl font-bold text-white tracking-tight">Status Metrics</h3>
          <div className="h-[250px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.statusDistribution.map(s => ({ name: s.status, value: s.count })) || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats?.statusDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#15101f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-3xl font-bold text-white">{stats?.totalVehicles}</span>
               <span className="text-[10px] text-text-dim font-bold uppercase">Vehicles</span>
            </div>
          </div>
          <div className="space-y-4">
            {stats?.statusDistribution && stats.statusDistribution.length > 0 ? (
              stats.statusDistribution.map((item, idx) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-sm font-medium text-text-dim">{item.status}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{item.count}</span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-4 space-y-2 opacity-50">
                <ExclamationCircleIcon className="w-8 h-8 text-text-muted" />
                <p className="text-xs font-bold uppercase tracking-widest text-text-muted">No data available</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
