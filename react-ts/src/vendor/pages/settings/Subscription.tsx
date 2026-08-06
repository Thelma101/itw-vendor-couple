import React from 'react';
import { VendorCard } from '@/vendor/components/ui/VendorCard';
import { Check, Star } from '@mui/icons-material';

export default function Subscription() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Your Plan</h1>
        <p className="text-slate-500 mt-1">Manage your subscription and billing cycle.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <VendorCard>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Free Tier</h3>
              <p className="text-sm text-slate-500">Essential tools for starters</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-6">?0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-slate-600 text-sm"><Check className="w-4 h-4 text-emerald-500" /> Basic profile listing</li>
            <li className="flex items-center gap-2 text-slate-600 text-sm"><Check className="w-4 h-4 text-emerald-500" /> Up to 5 portfolio images</li>
            <li className="flex items-center gap-2 text-slate-600 text-sm"><Check className="w-4 h-4 text-emerald-500" /> Standard lead notifications</li>
          </ul>
          <button className="w-full py-2.5 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
            Current Plan
          </button>
        </VendorCard>

        <VendorCard className="relative overflow-hidden border-2 border-teal-500 bg-teal-50/30">
          <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            RECOMMENDED
          </div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-teal-800 flex items-center gap-2">
                <Star className="text-amber-400" fontSize="small" /> Premium
              </h3>
              <p className="text-sm text-teal-600/80">For growing businesses</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-teal-900 mb-6">?15,000<span className="text-lg text-teal-600/80 font-normal">/mo</span></div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-slate-700 text-sm"><Check className="w-4 h-4 text-teal-500" /> Priority search placement</li>
            <li className="flex items-center gap-2 text-slate-700 text-sm"><Check className="w-4 h-4 text-teal-500" /> Unlimited portfolio uploads</li>
            <li className="flex items-center gap-2 text-slate-700 text-sm"><Check className="w-4 h-4 text-teal-500" /> Advanced analytics</li>
            <li className="flex items-center gap-2 text-slate-700 text-sm"><Check className="w-4 h-4 text-teal-500" /> Custom booking forms</li>
          </ul>
          <button className="w-full py-2.5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 shadow-sm transition-colors active:scale-95">
            Upgrade to Premium
          </button>
        </VendorCard>
      </div>
    </div>
  );
}
