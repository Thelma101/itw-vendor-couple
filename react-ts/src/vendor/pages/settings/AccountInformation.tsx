import React from 'react';
import { VendorCard } from '@/vendor/components/ui/VendorCard';
import { PhotoCamera, Save } from '@mui/icons-material';

export default function AccountInformation() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Account Information</h1>
        <p className="text-slate-500 mt-1">Update your personal details and business profile.</p>
      </div>

      <VendorCard>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-teal-50">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
              <button className="absolute bottom-0 inset-x-0 bg-slate-900/60 p-2 text-white hover:bg-slate-900/80 transition-colors">
                <PhotoCamera fontSize="small" className="mx-auto" />
              </button>
            </div>
            <p className="text-sm font-medium text-slate-500">JPG or PNG no larger than 5MB</p>
          </div>

          <div className="flex-1 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">First Name</label>
                <input type="text" defaultValue="John" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Last Name</label>
                <input type="text" defaultValue="Doe" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Business Name</label>
              <input type="text" defaultValue="JD Photography" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input type="email" defaultValue="john.doe@example.com" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 text-slate-500" disabled />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Phone Number</label>
              <input type="tel" defaultValue="+234 801 234 5678" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Business Description</label>
              <textarea rows={4} defaultValue="Award winning photography studio based in Lagos." className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none"></textarea>
            </div>

            <div className="pt-4 flex justify-end">
              <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all active:scale-95">
                <Save fontSize="small" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </VendorCard>
    </div>
  );
}
