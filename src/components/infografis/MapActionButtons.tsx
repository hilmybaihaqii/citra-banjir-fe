"use client";

import React from "react";
import { BarChart3, ShieldAlert } from "lucide-react";

interface ActionButtonsProps {
  setActiveModal: (modal: "data" | "dampak") => void;
}

export const MapActionButtons = ({ setActiveModal }: ActionButtonsProps) => {
  return (
    // Penambahan safe-area untuk Safari/iOS, pointer-events-auto, dan jarak dinamis
    <div 
      className="absolute z-[400] flex flex-col gap-2 sm:gap-3 pointer-events-auto"
      style={{
        top: 'max(1rem, env(safe-area-inset-top) + 1rem)',
        left: 'max(1rem, env(safe-area-inset-left) + 1rem)'
      }}
    >
      <button 
        onClick={() => setActiveModal("data")}
        className="group flex items-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none">Ringkasan</span>
          <span className="text-xs sm:text-sm font-black text-blue-950 tracking-tight whitespace-nowrap">Data Kejadian</span>
        </div>
      </button>

      <button 
        onClick={() => setActiveModal("dampak")}
        className="group flex items-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
          <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none">Analisis</span>
          <span className="text-xs sm:text-sm font-black text-blue-950 tracking-tight whitespace-nowrap">Dampak Kejadian</span>
        </div>
      </button>
    </div>
  );
};