import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VendorCard } from '@/vendor/components/ui/VendorCard';
import { TrendingUp, Visibility, People, Event, Star, AttachMoney, TrendingDown } from '@mui/icons-material';
import clsx from 'clsx';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('This Year');

  const stats = [
    { title: 'Total Revenue', value: '₦8.5M', trend: '+15.2%', isUp: true, icon: <AttachMoney /> },
    { title: 'Profile Views', value: '4,289', trend: '+28.4%', isUp: true, icon: <Visibility /> },
    { title: 'New Leads', value: '142', trend: '-5.1%', isUp: false, icon: <People /> },
    { title: 'Bookings', value: '38', trend: '+12.5%', isUp: true, icon: <Event /> },
  ];

  const packages = [
    { name: 'Premium Photography', bookings: 24, revenue: '₦6.0M', percentage: 65 },
    { name: 'Essential Gallery', bookings: 10, revenue: '₦1.5M', percentage: 25 },
    { name: 'Engagement Add-on', bookings: 4, revenue: '₦1.0M', percentage: 10 },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Performance Analytics</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Track your revenue, profile engagement, and conversion rates.</p>
        </div>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-white border border-slate-200 text-sm font-semibold text-slate-700 py-2 px-4 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all"
        >
          <option>This Month</option>
          <option>Last 3 months</option>
          <option>This Year</option>
          <option>All Time</option>
        </select>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <VendorCard key={i} className="flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                {stat.icon}
              </div>
              <div className={clsx("flex items-center text-xs font-bold px-2 py-1 rounded-md", stat.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                {stat.isUp ? <TrendingUp fontSize="inherit" className="mr-1" /> : <TrendingDown fontSize="inherit" className="mr-1" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{stat.title}</p>
              <h2 className="text-2xl font-black text-slate-800">{stat.value}</h2>
            </div>
          </VendorCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VendorCard className="lg:col-span-2 h-[400px] flex flex-col items-center justify-center bg-slate-50 border-dashed">
            <TrendingUp className="text-slate-300 w-16 h-16 mb-2" />
            <p className="text-slate-500 font-medium">Chart visualization placeholder</p>
            <p className="text-xs text-slate-400">Install recharts to view graph</p>
        </VendorCard>

        <VendorCard className="flex flex-col" noPadding>
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-lg">Top Performing Packages</h3>
          </div>
          <div className="flex-1 p-5 space-y-6">
            {packages.map((pkg, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm">{pkg.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{pkg.bookings} Bookings • {pkg.revenue}</p>
                  </div>
                  <span className="text-sm font-bold text-teal-600">{pkg.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: pkg.percentage + '%' }} />
                </div>
              </div>
            ))}
          </div>
        </VendorCard>
      </div>
    </div>
  );
}
