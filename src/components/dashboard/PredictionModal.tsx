"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

export interface RegionPrediction {
  id: string;
  area: string;
  status: "waspada" | "aman";
  date: string;
  rainfall: string;
  temp: string;
  wind: string;
  postName: string;
  waterDischarge: string;
  waterLevel: string;
}

const PREDICTION_DATA: RegionPrediction[] = [
  {
    id: "1",
    area: "Dayeuhkolot",
    status: "waspada",
    date: "7 Mei 2026, 14:00 WIB",
    rainfall: "85 mm/jam",
    temp: "26°C",
    wind: "12 km/jam",
    postName: "Pos Citarum - Dayeuhkolot",
    waterDischarge: "150 m³/s",
    waterLevel: "120 cm",
  },
  {
    id: "2",
    area: "Baleendah",
    status: "waspada",
    date: "7 Mei 2026, 14:00 WIB",
    rainfall: "60 mm/jam",
    temp: "25°C",
    wind: "14 km/jam",
    postName: "Pos Citarum - Baleendah",
    waterDischarge: "135 m³/s",
    waterLevel: "90 cm",
  },
  {
    id: "3",
    area: "Margaasih",
    status: "aman",
    date: "7 Mei 2026, 14:00 WIB",
    rainfall: "15 mm/jam",
    temp: "28°C",
    wind: "8 km/jam",
    postName: "Pos Sungai Margaasih",
    waterDischarge: "45 m³/s",
    waterLevel: "20 cm",
  },
  {
    id: "4",
    area: "Bojongsoang",
    status: "aman",
    date: "7 Mei 2026, 14:00 WIB",
    rainfall: "20 mm/jam",
    temp: "27°C",
    wind: "10 km/jam",
    postName: "Pos Cikapundung",
    waterDischarge: "60 m³/s",
    waterLevel: "40 cm",
  },
  {
    id: "5",
    area: "Majalaya",
    status: "aman",
    date: "7 Mei 2026, 14:00 WIB",
    rainfall: "10 mm/jam",
    temp: "26°C",
    wind: "5 km/jam",
    postName: "Pos Hujan Majalaya",
    waterDischarge: "30 m³/s",
    waterLevel: "15 cm",
  }
];

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- KOMPONEN KARTU WILAYAH (CLEAN & ELEGANT) ---
const RegionCard = ({ region }: { region: RegionPrediction }) => {
  const isWarning = region.status === "waspada";

  return (
    <div className={`shrink-0 w-[300px] sm:w-[340px] flex flex-col bg-white border rounded-xl shadow-sm transition-all snap-center ${
      isWarning ? 'border-red-200' : 'border-slate-200'
    }`}>
      
      {/* CARD HEADER */}
      <div className="p-6 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-slate-900 leading-none">{region.area}</h3>
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">{region.date}</p>
        </div>
        <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
          isWarning ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
          {isWarning ? 'Siaga' : 'Aman'}
        </div>
      </div>

      <div className="px-6">
        <div className="w-full h-px bg-slate-100"></div>
      </div>

      {/* CARD BODY: DATA LIST */}
      <div className="p-6 flex flex-col gap-4">
        
        {/* Meteorologi */}
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

        {/* Hidrologi */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">Pos Pantau</span>
            <span className="text-xs font-bold text-slate-900 text-right truncate max-w-[140px]">{region.postName}</span>
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

export const PredictionModal = ({ isOpen, onClose }: PredictionModalProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const warningCount = PREDICTION_DATA.filter(d => d.status === "waspada").length;
  const totalCount = PREDICTION_DATA.length;

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
      {/* MODAL WRAPPER (Z-INDEX TERTINGGI: 999999) 
        items-center justify-center: Memastikan posisinya 100% di tengah tanpa menabrak navbar 
      */}
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
                Prediksi & Status Wilayah
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{totalCount} Lokasi Total</span>
                <span className="text-[10px] text-slate-300">•</span>
                <span className={`text-[11px] font-bold uppercase tracking-widest ${warningCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {warningCount > 0 ? `${warningCount} Titik Siaga` : 'Semua Titik Aman'}
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
          <div className="relative flex-1 overflow-hidden flex flex-col justify-center min-h-[300px]">
            
            {/* Navigasi Kiri Kanan (Desktop) */}
            <button onClick={() => scroll('left')} className="hidden md:flex absolute left-4 lg:left-8 z-10 p-3 bg-white border border-slate-200 text-slate-900 rounded-full shadow-sm hover:bg-slate-50 transition-transform hover:-translate-x-1 focus:outline-none">
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
            <button onClick={() => scroll('right')} className="hidden md:flex absolute right-4 lg:right-8 z-10 p-3 bg-white border border-slate-200 text-slate-900 rounded-full shadow-sm hover:bg-slate-50 transition-transform hover:translate-x-1 focus:outline-none">
              <ChevronRight size={24} strokeWidth={1.5} />
            </button>

            {/* Container Kartu (Overflow X) */}
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-5 px-6 md:px-24 py-8 hide-scroll-bar snap-x snap-mandatory"
            >
              {PREDICTION_DATA.map((region) => (
                <RegionCard key={region.id} region={region} />
              ))}
            </div>
          </div>

          {/* MENGHILANGKAN SCROLLBAR BAWAAN BROWSER */}
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scroll-bar {
              -ms-overflow-style: none;  /* IE and Edge */
              scrollbar-width: none;  /* Firefox */
            }
            .hide-scroll-bar::-webkit-scrollbar {
              display: none; /* Chrome, Safari and Opera */
            }
          `}} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};