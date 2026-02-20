"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, ShieldAlert, X, Users, Home, Building2, MapPin, AlertTriangle } from "lucide-react";

interface MapModalsProps {
  activeModal: "data" | "dampak" | null;
  onClose: () => void;
}

export const MapModals = ({ activeModal, onClose }: MapModalsProps) => {
  return (
    <AnimatePresence>
      {activeModal && (
        <div className="fixed inset-0 z-500 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-blue-950/60 backdrop-blur-sm cursor-pointer" />
          
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors z-10"><X size={16} strokeWidth={3} /></button>

            {activeModal === "data" && (
              <div>
                <div className="bg-blue-50 px-6 py-5 border-b border-blue-100/50">
                  <div className="flex items-center gap-3 text-blue-600 mb-1"><BarChart3 size={20} strokeWidth={2.5} /><h2 className="text-lg font-black text-blue-950 tracking-tight">Data Kejadian Banjir</h2></div>
                  <p className="text-xs text-slate-500 font-medium">Rekapitulasi total kejadian di wilayah pantauan.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0"><AlertTriangle size={24} /></div>
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Insiden</p><p className="text-2xl font-black text-slate-800">24 <span className="text-sm font-semibold text-slate-500">Kejadian</span></p></div>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 shrink-0"><MapPin size={24} /></div>
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Desa Terdampak</p><p className="text-2xl font-black text-slate-800">18 <span className="text-sm font-semibold text-slate-500">Desa</span></p></div>
                  </div>
                </div>
              </div>
            )}

            {activeModal === "dampak" && (
              <div>
                <div className="bg-amber-50 px-6 py-5 border-b border-amber-100/50">
                  <div className="flex items-center gap-3 text-amber-600 mb-1"><ShieldAlert size={20} strokeWidth={2.5} /><h2 className="text-lg font-black text-blue-950 tracking-tight">Dampak Kejadian</h2></div>
                  <p className="text-xs text-slate-500 font-medium">Estimasi kerugian dan korban dari kejadian banjir.</p>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center"><Users size={24} className="text-rose-500 mb-2" /><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Korban Jiwa</p><p className="text-xl font-black text-slate-800">0</p></div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center"><Users size={24} className="text-orange-500 mb-2" /><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mengungsi</p><p className="text-xl font-black text-slate-800">1.250</p></div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center"><Home size={24} className="text-blue-500 mb-2" /><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rumah Terendam</p><p className="text-xl font-black text-slate-800">850</p></div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center"><Building2 size={24} className="text-slate-500 mb-2" /><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fasilitas Rusak</p><p className="text-xl font-black text-slate-800">12</p></div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};