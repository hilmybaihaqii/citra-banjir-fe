"use client";

import React, { useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, AttributionControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { Trash2, MapPin, Edit } from 'lucide-react';
import "leaflet/dist/leaflet.css";

// PERBAIKAN ESLINT: Menghilangkan tipe "any" dan mematangkan tipe "id"
export interface RegionData {
  id: number | string;
  regionName: string;
  latitude: number;
  longitude: number;
}

interface RegionMapPickerProps {
  locations: RegionData[];
  onMapClick: (lat: number, lng: number) => void;
  selectedCoords: [number, number] | null;
  onDeleteRegion: (id: number | string) => void;
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

const RegionMapPicker = ({ locations, onMapClick, selectedCoords, onDeleteRegion, onEditRegion }: RegionMapPickerProps) => {
  const centerPosition: [number, number] = [-6.9900, 107.6300]; 
  
  const getCustomIcon = useCallback((isNew: boolean = false) => {
    const bgColor = isNew ? "bg-amber-400" : "bg-blue-950"; 
    const iconHtml = renderToString(<MapPin size={16} className="text-white" strokeWidth={2.5} />);

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full ${bgColor} border-[2.5px] border-white shadow-md hover:scale-110 transition-transform duration-200 cursor-pointer">
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

        {/* TITIK WILAYAH YANG SUDAH ADA */}
        {locations.map((region) => (
          <Marker key={region.id} position={[region.latitude, region.longitude]} icon={getCustomIcon(false)}>
            <Popup className="custom-leaflet-popup">
              <div className="p-3 min-w-40 text-center flex flex-col items-center bg-white">
                <div className="p-1.5 bg-blue-50 text-blue-950 rounded-full mb-2">
                  <MapPin size={14} />
                </div>
                <h3 className="font-black text-slate-800 text-[11px] uppercase tracking-widest leading-tight">
                  {region.regionName}
                </h3>
                <p className="text-[9px] text-slate-400 mt-1 font-medium">Titik Lokasi Tersimpan</p>
                
                <div className="mt-4 pt-3 border-t border-slate-100 w-full flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditRegion(region);
                    }} 
                    className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-md text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 border border-amber-100"
                  >
                    <Edit size={12} /> EDIT
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRegion(region.id);
                    }} 
                    className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 border border-rose-100"
                  >
                    <Trash2 size={12} /> HAPUS
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* TITIK BARU YANG DIKLIK */}
        {selectedCoords && (
          <Marker position={selectedCoords} icon={getCustomIcon(true)}>
            <Popup className="custom-leaflet-popup">
              <div className="p-2 text-center flex flex-col items-center gap-1.5 bg-white">
                <div className="p-1.5 bg-amber-100 text-amber-600 rounded-full">
                  <MapPin size={14} />
                </div>
                <div className="text-[10px] font-black text-amber-700 uppercase tracking-widest">
                  Titik Terpilih
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* PERBAIKAN ESLINT: z-[400] diubah jadi z-400 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-400 bg-white px-4 py-2.5 rounded-md shadow-sm border border-slate-200 pointer-events-none flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 uppercase tracking-widest truncate">
          Klik Peta Untuk Kordinat
        </span>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper { border-radius: 8px !important; border: 1px solid #e2e8f0 !important; padding: 0 !important; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important; background: white !important; }
        .leaflet-popup-content { margin: 4px !important; }
        .leaflet-popup-tip { background: white !important; }
        .custom-marker { background: none !important; border: none !important; outline: none !important; }
        .leaflet-control-zoom { border: 1px solid #e2e8f0 !important; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important; }
      `}} />
    </div>
  );
};

export default React.memo(RegionMapPicker);