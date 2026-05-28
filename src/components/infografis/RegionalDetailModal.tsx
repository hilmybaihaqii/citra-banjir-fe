"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, Building2, AlertTriangle, UserMinus, ActivitySquare, Waves } from "lucide-react";
import { RegionData } from "./MapInformasi"; 

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  unit?: string;
}

const StatCard = ({ label, value, icon: Icon, unit }: StatCardProps) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center gap-1.5 text-slate-500">
      <Icon size={14} strokeWidth={2.5} />
      <span className="text-[9px] font-bold tracking-widest uppercase">
        {label}
      </span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        {value || "0"}
      </span>
      {unit && <span className="text-[10px] font-medium text-slate-500">{unit}</span>}
    </div>
  </div>
);

const formatCommas = (num: number) => num.toLocaleString('id-ID');

export const RegionalDetailModal = ({ 
  data, 
  onClose 
}: { 
  data: RegionData | null, 
  onClose: () => void 
}) => {
  if (!data) return null;

  const getStatusColor = (status: string) => {
    if (status === "RAWAN_BANJIR") return "bg-rose-100 text-rose-700";
    return "bg-emerald-100 text-emerald-700";
  };

  return (
    <AnimatePresence>
      {data && (
        <div className="fixed inset-0 z-600 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose} 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
          >
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
              <button 
                onClick={onClose} 
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
              
              <div className="flex flex-col items-start gap-2">
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${getStatusColor(data.alertStatus)}`}>
                  Status: {data.alertStatus.replace("_", " ")}
                </div>
                
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase">
                    {data.regionName}
                  </h2>
                  <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                    Rincian Dampak Wilayah
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto custom-scrollbar p-6 space-y-6">
              
              {(data.deathCount > 0 || data.injuredCount > 0) && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex flex-col relative overflow-hidden">
                    <div className="relative z-10">
                      <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-rose-600 mb-1">
                        <UserMinus size={12} /> Meninggal
                      </span>
                      <span className="text-3xl font-bold text-rose-700">{formatCommas(data.deathCount)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex flex-col">
                    <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-amber-600 mb-1">
                      <ActivitySquare size={12} /> Luka-luka
                    </span>
                    <span className="text-3xl font-bold text-amber-700">{formatCommas(data.injuredCount)}</span>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">
                  Dampak Warga
                </h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4">
                  <div className="col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Home size={20} className="text-blue-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Kepala Keluarga</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{formatCommas(data.familyCount)} <span className="text-xs font-normal text-slate-500">KK</span></span>
                  </div>
                  <div className="col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-slate-600">
                      <AlertTriangle size={20} className="text-amber-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Warga Mengungsi</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{formatCommas(data.evacueeCount)} <span className="text-xs font-normal text-slate-500">Jiwa</span></span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">
                  Kerusakan Infrastruktur
                </h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <StatCard label="Rumah Terendam" value={formatCommas(data.submergedHouses)} icon={Waves} unit="Unit" />
                  <StatCard label="Rumah Rusak Parah" value={formatCommas(data.heavilyDamagedHouses)} icon={Home} unit="Unit" />
                  <StatCard label="Fasilitas Umum" value={formatCommas(data.damagedPublicFacilities)} icon={Building2} unit="Unit" />
                  <StatCard label="Tempat Ibadah" value={formatCommas(data.damagedWorshipPlaces)} icon={Building2} unit="Unit" />
                </div>
              </div>

            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 shrink-0 flex justify-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Data diperbarui secara real-time dari Server
              </p>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};