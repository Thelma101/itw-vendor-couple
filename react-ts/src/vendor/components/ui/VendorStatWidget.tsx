import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface VendorStatWidgetProps {
  title: string;
  value: string;
  trendValue: string;
  trendDirection: 'up' | 'down' | 'neutral';
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  delay?: number;
}

export function VendorStatWidget({
  title,
  value,
  trendValue,
  trendDirection,
  icon,
  iconBgColor,
  iconColor,
  delay = 0,
}: VendorStatWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
    >
      {/* Decorative gradient blob */}
      <div 
        className={clsx(
          "absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-500",
          iconBgColor
        )}
      />

      <div className="flex justify-between items-start mb-4">
        <div 
          className={clsx(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            iconBgColor,
            iconColor
          )}
        >
          {icon}
        </div>
        <div className={clsx(
          "flex items-center space-x-1 text-sm font-semibold px-2 py-1 rounded-full",
          trendDirection === 'up' ? "bg-emerald-50 text-emerald-600" : 
          trendDirection === 'down' ? "bg-rose-50 text-rose-600" : 
          "bg-slate-50 text-slate-600"
        )}>
          {trendDirection === 'up' && <TrendingUp sx={{ fontSize: 16 }} />}
          {trendDirection === 'down' && <TrendingDown sx={{ fontSize: 16 }} />}
          <span>{trendValue}</span>
        </div>
      </div>
      
      <div>
        <h4 className="text-slate-500 text-sm font-medium mb-1 font-sans">{title}</h4>
        <h2 className="text-3xl font-bold text-slate-800 font-sans tracking-tight">{value}</h2>
      </div>
    </motion.div>
  );
}
