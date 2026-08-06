import React from 'react';
import { VendorCard } from '@/vendor/components/ui/VendorCard';
import { Lock, VpnKey, Smartphone } from '@mui/icons-material';

export default function Security() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Security Settings</h1>
        <p className="text-slate-500 mt-1">Keep your account and business data safe.</p>
      </div>

      <div className="space-y-6">
        <VendorCard>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <Lock className="text-slate-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-1">Change Password</h3>
              <p className="text-sm text-slate-500 mb-4">Ensure your password is at least 8 characters long and contains symbols.</p>
              
              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Current Password</label>
                  <input type="password" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">New Password</label>
                  <input type="password" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
                  <input type="password" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all active:scale-95">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </VendorCard>

        <VendorCard>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Smartphone className="text-emerald-600" />
            </div>
            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Two-Factor Authentication (2FA)</h3>
                <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
              </div>
              <button className="bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2 rounded-xl font-bold transition-all">
                Enable 2FA
              </button>
            </div>
          </div>
        </VendorCard>
      </div>
    </div>
  );
}
