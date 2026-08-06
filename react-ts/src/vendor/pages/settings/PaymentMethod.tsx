import React from 'react';
import { VendorCard } from '@/vendor/components/ui/VendorCard';
import { CreditCard, AccountBalance, Add } from '@mui/icons-material';

export default function PaymentMethod() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Payment Methods</h1>
          <p className="text-slate-500 mt-1">Manage how you get paid and your billing information.</p>
        </div>
        <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all active:scale-95">
          <Add fontSize="small" />
          <span>Add Payout Method</span>
        </button>
      </div>

      <VendorCard>
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <AccountBalance className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Receiving Payouts</h3>
            <p className="text-sm text-slate-500">Your earnings will be sent here.</p>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-500">
              GTB
            </div>
            <div>
              <p className="font-semibold text-slate-800">Guaranty Trust Bank</p>
              <p className="text-sm text-slate-500">**** **** 1234</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Default</span>
            <button className="text-slate-400 hover:text-slate-700 font-medium text-sm transition-colors">Edit</button>
          </div>
        </div>
      </VendorCard>

      <VendorCard>
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="p-3 bg-rose-100 rounded-xl">
            <CreditCard className="text-rose-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Billing Methods</h3>
            <p className="text-sm text-slate-500">Cards used to pay for your platform subscription.</p>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-blue-900 rounded flex items-center justify-center text-xs font-bold text-white italic">
              VISA
            </div>
            <div>
              <p className="font-semibold text-slate-800">Visa ending in 4242</p>
              <p className="text-sm text-slate-500">Expires 12/28</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-700 font-medium text-sm transition-colors">Edit</button>
        </div>
      </VendorCard>
    </div>
  );
}
