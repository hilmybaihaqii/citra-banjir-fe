"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, ActivitySquare, UserMinus, MapPin, Waves, Info, Building2, AlertTriangle } from "lucide-react";
import { RegionData } from "./MapInformasi";

interface MapModalsProps {
  activeModal: "data" | "dampak" | null;
  onClose: () => void;
  mapLocations: RegionData[]; 
}

const StatRow = ({ label, value, icon: Icon, unit, isLast = false }: { label: string; value: string | number; icon: React.ElementType; unit?: string; isLast?: boolean }) => (
  <div className={`flex items-center justify-between py-3.5 ${!isLast ? 'border-b border-slate-100' : ''}`}>
    <div className="flex items-center gap-3">
      <Icon size={18} className="text-slate-400" strokeWidth={2} />
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
    <div className="flex items-baseline gap-1.5">
      <span className="text-base font-semibold text-slate-800">{value || "0"}</span>
      {unit && <span className="text-xs font-normal text-slate-500">{unit}</span>}
    </div>
  </div>
);

const formatCommas = (num: number) => num.toLocaleString('id-ID');

export const MapModals = ({ activeModal, onClose, mapLocations }: MapModalsProps) => {

  const totalLokasi = mapLocations.length;

  const aggregateStats = mapLocations.reduce((acc, loc) => ({
    familyCount: acc.familyCount + (loc.familyCount || 0),
    evacueeCount: acc.evacueeCount + (loc.evacueeCount || 0),
    injuredCount: acc.injuredCount + (loc.injuredCount || 0),
    deathCount: acc.deathCount + (loc.deathCount || 0),
    submergedHouses: acc.submergedHouses + (loc.submergedHouses || 0),
    heavilyDamagedHouses: acc.heavilyDamagedHouses + (loc.heavilyDamagedHouses || 0),
    damagedPublicFacilities: acc.damagedPublicFacilities + (loc.damagedPublicFacilities || 0),
    damagedWorshipPlaces: acc.damagedWorshipPlaces + (loc.damagedWorshipPlaces || 0),
  }), { 
    familyCount: 0, evacueeCount: 0, injuredCount: 0, deathCount: 0, 
    submergedHouses: 0, heavilyDamagedHouses: 0, damagedPublicFacilities: 0, damagedWorshipPlaces: 0 
  });

  const isRawan = mapLocations.some(loc => loc.alertStatus === "RAWAN_BANJIR");
  const globalStatus = isRawan ? "Rawan Banjir" : "Aman";

  const getStatusStyle = () => {
    if (activeModal !== "data") return "bg-slate-100 text-slate-600 border-slate-200";
    if (isRawan) return "bg-rose-50 text-rose-600 border-rose-200";
    return "bg-emerald-50 text-emerald-600 border-emerald-200";
  };

  const topWilayah = [...mapLocations]
    .map(loc => ({ 
      name: loc.regionName, 
      value: loc.evacueeCount || 0 
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  if (!activeModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose} 
          className="absolute inset-0 bg-slate-900/40 pointer-events-auto" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] sm:max-h-[85vh] border border-slate-100 font-sans"
        >
          {/* HEADER */}
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start shrink-0">
            <div className="flex flex-col pr-6">
              <div className={`inline-flex items-center w-fit px-2.5 py-1 rounded text-xs font-semibold border ${getStatusStyle()}`}>
                {activeModal === "data" ? globalStatus : "Seluruh Wilayah"}
              </div>
              <h2 className="text-xl font-bold text-slate-800 mt-3">
                {activeModal === "data" ? "Data Lokasi" : "Rekapitulasi Dampak"}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {activeModal === "data" ? "Ringkasan titik wilayah pantauan." : "Total korban dan kerusakan fisik."}
              </p>
            </div>
            
            <button 
              onClick={onClose} 
              className="p-1.5 -mr-2 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none shrink-0"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="overflow-y-auto custom-scrollbar p-6 space-y-6">
            
            {activeModal === "data" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-slate-500" strokeWidth={2} />
                    <span className="text-sm font-medium text-slate-700">Total Lokasi</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-800">{totalLokasi}</span>
                    <span className="text-xs text-slate-500">Kawasan</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Wilayah Terdampak Terbanyak
                  </h3>
                  <div className="border border-slate-100 rounded-xl divide-y divide-slate-100">
                    {topWilayah.map((wil, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3.5 bg-white">
                        <span className="text-sm font-medium text-slate-700">{wil.name}</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-semibold text-slate-800">
                            {formatCommas(wil.value)}
                          </span>
                          <span className="text-xs text-slate-500">Jiwa</span>
                        </div>
                      </div>
                    ))}
                    {topWilayah.length === 0 && (
                      <p className="text-sm text-slate-400 italic text-center py-4">Data belum tersedia</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeModal === "dampak" && (
              <div className="space-y-6">
                {(aggregateStats.deathCount > 0 || aggregateStats.injuredCount > 0) && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex flex-col">
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-1.5 text-rose-600">
                        <UserMinus size={14} /> Meninggal
                      </span>
                      <span className="text-2xl font-bold text-rose-700">{formatCommas(aggregateStats.deathCount)}</span>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex flex-col">
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-1.5 text-amber-600">
                        <ActivitySquare size={14} /> Luka-luka
                      </span>
                      <span className="text-2xl font-bold text-amber-700">{formatCommas(aggregateStats.injuredCount)}</span>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Warga Terdampak
                  </h3>
                  <div className="border border-slate-100 rounded-xl px-4 bg-white">
                    <StatRow label="Kepala Keluarga" value={formatCommas(aggregateStats.familyCount)} icon={Home} unit="KK" />
                    <StatRow label="Total Mengungsi" value={formatCommas(aggregateStats.evacueeCount)} icon={AlertTriangle} unit="Jiwa" isLast />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Kerusakan Fisik & Fasilitas
                  </h3>
                  <div className="border border-slate-100 rounded-xl px-4 bg-white">
                    <StatRow label="Rumah Terendam" value={formatCommas(aggregateStats.submergedHouses)} icon={Waves} unit="Unit" />
                    <StatRow label="Rumah Rusak Parah" value={formatCommas(aggregateStats.heavilyDamagedHouses)} icon={Home} unit="Unit" />
                    <StatRow label="Fasilitas Umum" value={formatCommas(aggregateStats.damagedPublicFacilities)} icon={Building2} unit="Unit" />
                    <StatRow label="Tempat Ibadah" value={formatCommas(aggregateStats.damagedWorshipPlaces)} icon={Building2} unit="Unit" isLast />
                  </div>
                </div>
              </div>
            )}
            
          </div>
          
          {/* FOOTER */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 shrink-0">
            <Info size={14} className="text-slate-400" />
            <p className="text-xs font-medium text-slate-500">
              Data diperbarui otomatis
            </p>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};