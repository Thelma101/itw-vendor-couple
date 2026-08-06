import React from 'react';
import { VendorCard } from '@/vendor/components/ui/VendorCard';
import { CloudUpload, Delete, Visibility } from '@mui/icons-material';

const photos = [
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
];

export default function Gallery() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Portfolio Gallery</h1>
          <p className="text-slate-500 mt-1">Showcase your best work to potential clients.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all active:scale-95">
          <CloudUpload fontSize="small" />
          <span>Upload Media</span>
        </button>
      </div>

      <VendorCard noPadding className="p-6 border-dashed border-2 border-slate-200 bg-slate-50 text-center mb-8">
        <CloudUpload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-700">Drag and drop files here</h3>
        <p className="text-sm text-slate-500 mt-1">Supports JPG, PNG, MP4 up to 50MB</p>
      </VendorCard>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((src, i) => (
          <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
            <img 
              src={src} 
              alt={`Portfolio ${i}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <button className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-md transition-colors">
                <Visibility />
              </button>
              <button className="p-2 bg-white/20 hover:bg-rose-500/80 rounded-full text-white backdrop-blur-md transition-colors">
                <Delete />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
