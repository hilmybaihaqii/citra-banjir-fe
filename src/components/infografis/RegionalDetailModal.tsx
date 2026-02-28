"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Home, Building2, AlertTriangle } from "lucide-react";
import { KecamatanDetail } from "@/lib/mapData";

// --- Interface ---
interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
}

export const RegionalDetailModal = ({ 
  data, 
  onClose 
}: { 
  data: KecamatanDetail | null, 
  onClose: () => void 
}) => {
  if (!data) return null;

  return (
    <AnimatePresence>
      {data && (
        <div className="fixed inset-0 z-600 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose} 
            className="absolute inset-0 bg-slate-900/40 pointer-events-auto" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden pointer-events-auto flex flex-col"
          >
            <div className="px-8 pt-8 pb-4">
              <button 
                onClick={onClose} 
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
              
              <div className="flex flex-col items-start gap-3">
                <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase">
                  Status: {data.status}
                </div>
                
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                    {data.name}
                  </h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    Laporan detail dampak wilayah.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 grid grid-cols-2 gap-y-8 gap-x-6">
              <StatCard label="Jiwa Terdampak" value={data.stats.jiwaTerdampak} icon={Users} />
              <StatCard label="Rumah Terendam" value={data.stats.rumahTerendam} icon={Home} />
              <StatCard label="Total Pengungsi" value={data.stats.pengungsi} icon={AlertTriangle} />
              <StatCard label="Fasilitas Umum" value={data.stats.fasilitasUmum} icon={Building2} />
            </div>

            <div className="px-8 pb-8 pt-2">
              <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">
                    Total Kerusakan Fisik
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold">
                      {data.stats.rumahRusak} 
                    </span>
                    <span className="text-sm text-slate-400 font-normal">Unit</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <AlertTriangle size={18} className="text-slate-300" strokeWidth={2} />
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const StatCard = ({ label, value, icon: Icon }: StatCardProps) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 text-slate-500">
      <Icon size={16} strokeWidth={2.5} />
      <span className="text-[10px] font-bold tracking-widest uppercase">
        {label}
      </span>
    </div>
    <span className="text-4xl font-light text-slate-900 tracking-tighter">
      {value}
    </span>
  </div>
);