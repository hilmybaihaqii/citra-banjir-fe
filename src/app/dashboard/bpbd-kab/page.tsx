"use client";

import React, { useState, useEffect } from "react";
import { MapPinned, Users, AlertTriangle, Calendar } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const trendData = [
  { tanggal: "25 Feb", laporan: 1 },
  { tanggal: "26 Feb", laporan: 3 },
  { tanggal: "27 Feb", laporan: 2 },
  { tanggal: "28 Feb", laporan: 6 },
  { tanggal: "01 Mar", laporan: 2 },
  { tanggal: "02 Mar", laporan: 4 },
  { tanggal: "03 Mar", laporan: 8 },
];

const severityData = [
  { tingkat: "Rendah", jumlah: 12, fill: "#10b981" },
  { tingkat: "Sedang", jumlah: 10, fill: "#f59e0b" },
  { tingkat: "Tinggi", jumlah: 5, fill: "#ef4444" },
];

export default function BPBDKabDashboardHome() {
  const [currentDate, setCurrentDate] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      setCurrentDate(
        new Date().toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      );
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Situasi Terkini
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 italic">
            Kabupaten Bandung • Ringkasan Data Kebencanaan
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-3 text-[10px] font-bold uppercase text-slate-600 shadow-sm sm:w-auto">
          <Calendar size={14} className="text-blue-600" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* STATISTIC CARDS - Konsisten dengan BBWS, BMKG & PROV */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 border-l-4 border-l-amber-400 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Titik Terdampak
            </p>
            <MapPinned size={20} className="text-amber-500" />
          </div>
          <h3 className="text-4xl font-black text-blue-950">
            8{" "}
            <span className="text-xs font-bold text-slate-400 uppercase">
              Lokasi
            </span>
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 border-l-4 border-l-blue-950 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Total Pengungsi
            </p>
            <Users size={20} className="text-blue-600" />
          </div>
          <h3 className="text-4xl font-black text-blue-950">
            84{" "}
            <span className="text-xs font-bold text-slate-400 uppercase tracking-normal">
              Jiwa
            </span>
          </h3>
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 border-l-4 border-l-rose-500 shadow-sm transition-all hover:shadow-md sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase text-rose-700 tracking-widest">
              Status Siaga
            </p>
            <AlertTriangle size={20} className="text-rose-500" />
          </div>
          <h3 className="text-3xl font-black text-rose-600 uppercase">
            Waspada
          </h3>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-950">
              Tren Laporan Masuk
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Aktivitas Mingguan
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient
                    id="colorLaporanKab"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="tanggal"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="laporan"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorLaporanKab)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-950">
              Tingkat Keparahan
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Distribusi Wilayah
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="tingkat"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="jumlah" radius={[4, 4, 0, 0]} barSize={40}>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
