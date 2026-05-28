"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, AttributionControl, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { Layers, Plus, Minus, Check, CloudRain, Droplets, AlertTriangle, ShieldCheck, Map as MapIcon } from 'lucide-react';
import "leaflet/dist/leaflet.css";

// Interface tipe data koordinat terintegrasi AI dari halaman induk
interface IntegratedPrediction {
  id: string | number;
  area: string;
  status: "normal" | "waspada" | "siaga" | "awas";
  date: string;
  rainfall: string;
  temp: string;
  wind: string;
  postName: string;
  waterDischarge: string;
  waterLevel: string;
  coords: [number, number];
  isFloodPredicted: boolean;
}

interface FloodMapProps {
  predictionData: IntegratedPrediction[];
}

interface ZoomMethods {
  zoomIn: () => void;
  zoomOut: () => void;
}

interface LayerOptionProps {
  active: boolean;
  onClick: () => void;
  image?: string;
  label: string;
  icon?: React.ReactNode;
}

interface MapControllerProps {
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

const LayerOption = ({ active, onClick, image, label, icon }: LayerOptionProps) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-2.5 py-2 rounded-xl w-full text-left transition-all duration-200 ${active ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
  >
    <div className={`w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center border ${active ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 opacity-80 group-hover:opacity-100'}`}>
      {image ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={image} alt={label} className="w-full h-full object-cover" />
      ) : (
        icon
      )}
    </div>
    <span className={`text-[12px] font-semibold flex-1 ${active ? 'text-slate-900' : 'text-slate-500'}`}>
      {label}
    </span>
    {active && <Check size={16} className="text-slate-900" strokeWidth={2.5} />}
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

const MapController: React.FC<MapControllerProps> = ({ 
  onZoomIn, onZoomOut, currentLayer, setLayer, 
  showKabupaten, setShowKabupaten, showKecamatan, setShowKecamatan,
  showLabelKabupaten, setShowLabelKabupaten, showLabelKecamatan, setShowLabelKecamatan
}) => {
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showBoundaryMenu, setShowBoundaryMenu] = useState(false);

  const toggleLayerMenu = () => { setShowLayerMenu(!showLayerMenu); setShowBoundaryMenu(false); };
  const toggleBoundaryMenu = () => { setShowBoundaryMenu(!showBoundaryMenu); setShowLayerMenu(false); };

