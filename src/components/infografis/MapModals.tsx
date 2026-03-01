"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LucideIcon, Users, Home, Building2, MapPin, AlertTriangle, ArrowRight } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  unit: string;
  icon: LucideIcon;
}

interface ModalContent {
  title: string;
  subtitle: string;
  stats: StatItem[];
}

const MODAL_DATA: Record<string, ModalContent> = {
  data: {
    title: "Statistik Kejadian",
    subtitle: "Laporan akumulatif wilayah terdampak banjir.",
    stats: [
      { label: "Total Insiden", value: "128", unit: "Lokasi", icon: AlertTriangle },
      { label: "Kecamatan", value: "05", unit: "Wilayah", icon: MapPin },
      { label: "Posko Aktif", value: "12", unit: "Titik", icon: Building2 },
    ]
  },
  dampak: {
    title: "Analisis Dampak",
    subtitle: "Estimasi kerugian dan populasi terdampak.",
    stats: [
      { label: "Terdampak", value: "14.2k", unit: "Jiwa", icon: Users },
      { label: "Terendam", value: "2.8k", unit: "Unit", icon: Home },
      { label: "Rusak Berat", value: "142", unit: "Unit", icon: AlertTriangle },
    ]
  }
};

interface MapModalsProps {
  activeModal: "data" | "dampak" | null;
  onClose: () => void;
}

const StatRow = ({ stat }: { stat: StatItem }) => (
  <div className="group flex items-center justify-between py-3">
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors duration-300">
        <stat.icon size={20} strokeWidth={2} />
      </div>
      <span className="text-[11px] font-bold text-slate-500 tracking-[0.15em] uppercase group-hover:text-slate-700 transition-colors duration-300">
        {stat.label}
      </span>
    </div>
    
    <div className="flex items-baseline gap-1.5">
      <span className="text-3xl font-light tracking-tight text-slate-900">
        {stat.value}
      </span>
      <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
        {stat.unit}
      </span>
    </div>
  </div>
);

export const MapModals = ({ activeModal, onClose }: MapModalsProps) => {
  const content = activeModal ? MODAL_DATA[activeModal] : null;

  return (
    <AnimatePresence>
      {activeModal && content && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose} 
            className="absolute inset-0 bg-slate-900/40 pointer-events-auto" 
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden pointer-events-auto flex flex-col"
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
                  {activeModal === 'data' ? 'Info Center' : 'Impact'}
                </div>
                
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                    {content.title}
                  </h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    {content.subtitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-8 py-2 flex flex-col gap-2">
              {content.stats.map((stat, i) => (
                <StatRow key={i} stat={stat} />
              ))}
            </div>

            <div className="px-8 pb-8 pt-6">
              <button 
                onClick={onClose}
                className="group flex items-center justify-between w-full p-4 rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors duration-300"
              >
                <span className="text-[11px] font-bold text-white tracking-[0.2em] uppercase">
                  Kembali ke Peta
                </span>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};