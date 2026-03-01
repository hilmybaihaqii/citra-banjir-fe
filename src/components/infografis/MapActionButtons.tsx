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
    className="group flex items-center gap-3.5 bg-white border border-slate-50 p-2.5 pr-6 rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.12)] hover:border-slate-100 transition-all duration-300 active:scale-95 pointer-events-auto"
  >
    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-slate-900 group-hover:text-white">
      <Icon className="w-4.5 h-4.5" strokeWidth={2} />
    </div>
    
    <div className="flex flex-col items-start leading-none gap-1.5">
      <span className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase transition-colors group-hover:text-slate-500">
        {sublabel}
      </span>
      <div className="flex items-center gap-1.5">
        <span className="text-[13px] font-semibold text-slate-800 tracking-tight group-hover:text-slate-900 transition-colors">
          {label}
        </span>
        <ArrowRight size={12} className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all duration-300" />
      </div>
    </div>
  </button>
);

interface ActionButtonsProps {
  setActiveModal: (modal: "data" | "dampak") => void;
}

export const MapActionButtons = ({ setActiveModal }: ActionButtonsProps) => {
  return (
    <div className="absolute z-40 flex flex-col gap-3 top-5 left-4 md:left-6 pointer-events-none">
      <MapButton 
        onClick={() => setActiveModal("data")}
        icon={PieChart}
        sublabel="Info Center"
        label="Data Kejadian"
      />
      <MapButton 
        onClick={() => setActiveModal("dampak")}
        icon={AlertTriangle}
        sublabel="Impact"
        label="Dampak Bencana"
      />
    </div>
  );
};