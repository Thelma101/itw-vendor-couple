import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VendorCard } from '@/vendor/components/ui/VendorCard';
import { Save, Lock, VpnKey } from '@mui/icons-material';

export default function SecurityPage() {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto space-y-6 md:space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Security</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Update your password and secure your account.</p>
        </div>
      </motion.div>

      <VendorCard>
        <div className="space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
              <VpnKey className="text-teal-600" fontSize="small" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Change Password</h3>
              <p className="text-sm text-slate-500">Ensure your account uses a long, unique password.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Current Password</label>
              <input type="password" name="oldPassword" value={passwords.oldPassword} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500/20 font-sans" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">New Password</label>
              <input type="password" name="newPassword" value={passwords.newPassword} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500/20 font-sans" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
              <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500/20 font-sans" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <button className="flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all active:scale-95 w-full sm:w-auto">
              <Save fontSize="small" />
              <span>Update Password</span>
            </button>
          </div>
        </div>
      </VendorCard>
    </div>
  );
}
