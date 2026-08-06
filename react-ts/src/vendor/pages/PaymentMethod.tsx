import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VendorCard } from '@/vendor/components/ui/VendorCard';
import clsx from 'clsx';
import { AccountBalanceWallet, CreditCard, Receipt, ArrowBack, VerifiedUser, AccountBalance, ErrorOutline, Public } from '@mui/icons-material';

export default function PaymentMethod() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center bg-teal-50 text-teal-800 p-4 rounded-xl border border-teal-100 mb-6 shadow-sm">
         <div className="flex items-center space-x-3">
           <Public />
           <div>
             <h3 className="font-bold">Ready to see how clients view you?</h3>
             <p className="text-sm opacity-90">Preview your public storefront profile across the platform.</p>
           </div>
         </div>
         <button onClick={() => setShowPreviewModal(true)} className="px-5 py-2 bg-teal-600 text-white hover:bg-teal-700 font-bold rounded-lg transition-colors text-sm shadow-sm active:scale-95">
           Preview Profile
         </button>
      </div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Payment Setup</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard />, desc: 'Visa, Mastercard, Verve etc.' },
          { id: 'bank', name: 'Bank Transfer', icon: <AccountBalance />, desc: 'Direct secure transfer' },
          { id: 'paystack', name: 'Paystack', icon: <AccountBalanceWallet />, desc: 'Pay safely with Paystack' },
          { id: 'flutterwave', name: 'Flutterwave', icon: <Receipt />, desc: 'Pay via Flutterwave' }
        ].map((method) => (
          <div
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={clsx(
              "p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between",
              selectedMethod === method.id 
                ? "border-teal-500 bg-teal-50 shadow-sm" 
                : "border-slate-200 bg-white hover:border-teal-200 hover:bg-slate-50"
            )}
          >
            <div className="flex items-center space-x-4">
              <div className={clsx("p-2 rounded-lg", selectedMethod === method.id ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500")}>
                {method.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{method.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{method.desc}</p>
              </div>
            </div>
            <div className={clsx("w-5 h-5 rounded-full border-2 flex items-center justify-center", selectedMethod === method.id ? "border-teal-500" : "border-slate-300")}>
              {selectedMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedMethod === 'card' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
             <div className="bg-white p-6 rounded-xl border border-slate-200 mt-4 space-y-4 shadow-sm">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Card Number</label>
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Expiry (MM/YY)</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">CVV</label>
                    <input type="text" placeholder="123" className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 font-mono" />
                  </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] mt-6 flex items-center justify-center">
        <VerifiedUser fontSize="small" className="mr-2" /> Verify Payment Method
      </button>

      {/* Public Profile Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h2 className="font-bold text-slate-800 flex items-center"><Public className="mr-2 text-teal-600" /> Vendor Public Profile Preview</h2>
                 <button onClick={() => setShowPreviewModal(false)} className="text-slate-500 hover:bg-slate-200 p-2 rounded-lg font-semibold text-sm">Close Preview</button>
               </div>
               <div className="p-6 overflow-y-auto bg-slate-100 flex-1">
                 {/* Fake Profile View */}
                 <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <div className="h-48 bg-gradient-to-r from-teal-700 to-teal-900 relative">
                       <div className="absolute inset-0 bg-black/20" />
                    </div>
                    <div className="px-6 pb-6 relative">
                       <img src="https://i.pravatar.cc/150?img=5" className="w-24 h-24 rounded-full border-4 border-white absolute -top-12 left-6 object-cover shadow-sm" alt=""/>
                       <div className="ml-32 mt-4 flex justify-between items-start">
                         <div>
                            <h1 className="text-2xl font-black text-slate-800">Itheewed Events</h1>
                            <p className="text-sm font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded inline-block mt-1">Wedding Planner</p>
                            <p className="text-sm text-slate-500 mt-2 max-w-md">Creating magical contemporary wedding experiences across Nigeria. We specialize in intimate luxury setups and full coordinated spectacles.</p>
                         </div>
                         <button className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg cursor-not-allowed opacity-50">Contact Vendor</button>
                       </div>
                    </div>
                 </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
