"use client";

import React from "react";
import { CloudRainWind, ChevronRight } from "lucide-react";

interface PredictionButtonProps {
  onClick: () => void;
}

export const PredictionButton = ({ onClick }: PredictionButtonProps) => {
  return (
    <div className="absolute z-[400] top-[124px] md:top-[132px] left-4 md:left-6">
      <button
        onClick={onClick}
        className="group flex items-center gap-3 bg-white border border-slate-200 p-1.5 pr-4 rounded-[14px] shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
      >
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-[10px] bg-slate-100 text-slate-700 flex items-center justify-center transition-colors group-hover:bg-slate-900 group-hover:text-white shrink-0">
          <CloudRainWind className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={2} />
        </div>
        <div className="flex flex-col justify-center text-left py-0.5">
          <span className="text-[12px] md:text-[13px] font-bold text-slate-900 leading-tight">
            Prakiraan Cuaca
          </span>
          <span className="text-[10px] font-medium text-slate-500 leading-tight mt-0.5">
            Status & TMA
          </span>
        </div>
        <ChevronRight size={14} className="text-slate-300 ml-1 group-hover:text-slate-600 transition-colors" />
      </button>
    </div>
  );
};