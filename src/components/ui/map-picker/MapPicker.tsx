"use client";

import React, { useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, AttributionControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { Waves, Trash2, MapPin, Edit } from 'lucide-react';
import "leaflet/dist/leaflet.css";

export interface RegionData {
  id: number;
  regionName: string;
  alertStatus: string;
  latitude: number;
  longitude: number;
  familyCount: number;
  deathCount: number;
  evacueeCount: number;
  injuredCount: number;
  submergedHouses: number;
  heavilyDamagedHouses: number;
  damagedPublicFacilities: number;
  damagedWorshipPlaces: number;
}

interface MapPickerProps {
  locations: RegionData[];
  onMapClick: (lat: number, lng: number) => void;
  selectedCoords: [number, number] | null;
  onDeleteRegion: (id: number) => void;
  onEditRegion: (region: RegionData) => void;
}

const ClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const CenterMap = ({ coords }: { coords: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 14, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
};

const MapPicker = ({ locations, onMapClick, selectedCoords, onDeleteRegion, onEditRegion }: MapPickerProps) => {
  const centerPosition: [number, number] = [-6.9900, 107.6300]; 
  
  const getCustomIcon = useCallback((status: string, isNew: boolean = false) => {
    const isDanger = status === "RAWAN_BANJIR";
    let bgColor = "bg-blue-600"; 
    if (!isNew) {
       bgColor = isDanger ? "bg-rose-600" : "bg-emerald-500";
    }

    const iconHtml = renderToString(<Waves size={16} className="text-white" strokeWidth={2.5} />);

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full ${bgColor} border-[2.5px] ${isNew ? 'border-blue-950 animate-bounce shadow-xl' : 'border-white shadow-md'} hover:scale-110 transition-transform duration-200 cursor-pointer">
          ${iconHtml}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16], 
      popupAnchor: [0, -20], 
    });
  }, []);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative z-0 bg-slate-100">
      <MapContainer 
        center={centerPosition} 
        zoom={12} 
        scrollWheelZoom={true} 
        zoomControl={true} 
        attributionControl={false} 
        className="w-full h-full grayscale-[0.15]"
      >
        <AttributionControl position="bottomleft" prefix={false} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
        
        <ClickHandler onMapClick={onMapClick} />
        <CenterMap coords={selectedCoords} />

        {locations.map((kec) => (
          <Marker key={kec.id} position={[kec.latitude, kec.longitude]} icon={getCustomIcon(kec.alertStatus)}>
            <Popup className="custom-leaflet-popup">
              <div className="p-3 min-w-40 text-center flex flex-col items-center">
                <h3 className="font-black text-blue-950 text-[11px] mb-2 uppercase tracking-widest leading-tight">
                  {kec.regionName}
                </h3>
                
                <span className={`px-3 py-1 rounded-sm text-[9px] font-bold text-white uppercase tracking-widest shadow-sm ${kec.alertStatus === "RAWAN_BANJIR" ? 'bg-rose-600' : 'bg-emerald-500'}`}>
                  {kec.alertStatus === "RAWAN_BANJIR" ? "RAWAN BANJIR" : "AMAN"}
                </span>
                
                <div className="mt-4 pt-3 border-t border-slate-100 w-full flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditRegion(kec);
                    }} 
                    className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-md text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 border border-amber-100 hover:border-amber-200"
                  >
                    <Edit size={12} /> EDIT
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRegion(kec.id);
                    }} 
                    className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 border border-rose-100 hover:border-rose-200"
                  >
                    <Trash2 size={12} /> HAPUS
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {selectedCoords && (
          <Marker position={selectedCoords} icon={getCustomIcon('Baru', true)}>
            <Popup className="custom-leaflet-popup">
              <div className="p-2 text-center flex flex-col items-center gap-1.5">
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-full">
                  <MapPin size={14} />
                </div>
                <div className="text-[10px] font-black text-blue-950 uppercase tracking-widest">
                  Titik Terpilih
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-md border border-slate-200 pointer-events-none flex items-center gap-2.5 w-max max-w-[90%]">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
        <span className="text-[9px] sm:text-[10px] font-bold text-blue-950 uppercase tracking-widest truncate">
          Klik Peta Untuk Menentukan Titik
        </span>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper { border-radius: 8px !important; border: 1px solid #e2e8f0 !important; padding: 0 !important; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important; }
        .leaflet-popup-content { margin: 4px !important; }
        .leaflet-popup-tip-container { display: none !important; }
        .custom-marker { background: none !important; border: none !important; outline: none !important; }
        .leaflet-control-zoom { border: none !important; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important; }
        .leaflet-control-zoom-in, .leaflet-control-zoom-out { color: #1e3a8a !important; }
      `}} />
    </div>
  );
};

export default React.memo(MapPicker);