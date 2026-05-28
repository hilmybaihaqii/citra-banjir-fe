"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, ShieldCheck, AlertTriangle } from "lucide-react";

// Struktur data terpadu hasil output Model Stacking AI
export interface IntegratedPrediction {
  id: string | number;
  area: string;
  status: "normal" | "waspada" | "siaga" | "awas";
  date: string;
  rainfall: string;
  temp: string;
  wind: string;
  postName: string;
  waterDischarge: string;
  waterLevel: string;
  coords: [number, number];
  isFloodPredicted: boolean;
}

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: IntegratedPrediction[]; // Resmi menerima lemparan data dari server
}

// --- KOMKOMPEN KARTU WILAYAH ---
const RegionCard = ({ region }: { region: IntegratedPrediction }) => {
  const isNormal = region.status === "normal";

  return (
    <div className={`shrink-0 w-[300px] sm:w-[340px] flex flex-col bg-white border rounded-xl shadow-sm transition-all snap-center ${
      isNormal ? 'border-slate-200' : 'border-red-200 shadow-sm'
    }`}>
      
      {/* CARD HEADER */}
      <div className="p-6 flex justify-between items-start">
        <div className="flex flex-col gap-1 w-2/3">
          <h3 className="text-lg font-bold text-slate-900 leading-none truncate">{region.area}</h3>
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mt-1">{region.date}</p>
        </div>
        <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${
          isNormal ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {isNormal ? <ShieldCheck size={12} /> : <AlertTriangle size={12} />}
          {region.status}
        </div>
      </div>

      <div className="px-6">
        <div className="w-full h-px bg-slate-100"></div>
      </div>

      {/* CARD BODY: DATA LIST */}
      <div className="p-6 flex flex-col gap-4">
        
        {/* Sektor Meteorologi (BMKG) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">Curah Hujan</span>
            <span className="text-sm font-bold text-slate-900">{region.rainfall}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">Suhu Udara</span>
            <span className="text-sm font-bold text-slate-900">{region.temp}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">Kecepatan Angin</span>
            <span className="text-sm font-bold text-slate-900">{region.wind}</span>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100 my-1"></div>

        {/* Sektor Hidrologi (BBWS) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">Pos Pantau</span>
            <span className="text-xs font-bold text-slate-900 text-right truncate max-w-[150px]">{region.postName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">Debit Air</span>
            <span className="text-sm font-bold text-slate-900">{region.waterDischarge}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">Tinggi Muka Air</span>
            <span className="text-sm font-bold text-slate-900">{region.waterLevel}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export const PredictionModal = ({ isOpen, onClose, data }: PredictionModalProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Deteksi jumlah wilayah siaga/tidak aman secara live
  const warningCount = data.filter(d => d.status !== "normal").length;
  const totalCount = data.length;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360; 
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex justify-center items-center p-4 sm:p-6 lg:p-8">
        
        {/* BACKDROP SOLID */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose} 
          className="absolute inset-0 bg-slate-900/70" 
        />
        
        {/* MODAL CONTAINER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.25, ease: [0.2, 0, 0.2, 1] }}
          className="relative w-full max-w-6xl bg-slate-50 rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden max-h-[90dvh]"
        >
          {/* HEADER MODAL */}
          <div className="px-6 py-5 bg-white border-b border-slate-200 flex justify-between items-center shrink-0 z-10">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-lg md:text-xl font-bold text-slate-900">
                Prediksi Risiko AI & Status Wilayah
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{totalCount} Lokasi Total</span>
                <span className="text-[10px] text-slate-300">•</span>
                <span className={`text-[11px] font-bold uppercase tracking-widest ${warningCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {warningCount > 0 ? `${warningCount} Titik Potensi Banjir` : 'Semua Titik Aman'}
                </span>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              className="p-2 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {/* HORIZONTAL SCROLL AREA */}
          <div className="relative flex-1 overflow-hidden flex flex-col justify-center min-h-[350px]">
            
            {/* Navigasi Desktop */}
            <button onClick={() => scroll('left')} className="hidden md:flex absolute left-4 lg:left-8 z-10 p-3 bg-white border border-slate-200 text-slate-900 rounded-full shadow-sm hover:bg-slate-50 transition-transform hover:-translate-x-1 focus:outline-none">
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
            <button onClick={() => scroll('right')} className="hidden md:flex absolute right-4 lg:right-8 z-10 p-3 bg-white border border-slate-200 text-slate-900 rounded-full shadow-sm hover:bg-slate-50 transition-transform hover:translate-x-1 focus:outline-none">
              <ChevronRight size={24} strokeWidth={1.5} />
            </button>

            {/* Container Slider Kartu */}
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-5 px-6 py-4 md:px-24 hide-scroll-bar snap-x snap-mandatory"
            >
              {data.length === 0 ? (
                <div className="w-full text-center py-12 text-slate-400 font-medium italic">
                  Tidak ada data log hidrologi aktif yang tersedia untuk diprediksi oleh AI.
                </div>
              ) : (
                data.map((region) => (
                  <RegionCard key={region.id} region={region} />
                ))
              )}
            </div>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            .hide-scroll-bar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .hide-scroll-bar::-webkit-scrollbar {
              display: none;
            }
          `}} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};