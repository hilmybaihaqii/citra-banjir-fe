"use client";

import React, { useState, useEffect } from "react";
import { MapPinned, Users, AlertTriangle, TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const trendData = [
  { tanggal: '25 Feb', laporan: 1 },
  { tanggal: '26 Feb', laporan: 3 },
  { tanggal: '27 Feb', laporan: 2 },
  { tanggal: '28 Feb', laporan: 6 },
  { tanggal: '01 Mar', laporan: 2 },
  { tanggal: '02 Mar', laporan: 4 },
  { tanggal: '03 Mar', laporan: 8 },
];

const severityData = [
  { tingkat: 'Rendah', jumlah: 12, fill: '#3b82f6' }, 
  { tingkat: 'Sedang', jumlah: 10, fill: '#f59e0b' }, 
  { tingkat: 'Tinggi', jumlah: 5, fill: '#ef4444' }, 
];

const statusData = [
  { name: 'Baru', value: 8, color: '#f43f5e' },     
  { name: 'Diproses', value: 5, color: '#f59e0b' },  
  { name: 'Selesai', value: 14, color: '#10b981' },  
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number | string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-3 shadow-lg">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
        <p className="text-sm font-black text-blue-950">
          {payload[0].value} <span className="text-[10px] font-bold text-slate-400">Laporan</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function BPBDKabDashboardHome() {
  const [currentDate, setCurrentDate] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("id-ID", options));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-6 pb-8 lg:gap-8">
      
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Situasi Terkini
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Ringkasan Data Kebencanaan Wilayah Kabupaten Bandung
          </p>
        </div>
        
        <div className="flex w-full shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 shadow-sm sm:w-auto">
          <span className="mr-2 text-slate-400">Update:</span>
          <span className="text-blue-700">{currentDate || "Memuat..."}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <MapPinned size={20} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Titik Terdampak</p>
          </div>
          <h3 className="text-3xl font-black tracking-tight text-blue-950">
            8 <span className="ml-1 text-xs font-bold text-slate-400">Lokasi</span>
          </h3>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users size={20} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Pengungsi</p>
          </div>
          <h3 className="text-3xl font-black tracking-tight text-blue-950">
            84 <span className="ml-1 text-xs font-bold text-slate-400">Jiwa</span>
          </h3>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <AlertTriangle size={20} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">Status Siaga</p>
          </div>
          <h3 className="text-3xl font-black tracking-tight text-red-600">WASPADA</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 lg:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-950">Tren Laporan Masuk</h3>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">7 Hari Terakhir</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <TrendingUp size={16} />
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorLaporanKab" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="tanggal" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area 
                  type="monotone" 
                  dataKey="laporan" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorLaporanKab)" 
                  activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-950">Tingkat Keparahan</h3>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Distribusi Dampak</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-50 text-slate-500">
                <BarChart3 size={16} />
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="tingkat" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} tickMargin={12} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="jumlah" radius={[6, 6, 0, 0]} barSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: Donut Chart (Status) */}
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-950">Status Penanganan</h3>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Progres Laporan</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                <PieChartIcon size={16} />
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}