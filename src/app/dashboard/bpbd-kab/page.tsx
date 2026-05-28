"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MapPinned,
  Users,
  Calendar,
  Home,
  Building2,
  UserMinus,
  ActivitySquare,
  Waves,
  Loader2,
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
import Cookies from "js-cookie";

interface RegionData {
  alertStatus: string;
  familyCount: number;
  evacueeCount: number;
  deathCount: number;
  injuredCount: number;
  submergedHouses: number;
  heavilyDamagedHouses: number;
  damagedPublicFacilities: number;
  damagedWorshipPlaces: number;
}

interface ReportData {
  createdAt?: string;
  date?: string;
  severity?: string;
  impact?: string;
}

export default function BPBDDashboardHome() {
  const [currentDate, setCurrentDate] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [regionStats, setRegionStats] = useState({
    titikTerdampak: 0,
    totalKK: 0,
    totalPengungsi: 0,
    totalMeninggal: 0,
    totalLuka: 0,
    rumahTerendam: 0,
    rumahRusak: 0,
    fasum: 0,
    ibadah: 0,
  });

  const [trendData, setTrendData] = useState<
    { tanggal: string; laporan: number }[]
  >([]);
  const [severityData, setSeverityData] = useState<
    { tingkat: string; jumlah: number; fill: string }[]
  >([]);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("auth_token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const [resRegions, resReports] = await Promise.all([
        fetch(`${API_URL}/regions`, {
          method: "GET",
          headers,
          cache: "no-store",
        }),
        fetch(`${API_URL}/reports?limit=1000`, {
          method: "GET",
          headers,
          cache: "no-store",
        }),
      ]);

      if (resRegions.ok) {
        const regionsJson = await resRegions.json();
        const regions: RegionData[] =
          regionsJson.data?.items || regionsJson.data || [];

        let titik = 0,
          kk = 0,
          pengungsi = 0,
          meninggal = 0,
          luka = 0;
        let terendam = 0,
          rusak = 0,
          fasum = 0,
          ibadah = 0;

        regions.forEach((r) => {
          if (r.alertStatus === "RAWAN_BANJIR") titik++;
          kk += r.familyCount || 0;
          pengungsi += r.evacueeCount || 0;
          meninggal += r.deathCount || 0;
          luka += r.injuredCount || 0;
          terendam += r.submergedHouses || 0;
          rusak += r.heavilyDamagedHouses || 0;
          fasum += r.damagedPublicFacilities || 0;
          ibadah += r.damagedWorshipPlaces || 0;
        });

        setRegionStats({
          titikTerdampak: titik,
          totalKK: kk,
          totalPengungsi: pengungsi,
          totalMeninggal: meninggal,
          totalLuka: luka,
          rumahTerendam: terendam,
          rumahRusak: rusak,
          fasum: fasum,
          ibadah: ibadah,
        });
      }

      if (resReports.ok) {
        const reportsJson = await resReports.json();
        const reports: ReportData[] =
          reportsJson.data?.items || reportsJson.data || [];

        let rendah = 0,
          sedang = 0,
          tinggi = 0;
        reports.forEach((r) => {
          let sev = r.severity?.toLowerCase() || "sedang";
          if (r.impact && !r.severity) {
            const match = r.impact.match(/\[Prioritas:\s*(.*?)\]/i);
            if (match) sev = match[1].toLowerCase();
          }

          if (sev === "parah") tinggi++;
          else if (sev === "sedang") sedang++;
          else rendah++;
        });

        setSeverityData([
          { tingkat: "Rendah", jumlah: rendah, fill: "#10b981" },
          { tingkat: "Sedang", jumlah: sedang, fill: "#f59e0b" },
          { tingkat: "Tinggi", jumlah: tinggi, fill: "#e11d48" },
        ]);

        const last7Days: { [key: string]: number } = {};
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const dateStr = d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          });
          last7Days[dateStr] = 0;
        }

        reports.forEach((r) => {
          const rawDate = r.createdAt || r.date;
          if (!rawDate) return;
          const repDate = new Date(rawDate);
          const dateStr = repDate.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          });
          if (last7Days[dateStr] !== undefined) {
            last7Days[dateStr]++;
          }
        });

        const trendArray = Object.keys(last7Days).map((key) => ({
          tanggal: key,
          laporan: last7Days[key],
        }));
        setTrendData(trendArray);
      }
    } catch (error) {
      console.error("Gagal memuat data dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    setIsMounted(true);
    setCurrentDate(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatNum = (num: number) => num.toLocaleString("id-ID");

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-6 p-4 pb-12 sm:p-6 lg:pb-8 w-full max-w-350 mx-auto animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Situasi Terkini
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 italic">
            Provinsi Jawa Barat • Ringkasan Data Kebencanaan
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-600 shadow-sm sm:w-auto transition-colors hover:border-blue-200">
          <Calendar size={14} className="text-blue-600" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* SECTION 1: OVERVIEW KORBAN & TITIK (3 Kolom) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {/* Titik Terdampak */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 border-l-4 border-l-amber-500 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Titik Rawan Banjir
            </p>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
              <MapPinned size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-blue-950">
              {isLoading ? (
                <Loader2 size={24} className="animate-spin text-slate-300" />
              ) : (
                formatNum(regionStats.titikTerdampak)
              )}
            </h3>
            {!isLoading && (
              <span className="text-xs font-bold text-slate-400 uppercase">
                Kawasan
              </span>
            )}
          </div>
        </div>

        {/* Total Pengungsi */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 border-l-4 border-l-blue-600 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Warga Mengungsi
            </p>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-blue-950">
              {isLoading ? (
                <Loader2 size={24} className="animate-spin text-slate-300" />
              ) : (
                formatNum(regionStats.totalPengungsi)
              )}
            </h3>
            {!isLoading && (
              <span className="text-xs font-bold text-slate-400 uppercase">
                Jiwa
              </span>
            )}
          </div>
        </div>

        {/* Korban Jiwa (Meninggal & Luka) */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 border-l-4 border-l-rose-600 shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Statistik Korban Jiwa
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1 text-rose-600">
                <UserMinus size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Meninggal
                </span>
              </div>
              <span className="text-2xl font-black text-blue-950">
                {isLoading ? "-" : formatNum(regionStats.totalMeninggal)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1 text-amber-500">
                <ActivitySquare size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Luka-Luka
                </span>
              </div>
              <span className="text-2xl font-black text-blue-950">
                {isLoading ? "-" : formatNum(regionStats.totalLuka)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: KERUSAKAN INFRASTRUKTUR (4 Kolom) */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 px-1">
          Data Kerusakan Infrastruktur
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-full shrink-0">
              <Waves size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                Rumah Terendam
              </p>
              <p className="text-xl font-black text-blue-950">
                {isLoading ? "-" : formatNum(regionStats.rumahTerendam)}{" "}
                <span className="text-[10px] font-medium text-slate-400">
                  Unit
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-full shrink-0">
              <Home size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                Rusak Parah
              </p>
              <p className="text-xl font-black text-blue-950">
                {isLoading ? "-" : formatNum(regionStats.rumahRusak)}{" "}
                <span className="text-[10px] font-medium text-slate-400">
                  Unit
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                Fasilitas Umum
              </p>
              <p className="text-xl font-black text-blue-950">
                {isLoading ? "-" : formatNum(regionStats.fasum)}{" "}
                <span className="text-[10px] font-medium text-slate-400">
                  Bangunan
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                Tempat Ibadah
              </p>
              <p className="text-xl font-black text-blue-950">
                {isLoading ? "-" : formatNum(regionStats.ibadah)}{" "}
                <span className="text-[10px] font-medium text-slate-400">
                  Bangunan
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* AREA CHART TREN */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-950">
              Tren Laporan Warga
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Aktivitas Pengaduan 7 Hari Terakhir
            </p>
          </div>
          <div className="h-64 w-full">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-slate-300" size={32} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient
                      id="colorLaporanProv"
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
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ color: "#1e3a8a", fontWeight: "bold" }}
                    labelStyle={{
                      color: "#64748b",
                      fontWeight: "bold",
                      fontSize: "12px",
                      marginBottom: "4px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="laporan"
                    name="Total Laporan"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorLaporanProv)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#2563eb" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* BAR CHART SEVERITY */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-950">
              Tingkat Keparahan Laporan
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Distribusi berdasarkan prioritas penanganan
            </p>
          </div>
          <div className="h-64 w-full">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-slate-300" size={32} />
              </div>
            ) : (
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
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                    labelStyle={{
                      color: "#64748b",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                    itemStyle={{ fontWeight: "bold", color: "#0f172a" }}
                  />
                  <Bar
                    dataKey="jumlah"
                    name="Total Laporan"
                    radius={[4, 4, 0, 0]}
                    barSize={45}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
