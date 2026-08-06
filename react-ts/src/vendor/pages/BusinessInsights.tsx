import React from 'react';
import { motion } from 'framer-motion';
import { VendorCard } from '@/vendor/components/ui/VendorCard';
import { Lightbulb, TrendingUp, AutoGraph, Groups } from '@mui/icons-material';

const insights = [
  {
    icon: <Groups className="text-indigo-600" />,
    bg: 'bg-indigo-100',
    title: 'Audience Shift',
    desc: 'You have seen a 25% increase in inquiries from couples planning destination weddings in the last 30 days.'
  },
  {
    icon: <TrendingUp className="text-emerald-600" />,
    bg: 'bg-emerald-100',
    title: 'Pricing Sweet Spot',
    desc: 'Your "Premium Package" has the highest conversion rate (42%). Consider making it your default recommended option.'
  },
  {
    icon: <AutoGraph className="text-amber-600" />,
    bg: 'bg-amber-100',
    title: 'Peak Booking Season',
    desc: 'Based on platform data, users in your region book photographers mostly between October and December.'
  }
];

export default function BusinessInsights() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Initial Insights</h1>
        <p className="text-slate-500 mt-1">AI-driven actionable recommendations for your business.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, idx) => (
          <VendorCard key={idx} hoverEffect className="flex flex-col">
            <div className={"w-12 h-12 rounded-xl flex items-center justify-center mb-4 "}>
              {insight.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{insight.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed flex-1">{insight.desc}</p>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button className="text-teal-600 text-sm font-semibold hover:text-teal-700">Take Action &rarr;</button>
            </div>
          </VendorCard>
        ))}
      </div>

      <VendorCard className="mt-8 bg-gradient-to-br from-slate-900 to-teal-900 text-white border-none">
        <div className="flex flex-col md:flex-row items-center gap-6 p-4">
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
            <Lightbulb className="w-10 h-10 text-amber-300" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">Unlock Deeper Analytics</h2>
            <p className="text-teal-100 max-w-2xl">
              Upgrade to the Premium tier to see exactly what couples are searching for in your area, track competitor pricing, and get predictive demand forecasting.
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-teal-900 font-bold rounded-xl hover:bg-slate-50 transition-colors">
            Upgrade Now
          </button>
        </div>
      </VendorCard>
    </div>
  );
}
