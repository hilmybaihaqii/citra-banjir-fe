"use client";

import React from 'react';
import { Clock } from 'lucide-react';

export const OperationalInfo = () => {
  return (
    <div className="bg-slate-50 p-8 border border-slate-100 relative overflow-hidden group rounded-sm shadow-sm">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

      <div className="flex items-center gap-3 mb-8 text-slate-900">
         <Clock size={20} />
         <span className="text-xs font-bold uppercase tracking-widest">Waktu Operasional</span>
      </div>
      
      <div className="space-y-8 relative z-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Layanan Administratif</p>
          <p className="text-xl font-medium text-slate-900">Senin - Jumat</p>
          <p className="text-slate-500 text-sm mt-1">08:00 - 16:00 WIB</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Pusdalops / Tanggap Darurat</p>
          <p className="text-xl font-medium text-slate-900">Setiap Hari</p>
          <div className="flex items-center gap-2 mt-1">
             <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
             <p className="text-emerald-600 font-medium text-sm">Aktif 24 Jam</p>
          </div>
        </div>
      </div>
    </div>
  );
};