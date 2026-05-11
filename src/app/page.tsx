'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  TruckIcon, 
  UsersIcon, 
  ClipboardDocumentCheckIcon, 
  ChartBarIcon, 
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  const features = [
    {
      title: 'Fleet Tracking',
      description: 'Real-time monitoring of vehicle locations and status across your entire operation.',
      icon: TruckIcon,
    },
    {
      title: 'Assignment Management',
      description: 'Conflict-free scheduling and driver assignments with automated history tracking.',
      icon: ClipboardDocumentCheckIcon,
    },
    {
      title: 'Real-time Analytics',
      description: 'Interactive dashboards providing deep insights into fleet utilization and performance.',
      icon: ChartBarIcon,
    },
    {
      title: 'Audit Logging',
      description: 'Enterprise-grade security with full traceability for every action taken in the system.',
      icon: ShieldCheckIcon,
    },
    {
      title: 'Maintenance Tracking',
      description: 'Stay ahead of repairs with automated maintenance status updates and history.',
      icon: WrenchScrewdriverIcon,
    },
    {
      title: 'Role-Based Access',
      description: 'Granular permissions ensuring every team member has the right level of access.',
      icon: UsersIcon,
    },
  ];

  const stats = [
    { label: 'Active Vehicles', value: '500+' },
    { label: 'Assignments Completed', value: '12k+' },
    { label: 'Drivers Managed', value: '1.2k+' },
    { label: 'System Reliability', value: '99.9%' },
  ];

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-[100] glass-light border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-primary/30">U</div>
          <span className="text-2xl font-bold tracking-tight text-white">UltraDrive</span>
        </div>
        <div className="flex items-center gap-6">
          {user ? (
            <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="text-text-dim hover:text-white transition-colors font-medium">Login</Link>
              <Link href="/login" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/fleet_hero_background_1778484577272.png" 
            alt="UltraDrive Hero" 
            fill 
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/80 via-transparent to-background"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm font-bold tracking-widest uppercase mb-4">
              Next-Gen Fleet Management
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-tight">
              Enterprise Fleet <br/> 
              <span className="gradient-text">Operations Simplified</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-dim max-w-2xl mx-auto mt-6 leading-relaxed">
              Manage vehicles, drivers, and assignments with precision. UltraDrive brings clarity and efficiency to your complex operations.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col md:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Link href={user ? "/dashboard" : "/login"} className="btn-primary py-4 px-10 text-lg group">
              Start Managing Now
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="glass-light hover:bg-white/10 text-white font-semibold py-4 px-10 rounded-xl transition-all duration-300">
              Watch Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-2"
              >
                <p className="text-4xl md:text-6xl font-bold text-white tracking-tighter">{stat.value}</p>
                <p className="text-text-muted font-medium uppercase tracking-widest text-xs md:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Everything you need for <span className="gradient-text">Smarter Operations</span></h2>
            <p className="text-lg text-text-dim">UltraDrive provides a complete set of tools designed for high-performance fleet teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="glass p-8 rounded-3xl group transition-all duration-500 hover:shadow-primary/10"
              >
                <div className="w-14 h-14 bg-surface-light rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-500 shadow-inner">
                  <feature.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-text-dim leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="glass p-12 md:p-24 rounded-[3rem] space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-cyan/10 blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
            
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">Ready to scale your <span className="gradient-text">Fleet Operations?</span></h2>
            <p className="text-xl text-text-dim max-w-2xl mx-auto">Join hundreds of companies managing their fleet with UltraDrive. Get started in minutes.</p>
            <div className="pt-4">
              <Link href="/login" className="btn-primary py-5 px-12 text-xl inline-flex">
                Create Free Account
                <ArrowRightIcon className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 relative z-10 bg-background">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">U</div>
              <span className="text-xl font-bold tracking-tight text-white">UltraDrive</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              Leading the future of commercial fleet management with intelligent operations and real-time visibility.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Product</h4>
            <ul className="space-y-4 text-text-muted text-sm font-medium">
              <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-4 text-text-muted text-sm font-medium">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'React', 'Prisma', 'Tailwind', 'PostgreSQL', 'Framer Motion'].map(tech => (
                <span key={tech} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-xs text-text-muted font-medium">{tech}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-xs">© 2026 UltraDrive Operations Inc. All rights reserved.</p>
          <div className="flex gap-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {/* Social Icons Placeholder */}
          </div>
        </div>
      </footer>
    </div>
  );
}
