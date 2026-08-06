import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VendorCard } from '@/vendor/components/ui/VendorCard';
import { CalendarMonth, Settings, DateRange } from '@mui/icons-material';

export default function Availability() {
  const [selectedMonth, setSelectedMonth] = useState('October 2026');

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Availability</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Manage your schedule and block out unavailable dates.</p>
        </div>
        <button className="flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium transition-all active:scale-95 w-full sm:w-auto">
          <Settings fontSize="small" />
          <span>Calendar Settings</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VendorCard className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800 flex items-center"><CalendarMonth className="mr-2 text-teal-600" /> {selectedMonth}</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-slate-100 rounded-lg hover:bg-slate-200 text-sm font-semibold text-slate-600">&lt;</button>
              <button className="px-3 py-1 bg-slate-100 rounded-lg hover:bg-slate-200 text-sm font-semibold text-slate-600">&gt;</button>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl min-h-[400px] flex items-center justify-center border border-dashed border-slate-200">
            <div className="text-center">
              <DateRange className="text-slate-300 w-16 h-16 mx-auto mb-3" />
              <p className="text-slate-500 font-medium font-sans">Full Calendar Component</p>
              <p className="text-xs text-slate-400 mt-1">Integrate react-big-calendar or FullCalendar.</p>
            </div>
          </div>
        </VendorCard>

        <VendorCard>
          <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-3 mb-4">Quick Block</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Select Date</label>
              <input type="date" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500/20 font-sans" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Reason / Label</label>
              <input type="text" placeholder="e.g. Personal Holiday" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500/20 font-sans" />
            </div>
            <button className="w-full py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors mt-2">
              Block Date
            </button>
          </div>

          <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-3 mb-4 mt-8">Sync Calendars</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
              <span className="font-semibold text-slate-700">Google Calendar</span>
              <span className="text-xs font-bold px-2 py-1 bg-teal-50 text-teal-600 rounded">Connected</span>
            </button>
            <button className="w-full px-4 py-3 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
              <span className="font-semibold text-slate-700">Apple Calendar</span>
              <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded">Connect</span>
            </button>
          </div>
        </VendorCard>
      </div>
    </div>
  );
}
