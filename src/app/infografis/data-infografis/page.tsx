"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts';
import { motion, Variants } from 'framer-motion';
import { ArrowUpRight, AlertTriangle, Activity, Waves, Home, Users, Building2, LucideIcon, RefreshCcw, Cross, PlusSquare } from 'lucide-react';
import { KECAMATAN_DATA, KecamatanDetail } from '@/lib/mapData';

interface StatBigRowProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  isDanger?: boolean;
  isWarning?: boolean;
}

interface ImpactGridItemProps {
  label: string;
  value: string | number;
  subLabel: string;
  isLast?: boolean;
  isDanger?: boolean;
}

const containerVar: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const itemVar: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const StatBigRow = ({ label, value, unit, icon: Icon, isDanger = false, isWarning = false }: StatBigRowProps) => (
  <motion.div variants={itemVar} className="group w-full border-t border-slate-200 py-8 md:py-10">
    <div className="flex items-start justify-between">
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          {Icon && <Icon size={16} className={isDanger ? "text-rose-500" : isWarning ? "text-amber-500" : "text-slate-400"} />}
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 group-hover:text-blue-900 transition-colors">
            {label}
          </h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-5xl md:text-7xl font-light tracking-tight leading-none ${isDanger ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-900'}`}>
            {value}
          </span>
          {unit && <span className="text-sm text-slate-500 font-medium">{unit}</span>}
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <ArrowUpRight size={24} className="text-slate-300" />
      </div>
    </div>
  </motion.div>
);

const ImpactGridItem = ({ label, value, subLabel, isLast = false, isDanger = false }: ImpactGridItemProps) => (
  <div className={`flex flex-col py-6 md:py-4 pr-6 ${!isLast ? 'border-b md:border-b-0 md:border-r border-slate-200' : ''}`}>
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</span>
    <span className={`text-3xl font-light mb-1 ${isDanger ? 'text-rose-600' : 'text-slate-900'}`}>{value}</span>
    <span className="text-[10px] text-slate-500">{subLabel}</span>
  </div>
);

const formatNumber = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

const formatCommas = (num: number) => {
  return num.toLocaleString('id-ID');
};

export default function InfographicPage() {
  const [locations, setLocations] = useState<KecamatanDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      const savedData = localStorage.getItem("simulasi_database_banjir");
      if (savedData) {
        setLocations(JSON.parse(savedData));
      } else {
        setLocations(KECAMATAN_DATA);
      }
      setIsLoading(false);
    };

    fetchData();
    window.addEventListener("storage", fetchData);
    return () => window.removeEventListener("storage", fetchData);
  }, []);

  // --- KALKULASI DATA DINAMIS ---
  const totalLokasi = locations.length;

  const aggregateStats = locations.reduce((acc, loc) => {
    const parseStat = (val: string) => parseInt(val.replace(/\./g, '')) || 0;

    return {
      kepalaKeluarga: acc.kepalaKeluarga + parseStat(loc.stats.kepalaKeluarga || "0"),
      jiwaTerdampak: acc.jiwaTerdampak + parseStat(loc.stats.jiwaTerdampak),
      pengungsi: acc.pengungsi + parseStat(loc.stats.pengungsi),
      lukaLuka: acc.lukaLuka + parseStat(loc.stats.lukaLuka || "0"),
      meninggal: acc.meninggal + parseStat(loc.stats.meninggal || "0"),
      rumahTerendam: acc.rumahTerendam + parseStat(loc.stats.rumahTerendam),
      rumahRusakParah: acc.rumahRusakParah + parseStat(loc.stats.rumahRusakParah || "0"),
      fasilitasUmum: acc.fasilitasUmum + parseStat(loc.stats.fasilitasUmum),
      tempatIbadah: acc.tempatIbadah + parseStat(loc.stats.tempatIbadah || "0"),
    };
  }, { 
    kepalaKeluarga: 0, jiwaTerdampak: 0, pengungsi: 0, lukaLuka: 0, meninggal: 0, 
    rumahTerendam: 0, rumahRusakParah: 0, fasilitasUmum: 0, tempatIbadah: 0 
  });

  const globalStatus = locations.some(loc => loc.status === "Siaga 1") ? "Siaga 1" : 
                       locations.some(loc => loc.status === "Siaga 2") ? "Siaga 2" : 
                       locations.some(loc => loc.status === "Waspada") ? "Waspada" : "Aman";
  
  const chartData = [...locations]
    .map(loc => ({
      name: loc.name,
      value: parseInt(loc.stats.jiwaTerdampak.replace(/\./g, '')) || 0
    }))
    .sort((a, b) => b.value - a.value) 
    .slice(0, 5); 

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50">
        <RefreshCcw size={24} className="animate-spin text-slate-300" />
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="h-full w-full pt-18 bg-white text-slate-900 font-sans overflow-y-auto selection:bg-blue-100 selection:text-blue-900 custom-scrollbar relative">
      
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 pt-10 md:pt-16">
        <motion.div initial="hidden" animate="show" variants={containerVar} className="mb-16 border-b border-slate-200 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="overflow-hidden">
              <motion.span variants={itemVar} className="block text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4">
                Pusat Data & Informasi
              </motion.span>
              <motion.h1 variants={itemVar} className="text-4xl md:text-7xl font-medium tracking-tighter text-slate-900 leading-tight pb-2">
                Laporan <br /> <span className="text-slate-900">Dampak Banjir.</span>
              </motion.h1>
            </div>
            
            <motion.div variants={itemVar} className="flex flex-col gap-4 text-left md:text-right items-start md:items-end">
               <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-sm ${
                 globalStatus === 'Siaga 1' ? 'border-red-200 bg-red-50 text-red-700' :
                 globalStatus === 'Siaga 2' ? 'border-orange-200 bg-orange-50 text-orange-700' :
                 globalStatus === 'Waspada' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                 'border-emerald-200 bg-emerald-50 text-emerald-700'
               }`}>
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${globalStatus.includes('Siaga') ? 'bg-red-400' : globalStatus === 'Waspada' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${globalStatus.includes('Siaga') ? 'bg-red-600' : globalStatus === 'Waspada' ? 'bg-amber-600' : 'bg-emerald-600'}`}></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Status Keseluruhan: {globalStatus}</span>
               </div>
               <p className="text-slate-500 max-w-sm text-xs md:text-sm leading-relaxed">
                Data real-time disinkronisasi dari pantauan lapangan.<br/>
                Per: {currentDate}
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }} className="lg:col-span-4 space-y-12">
              <div className="bg-slate-900 text-white p-8 border border-slate-800 relative overflow-hidden group rounded-sm shadow-xl">
                <div className="absolute -right-6 -bottom-6 text-slate-800 opacity-20 pointer-events-none">
                    <Waves size={180} strokeWidth={1} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8 text-white/60">
                      <AlertTriangle size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Ringkasan Eksekutif</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-light mb-6 leading-snug">
                    Terdapat {totalLokasi} titik kawasan terdampak di Jawa Barat.
                  </h2>
                  
                  <p className="text-sm text-slate-400 leading-relaxed mb-8">
                    Sebanyak {formatCommas(aggregateStats.jiwaTerdampak)} jiwa ({formatCommas(aggregateStats.kepalaKeluarga)} KK) terdampak luapan air. Evakuasi darurat terus berlangsung di titik merah.
                  </p>

                  <div className="w-full h-px bg-slate-800 mb-6"></div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Kepala Keluarga</span>
                        <span className="text-2xl font-medium">{formatNumber(aggregateStats.kepalaKeluarga)}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Pengungsi</span>
                        <span className="text-2xl font-medium text-amber-400">{formatNumber(aggregateStats.pengungsi)}</span>
                      </div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Kawasan Terpadat Terdampak</p>
                <ul className="space-y-3">
                  {chartData.map((item, i) => (
                    <li key={i} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 font-medium">{item.name}</span>
                      <span className="font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded">{formatCommas(item.value)} Jiwa</span>
                    </li>
                  ))}
                  {chartData.length === 0 && (
                     <li className="text-xs text-slate-400 italic">Belum ada data wilayah.</li>
                  )}
                </ul>
              </div>
          </motion.div>

          <motion.div className="lg:col-span-8" variants={containerVar} initial="hidden" animate="show">
            <div className="flex flex-col">
              
              <StatBigRow 
                label="Total Jiwa Terdampak" 
                value={formatNumber(aggregateStats.jiwaTerdampak)} 
                unit={`Jiwa / ${formatNumber(aggregateStats.kepalaKeluarga)} KK`}
                icon={Users} 
                isWarning={aggregateStats.jiwaTerdampak > 500 && aggregateStats.jiwaTerdampak <= 2000}
                isDanger={aggregateStats.jiwaTerdampak > 2000}
              />
              
              <motion.div variants={itemVar} className="pb-10 pt-2 border-t border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-6 border border-slate-200 bg-white shadow-sm">
                       <div>
                         <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Korban Luka-luka</span>
                         <span className="text-3xl font-light text-slate-900">{formatCommas(aggregateStats.lukaLuka)} <span className="text-sm text-slate-400">Orang</span></span>
                       </div>
                       <PlusSquare size={32} className="text-amber-400/30" strokeWidth={1} />
                    </div>
                    
                    <div className="flex items-center justify-between p-6 border border-rose-200 bg-rose-50/50 shadow-sm relative overflow-hidden">
                       <div className="relative z-10">
                         <span className="block text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-1">Meninggal Dunia</span>
                         <span className="text-3xl font-medium text-rose-700">{formatCommas(aggregateStats.meninggal)} <span className="text-sm text-rose-500/70">Jiwa</span></span>
                       </div>
                       <Cross size={40} className="text-rose-500/10 absolute -right-2 -bottom-2" strokeWidth={3} />
                    </div>
                  </div>
              </motion.div>

              <motion.div variants={itemVar} className="border-t border-slate-200 py-10">
                  <div className="flex items-center gap-3 mb-8">
                    <Home size={16} className="text-slate-400" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                      Kerusakan Infrastruktur Warga
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200 bg-slate-50/50 p-6 md:p-8">
                    <ImpactGridItem 
                      label="Rumah Terendam" 
                      value={formatCommas(aggregateStats.rumahTerendam)} 
                      subLabel="Ketinggian air bervariasi" 
                    />
                    <ImpactGridItem 
                      label="Rumah Rusak Parah" 
                      value={formatCommas(aggregateStats.rumahRusakParah)} 
                      subLabel="Rusak berat / Hanyut" 
                      isDanger={aggregateStats.rumahRusakParah > 0}
                      isLast={true}
                    />
                  </div>
              </motion.div>
              <motion.div variants={itemVar} className="border-t border-slate-200 py-10">
                  <div className="flex items-center gap-3 mb-8">
                    <Building2 size={16} className="text-slate-400" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                      Fasilitas Layanan Publik
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col p-5 border border-slate-200 bg-white">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Fasilitas Umum</span>
                       <div className="flex items-end gap-2">
                         <span className="text-4xl font-light text-slate-900 leading-none">{formatCommas(aggregateStats.fasilitasUmum)}</span>
                         <span className="text-sm font-medium text-slate-500 mb-1">Unit</span>
                       </div>
                       <p className="text-xs text-slate-400 mt-2">Termasuk sekolah, kantor desa, pasar, dll.</p>
                    </div>
                    
                    <div className="flex flex-col p-5 border border-slate-200 bg-white">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Tempat Ibadah</span>
                       <div className="flex items-end gap-2">
                         <span className="text-4xl font-light text-slate-900 leading-none">{formatCommas(aggregateStats.tempatIbadah)}</span>
                         <span className="text-sm font-medium text-slate-500 mb-1">Unit</span>
                       </div>
                       <p className="text-xs text-slate-400 mt-2">Masjid, Mushola, dll yang terendam air.</p>
                    </div>
                  </div>
              </motion.div>

              <motion.div variants={itemVar} className="border-t border-slate-200 pt-10 pb-4">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <Activity size={16} className="text-slate-400" />
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                        Distribusi Beban Evakuasi
                      </h3>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono tracking-widest hidden sm:block">X: LOKASI / Y: JIWA TERDAMPAK</span>
                  </div>
                  
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={50}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} 
                          tickFormatter={(value) => value.substring(0,10).toUpperCase()}
                          dy={10}
                        />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{fill: '#f8fafc'}}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-slate-900 text-white text-[10px] p-3 uppercase tracking-widest shadow-xl rounded-sm">
                                  <span className="font-bold">{payload[0].payload.name}:</span> <br/>
                                  <span className="text-amber-400">{formatCommas(payload[0].value as number)} Jiwa</span>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#b91c1c' : index === 1 ? '#ea580c' : '#0f172a'} /> 
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
              </motion.div>

              <motion.div variants={itemVar} className="border-t border-slate-200 pt-8" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}