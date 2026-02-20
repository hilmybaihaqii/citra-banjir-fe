"use client";

import React, { useState } from "react";
import { Layers, Plus, Minus, Check } from "lucide-react";

// 1. Perbaikan TypeScript: Mendefinisikan tipe data dengan jelas (menggantikan 'any')
interface LayerOptionProps {
  active: boolean;
  onClick: () => void;
  image: string;
  label: string;
}

interface MapControllerProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  currentLayer: string;
  setLayer: (l: string) => void;
}

// 2. Perbaikan React: Mengeluarkan komponen ini agar tidak dirender berulang-ulang
const LayerOption = ({ active, onClick, image, label }: LayerOptionProps) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-2 py-2 rounded-md w-full text-left transition-all ${active ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
    <div className={`w-8 h-8 rounded-md overflow-hidden border ${active ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 opacity-80'}`}>
      {/* 3. Perbaikan Next.js: Menonaktifkan peringatan tag img untuk baris ini saja */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={label} className="w-full h-full object-cover" />
    </div>
    <span className={`text-xs font-semibold flex-1 ${active ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
    {active && <Check size={14} className="text-blue-600" />}
  </button>
);

export const MapController = ({ onZoomIn, onZoomOut, currentLayer, setLayer }: MapControllerProps) => {
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  return (
    // 4. Perbaikan Tailwind: Menyesuaikan penulisan z-index
    <div className="absolute bottom-6 right-6 z-400 flex flex-col gap-4 items-end font-sans pointer-events-none">
      
      <div className="relative pointer-events-auto">
        {showLayerMenu && (
          <div className="absolute bottom-0 right-14 mb-0 bg-white rounded-lg shadow-[0_2px_15px_rgba(0,0,0,0.15)] border border-slate-200 p-2 min-w-48 animate-in fade-in slide-in-from-right-2 duration-200">
            <div className="flex flex-col gap-1">
              <LayerOption 
                active={currentLayer === 'osm'} 
                onClick={() => setLayer('osm')} 
                label="Street" 
                image="https://a.tile.openstreetmap.org/14/13215/8488.png" 
              />
              <LayerOption 
                active={currentLayer === 'topo'} 
                onClick={() => setLayer('topo')} 
                label="Topografi" 
                image="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/14/9053/13215" 
              />
              <LayerOption 
                active={currentLayer === 'satellite'} 
                onClick={() => setLayer('satellite')} 
                label="Satelit" 
                image="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/9053/13215" 
              />
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setShowLayerMenu(!showLayerMenu)} 
          className={`w-10 h-10 rounded-lg shadow-md border flex items-center justify-center transition-all duration-200 ${showLayerMenu ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
        >
          <Layers size={18} />
        </button>
      </div>

      <div className="flex flex-col bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden pointer-events-auto">
        <button onClick={onZoomIn} className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 active:bg-slate-100 border-b border-slate-100">
          <Plus size={18} />
        </button>
        <button onClick={onZoomOut} className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 active:bg-slate-100">
          <Minus size={18} />
        </button>
      </div>
      
    </div>
  );
};