import React from 'react';
import { motion } from 'framer-motion';
import { VendorCard } from '@/vendor/components/ui/VendorCard';
import { LocalOffer, ContentCopy, Add } from '@mui/icons-material';

export default function Promotions() {
  const promotions = [
    { id: 1, code: 'SUMMER2026', discount: '10% OFF', description: 'Applicable to Premium Packages booked before August.', active: true, usage: 12 },
    { id: 2, code: 'EARLYBIRD', discount: '₦50,000 OFF', description: 'Flat discount for bookings made 6+ months in advance.', active: true, usage: 34 },
    { id: 3, code: 'VALENTINE', discount: '15% OFF', description: 'Couples package special.', active: false, usage: 5 },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Promotions & Discounts</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Create special offers to attract more couples.</p>
        </div>
        <button className="flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all active:scale-95 w-full sm:w-auto">
          <Add fontSize="small" />
          <span>New Promo Code</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {promotions.map(promo => (
          <VendorCard key={promo.id} className="relative overflow-hidden group">
            {!promo.active && <div className="absolute inset-0 bg-white/60 z-10 backdrop-blur-[1px]" />}
            <div className="flex justify-between items-start mb-4">
              <div className="bg-teal-50 text-teal-600 p-2.5 rounded-xl">
                <LocalOffer />
              </div>
              <span className="text-2xl font-black text-slate-800">{promo.discount}</span>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2.5 rounded-lg mb-2">
                <span className="font-mono font-bold text-slate-700 tracking-wider flex-1 text-center">{promo.code}</span>
                <button className="text-slate-400 hover:text-teal-600 transition-colors p-1">
                  <ContentCopy fontSize="small" />
                </button>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed min-h-[40px]">{promo.description}</p>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-sm">
              <span className="font-semibold text-slate-600">{promo.usage} Uses</span>
              <span className={promo.active ? "text-emerald-600 font-bold" : "text-rose-500 font-bold"}>
                {promo.active ? 'Active' : 'Expired'}
              </span>
            </div>
          </VendorCard>
        ))}
      </div>
    </div>
  );
}
