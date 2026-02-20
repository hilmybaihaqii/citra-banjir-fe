"use client";

import React from "react";
import { BarChart3, ShieldAlert } from "lucide-react";

interface ActionButtonsProps {
  setActiveModal: (modal: "data" | "dampak") => void;
}

export const MapActionButtons = ({ setActiveModal }: ActionButtonsProps) => {
  return (
    <div className="absolute top-6 left-6 z-400 flex flex-col gap-3">
      <button 
        onClick={() => setActiveModal("data")}
        className="group flex items-center gap-3 bg-white/95 backdrop-blur-md border border-slate-200 px-4 py-3 rounded-xl shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <BarChart3 size={16} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none">Ringkasan</span>
          <span className="text-sm font-black text-blue-950 tracking-tight">Data Kejadian</span>
        </div>
      </button>

      <button 
        onClick={() => setActiveModal("dampak")}
        className="group flex items-center gap-3 bg-white/95 backdrop-blur-md border border-slate-200 px-4 py-3 rounded-xl shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
      >
        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
          <ShieldAlert size={16} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none">Analisis</span>
          <span className="text-sm font-black text-blue-950 tracking-tight">Dampak Kejadian</span>
        </div>
      </button>
    </div>
  );
};