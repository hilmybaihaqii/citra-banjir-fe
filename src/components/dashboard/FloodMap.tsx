"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, AttributionControl } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Plus, Minus, Check } from 'lucide-react';

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

const MapController = ({ 
  onZoomIn, 
  onZoomOut, 
  currentLayer, 
  setLayer 
}: { 
  onZoomIn: () => void; 
  onZoomOut: () => void;
  currentLayer: string;
  setLayer: (l: string) => void;
}) => {
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  return (
    <div className="absolute bottom-24 right-4 md:bottom-8 md:right-6 z-400 flex flex-col gap-4 items-end font-sans pointer-events-none">

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
          title="Layer"
        >
          <Layers size={18} />
        </button>
      </div>

      {/* Container Zoom (Pointer Auto) */}
      <div className="flex flex-col bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden pointer-events-auto">
        <button 
          onClick={onZoomIn}
          className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors border-b border-slate-100"
        >
          <Plus size={18} />
        </button>
        <button 
          onClick={onZoomOut}
          className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors"
        >
          <Minus size={18} />
        </button>
      </div>
    </div>
  );
};

const LayerOption = ({ active, onClick, image, label }: LayerOptionProps) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-2 py-2 rounded-md w-full text-left transition-all ${active ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
  >
    <div className={`w-8 h-8 rounded-md overflow-hidden border ${active ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 opacity-80'}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={label} className="w-full h-full object-cover" />
    </div>
    
    {/* Label */}
    <span className={`text-xs font-semibold flex-1 ${active ? 'text-slate-900' : 'text-slate-500'}`}>
      {label}
    </span>
    {active && <Check size={14} className="text-blue-600" />}
  </button>
);

const ZoomHandler = ({ setZoomMethods }: { setZoomMethods: (methods: ZoomMethods) => void }) => {
  const map = useMap();
  useEffect(() => {
    setZoomMethods({
      zoomIn: () => map.zoomIn(),
      zoomOut: () => map.zoomOut()
    });
  }, [map, setZoomMethods]);
  return null;
};

const FloodMap = () => {
  const position: [number, number] = [-6.9757, 107.6191]; // Dayeuhkolot
  const [activeLayer, setActiveLayer] = useState('osm');
  const [zoomHandlers, setZoomHandlers] = useState<ZoomMethods | null>(null);

  const customIcon = useMemo(() => {
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="absolute inline-flex w-full h-full rounded-full bg-red-600 opacity-30 animate-ping"></span>
          <div class="relative w-3.5 h-3.5 bg-red-600 border-2 border-white rounded-full shadow-md"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }, []);

  return (
    <div className="w-full h-full relative group">
      <MapContainer 
        center={position} 
        zoom={14} 
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full bg-slate-100 outline-none"
      >
        <ZoomHandler setZoomMethods={setZoomHandlers} />
        <AttributionControl position="bottomleft" prefix={false} />

        {activeLayer === 'osm' && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        {activeLayer === 'topo' && (
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
          />
        )}

        {activeLayer === 'satellite' && (
          <TileLayer
            attribution='Tiles &copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        )}

        <Marker position={position} icon={customIcon} />

      </MapContainer>

      <MapController 
        onZoomIn={() => zoomHandlers?.zoomIn()}
        onZoomOut={() => zoomHandlers?.zoomOut()}
        currentLayer={activeLayer}
        setLayer={setActiveLayer}
      />
    </div>
  );
};

export default React.memo(FloodMap);