"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Waves, Droplets, Calendar, Activity, RefreshCw } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { apiFetch } from "@/lib/api";

// Interface agar TypeScript/ESLint tidak error 'any'
interface RegionData {
  id: number;
  regionName: string;
  alertStatus: string;
  submergedHouses: number;
}

const tmaData = [
  { time: "00:00", level: 1.2 },
  { time: "04:00", level: 1.5 },
  { time: "08:00", level: 2.8 },
  { time: "12:00", level: 3.4 },
  { time: "16:00", level: 2.1 },
  { time: "20:00", level: 1.8 },
];

const rainTrend = [
  { loc: "Pos 1", val: 40 },
  { loc: "Pos 2", val: 75 },
  { loc: "Pos 3", val: 30 },
  { loc: "Pos 4", val: 55 },
  { loc: "Pos 5", val: 90 },
];

export default function BBWSDashboard() {
  const [currentDate, setCurrentDate] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk data statistik hidrologi real-time
  const [bbwsStats, setBbwsStats] = useState({
    totalTitik: 0,
    debitRata: 120, // Default simulasi
    statusDas: "Aman",
  });

  const fetchBbwsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch(
        "https://sicitra-banjir.onrender.com/api/regions",
      );
      const result = await res.json();

      if (res.ok && result.success) {
        const data: RegionData[] = result.data;

        // Cek apakah ada status bahaya di aliran sungai (Simulasi DAS)
        const isHazard = data.some(
          (item: RegionData) => item.alertStatus === "RAWAN_BANJIR",
        );

        setBbwsStats({
          totalTitik: data.length,
          debitRata: 120 + data.length, // Simulasi dinamis berdasarkan jumlah titik
          statusDas: isHazard ? "Waspada" : "Aman",
        });
      }
    } catch {
      console.error("Gagal sinkronisasi dashboard BBWS");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );

    fetchBbwsData();
    setIsMounted(true);
  }, [fetchBbwsData]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Status Hidrologi
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 italic">
            Monitoring Real-time Daerah Aliran Sungai Citarum
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchBbwsData}
            className="p-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw
              size={16}
              className={`${isLoading ? "animate-spin" : ""} text-slate-600`}
            />
          </button>
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-3 text-[10px] font-bold uppercase text-slate-600 shadow-sm sm:w-auto">
            <Calendar size={14} className="text-blue-600" />
            <span>{currentDate}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 border-l-4 border-l-amber-400 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Titik Pantau TMA
            </p>
            <Droplets size={20} className="text-amber-500" />
          </div>
          <h3 className="text-4xl font-black text-blue-950">
            {bbwsStats.totalTitik}{" "}
            <span className="text-xs font-bold text-slate-400">LOKASI</span>
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 border-l-4 border-l-blue-950 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Debit Rata-rata
            </p>
            <Waves size={20} className="text-blue-600" />
          </div>
          <h3 className="text-4xl font-black text-blue-950">
            {bbwsStats.debitRata}{" "}
            <span className="text-xs font-bold text-slate-400 tracking-normal">
              m³/s
            </span>
          </h3>
        </div>

        <div
          className={`rounded-xl border p-6 border-l-4 shadow-sm sm:col-span-2 lg:col-span-1 transition-all ${
            bbwsStats.statusDas === "Waspada"
              ? "border-rose-200 bg-rose-50 border-l-rose-500"
              : "border-emerald-200 bg-emerald-50 border-l-emerald-500"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <p
              className={`text-[10px] font-black uppercase tracking-widest ${
                bbwsStats.statusDas === "Waspada"
                  ? "text-rose-700"
                  : "text-emerald-700"
              }`}
            >
              Status DAS
            </p>
            <Activity
              size={20}
              className={
                bbwsStats.statusDas === "Waspada"
                  ? "text-rose-500"
                  : "text-emerald-500"
              }
            />
          </div>
          <h3
            className={`text-3xl font-black uppercase ${
              bbwsStats.statusDas === "Waspada"
                ? "text-rose-600"
                : "text-emerald-600"
            }`}
          >
            {bbwsStats.statusDas}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-950">
              Tinggi Muka Air (TMA)
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Fluktuasi Ketinggian Sungai (Meter)
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tmaData}>
                <defs>
                  <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="time"
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
                  dataKey="level"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorLevel)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-950">
              Intensitas Per Pos
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Laporan Curah Hujan Terkini (mm)
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rainTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="loc"
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
                <Bar dataKey="val" radius={[4, 4, 0, 0]} barSize={35}>
                  {rainTrend.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.val > 70 ? "#ef4444" : "#1e3a8a"}
                    />
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
