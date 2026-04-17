"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  AttributionControl,
  GeoJSON,
} from "react-leaflet";
import L from "leaflet";
import { renderToString } from "react-dom/server";
import {
  Layers,
  Plus,
  Minus,
  Check,
  CloudRain,
  Droplets,
  AlertTriangle,
  ShieldCheck,
  Map as MapIcon,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { apiFetch } from "@/lib/api";

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

// Interface untuk tipe data Region dari API
interface RegionData {
  id: number;
  name: string;
  coords: [number, number];
  isFloodPredicted: boolean;
  curahHujan: string;
  ketinggianAir: string;
}

// Interface untuk response API agar bebas error ESLint 'any'
interface RegionApiResponse {
  id: number;
  regionName: string;
  latitude: number;
  longitude: number;
  alertStatus: string;
  submergedHouses: number;
}

const LayerOption = ({
  active,
  onClick,
  image,
  label,
  icon,
}: LayerOptionProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-2.5 py-2 rounded-xl w-full text-left transition-all duration-200 ${active ? "bg-slate-50" : "hover:bg-slate-50"}`}
  >
    <div
      className={`w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center border ${active ? "border-slate-900 ring-2 ring-slate-900/10" : "border-slate-200 opacity-80 group-hover:opacity-100"}`}
    >
      {image ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={image} alt={label} className="w-full h-full object-cover" />
      ) : (
        icon
      )}
    </div>
    <span
      className={`text-[12px] font-semibold flex-1 ${active ? "text-slate-900" : "text-slate-500"}`}
    >
      {label}
    </span>
    {active && <Check size={16} className="text-slate-900" strokeWidth={2.5} />}
  </button>
);

const CheckboxOption = ({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-all duration-200 hover:bg-slate-50"
  >
    {icon && <div className="text-slate-500">{icon}</div>}
    <span className="text-[13px] font-semibold flex-1 text-slate-700">
      {label}
    </span>
    <div
      className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${active ? "bg-slate-900 border-slate-900" : "border-slate-300"}`}
    >
      {active && <Check size={14} className="text-white" strokeWidth={3} />}
    </div>
  </button>
);

