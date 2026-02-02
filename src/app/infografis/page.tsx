"use client";

import React from 'react';
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
import { ArrowUpRight, AlertTriangle, Activity, Waves, Home, Users, Building2, LucideIcon } from 'lucide-react';

// --- Data Dummy ---
const CHART_DATA = [
  { name: 'Dayeuhkolot', value: 45 },
  { name: 'Baleendah', value: 38 },
  { name: 'Bojongsoang', value: 32 },
  { name: 'Rancaekek', value: 24 },
  { name: 'Majalaya', value: 18 },
];

// --- Interfaces / Types (Fix ESLint Any) ---
interface StatBigRowProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  isDanger?: boolean;
}

interface ImpactGridItemProps {
  label: string;
  value: string | number;
  subLabel: string;
  isLast?: boolean;
}

// --- Animation Variants ---
const containerVar: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const itemVar: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    }
  }
};

// --- Sub Components ---

const StatBigRow = ({ label, value, unit, icon: Icon, isDanger = false }: StatBigRowProps) => (
  <motion.div variants={itemVar} className="group w-full border-t border-slate-200 py-8 md:py-10">
    <div className="flex items-start justify-between">
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          {Icon && <Icon size={16} className={isDanger ? "text-red-500" : "text-slate-400"} />}
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 group-hover:text-blue-900 transition-colors">
            {label}
          </h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-5xl md:text-7xl font-light tracking-tight leading-none ${isDanger ? 'text-red-600' : 'text-slate-900'}`}>
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

const ImpactGridItem = ({ label, value, subLabel, isLast = false }: ImpactGridItemProps) => (
  <div className={`flex flex-col py-6 pr-6 ${!isLast ? 'border-b md:border-b-0 md:border-r border-slate-200' : ''}`}>
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</span>
    <span className="text-3xl font-light text-slate-900 mb-1">{value}</span>
    <span className="text-xs text-slate-500">{subLabel}</span>
  </div>
);

// --- Main Page ---

export default function InfographicPage() {
  return (
    <div className="h-full w-full bg-white text-slate-900 font-sans overflow-y-auto selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background Noise */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 pt-28 md:pt-36">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          animate="show"
          variants={containerVar}
          className="mb-20 border-b border-slate-200 pb-10"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="overflow-hidden">
              <motion.span variants={itemVar} className="block text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4">
                Pusat Data & Informasi
              </motion.span>
              <motion.h1 variants={itemVar} className="text-5xl md:text-8xl font-medium tracking-tighter text-slate-900 leading-tight pb-2">
                Laporan <br /> <span className="text-slate-900">Dampak Banjir.</span>
              </motion.h1>
            </div>
            
            <motion.div variants={itemVar} className="flex flex-col gap-4 text-right items-start md:items-end">
               <div className="flex items-center gap-2 px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 rounded-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Status: Siaga 1</span>
               </div>
               <p className="text-slate-500 max-w-sm text-sm leading-relaxed text-left md:text-right">
                Data terkini per 30 Januari 2026.<br/>
                Wilayah Sungai Citarum & Sekitarnya.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column (Highlight / Summary) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 space-y-12"
          >
              <div className="bg-slate-900 text-white p-8 border border-slate-800 relative overflow-hidden group rounded-sm shadow-xl">
                <div className="absolute -right-6 -bottom-6 text-slate-800 opacity-20">
                    <Waves size={180} strokeWidth={1} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-10 text-white/60">
                      <AlertTriangle size={18} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Ringkasan Eksekutif</span>
                  </div>
                  
                  <h2 className="text-3xl font-light mb-6 leading-snug">
                    Peningkatan debit air signifikan terdeteksi di 5 kecamatan.
                  </h2>
                  
                  <p className="text-sm text-slate-400 leading-relaxed mb-8">
                    Curah hujan tinggi menyebabkan luapan Sungai Citarum sejak dini hari. Tim evakuasi telah dikerahkan ke titik prioritas Dayeuhkolot dan Baleendah.
                  </p>

                  <div className="w-full h-px bg-slate-800 mb-6"></div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Posko Aktif</span>
                        <span className="text-2xl font-medium">12 Titik</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Tim Lapangan</span>
                        <span className="text-2xl font-medium">145 Personil</span>
                      </div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Wilayah Terdampak</p>
                <ul className="space-y-3">
                  {CHART_DATA.map((item, i) => (
                    <li key={i} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                      <span className="text-slate-600">{item.name}</span>
                      <span className="font-mono text-slate-400">{item.value} Titik</span>
                    </li>
                  ))}
                </ul>
              </div>
          </motion.div>

          {/* Right Column (Data Detail) */}
          <motion.div 
            className="lg:col-span-8"
            variants={containerVar}
            initial="hidden"
            animate="show"
          >
            <div className="flex flex-col">
              
              {/* 1. Main Stats Rows */}
              <StatBigRow 
                label="Total Kejadian Banjir" 
                value="128" 
                unit="Lokasi" 
                icon={Waves} 
              />
              
              <StatBigRow 
                label="Total Jiwa Terdampak" 
                value="14.2K" 
                unit="Jiwa" 
                icon={Users} 
                isDanger={true}
              />

              {/* 2. Detailed Grid Impact */}
              <motion.div variants={itemVar} className="border-t border-slate-200 py-10">
                  <div className="flex items-center gap-3 mb-8">
                    <Home size={16} className="text-slate-400" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                      Kerusakan Infrastruktur
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 border border-slate-200 bg-slate-50/50 p-6 md:p-8">
                    <ImpactGridItem 
                      label="Rusak Berat" 
                      value="142" 
                      subLabel="Tidak dapat dihuni" 
                    />
                    <ImpactGridItem 
                      label="Rusak Sedang" 
                      value="350" 
                      subLabel="Perbaikan struktural" 
                    />
                    <ImpactGridItem 
                      label="Terendam" 
                      value="2.8K" 
                      subLabel="Rendaman > 50cm" 
                      isLast={true}
                    />
                  </div>
              </motion.div>

              {/* 3. Facility Stats */}
              <motion.div variants={itemVar} className="border-t border-slate-200 py-10">
                  <div className="flex items-center gap-3 mb-8">
                    <Building2 size={16} className="text-slate-400" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                      Fasilitas Umum
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border border-slate-200 hover:border-slate-300 transition-colors cursor-default">
                       <span className="text-sm font-medium text-slate-600">Sarana Pendidikan</span>
                       <span className="text-xl font-light text-slate-900">12 Unit</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-slate-200 hover:border-slate-300 transition-colors cursor-default">
                       <span className="text-sm font-medium text-slate-600">Sarana Ibadah</span>
                       <span className="text-xl font-light text-slate-900">8 Unit</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-slate-200 hover:border-slate-300 transition-colors cursor-default">
                       <span className="text-sm font-medium text-slate-600">Fasilitas Kesehatan</span>
                       <span className="text-xl font-light text-slate-900">2 Unit</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-slate-200 hover:border-slate-300 transition-colors cursor-default">
                       <span className="text-sm font-medium text-slate-600">Jalan & Jembatan</span>
                       <span className="text-xl font-light text-slate-900">5 Titik</span>
                    </div>
                  </div>
              </motion.div>

              {/* 4. Chart Section */}
              <motion.div variants={itemVar} className="border-t border-slate-200 pt-10 pb-4">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <Activity size={16} className="text-slate-400" />
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                        Frekuensi Kejadian
                      </h3>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">X: LOKASI / Y: JUMLAH</span>
                  </div>
                  
                  <div className="h-75 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={CHART_DATA}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        barSize={60}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          // FIX: Removed textTransform from 'tick' object prop
                          tick={{
                            fill: '#94a3b8', 
                            fontSize: 10, 
                            fontFamily: 'monospace'
                          }} 
                          // FIX: Use tickFormatter for uppercase
                          tickFormatter={(value) => value.toUpperCase()}
                          dy={10}
                        />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{fill: '#f8fafc'}}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-slate-900 text-white text-xs p-2 uppercase tracking-wider shadow-xl">
                                  <span className="font-bold">{payload[0].payload.name}:</span> {payload[0].value}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                          {CHART_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#0f172a' : '#cbd5e1'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
              </motion.div>

              <motion.div variants={itemVar} className="border-t border-slate-200" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}