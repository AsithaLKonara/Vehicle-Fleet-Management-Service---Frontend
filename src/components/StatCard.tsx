import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'primary' }) => {
  return (
    <div className="glass p-6 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-all cursor-default">
      <div>
        <p className="text-text-dim text-sm font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