const MapController: React.FC<MapControllerProps> = ({
  onZoomIn,
  onZoomOut,
  currentLayer,
  setLayer,
  showKabupaten,
  setShowKabupaten,
  showKecamatan,
  setShowKecamatan,
  showLabelKabupaten,
  setShowLabelKabupaten,
  showLabelKecamatan,
  setShowLabelKecamatan,
}) => {
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showBoundaryMenu, setShowBoundaryMenu] = useState(false);

  const toggleLayerMenu = () => {
    setShowLayerMenu(!showLayerMenu);
    setShowBoundaryMenu(false);
  };
  const toggleBoundaryMenu = () => {
    setShowBoundaryMenu(!showBoundaryMenu);
    setShowLayerMenu(false);
  };

  return (
    <div
      className="absolute bottom-6 right-4 md:bottom-8 md:right-6 flex flex-col gap-2 items-end font-sans pointer-events-none"
      style={{ zIndex: 1000 }}
    >
      <div className="relative pointer-events-auto flex justify-end group">
        {showLayerMenu && (
          <div className="absolute bottom-full right-0 mb-3 md:right-full md:bottom-0 md:mb-0 md:mr-3 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 w-52 animate-in fade-in zoom-in-95 duration-200 md:origin-bottom-right origin-bottom">
            <div className="flex flex-col gap-1">
              <LayerOption
                active={currentLayer === "osm"}
                onClick={() => {
                  setLayer("osm");
                  setShowLayerMenu(false);
                }}
                label="Peta Jalan"
                image="https://a.tile.openstreetmap.org/14/13215/8488.png"
              />
              <LayerOption
                active={currentLayer === "topo"}
                onClick={() => {
                  setLayer("topo");
                  setShowLayerMenu(false);
                }}
                label="Topografi"
                image="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/14/9053/13215"
              />
              <LayerOption
                active={currentLayer === "satellite"}
                onClick={() => {
                  setLayer("satellite");
                  setShowLayerMenu(false);
                }}
                label="Satelit"
                image="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/9053/13215"
              />
            </div>
          </div>
        )}
        <button
          onClick={toggleLayerMenu}
          className={`w-11 h-11 rounded-xl shadow-md border flex items-center justify-center transition-all duration-300 active:scale-95 ${showLayerMenu ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-50 hover:border-slate-100 hover:text-slate-900"}`}
        >
          <Layers size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="relative pointer-events-auto flex justify-end group">
        {showBoundaryMenu && (
          <div className="absolute bottom-full right-0 mb-3 md:right-full md:bottom-0 md:mb-0 md:mr-3 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 w-56 animate-in fade-in zoom-in-95 duration-200 md:origin-bottom-right origin-bottom">
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1.5 mb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Batas Wilayah
              </div>
              <CheckboxOption
                active={showKabupaten}
                onClick={() => setShowKabupaten(!showKabupaten)}
                label="Kab/Kota"
              />
              <CheckboxOption
                active={showKecamatan}
                onClick={() => setShowKecamatan(!showKecamatan)}
                label="Kecamatan"
              />
              <div className="w-full h-px bg-slate-100 my-1"></div>
              <div className="px-3 py-1.5 mt-1 mb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Nama Wilayah
              </div>
              <CheckboxOption
                active={showLabelKabupaten}
                onClick={() => setShowLabelKabupaten(!showLabelKabupaten)}
                label="Kab/Kota"
              />
              <CheckboxOption
                active={showLabelKecamatan}
                onClick={() => setShowLabelKecamatan(!showLabelKecamatan)}
                label="Kecamatan"
              />
            </div>
          </div>
        )}
        <button
          onClick={toggleBoundaryMenu}
          className={`w-11 h-11 rounded-xl shadow-md border flex items-center justify-center transition-all duration-300 active:scale-95 ${showBoundaryMenu ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-50 hover:border-slate-100 hover:text-slate-900"}`}
        >
          <MapIcon size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-col w-11 bg-white rounded-xl shadow-md border border-slate-50 overflow-hidden pointer-events-auto">
        <button
          onClick={onZoomIn}
          className="h-11 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors border-b border-slate-100"
          title="Perbesar"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
        <button
          onClick={onZoomOut}
          className="h-11 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          title="Perkecil"
        >
          <Minus size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

const ZoomHandler = ({
  setZoomMethods,
}: {
  setZoomMethods: (methods: ZoomMethods) => void;
}) => {
  const map = useMap();
  useEffect(() => {
    setZoomMethods({
      zoomIn: () => map.zoomIn(),
      zoomOut: () => map.zoomOut(),
    });
    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [map, setZoomMethods]);
  return null;
};

const FloodMap = () => {
  const centerPosition: [number, number] = [-6.98, 107.62];
  const [activeLayer, setActiveLayer] = useState("osm");
  const [zoomHandlers, setZoomHandlers] = useState<ZoomMethods | null>(null);

  const [showKabupaten, setShowKabupaten] = useState(false);
  const [showKecamatan, setShowKecamatan] = useState(false);
  const [showLabelKabupaten, setShowLabelKabupaten] = useState(false);
  const [showLabelKecamatan, setShowLabelKecamatan] = useState(false);

  const [kabData, setKabData] = useState<GeoJSON.FeatureCollection | null>(
    null,
  );
  const [kecData, setKecData] = useState<GeoJSON.FeatureCollection | null>(
    null,
  );

  // State untuk menampung data dari Backend
  const [predictionData, setPredictionData] = useState<RegionData[]>([]);

  // 1. Fetch data GeoJSON dan Data Wilayah dari API
  useEffect(() => {
    // Ambil file GeoJSON (Tetap)
    fetch("/geo/kab bandung.geojson")
      .then((res) => res.json())
      .then((data) => setKabData(data))
      .catch((err) => console.error(err));
    fetch("/geo/kecamatan kab bandung 1.geojson")
      .then((res) => res.json())
      .then((data) => setKecData(data))
      .catch((err) => console.error(err));

    // Ambil Data Wilayah Real-time dari Backend
    const fetchRegionData = async () => {
      try {
        const response = await apiFetch(
          "https://sicitra-banjir.onrender.com/api/regions",
        );
        const result = await response.json();

        if (result.success) {
          // Mapping data menggunakan interface RegionApiResponse untuk menghindari error ESLint 'any'
          const mappedData: RegionData[] = result.data.map(
            (item: RegionApiResponse) => ({
              id: item.id,
              name: item.regionName,
              coords: [item.latitude, item.longitude] as [number, number],
              isFloodPredicted: item.alertStatus === "RAWAN_BANJIR",
              curahHujan: "Tersedia di Dashboard BMKG",
              ketinggianAir: `${item.submergedHouses} rumah terdampak`,
            }),
          );
          setPredictionData(mappedData);
        }
      } catch (error) {
        console.error("Gagal mengambil data peta dari server:", error);
      }
    };

    fetchRegionData();
    // Auto-Refresh data setiap 5 menit
    const interval = setInterval(fetchRegionData, 300000);
    return () => clearInterval(interval);
  }, []);

  const baseBoundaryStyle = {
    fillColor: "transparent",
    weight: 2,
    fillOpacity: 0.05,
  };
  const transparentStyle = { opacity: 0, fillOpacity: 0, weight: 0 };
  const styleKabupaten = showKabupaten
    ? { ...baseBoundaryStyle, color: "#0f172a", dashArray: "5, 5" }
    : transparentStyle;
  const styleKecamatan = showKecamatan
    ? { ...baseBoundaryStyle, color: "#3b82f6", dashArray: "3, 6" }
    : transparentStyle;

  const onEachKabupaten = useCallback(
    (feature: GeoJSON.Feature, layer: L.Layer) => {
      if (showLabelKabupaten && feature.properties?.KAB_KOTA) {
        layer.bindTooltip(feature.properties.KAB_KOTA, {
          permanent: true,
          direction: "center",
          className: "custom-polygon-label uppercase-label text-[13px]",
        });
      }
    },
    [showLabelKabupaten],
  );

  const onEachKecamatan = useCallback(
    (feature: GeoJSON.Feature, layer: L.Layer) => {
      if (showLabelKecamatan && feature.properties?.KECAMATAN) {
        layer.bindTooltip(feature.properties.KECAMATAN, {
          permanent: true,
          direction: "center",
          className: "custom-polygon-label capitalize-label text-[11px]",
        });
      }
    },
    [showLabelKecamatan],
  );

  const getCustomIcon = useCallback((isFloodPredicted: boolean) => {
    const bgColor = isFloodPredicted ? "bg-red-600" : "bg-emerald-500";
    const iconHtml = renderToString(
      <CloudRain size={18} className="text-white" strokeWidth={2} />,
    );
    return L.divIcon({
      className: "custom-marker",
      html: `<div class="flex items-center justify-center w-9 h-9 rounded-full ${bgColor} border-4 border-white shadow-md hover:scale-110 transition-transform duration-200 cursor-pointer">${iconHtml}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -22],
    });
  }, []);

  return (
    <div className="w-full h-full relative font-sans overflow-hidden bg-slate-100">
      <MapContainer
        center={centerPosition}
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full outline-none z-0 grayscale-[0.05]"
      >
        <ZoomHandler setZoomMethods={setZoomHandlers} />
        <AttributionControl position="bottomleft" prefix={false} />

        {activeLayer === "osm" && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}
        {activeLayer === "topo" && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
          />
        )}
        {activeLayer === "satellite" && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        )}

        {(showKabupaten || showLabelKabupaten) && kabData && (
          <GeoJSON
            key={`kab-${showKabupaten}-${showLabelKabupaten}`}
            data={kabData}
            style={styleKabupaten}
            onEachFeature={onEachKabupaten}
          />
        )}

        {(showKecamatan || showLabelKecamatan) && kecData && (
          <GeoJSON
            key={`kec-${showKecamatan}-${showLabelKecamatan}`}
            data={kecData}
            style={styleKecamatan}
            onEachFeature={onEachKecamatan}
          />
        )}

        {predictionData.map((loc) => (
          <Marker
            key={loc.id}
            position={loc.coords}
            icon={getCustomIcon(loc.isFloodPredicted)}
          >
            <Popup
              closeButton={false}
              autoPan={false}
              className="custom-leaflet-popup"
            >
              <div className="flex flex-col w-52 bg-white rounded-xl p-4 gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">
                    {loc.name}
                  </h3>
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md self-start ${loc.isFloodPredicted ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
                  >
                    {loc.isFloodPredicted ? (
                      <AlertTriangle size={14} strokeWidth={2.5} />
                    ) : (
                      <ShieldCheck size={14} strokeWidth={2.5} />
                    )}
                    <span className="text-[11px] font-bold uppercase tracking-wide">
                      {loc.isFloodPredicted
                        ? "Waspada Banjir"
                        : "Terpantau Aman"}
                    </span>
                  </div>
                </div>
                <div className="w-full h-px bg-slate-100"></div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <CloudRain size={16} strokeWidth={2} />
                      <span className="text-xs font-semibold">Status</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {loc.isFloodPredicted ? "Rawan" : "Aman"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Droplets size={16} strokeWidth={2} />
                      <span className="text-xs font-semibold">Informasi</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-900">
                      {loc.ketinggianAir}
                    </span>
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
        showKabupaten={showKabupaten}
        setShowKabupaten={setShowKabupaten}
        showKecamatan={showKecamatan}
        setShowKecamatan={setShowKecamatan}
        showLabelKabupaten={showLabelKabupaten}
        setShowLabelKabupaten={setShowLabelKabupaten}
        showLabelKecamatan={showLabelKecamatan}
        setShowLabelKecamatan={setShowLabelKecamatan}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .leaflet-popup-content-wrapper { border-radius: 16px; box-shadow: 0 12px 40px -10px rgba(0,0,0,0.15); padding: 0; background: transparent; }
        .leaflet-popup-content { margin: 0; width: 210px !important; }
        .leaflet-popup-tip { display: none; }
        .custom-marker { background: none; border: none; outline: none; }
        .custom-polygon-label {
          background-color: transparent !important; border: none !important; box-shadow: none !important;
          font-weight: 800; color: #1e293b; text-align: center; white-space: nowrap;
          text-shadow: -1.5px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, -1.5px 1.5px 0 #fff, 1.5px 1.5px 0 #fff;
        }
        .uppercase-label { text-transform: uppercase; letter-spacing: 0.5px; }
        .capitalize-label { text-transform: capitalize; }
      `,
        }}
      />
    </div>
  );
};

export default React.memo(FloodMap);
