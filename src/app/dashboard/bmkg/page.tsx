"use client";

import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { 
  Thermometer, 
  Calendar, 
  Map, 
  Wind, 
  History, 
  ArrowUpRight,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ITEMS_PER_PAGE = 5; 

// --- DEFINISI ANTARMUKA STRUKTUR DATA (TYPE-SAFE) ---
interface WeatherMatrixData {
  id: string | number;
  region: string;
  post: string;
  suhu: string;
  angin: string;
  waktu: string;
}

interface ActivityLog {
  id: string | number;
  time: string;
  action: string;
  desc: string;
  user: string;
}

interface BackendLogItem {
  id: string | number;
  tinggiMukaAir?: string | number;
  debitAir?: string | number;
  curahHujan?: string | number;
  waktuInput?: string;
  createdAt?: string;
  wilayah?: { nama: string };
  pos?: { nama: string };
  suhuUdara?: string | number;
  kecepatanAngin?: string | number;
}

interface BackendActivityItem {
  id: string | number;
  createdAt?: string;
  action?: string;
  description?: string;
  user?: { name: string };
}

export default function BMKGDashboard() {
  const [currentDate, setCurrentDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // State Agregasi Metrik Meteorologi
  const [totalWilayah, setTotalWilayah] = useState(0);
  const [avgSuhu, setAvgSuhu] = useState(0);
  const [maxAngin, setMaxAngin] = useState({ location: "TIDAK ADA", speed: 0 });

  // State Penampung List Data
  const [weatherMatrix, setWeatherMatrix] = useState<WeatherMatrixData[]>([]);
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);

  // Parser Angka Desimal String/Number Amandemen Spasial
  const cleanFloat = (val: string | number | undefined): number => {
    if (val === undefined || val === null) return 0;
    if (typeof val === "number") return val;
    return parseFloat(val.toString().replace(/,/g, ".")) || 0;
  };

  // Pipeline Sinkronisasi Endpoint BMKG
  const fetchBMKGMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("auth_token");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Ambil data dari server secara paralel
      const [resWilayah, resPemantauan, resLogs] = await Promise.all([
        fetch(`${API_BASE_URL}/wilayah-pantauan`, { headers }),
        fetch(`${API_BASE_URL}/pemantauan-terpadu`, { headers }),
        fetch(`${API_BASE_URL}/bmkg/logs`, { headers }),
      ]);

      // 1. Ambil Hitungan Data Master Wilayah
      if (resWilayah.ok) {
        const d = await resWilayah.json();
        setTotalWilayah(Array.isArray(d) ? d.length : d.data?.length || 0);
      }

      // 2. Pemrosesan Data Meteorologi Terpadu
      if (resPemantauan.ok) {
        const d = await resPemantauan.json();
        const rawLogs: BackendLogItem[] = Array.isArray(d) ? d : d.data || d.results || [];

        let sumSuhu = 0;
        let peakWindSpeed = -1;
        let peakWindLocation = "TIDAK ADA";
        const formattedMatrix: WeatherMatrixData[] = [];

        rawLogs.forEach((item: BackendLogItem) => {
          const suhu = cleanFloat(item.suhuUdara);
          const angin = cleanFloat(item.kecepatanAngin);
          const regionName = item.wilayah?.nama || "Unknown";

          sumSuhu += suhu;

          // Cari Rekor Kecepatan Angin Tertinggi di Wilayah Kerja
          if (angin > peakWindSpeed) {
            peakWindSpeed = angin;
            peakWindLocation = regionName;
          }

          // FIXING TS2769: Memastikan property waktu di-narrow dengan aman sebelum dicompile
          const rawTime = item.waktuInput || item.createdAt;
          const timeLabel = rawTime 
            ? new Date(rawTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"
            : "-";

          formattedMatrix.push({
            id: item.id,
            region: regionName,
            post: item.pos?.nama || "Unknown",
            suhu: `${suhu.toString().replace(".", ",")} °C`,
            angin: `${angin.toString().replace(".", ",")} km/h`,
            waktu: timeLabel,
          });
        });

        setWeatherMatrix(formattedMatrix);
        setAvgSuhu(rawLogs.length ? Math.round(sumSuhu / rawLogs.length) : 0);
        if (peakWindSpeed > -1) {
          setMaxAngin({ location: peakWindLocation.toUpperCase(), speed: peakWindSpeed });
        }
      }

      // 3. Pemrosesan Log Transaksi Aktivitas Petugas BMKG
      if (resLogs.ok) {
        const d = await resLogs.json();
        const rawActivity: BackendActivityItem[] = d.data?.items || d.data || d || [];
        
        const formattedLogs: ActivityLog[] = rawActivity.slice(0, 5).map((log: BackendActivityItem) => ({
          id: log.id,
          time: log.createdAt
            ? new Date(log.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"
            : "Baru saja",
          action: log.action || "LOG",
          desc: log.description || "",
          user: log.user?.name || "Sistem BMKG",
        }));
        setRecentLogs(formattedLogs);
      }

    } catch (error) {
      console.error("BMKG Dashboard critical synchronization error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );
    fetchBMKGMetrics();
  }, [fetchBMKGMetrics]);

  // Perhitungan Halaman Tabel Spasial
  const totalPages = Math.ceil(weatherMatrix.length / ITEMS_PER_PAGE);
  const currentMatrixItems = weatherMatrix.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getActionColor = (action: string) => {
    if (action === "UPDATE" || action === "EDIT") return "text-blue-700 bg-blue-50 border-blue-100";
    if (action === "CREATE" || action === "ADD" || action === "WEATHER") return "text-emerald-700 bg-emerald-50 border-emerald-100";
    return "text-slate-700 bg-slate-50 border-slate-100";
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100dvh-5rem)] w-full flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 size={36} className="animate-spin text-blue-950" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12 p-4 sm:p-6 w-full max-w-350 mx-auto animate-in fade-in duration-500">
      
      {/* HEADER DASBOR */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Monitor Meteorologi Wilayah
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Pusat Analisis Data parameter Cuaca & Presipitasi Terintegrasi
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase text-slate-600 shadow-sm">
          <Calendar size={14} className="text-blue-900" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* METRIK REAL-TIME UTAMA (GRID DIUBAH JADI 3 KOLOM) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Cakupan Wilayah Pengamatan</p>
            <Map size={18} className="text-slate-400" />
          </div>
          <h3 className="text-3xl font-black text-blue-950">
            {totalWilayah} <span className="text-xs font-bold text-slate-400">WILAYAH</span>
          </h3>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Suhu Udara Rata-rata</p>
            <Thermometer size={18} className="text-amber-500" />
          </div>
          <h3 className="text-3xl font-black text-blue-950">
            {avgSuhu} <span className="text-xs font-bold text-slate-400">°C</span>
          </h3>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Kecepatan Angin Tertinggi</p>
            <Wind size={18} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight text-blue-950">
            {maxAngin.speed} km/h <span className="text-[10px] text-slate-400 font-bold">({maxAngin.location})</span>
          </h3>
        </div>
      </div>

      {/* STRUKTUR GRID UTAMA - SINKRONISASI TINGGI KANAN KIRI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* KIRI: MATRIKS DATA METEOROLOGI (FIXING CLASS: h-115) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-115">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3.5 shrink-0">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-950">Matriks Parameter Udara & Cuaca</h3>
          </div>
          
          <div className="overflow-x-auto flex-1 custom-scrollbar min-h-0">
            <table className="w-full min-w-150 text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider bg-white">Wilayah Amatan</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider bg-white">Stasiun Pemantau</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider bg-white">Suhu Udara</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider bg-white">Kecepatan Angin</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right bg-white">Waktu Pengamatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-semibold">
                {currentMatrixItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs font-bold uppercase text-slate-400 italic">Belum ada rekaman parameter cuaca masuk</td>
                  </tr>
                ) : (
                  currentMatrixItems.map((item) => (
                    // FIXING CLASS: h-16.25
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors h-16.25">
                      <td className="p-3 font-bold text-blue-950">{item.region}</td>
                      <td className="p-3 text-slate-500 font-medium">{item.post}</td>
                      <td className="p-3 text-slate-900 font-mono">{item.suhu}</td>
                      <td className="p-3 text-slate-900 font-mono">{item.angin}</td>
                      <td className="p-3 text-right font-mono font-medium text-slate-400 text-[11px]">{item.waktu}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* KONTROLLER PAGINASI TABEL */}
          <div className="shrink-0 border-t border-slate-100 bg-slate-50/50 px-4 py-3 flex items-center justify-between text-xs">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Total: <span className="text-blue-950">{weatherMatrix.length}</span> Entri
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[10px] font-black tracking-wider text-slate-500 font-mono">
                {currentPage} / {totalPages || 1}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* RAKAN: LOG AKTIVITAS BMKG (FIXING CLASS: h-115) */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-115">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <History size={14} className="text-slate-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-950">Aktivitas Data Terakhir</h3>
            </div>
            <ArrowUpRight size={14} className="text-slate-400" />
          </div>
          
          <div className="p-4 divide-y divide-slate-100 flex-1 overflow-y-auto custom-scrollbar min-h-0 space-y-3.5">
            {recentLogs.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-xs font-bold text-slate-400 uppercase py-12">Tidak ada transaksi log baru</div>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="pt-3 first:pt-0 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded border text-[8px] font-black tracking-widest ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-slate-400">{log.time}</span>
                  </div>
                  <p className="text-xs font-bold text-blue-950 leading-snug">{log.desc}</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Oleh: {log.user}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}