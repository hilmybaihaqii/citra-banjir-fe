"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MapPinned,
  Users,
  AlertTriangle,
  Calendar,
  RefreshCw,
} from "lucide-react";
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
import { apiFetch } from "@/lib/api";

// Interface agar ESLint tidak error 'any'
interface RegionData {
  id: number;
  regionName: string;
  alertStatus: string;
  evacueeCount: number;
}

const trendData = [
  { tanggal: "25 Feb", laporan: 2 },
  { tanggal: "26 Feb", laporan: 5 },
  { tanggal: "27 Feb", laporan: 3 },
  { tanggal: "28 Feb", laporan: 8 },
  { tanggal: "01 Mar", laporan: 4 },
  { tanggal: "02 Mar", laporan: 7 },
  { tanggal: "03 Mar", laporan: 12 },
];

export default function BPBDDashboardHome() {
  const [currentDate, setCurrentDate] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk statistik ringkasan Provinsi
  const [stats, setStats] = useState({
    totalKecamatan: 0,
    totalPengungsi: 0,
    statusSiaga: "Aman",
    severityChart: [
      { tingkat: "Rendah", jumlah: 0, fill: "#10b981" },
      { tingkat: "Sedang", jumlah: 0, fill: "#f59e0b" },
      { tingkat: "Tinggi", jumlah: 0, fill: "#ef4444" },
    ],
  });

  const fetchJabarData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch(
        "https://sicitra-banjir.onrender.com/api/regions",
      );
      const result = await res.json();

      if (res.ok && result.success) {
        const data: RegionData[] = result.data;

        // Hitung total pengungsi se-Jabar dari API
        const totalJiwa = data.reduce(
          (acc: number, curr: RegionData) => acc + (curr.evacueeCount || 0),
          0,
        );

        // Cek apakah ada daerah yang Waspada/Siaga
        const hasWarning = data.some(
          (item: RegionData) => item.alertStatus === "RAWAN_BANJIR",
        );

        setStats({
          totalKecamatan: data.length,
          totalPengungsi: totalJiwa,
          statusSiaga: hasWarning ? "Waspada" : "Aman",
          severityChart: [
            {
              tingkat: "Rendah",
              jumlah: data.filter((i: RegionData) => i.alertStatus === "AMAN")
                .length,
              fill: "#10b981",
            },
            {
              tingkat: "Sedang",
              jumlah: data.filter(
                (i: RegionData) => i.alertStatus === "RAWAN_BANJIR",
              ).length,
              fill: "#f59e0b",
            },
            {
              tingkat: "Tinggi",
              jumlah: data.filter((i: RegionData) => i.evacueeCount > 50)
                .length,
              fill: "#ef4444",
            },
          ],
        });
      }
    } catch {
      console.error("Gagal sinkronisasi dashboard Jabar");
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

    fetchJabarData();
    setIsMounted(true);
  }, [fetchJabarData]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Situasi Terkini
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 italic">
            Jawa Barat • Ringkasan Data Kebencanaan (Live)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchJabarData}
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
        <div className="rounded-xl border border-slate-200 bg-white p-6 border-l-4 border-l-amber-400 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Area Terdampak
            </p>
            <MapPinned size={20} className="text-amber-500" />
          </div>
          <h3 className="text-4xl font-black text-blue-950">
            {stats.totalKecamatan}{" "}
            <span className="text-xs font-bold text-slate-400 uppercase">
              Wilayah
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
            {stats.totalPengungsi}{" "}
            <span className="text-xs font-bold text-slate-400 uppercase">
              Jiwa
            </span>
          </h3>
        </div>

        <div
          className={`rounded-xl border p-6 border-l-4 shadow-sm transition-all hover:shadow-md sm:col-span-2 lg:col-span-1 ${
            stats.statusSiaga === "Waspada"
              ? "border-rose-200 bg-rose-50 border-l-rose-500"
              : "border-emerald-200 bg-emerald-50 border-l-emerald-500"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <p
              className={`text-[10px] font-black uppercase tracking-widest ${stats.statusSiaga === "Waspada" ? "text-rose-700" : "text-emerald-700"}`}
            >
              Status Siaga
            </p>
            <AlertTriangle
              size={20}
              className={
                stats.statusSiaga === "Waspada"
                  ? "text-rose-500"
                  : "text-emerald-500"
              }
            />
          </div>
          <h3
            className={`text-3xl font-black uppercase ${stats.statusSiaga === "Waspada" ? "text-rose-600" : "text-emerald-600"}`}
          >
            {stats.statusSiaga}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-950">
              Tren Laporan Masuk
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              7 Hari Terakhir
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorLaporan" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#colorLaporan)"
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
              Distribusi Dampak Wilayah
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.severityChart}>
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
                  {stats.severityChart.map((entry, index) => (
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
