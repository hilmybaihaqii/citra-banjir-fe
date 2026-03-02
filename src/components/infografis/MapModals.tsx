"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Home, ActivitySquare, UserMinus, MapPin, Waves, Info, Building2, AlertTriangle } from "lucide-react";
import { KECAMATAN_DATA, KecamatanDetail } from "@/lib/mapData";

interface MapModalsProps {
  activeModal: "data" | "dampak" | null;
  onClose: () => void;
}

const StatRow = ({ label, value, icon: Icon, unit, isLast = false }: { label: string; value: string | number; icon: React.ElementType; unit?: string; isLast?: boolean }) => (
  <div className={`flex items-center justify-between p-4 bg-white ${!isLast ? 'border-b border-gray-100' : ''}`}>
    <div className="flex items-center gap-3 text-gray-700">
      <Icon size={18} className="text-gray-500" />
      <span className="text-base font-medium">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-lg font-bold text-black">{value || "0"}</span>
      {unit && <span className="text-sm font-normal text-gray-500">{unit}</span>}
    </div>
  </div>
);

const formatCommas = (num: number) => num.toLocaleString('id-ID');

export const MapModals = ({ activeModal, onClose }: MapModalsProps) => {
  const [locations, setLocations] = useState<KecamatanDetail[]>([]);

  useEffect(() => {
    const fetchData = () => {
      const savedData = localStorage.getItem("simulasi_database_banjir");
      if (savedData) {
        setLocations(JSON.parse(savedData));
      } else {
        setLocations(KECAMATAN_DATA);
      }
    };

    fetchData();
    window.addEventListener("storage", fetchData);
    return () => window.removeEventListener("storage", fetchData);
  }, [activeModal]);

  const totalLokasi = locations.length;

  const aggregateStats = locations.reduce((acc, loc) => {
    const parseStat = (val: string) => parseInt(val.replace(/\./g, '')) || 0;
    return {
      jiwaTerdampak: acc.jiwaTerdampak + parseStat(loc.stats.jiwaTerdampak),
      kepalaKeluarga: acc.kepalaKeluarga + parseStat(loc.stats.kepalaKeluarga || "0"),
      pengungsi: acc.pengungsi + parseStat(loc.stats.pengungsi),
      lukaLuka: acc.lukaLuka + parseStat(loc.stats.lukaLuka || "0"),
      meninggal: acc.meninggal + parseStat(loc.stats.meninggal || "0"),
      rumahTerendam: acc.rumahTerendam + parseStat(loc.stats.rumahTerendam),
      rumahRusakParah: acc.rumahRusakParah + parseStat(loc.stats.rumahRusakParah || "0"),
      fasilitasUmum: acc.fasilitasUmum + parseStat(loc.stats.fasilitasUmum || "0"),
      tempatIbadah: acc.tempatIbadah + parseStat(loc.stats.tempatIbadah || "0"),
    };
  }, { 
    jiwaTerdampak: 0, kepalaKeluarga: 0, pengungsi: 0, lukaLuka: 0, meninggal: 0, 
    rumahTerendam: 0, rumahRusakParah: 0, fasilitasUmum: 0, tempatIbadah: 0 
  });

  const globalStatus = locations.some(loc => loc.status === "Siaga 1") ? "Siaga 1" : 
                       locations.some(loc => loc.status === "Siaga 2") ? "Siaga 2" : 
                       locations.some(loc => loc.status === "Waspada") ? "Waspada" : "Aman";

  const getStatusColor = (status: string) => {
    if (status.includes("Siaga")) return "bg-black text-white border-black";
    if (status === "Waspada") return "bg-gray-200 text-black border-gray-300";
    return "bg-white text-black border-gray-300";
  };

  const topWilayah = [...locations]
    .map(loc => ({ name: loc.name, value: parseInt(loc.stats.jiwaTerdampak.replace(/\./g, '')) || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  if (!activeModal) return null;

  return (
    <AnimatePresence>
      {/* Ubah z-50 menjadi z-[9999] agar selalu menutupi MapController */}
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose} 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] sm:max-h-[85vh] border border-gray-200 font-sans"
        >
          <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-white flex justify-between items-start shrink-0">
            <div className="flex flex-col gap-2.5 pr-6">
              <div className={`inline-flex items-center w-fit px-3 py-1.5 rounded text-[13px] sm:text-sm font-bold border ${activeModal === "data" ? getStatusColor(globalStatus) : "bg-gray-100 text-gray-800 border-gray-200"}`}>
                {activeModal === "data" ? `Status Umum: ${globalStatus}` : "Akumulasi Seluruh Wilayah"}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-black leading-tight">
                  {activeModal === "data" ? "Statistik Kejadian" : "Ringkasan Dampak"}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mt-0.5 sm:mt-1">
                  {activeModal === "data" ? "Pantauan Kondisi Global" : "Total Kerusakan & Korban"}
                </p>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              className="p-2 -mr-2 -mt-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-black transition-colors focus:outline-none shrink-0"
              aria-label="Tutup Detail"
            >
              <X size={22} strokeWidth={2} className="sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="overflow-y-auto custom-scrollbar bg-gray-50 p-4 sm:p-6 space-y-5 sm:space-y-6">
            
            {activeModal === "data" && (
              <div className="space-y-5 sm:space-y-6">

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
                    Cakupan Wilayah
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <StatRow label="Total Titik Pantauan" value={totalLokasi} icon={MapPin} unit="Kawasan" isLast />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
                    3 Wilayah Terparah
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-2 space-y-2">
                    {topWilayah.map((wil, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 border border-gray-200 p-3 rounded-lg">
                        <span className="text-sm sm:text-base font-semibold text-gray-800">{wil.name}</span>
                        <span className="text-xs sm:text-sm font-bold text-black bg-white border border-gray-200 shadow-sm px-2.5 sm:px-3 py-1.5 rounded-md">
                          {formatCommas(wil.value)} <span className="font-normal text-gray-500">Jiwa</span>
                        </span>
                      </div>
                    ))}
                    {topWilayah.length === 0 && (
                      <p className="text-sm text-gray-500 italic text-center py-4">Belum ada data wilayah</p>
                    )}
                  </div>
                </div>

              </div>
            )}

            {activeModal === "dampak" && (
              <div className="space-y-5 sm:space-y-6">
                {(aggregateStats.meninggal > 0 || aggregateStats.lukaLuka > 0) && (
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gray-100 text-black p-4 sm:p-5 rounded-xl border border-gray-300 shadow-md flex flex-col">
                      <span className="flex items-center gap-2 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-black">
                        <UserMinus size={16} /> Meninggal
                      </span>
                      <span className="text-2xl sm:text-3xl font-bold">{formatCommas(aggregateStats.meninggal)}</span>
                    </div>
                    <div className="bg-gray-100 text-black p-4 sm:p-5 rounded-xl border border-gray-300 shadow-sm flex flex-col">
                      <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-700">
                        <ActivitySquare size={16} /> Luka-luka
                      </span>
                      <span className="text-2xl sm:text-3xl font-bold">{formatCommas(aggregateStats.lukaLuka)}</span>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
                    Dampak Terhadap Warga
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <StatRow label="Total Jiwa" value={formatCommas(aggregateStats.jiwaTerdampak)} icon={Users} unit="Orang" />
                    <StatRow label="Kepala Keluarga" value={formatCommas(aggregateStats.kepalaKeluarga)} icon={Home} unit="KK" />
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        <AlertTriangle size={20} className="text-gray-800" />
                        <span className="text-sm sm:text-base font-semibold text-gray-900">Total Mengungsi</span>
                      </div>
                      <span className="text-lg sm:text-xl font-bold text-black">
                        {formatCommas(aggregateStats.pengungsi)} <span className="text-xs sm:text-sm font-normal text-gray-600">Jiwa</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
                    Kerusakan Fisik & Fasilitas
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <StatRow label="Rumah Terendam" value={formatCommas(aggregateStats.rumahTerendam)} icon={Waves} unit="Unit" />
                    <StatRow label="Rumah Rusak Parah" value={formatCommas(aggregateStats.rumahRusakParah)} icon={Home} unit="Unit" />
                    <StatRow label="Fasilitas Umum" value={formatCommas(aggregateStats.fasilitasUmum)} icon={Building2} unit="Unit" />
                    <StatRow label="Tempat Ibadah" value={formatCommas(aggregateStats.tempatIbadah)} icon={Building2} unit="Unit" isLast />
                  </div>
                </div>

              </div>
            )}
            
          </div>
          
          <div className="px-5 sm:px-6 py-3 sm:py-4 bg-white border-t border-gray-200 flex items-center justify-center gap-2 shrink-0">
            <Info size={14} className="text-gray-400" />
            <p className="text-[11px] sm:text-xs font-medium text-gray-500">
              Data akan selalu diperbarui
            </p>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};