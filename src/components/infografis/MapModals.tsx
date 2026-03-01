"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, PieChart, AlertTriangle, Users, Home, ActivitySquare, UserMinus, MapPin, Waves } from "lucide-react";
import { KECAMATAN_DATA, KecamatanDetail } from "@/lib/mapData";

interface MapModalsProps {
  activeModal: "data" | "dampak" | null;
  onClose: () => void;
}

// Helper Format Angka
const formatCommas = (num: number) => num.toLocaleString('id-ID');

export const MapModals = ({ activeModal, onClose }: MapModalsProps) => {
  const [locations, setLocations] = useState<KecamatanDetail[]>([]);

  // --- 1. SINKRONISASI DATA DARI LOCAL STORAGE ---
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
  }, [activeModal]); // Re-fetch setiap kali modal dibuka

  // --- 2. KALKULASI DATA DINAMIS ---
  const totalLokasi = locations.length;

  const aggregateStats = locations.reduce((acc, loc) => {
    const parseStat = (val: string) => parseInt(val.replace(/\./g, '')) || 0;
    return {
      jiwaTerdampak: acc.jiwaTerdampak + parseStat(loc.stats.jiwaTerdampak),
      pengungsi: acc.pengungsi + parseStat(loc.stats.pengungsi),
      lukaLuka: acc.lukaLuka + parseStat(loc.stats.lukaLuka || "0"),
      meninggal: acc.meninggal + parseStat(loc.stats.meninggal || "0"),
      rumahTerendam: acc.rumahTerendam + parseStat(loc.stats.rumahTerendam),
      rumahRusakParah: acc.rumahRusakParah + parseStat(loc.stats.rumahRusakParah || "0"),
    };
  }, { jiwaTerdampak: 0, pengungsi: 0, lukaLuka: 0, meninggal: 0, rumahTerendam: 0, rumahRusakParah: 0 });

  const globalStatus = locations.some(loc => loc.status === "Siaga 1") ? "Siaga 1" : 
                       locations.some(loc => loc.status === "Siaga 2") ? "Siaga 2" : 
                       locations.some(loc => loc.status === "Waspada") ? "Waspada" : "Aman";

  // Top 3 Wilayah Terdampak untuk Modal Data
  const topWilayah = [...locations]
    .map(loc => ({ name: loc.name, value: parseInt(loc.stats.jiwaTerdampak.replace(/\./g, '')) || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  if (!activeModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-500 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
        >
          <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-950 shadow-sm">
                {activeModal === "data" ? <PieChart size={20} strokeWidth={2.5}/> : <AlertTriangle size={20} strokeWidth={2.5}/>}
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                  {activeModal === "data" ? "Statistik Kejadian" : "Ringkasan Dampak"}
                </h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                  {activeModal === "data" ? "Kondisi Umum Wilayah" : "Akumulasi Seluruh Wilayah"}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-sm">
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
          <div className="p-6">
            
            {activeModal === "data" && (
              <div className="space-y-6">
                
                <div className={`p-4 rounded-xl flex justify-between items-center border ${
                  globalStatus.includes('Siaga') ? 'bg-rose-50 border-rose-100 text-rose-700' : 
                  globalStatus === 'Waspada' ? 'bg-amber-50 border-amber-100 text-amber-700' : 
                  'bg-emerald-50 border-emerald-100 text-emerald-700'
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Status Keseluruhan</span>
                  <span className="text-lg font-black uppercase tracking-tight">{globalStatus}</span>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><MapPin size={24} /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Titik Pantauan</p>
                    <p className="text-3xl font-light text-slate-900">{totalLokasi} <span className="text-sm font-medium text-slate-500">Kawasan</span></p>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-2">3 Wilayah Terdampak Terparah</h3>
                  <div className="space-y-3">
                    {topWilayah.map((wil, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-lg shadow-sm">
                        <span className="text-sm font-bold text-slate-700">{wil.name}</span>
                        <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">{formatCommas(wil.value)} Jiwa</span>
                      </div>
                    ))}
                    {topWilayah.length === 0 && <p className="text-xs text-slate-400 italic text-center py-2">Belum ada data wilayah</p>}
                  </div>
                </div>

              </div>
            )}

            {activeModal === "dampak" && (
              <div className="space-y-6">
                
                {(aggregateStats.meninggal > 0 || aggregateStats.lukaLuka > 0) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
                      <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-rose-600 mb-1">
                        <UserMinus size={12} /> Total Meninggal
                      </span>
                      <span className="text-2xl font-black text-rose-700">{formatCommas(aggregateStats.meninggal)}</span>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                      <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-amber-600 mb-1">
                        <ActivitySquare size={12} /> Total Luka-luka
                      </span>
                      <span className="text-2xl font-black text-amber-700">{formatCommas(aggregateStats.lukaLuka)}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-200 p-4 rounded-xl bg-white shadow-sm flex flex-col items-center text-center">
                    <Users size={20} className="text-blue-600 mb-2" />
                    <span className="text-2xl font-light text-slate-900">{formatCommas(aggregateStats.jiwaTerdampak)}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Jiwa Terdampak</span>
                  </div>
                  <div className="border border-slate-200 p-4 rounded-xl bg-white shadow-sm flex flex-col items-center text-center">
                    <AlertTriangle size={20} className="text-amber-500 mb-2" />
                    <span className="text-2xl font-light text-slate-900">{formatCommas(aggregateStats.pengungsi)}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Total Pengungsi</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-2">Kerusakan Fisik</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Waves size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Rumah Terendam</span>
                      </div>
                      <span className="text-sm font-mono font-bold text-slate-800">{formatCommas(aggregateStats.rumahTerendam)} Unit</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Home size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Rumah Rusak Parah</span>
                      </div>
                      <span className="text-sm font-mono font-bold text-slate-800">{formatCommas(aggregateStats.rumahRusakParah)} Unit</span>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
          
        </motion.div>
      </div>
    </AnimatePresence>
  );
};