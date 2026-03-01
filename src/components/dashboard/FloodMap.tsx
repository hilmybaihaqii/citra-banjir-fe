"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, AttributionControl } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { Layers, Plus, Minus, Check, CloudRain, Droplets, AlertTriangle, ShieldCheck } from 'lucide-react';
import "leaflet/dist/leaflet.css";

// --- Interfaces ---
interface ZoomMethods {
  zoomIn: () => void;
  zoomOut: () => void;
}

interface LayerOptionProps {
  active: boolean;
  onClick: () => void;
  image: string;
  label: string;
}

// --- Data Prediksi Terintegrasi (Sinkron dengan KECAMATAN_DATA) ---
const PREDICTION_DATA = [
  { id: 1, name: "Dayeuhkolot", coords: [-6.9881, 107.6284], isFloodPredicted: true, curahHujan: "85 mm/jam", ketinggianAir: "120 cm" },
  { id: 2, name: "Baleendah", coords: [-6.9946, 107.6306], isFloodPredicted: true, curahHujan: "60 mm/jam", ketinggianAir: "90 cm" },
  { id: 3, name: "Bojongsoang", coords: [-6.9806, 107.6432], isFloodPredicted: true, curahHujan: "45 mm/jam", ketinggianAir: "70 cm" },
  { id: 4, name: "Margahayu", coords: [-6.9631, 107.5752], isFloodPredicted: true, curahHujan: "30 mm/jam", ketinggianAir: "50 cm" },
  { id: 5, name: "Margaasih", coords: [-6.9467, 107.5564], isFloodPredicted: false, curahHujan: "15 mm/jam", ketinggianAir: "20 cm" },
  { id: 6, name: "Majalaya", coords: [-7.0450, 107.7547], isFloodPredicted: true, curahHujan: "75 mm/jam", ketinggianAir: "100 cm" },
];

// --- Sub Komponen: Kontrol Layer & Zoom ---
const LayerOption = ({ active, onClick, image, label }: LayerOptionProps) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-2.5 py-2 rounded-xl w-full text-left transition-all duration-200 ${active ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
  >
    <div className={`w-8 h-8 rounded-lg overflow-hidden border ${active ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 opacity-80 group-hover:opacity-100'}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={label} className="w-full h-full object-cover" />
    </div>
    <span className={`text-[12px] font-semibold flex-1 ${active ? 'text-slate-900' : 'text-slate-500'}`}>
      {label}
    </span>
    {active && <Check size={16} className="text-slate-900" strokeWidth={2.5} />}
  </button>
);

const MapController = ({ 
  onZoomIn, onZoomOut, currentLayer, setLayer 
}: { 
  onZoomIn: () => void; onZoomOut: () => void; currentLayer: string; setLayer: (l: string) => void;
}) => {
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  return (
    <div className="absolute bottom-6 md:bottom-8 right-4 md:right-6 z-400 flex flex-col gap-3 items-end font-sans pointer-events-none">
      <div className="relative pointer-events-auto">
        {showLayerMenu && (
          <div className="absolute bottom-0 right-14 mb-0 bg-white rounded-2xl shadow-[0_15px_35px_-10px_rgba(0,0,0,0.12)] border border-slate-100 p-2 min-w-45 animate-in fade-in slide-in-from-right-2 duration-200">
            <div className="flex flex-col gap-1">
              <LayerOption active={currentLayer === 'osm'} onClick={() => { setLayer('osm'); setShowLayerMenu(false); }} label="Peta Jalan" image="https://a.tile.openstreetmap.org/14/13215/8488.png" />
              <LayerOption active={currentLayer === 'topo'} onClick={() => { setLayer('topo'); setShowLayerMenu(false); }} label="Topografi" image="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/14/9053/13215" />
              <LayerOption active={currentLayer === 'satellite'} onClick={() => { setLayer('satellite'); setShowLayerMenu(false); }} label="Satelit" image="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/9053/13215" />
            </div>
          </div>
        )}
        <button 
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          className={`w-11 h-11 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.12)] border flex items-center justify-center transition-all duration-300 active:scale-95 ${showLayerMenu ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-50 hover:border-slate-100 hover:text-slate-900'}`}
          title="Ubah Tampilan Peta"
        >
          <Layers size={20} strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col w-11 bg-white rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] border border-slate-50 overflow-hidden pointer-events-auto">
        <button onClick={onZoomIn} className="h-11 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors border-b border-slate-100" title="Perbesar">
          <Plus size={20} strokeWidth={2.5} />
        </button>
        <button onClick={onZoomOut} className="h-11 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors" title="Perkecil">
          <Minus size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

