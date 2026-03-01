"use client";

import React, { useState } from "react";
import { Layers, Plus, Minus, Check } from "lucide-react";

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

// Sub Komponen: Pilihan Layer
const LayerOption = ({ active, onClick, image, label }: LayerOptionProps) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-3 px-2 py-2 rounded-lg w-full text-left transition-all duration-200 ${active ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
  >
    <div className={`w-8 h-8 rounded-md overflow-hidden border ${active ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 opacity-80 group-hover:opacity-100'}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={label} className="w-full h-full object-cover" />
    </div>
    <span className={`text-[11px] font-bold tracking-wide flex-1 uppercase ${active ? 'text-slate-900' : 'text-slate-500'}`}>
      {label}
    </span>
    {active && <Check size={14} className="text-slate-900" strokeWidth={3} />}
  </button>
);

export const MapController = ({ onZoomIn, onZoomOut, currentLayer, setLayer }: MapControllerProps) => {
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  return (
    <div className="absolute bottom-6 md:bottom-8 right-4 md:right-6 z-400 flex flex-col gap-3 items-end font-sans pointer-events-none">
      
      {/* --- KONTROL LAYER --- */}
      <div className="relative pointer-events-auto">
        {showLayerMenu && (
          // Menu popup disesuaikan posisinya dengan ukuran tombol baru (right-12 / right-14)
          <div className="absolute bottom-0 right-14 mb-0 bg-white rounded-xl shadow-[0_15px_35px_-10px_rgba(0,0,0,0.12)] border border-slate-100 p-45 animate-in fade-in slide-in-from-right-2 duration-200">
            <div className="flex flex-col gap-1">
              <LayerOption 
                active={currentLayer === 'osm'} 
                onClick={() => { setLayer('osm'); setShowLayerMenu(false); }} 
                label="Street" 
                image="https://a.tile.openstreetmap.org/14/13215/8488.png" 
              />
              <LayerOption 
                active={currentLayer === 'topo'} 
                onClick={() => { setLayer('topo'); setShowLayerMenu(false); }} 
                label="Topografi" 
                image="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/14/9053/13215" 
              />
              <LayerOption 
                active={currentLayer === 'satellite'} 
                onClick={() => { setLayer('satellite'); setShowLayerMenu(false); }} 
                label="Satelit" 
                image="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/9053/13215" 
              />
            </div>
          </div>
        )}
        
        {/* Tombol Toggle Layer: DISAMAKAN menjadi w-10 h-10 dan rounded-xl */}
        <button 
          onClick={() => setShowLayerMenu(!showLayerMenu)} 
          className={`w-10 h-10 rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.12)] border flex items-center justify-center transition-all duration-300 active:scale-95 ${showLayerMenu ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-50 hover:border-slate-100 hover:text-slate-900'}`}
          title="Ubah Layer"
        >
          <Layers size={18} strokeWidth={2} />
        </button>
      </div>

      {/* --- KONTROL ZOOM --- */}
      {/* Container Zoom: DISAMAKAN menjadi w-10 dan rounded-xl */}
      <div className="flex flex-col w-10 bg-white rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] border border-slate-50 overflow-hidden pointer-events-auto">
        <button 
          onClick={onZoomIn} 
          // Tombol Zoom In: h-10 (karena w-10 diturunkan dari parent)
          className="h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 border-b border-slate-50 transition-colors"
          title="Zoom In"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
        <button 
          onClick={onZoomOut} 
          // Tombol Zoom Out: h-10
          className="h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          title="Zoom Out"
        >
          <Minus size={18} strokeWidth={2.5} />
        </button>
      </div>
      
    </div>
  );
};