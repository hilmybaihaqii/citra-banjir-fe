"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, AttributionControl, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { Waves } from 'lucide-react';
import "leaflet/dist/leaflet.css";

import { KECAMATAN_DATA, KecamatanDetail } from '@/lib/mapData';
import { MapController } from './MapController';
import { MapActionButtons } from './MapActionButtons';
import { MapModals } from './MapModals';
import { RegionalDetailModal } from './RegionalDetailModal';

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
  
  const [mapLocations, setMapLocations] = useState<KecamatanDetail[]>([]);
  const [activeModal, setActiveModal] = useState<"data" | "dampak" | null>(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState<KecamatanDetail | null>(null);

  const [showKabupaten, setShowKabupaten] = useState(false);
  const [showKecamatan, setShowKecamatan] = useState(false);
  const [showLabelKabupaten, setShowLabelKabupaten] = useState(false);
  const [showLabelKecamatan, setShowLabelKecamatan] = useState(false);
  
  const [kabData, setKabData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [kecData, setKecData] = useState<GeoJSON.FeatureCollection | null>(null);

  const STORAGE_KEY = "simulasi_database_banjir";

  useEffect(() => {
    const fetchMapData = () => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) setMapLocations(JSON.parse(savedData));
      else setMapLocations(KECAMATAN_DATA);
    };

    fetchMapData();
    window.addEventListener("storage", fetchMapData);

    fetch('/geo/kab bandung.geojson').then(res => res.json()).then(data => setKabData(data)).catch(err => console.error(err));
    fetch('/geo/kecamatan kab bandung 1.geojson').then(res => res.json()).then(data => setKecData(data)).catch(err => console.error(err));
    
    return () => window.removeEventListener("storage", fetchMapData);
  }, []);

  const baseBoundaryStyle = { fillColor: 'transparent', weight: 2, fillOpacity: 0.05 };
  const transparentStyle = { opacity: 0, fillOpacity: 0, weight: 0 }; 
  const renderKabupatenGeo = showKabupaten || showLabelKabupaten;
  const renderKecamatanGeo = showKecamatan || showLabelKecamatan;
  const styleKabupaten = showKabupaten ? { ...baseBoundaryStyle, color: '#0f172a', dashArray: '5, 5' } : transparentStyle;
  const styleKecamatan = showKecamatan ? { ...baseBoundaryStyle, color: '#3b82f6', dashArray: '3, 6' } : transparentStyle;

  const onEachKabupaten = useCallback((feature: GeoJSON.Feature, layer: L.Layer) => {
    if (showLabelKabupaten && feature.properties?.KAB_KOTA) {
      layer.bindTooltip(feature.properties.KAB_KOTA, {
        permanent: true, direction: 'center', className: 'custom-polygon-label uppercase-label text-[13px]'
      });
    }
  }, [showLabelKabupaten]);

  const onEachKecamatan = useCallback((feature: GeoJSON.Feature, layer: L.Layer) => {
    if (showLabelKecamatan && feature.properties?.KECAMATAN) {
      layer.bindTooltip(feature.properties.KECAMATAN, {
        permanent: true, direction: 'center', className: 'custom-polygon-label capitalize-label text-[11px]'
      });
    }
  }, [showLabelKecamatan]);

  const getCustomIcon = useCallback((status: string) => {
    const isDanger = status.includes("Siaga");
    const isWarning = status === "Waspada";
    
    const bgColor = isDanger ? "bg-red-600" : isWarning ? "bg-amber-500" : "bg-emerald-500";
    const iconHtml = renderToString(<Waves size={16} className="text-white" strokeWidth={2.5} />);

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full ${bgColor} border-[2.5px] border-white shadow-sm hover:scale-110 transition-transform duration-200 cursor-pointer">
          ${iconHtml}
        </div>
      `,
      iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -20],
    });
  }, []);

  return (
    <div className="w-full h-full relative font-sans overflow-hidden bg-slate-50">
      
      <MapContainer 
        center={centerPosition} zoom={12} scrollWheelZoom={true} zoomControl={false} attributionControl={false}
        className="w-full h-full z-0 outline-none grayscale-[0.1]"
      >
        <ZoomHandler setZoomMethods={setZoomHandlers} />
        <AttributionControl position="bottomleft" prefix={false} />

        {activeLayer === 'osm' && <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />}
        {activeLayer === 'topo' && <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" maxZoom={18} />}
        {activeLayer === 'satellite' && <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxZoom={19} />}

        {renderKabupatenGeo && kabData && (
          <GeoJSON key={`kab-${showKabupaten}-${showLabelKabupaten}`} data={kabData} style={styleKabupaten} onEachFeature={onEachKabupaten} />
        )}
        {renderKecamatanGeo && kecData && (
          <GeoJSON key={`kec-${showKecamatan}-${showLabelKecamatan}`} data={kecData} style={styleKecamatan} onEachFeature={onEachKecamatan} />
        )}

        {mapLocations.map((kec) => (
          <Marker 
            key={kec.id} position={kec.coords as [number, number]} icon={getCustomIcon(kec.status)}
            eventHandlers={{ click: () => setSelectedKecamatan(kec) }}
          >
            <Popup closeButton={false} className="custom-leaflet-popup">
              <div className="p-1 min-w-35">
                <h3 className="font-bold text-slate-800 text-[11px] mb-1.5 uppercase tracking-widest">{kec.name}</h3>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold text-white ${kec.status.includes("Siaga") ? 'bg-red-600' : kec.status === "Waspada" ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                    {kec.status}
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                  Klik titik untuk detail →
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <MapActionButtons setActiveModal={setActiveModal} />
      <MapModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
      
      <RegionalDetailModal data={selectedKecamatan} onClose={() => setSelectedKecamatan(null)} />

      <MapController 
        onZoomIn={() => zoomHandlers?.zoomIn()} onZoomOut={() => zoomHandlers?.zoomOut()}
        currentLayer={activeLayer} setLayer={setActiveLayer}
        showKabupaten={showKabupaten} setShowKabupaten={setShowKabupaten}
        showKecamatan={showKecamatan} setShowKecamatan={setShowKecamatan}
        showLabelKabupaten={showLabelKabupaten} setShowLabelKabupaten={setShowLabelKabupaten}
        showLabelKecamatan={showLabelKecamatan} setShowLabelKecamatan={setShowLabelKecamatan}
      />
      
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper { 
          border-radius: 8px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; padding: 0;
        }
        .leaflet-popup-content { margin: 12px; }
        .leaflet-popup-tip { display: none; } 
        .custom-marker { background: none; border: none; outline: none; }

        /* --- STYLING LABEL GEOJSON --- */
        .custom-polygon-label {
          background-color: transparent !important; border: none !important; box-shadow: none !important;
          font-weight: 800; color: #1e293b; text-align: center; white-space: nowrap;
          text-shadow: -1.5px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, -1.5px 1.5px 0 #fff, 1.5px 1.5px 0 #fff; 
        }
        .uppercase-label { text-transform: uppercase; letter-spacing: 0.5px; }
        .capitalize-label { text-transform: capitalize; }
        
        .leaflet-tooltip-left.custom-polygon-label::before,
        .leaflet-tooltip-right.custom-polygon-label::before,
        .leaflet-tooltip-top.custom-polygon-label::before,
        .leaflet-tooltip-bottom.custom-polygon-label::before { display: none !important; }
      `}} />
    </div>
  );
};

export default React.memo(FloodMap);