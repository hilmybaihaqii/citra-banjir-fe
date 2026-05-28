"use client";

import React from "react";
import { PieChart, AlertTriangle, LucideIcon, ArrowRight } from "lucide-react";

interface MapButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  sublabel: string;
}

const MapButton = ({ onClick, icon: Icon, label, sublabel }: MapButtonProps) => (
  <button 
    onClick={onClick}
    className="group flex items-center gap-3 bg-white border border-slate-200 p-2 pr-4 md:p-2.5 md:pr-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 active:scale-[0.98] pointer-events-auto text-left"
  >
    <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center transition-colors duration-200 group-hover:bg-slate-800 group-hover:text-white group-hover:border-slate-800 shrink-0">
      <Icon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
    </div>
    <div className="flex flex-col justify-center gap-1 md:gap-1.5">
      <span className="text-[9px] font-bold text-slate-400 tracking-[0.15em] uppercase leading-none transition-colors duration-200 group-hover:text-slate-500">
        {sublabel}
      </span>
      <div className="flex items-center gap-1.5 md:gap-2">
        <span className="text-xs md:text-sm font-semibold text-slate-800 tracking-tight leading-none transition-colors duration-200 group-hover:text-slate-900">
          {label}
        </span>
        <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-300 transition-colors duration-200 group-hover:text-slate-800 shrink-0" />
      </div>
    </div>
  </button>
);

interface ActionButtonsProps {
  setActiveModal: (modal: "data" | "dampak") => void;
}

export const MapActionButtons = ({ setActiveModal }: ActionButtonsProps) => {
  return (
    <div className="absolute z-40 flex flex-col gap-2.5 md:gap-3 top-4 md:top-5 left-4 md:left-6 pointer-events-none">
      <MapButton 
        onClick={() => setActiveModal("data")}
        icon={PieChart}
        sublabel="Statistik"
        label="Data Kejadian"
      />
      <MapButton 
        onClick={() => setActiveModal("dampak")}
        icon={AlertTriangle}
        sublabel="Ringkasan"
        label="Dampak Bencana"
      />
    </div>
  );
};