const ZoomHandler = ({ setZoomMethods }: { setZoomMethods: (methods: ZoomMethods) => void }) => {
  const map = useMap();
  useEffect(() => {
    setZoomMethods({ zoomIn: () => map.zoomIn(), zoomOut: () => map.zoomOut() });
    setTimeout(() => { map.invalidateSize(); }, 250);
  }, [map, setZoomMethods]);
  return null;
};

// --- Komponen Utama: Peta Prediksi ---
const FloodMap = () => {
  const centerPosition: [number, number] = [-6.9800, 107.6200]; 
  const [activeLayer, setActiveLayer] = useState('osm');
  const [zoomHandlers, setZoomHandlers] = useState<ZoomMethods | null>(null);

  // Marker Minimalis dengan Ikon Hujan/Cuaca
  const getCustomIcon = useCallback((isFloodPredicted: boolean) => {
    const bgColor = isFloodPredicted ? "bg-red-600" : "bg-emerald-500";
    const iconHtml = renderToString(<CloudRain size={18} className="text-white" strokeWidth={2} />);

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="flex items-center justify-center w-9 h-9 rounded-full ${bgColor} border-4 border-white shadow-md hover:scale-110 transition-transform duration-200 cursor-pointer">
          ${iconHtml}
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -22],
    });
  }, []);

  return (
    <div className="w-full h-full relative font-sans overflow-hidden bg-slate-100">
      <MapContainer 
        center={centerPosition} 
        zoom={12} // Mundurkan sedikit zoom agar semua 6 wilayah masuk frame awal
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full outline-none z-0 grayscale-[0.05]"
      >
        <ZoomHandler setZoomMethods={setZoomHandlers} />
        <AttributionControl position="bottomleft" prefix={false} />

        {/* Tile Layers */}
        {activeLayer === 'osm' && <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />}
        {activeLayer === 'topo' && <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" maxZoom={18} />}
        {activeLayer === 'satellite' && <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxZoom={19} />}

        {/* Mapping Data Prediksi Baru */}
        {PREDICTION_DATA.map((loc) => (
          <Marker key={loc.id} position={loc.coords as [number, number]} icon={getCustomIcon(loc.isFloodPredicted)}>
            
            {/* Popup Universal Design */}
            <Popup closeButton={false} autoPan={false} className="custom-leaflet-popup">
              <div className="flex flex-col w-55 bg-white rounded-xl p-4 gap-4">
                
                {/* Header: Nama dan Badge Status */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{loc.name}</h3>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md self-start ${loc.isFloodPredicted ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {loc.isFloodPredicted ? <AlertTriangle size={14} strokeWidth={2.5}/> : <ShieldCheck size={14} strokeWidth={2.5}/>}
                    <span className="text-[11px] font-bold uppercase tracking-wide">
                      {loc.isFloodPredicted ? "Waspada Banjir" : "Terpantau Aman"}
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-100"></div>
                
                {/* Body: Data List */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <CloudRain size={16} strokeWidth={2} />
                      <span className="text-xs font-semibold">Curah Hujan</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{loc.curahHujan}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Droplets size={16} strokeWidth={2} />
                      <span className="text-xs font-semibold">Tinggi Air</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{loc.ketinggianAir}</span>
                  </div>
                </div>

              </div>
            </Popup>
            
          </Marker>
        ))}

      </MapContainer>

      <MapController 
        onZoomIn={() => zoomHandlers?.zoomIn()}
        onZoomOut={() => zoomHandlers?.zoomOut()}
        currentLayer={activeLayer}
        setLayer={setActiveLayer}
      />

      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper { 
          border-radius: 16px; 
          box-shadow: 0 12px 40px -10px rgba(0,0,0,0.15); 
          padding: 0;
          background: transparent;
        }
        .leaflet-popup-content { margin: 0; width: 220px !important; }
        .leaflet-popup-tip { display: none; }
        .custom-marker { background: none; border: none; outline: none; }
      `}} />
    </div>
  );
};

export default React.memo(FloodMap);