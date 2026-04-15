"use client";

import React, { useState } from "react";
import { Layers, Plus, Minus, Check, Map as MapIcon } from "lucide-react";

interface LayerOptionProps {
  active: boolean;
  onClick: () => void;
  image: string;
  label: string;
}

// Tambahkan props untuk wilayah dan label
export interface MapControllerProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  currentLayer: string;
  setLayer: (l: string) => void;
  showKabupaten: boolean;
  setShowKabupaten: (v: boolean) => void;
  showKecamatan: boolean;
  setShowKecamatan: (v: boolean) => void;
  showLabelKabupaten: boolean;
  setShowLabelKabupaten: (v: boolean) => void;
  showLabelKecamatan: boolean;
  setShowLabelKecamatan: (v: boolean) => void;
}

const LayerOption = ({ active, onClick, image, label }: LayerOptionProps) => (
  <button 
    onClick={onClick}
    className={`group flex items-center gap-3 px-2.5 py-2 rounded-xl w-full text-left transition-all duration-200 ${active ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
  >
    <div className={`w-8 h-8 rounded-lg overflow-hidden border transition-all ${active ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 opacity-80 group-hover:opacity-100'}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={label} className="w-full h-full object-cover" />
    </div>
    <span className={`text-[12px] font-semibold flex-1 ${active ? 'text-slate-900' : 'text-slate-500'}`}>
      {label}
    </span>
    {active && <Check size={16} className="text-slate-900 shrink-0" strokeWidth={2.5} />}
  </button>
);

const CheckboxOption = ({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon?: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-all duration-200 hover:bg-slate-50"
  >
    {icon && <div className="text-slate-500">{icon}</div>}
    <span className="text-[13px] font-semibold flex-1 text-slate-700">{label}</span>
    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${active ? 'bg-slate-900 border-slate-900' : 'border-slate-300'}`}>
      {active && <Check size={14} className="text-white" strokeWidth={3} />}
    </div>
  </button>
);

export const MapController = ({ 
  onZoomIn, onZoomOut, currentLayer, setLayer,
  showKabupaten, setShowKabupaten, showKecamatan, setShowKecamatan,
  showLabelKabupaten, setShowLabelKabupaten, showLabelKecamatan, setShowLabelKecamatan
}: MapControllerProps) => {
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showBoundaryMenu, setShowBoundaryMenu] = useState(false);

  const toggleLayerMenu = () => { setShowLayerMenu(!showLayerMenu); setShowBoundaryMenu(false); };
  const toggleBoundaryMenu = () => { setShowBoundaryMenu(!showBoundaryMenu); setShowLayerMenu(false); };

  return (
    <div className="absolute bottom-6 md:bottom-8 right-4 md:right-6 z-50 flex flex-col gap-3 items-end font-sans pointer-events-none">
      
      {/* 1. Tombol Tampilan Peta */}
      <div className="relative pointer-events-auto group">
        {showLayerMenu && (
          <div className="absolute bottom-full right-0 mb-3 md:bottom-0 md:right-14 md:mb-0 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 w-52 animate-in fade-in zoom-in-95 duration-200 md:origin-right origin-bottom-right">
            <div className="flex flex-col gap-1">
              <LayerOption active={currentLayer === 'osm'} onClick={() => { setLayer('osm'); setShowLayerMenu(false); }} label="Peta Jalan" image="https://a.tile.openstreetmap.org/14/13215/8488.png" />
              <LayerOption active={currentLayer === 'topo'} onClick={() => { setLayer('topo'); setShowLayerMenu(false); }} label="Topografi" image="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/14/9053/13215" />
              <LayerOption active={currentLayer === 'satellite'} onClick={() => { setLayer('satellite'); setShowLayerMenu(false); }} label="Satelit" image="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/9053/13215" />
            </div>
          </div>
        )}
        <button 
          onClick={toggleLayerMenu}
          className={`w-11 h-11 rounded-xl shadow-md border flex items-center justify-center transition-all duration-300 active:scale-95 ${showLayerMenu ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-50 hover:border-slate-100 hover:text-slate-900'}`}
        >
          <Layers size={20} strokeWidth={2} />
        </button>
        {!showLayerMenu && <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">Tampilan Peta</div>}
      </div>

      {/* 2. Tombol Batas Wilayah */}
      <div className="relative pointer-events-auto group">
        {showBoundaryMenu && (
          <div className="absolute bottom-full right-0 mb-3 md:bottom-0 md:right-14 md:mb-0 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 w-56 animate-in fade-in zoom-in-95 duration-200 md:origin-right origin-bottom-right">
            <div className="flex flex-col gap-1">
              
              <div className="px-3 py-1.5 mb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Batas Wilayah</div>
              <CheckboxOption active={showKabupaten} onClick={() => setShowKabupaten(!showKabupaten)} label="Kab/Kota" />
              <CheckboxOption active={showKecamatan} onClick={() => setShowKecamatan(!showKecamatan)} label="Kecamatan" />
              
              <div className="w-full h-px bg-slate-100 my-1"></div>
              
              <div className="px-3 py-1.5 mt-1 mb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nama Wilayah</div>
              <CheckboxOption active={showLabelKabupaten} onClick={() => setShowLabelKabupaten(!showLabelKabupaten)} label="Kab/Kota" />
              <CheckboxOption active={showLabelKecamatan} onClick={() => setShowLabelKecamatan(!showLabelKecamatan)} label="Kecamatan" />

            </div>
          </div>
        )}
        <button 
          onClick={toggleBoundaryMenu}
          className={`w-11 h-11 rounded-xl shadow-md border flex items-center justify-center transition-all duration-300 active:scale-95 ${showBoundaryMenu ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-50 hover:border-slate-100 hover:text-slate-900'}`}
        >
          <MapIcon size={20} strokeWidth={2} />
        </button>
        {!showBoundaryMenu && <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">Batas Wilayah</div>}
      </div>

      {/* 3. Tombol Zoom */}
      <div className="flex flex-col w-11 bg-white rounded-xl shadow-md border border-slate-50 overflow-hidden pointer-events-auto">
        <button onClick={onZoomIn} className="h-11 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors border-b border-slate-100" title="Perbesar"><Plus size={20} strokeWidth={2.5} /></button>
        <button onClick={onZoomOut} className="h-11 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors" title="Perkecil"><Minus size={20} strokeWidth={2.5} /></button>
      </div>
      
    </div>
  );
};