"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, AttributionControl } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle } from 'lucide-react';
import "leaflet/dist/leaflet.css";

// Import komponen-komponen terpisah
import { KECAMATAN_DATA } from '@/lib/mapData';
import { MapController } from './MapController';
import { MapActionButtons } from './MapActionButtons';
import { MapModals } from './MapModals';

interface ZoomMethods {
  zoomIn: () => void;
  zoomOut: () => void;
}

const ZoomHandler = ({ setZoomMethods }: { setZoomMethods: (methods: ZoomMethods) => void }) => {
  const map = useMap();
  useEffect(() => {
    setZoomMethods({ zoomIn: () => map.zoomIn(), zoomOut: () => map.zoomOut() });
    window.dispatchEvent(new Event('resize'));
  }, [map, setZoomMethods]);
  return null;
};

const FloodMap = () => {
  const centerPosition: [number, number] = [-6.9900, 107.6300]; 
  const [activeLayer, setActiveLayer] = useState('osm');
  const [zoomHandlers, setZoomHandlers] = useState<ZoomMethods | null>(null);
  const [activeModal, setActiveModal] = useState<"data" | "dampak" | null>(null);

  const getCustomIcon = (status: string) => {
    const isDanger = status === "Siaga 1" || status === "Siaga 2";
    const colorClass = isDanger ? "bg-red-600" : status === "Waspada" ? "bg-amber-500" : "bg-green-500";
    
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="absolute inline-flex w-full h-full rounded-full ${colorClass} opacity-30 animate-ping"></span>
          <div class="relative w-3.5 h-3.5 ${colorClass} border-2 border-white rounded-full shadow-md"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  return (
    <div className="w-full h-full relative font-sans overflow-hidden">
      <MapContainer 
        center={centerPosition} zoom={12} scrollWheelZoom={true} zoomControl={false} attributionControl={false}
        className="w-full h-full bg-slate-100 outline-none z-0"
      >
        <ZoomHandler setZoomMethods={setZoomHandlers} />
        <AttributionControl position="bottomleft" prefix={false} />

        {activeLayer === 'osm' && <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />}
        {activeLayer === 'topo' && <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" maxZoom={18} />}
        {activeLayer === 'satellite' && <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxZoom={19} />}

        {KECAMATAN_DATA.map((kec) => (
          <Marker key={kec.id} position={kec.coords as [number, number]} icon={getCustomIcon(kec.status)}>
             <Popup>
              <div className="p-1 min-w-37.5">
                <h3 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wider">{kec.name}</h3>
                <div className="w-full h-px bg-slate-200 mb-2"></div>
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                  <AlertTriangle size={14} className={kec.status === "Aman" ? "text-green-500" : kec.status.includes("Siaga") ? "text-red-500" : "text-amber-500"} />
                  <span>Status: <strong className={kec.status === "Aman" ? "text-green-600" : kec.status.includes("Siaga") ? "text-red-600" : "text-amber-600"}>{kec.status}</strong></span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Komponen Modular UI yang sudah diekstrak */}
      <MapActionButtons setActiveModal={setActiveModal} />
      <MapModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
      <MapController 
        onZoomIn={() => zoomHandlers?.zoomIn()} onZoomOut={() => zoomHandlers?.zoomOut()}
        currentLayer={activeLayer} setLayer={setActiveLayer}
      />
      
      {/* CSS Kustom Popup bawaan Leaflet */}
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper { border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); border: 1px solid #e2e8f0; }
        .leaflet-popup-tip { box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
      `}} />
    </div>
  );
};

export default React.memo(FloodMap);