  return (
    <div className="absolute bottom-6 right-4 md:bottom-8 md:right-6 flex flex-col gap-2 items-end font-sans pointer-events-auto" style={{ zIndex: 1000 }}>
      <div className="relative pointer-events-auto flex justify-end group">
        {showLayerMenu && (
          <div className="absolute bottom-full right-0 mb-3 md:right-full md:bottom-0 md:mb-0 md:mr-3 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 w-52 animate-in fade-in zoom-in-95 duration-200 md:origin-bottom-right origin-bottom">
            <div className="flex flex-col gap-1">
              <LayerOption active={currentLayer === 'osm'} onClick={() => { setLayer('osm'); setShowLayerMenu(false); }} label="Peta Jalan" image="https://a.tile.openstreetmap.org/14/13215/8488.png" />
              <LayerOption active={currentLayer === 'topo'} onClick={() => { setLayer('topo'); setShowLayerMenu(false); }} label="Topografi" image="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/14/9053/13215" />
              <LayerOption active={currentLayer === 'satellite'} onClick={() => { setLayer('satellite'); setShowLayerMenu(false); }} label="Satelit" image="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/9053/13215" />
            </div>
          </div>
        )}
        <button onClick={toggleLayerMenu} className={`w-11 h-11 rounded-xl shadow-md border flex items-center justify-center transition-all duration-300 active:scale-95 ${showLayerMenu ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-50 hover:border-slate-100 hover:text-slate-900'}`}>
          <Layers size={20} strokeWidth={2.5} />
        </button>
        {!showLayerMenu && <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">Tampilan Peta</div>}
      </div>

      <div className="relative pointer-events-auto flex justify-end group">
        {showBoundaryMenu && (
          <div className="absolute bottom-full right-0 mb-3 md:right-full md:bottom-0 md:mb-0 md:mr-3 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 w-56 animate-in fade-in zoom-in-95 duration-200 md:origin-bottom-right origin-bottom">
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
        <button onClick={toggleBoundaryMenu} className={`w-11 h-11 rounded-xl shadow-md border flex items-center justify-center transition-all duration-300 active:scale-95 ${showBoundaryMenu ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-50 hover:border-slate-100 hover:text-slate-900'}`}>
          <MapIcon size={20} strokeWidth={2.5} />
        </button>
         {!showBoundaryMenu && <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">Batas Wilayah</div>}
      </div>

      <div className="flex flex-col w-11 bg-white rounded-xl shadow-md border border-slate-50 overflow-hidden pointer-events-auto">
        <button onClick={onZoomIn} className="h-11 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors border-b border-slate-100" title="Perbesar"><Plus size={20} strokeWidth={2.5} /></button>
        <button onClick={onZoomOut} className="h-11 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors" title="Perkecil"><Minus size={20} strokeWidth={2.5} /></button>
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

const FloodMap = ({ predictionData }: FloodMapProps) => {
  const centerPosition: [number, number] = [-6.9800, 107.6200]; 
  const [activeLayer, setActiveLayer] = useState('osm');
  const [zoomHandlers, setZoomHandlers] = useState<ZoomMethods | null>(null);

  const [showKabupaten, setShowKabupaten] = useState(true);
  const [showKecamatan, setShowKecamatan] = useState(false);

  const [showLabelKabupaten, setShowLabelKabupaten] = useState(true);
  const [showLabelKecamatan, setShowLabelKecamatan] = useState(false);
  
  const [kabData, setKabData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [kecData, setKecData] = useState<GeoJSON.FeatureCollection | null>(null);

  useEffect(() => {
    fetch('/geo/kab bandung.geojson').then(res => res.json()).then(data => setKabData(data)).catch(err => console.error(err));
    fetch('/geo/kecamatan kab bandung 1.geojson').then(res => res.json()).then(data => setKecData(data)).catch(err => console.error(err));
  }, []);

  const baseBoundaryStyle = { fillColor: 'transparent', weight: 2, fillOpacity: 0.05 };
  const transparentStyle = { opacity: 0, fillOpacity: 0, weight: 0 }; 
  const renderKabupatenGeo = showKabupaten || showLabelKabupaten;
  const renderKecamatanGeo = showKecamatan || showLabelKecamatan;
  
  const styleKabupaten = showKabupaten ? { ...baseBoundaryStyle, color: '#000000', dashArray: '5, 5' } : transparentStyle;
  const styleKecamatan = showKecamatan ? { ...baseBoundaryStyle, color: '#000000', dashArray: '3, 6' } : transparentStyle;

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

  // Pewarnaan pin berbasis response kelas multiclass dari model AI Flask
  const getCustomIcon = useCallback((status: "normal" | "waspada" | "siaga" | "awas") => {
    let bgColor = "bg-emerald-500"; // Default: Normal (Aman)
    if (status === "waspada") bgColor = "bg-amber-500";
    if (status === "siaga" || status === "awas") bgColor = "bg-red-600";

    const iconHtml = renderToString(<CloudRain size={18} className="text-white" strokeWidth={2} />);
    return L.divIcon({
      className: "custom-marker",
      html: `<div class="flex items-center justify-center w-9 h-9 rounded-full ${bgColor} border-4 border-white shadow-md hover:scale-110 transition-transform duration-200 cursor-pointer">${iconHtml}</div>`,
      iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -22],
    });
  }, []);

  return (
    <div className="w-full h-full relative font-sans overflow-hidden bg-slate-100">
      <MapContainer 
        center={centerPosition} zoom={12} scrollWheelZoom={true} zoomControl={false} attributionControl={false}
        className="w-full h-full outline-none z-0 grayscale-[0.05]"
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

        {/* Pemetaan Data Live Terintegrasi Server */}
        {predictionData.map((loc) => (
          <Marker key={loc.id} position={loc.coords} icon={getCustomIcon(loc.status)}>
            <Popup closeButton={false} autoPan={false} className="custom-leaflet-popup">
              <div className="flex flex-col w-52 bg-white rounded-xl p-4 gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{loc.area}</h3>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md self-start ${
                    loc.status === "normal" ? 'bg-emerald-50 text-emerald-700' :
                    loc.status === "waspada" ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {loc.status === "normal" ? <ShieldCheck size={14} strokeWidth={2.5}/> : <AlertTriangle size={14} strokeWidth={2.5}/>}
                    <span className="text-[11px] font-bold uppercase tracking-wide">
                      {loc.status === "normal" ? "Terpantau Aman" : `${loc.status} banjir`}
                    </span>
                  </div>
                </div>
                <div className="w-full h-px bg-slate-100"></div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500"><CloudRain size={16} strokeWidth={2} /><span className="text-xs font-semibold">Curah Hujan</span></div>
                    <span className="text-sm font-bold text-slate-900">{loc.rainfall}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500"><Droplets size={16} strokeWidth={2} /><span className="text-xs font-semibold">Tinggi Air</span></div>
                    <span className="text-sm font-bold text-slate-900">{loc.waterLevel}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <MapController 
        onZoomIn={() => zoomHandlers?.zoomIn()} onZoomOut={() => zoomHandlers?.zoomOut()}
        currentLayer={activeLayer} setLayer={setActiveLayer}
        showKabupaten={showKabupaten} setShowKabupaten={setShowKabupaten}
        showKecamatan={showKecamatan} setShowKecamatan={setShowKecamatan}
        showLabelKabupaten={showLabelKabupaten} setShowLabelKabupaten={setShowLabelKabupaten}
        showLabelKecamatan={showLabelKecamatan} setShowLabelKecamatan={setShowLabelKecamatan}
      />

      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper { border-radius: 16px; box-shadow: 0 12px 40px -10px rgba(0,0,0,0.15); padding: 0; background: transparent; }
        .leaflet-popup-content { margin: 0; width: 210px !important; }
        .leaflet-popup-tip { display: none; }
        .custom-marker { background: none; border: none; outline: none; }
        
        /* CSS Label Peta */
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