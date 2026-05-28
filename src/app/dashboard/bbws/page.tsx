"use client";

import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { 
  Waves, 
  Calendar, 
  Map, 
  Radio, 
  ShieldAlert, 
  History, 
  ArrowUpRight,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ITEMS_PER_PAGE = 5; // Konsistensi tinggi: 5 baris data per halaman

// --- DEFINISI ANTARMUKA STRUKTUR DATA ---
interface MatrixData {
  id: string | number;
  region: string;
  post: string;
  tma: string;
  debit: string;
  status: "NORMAL" | "WASPADA" | "SIAGA" | "AWAS";
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
}

interface BackendActivityItem {
  id: string | number;
  createdAt?: string;
  action?: string;
  description?: string;
  user?: { name: string };
}

export default function BBWSDashboard() {
  const [currentDate, setCurrentDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // State Telemetri Metrik Aggregation
  const [totalWilayah, setTotalWilayah] = useState(0);
  const [totalStasiun, setTotalStasiun] = useState(0);
  const [avgDebit, setAvgDebit] = useState(0);
  const [highestRisk, setHighestRisk] = useState({ location: "TIDAK ADA", level: "NORMAL" });

  // State List Data Backend
  const [statusMatrix, setStatusMatrix] = useState<MatrixData[]>([]);
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);

  // Utility: Parsing Nilai Desimal secara Aman
  const cleanFloat = (val: string | number | undefined): number => {
    if (val === undefined || val === null) return 0;
    if (typeof val === "number") return val;
    return parseFloat(val.toString().replace(/,/g, ".")) || 0;
  };

  // Pipeline Penarikan Data Utama
  const fetchDashboardMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("auth_token");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // HTTP Request Paralel ke Semua Resource Sektoral
      const [resWilayah, resPos, resPemantauan, resLogs] = await Promise.all([
        fetch(`${API_BASE_URL}/wilayah-pantauan`, { headers }),
        fetch(`${API_BASE_URL}/pos-pantau`, { headers }),
        fetch(`${API_BASE_URL}/pemantauan-terpadu`, { headers }),
        fetch(`${API_BASE_URL}/bbws/logs`, { headers }),
      ]);

      // 1. Agregasi Data Wilayah & Pos
      if (resWilayah.ok) {
        const d = await resWilayah.json();
        setTotalWilayah(Array.isArray(d) ? d.length : d.data?.length || 0);
      }
      if (resPos.ok) {
        const d = await resPos.json();
        setTotalStasiun(Array.isArray(d) ? d.length : d.data?.length || 0);
      }

      // 2. Agregasi Log Operasional Sungai
      if (resPemantauan.ok) {
        const d = await resPemantauan.json();
        const rawLogs: BackendLogItem[] = Array.isArray(d) ? d : d.data || d.results || [];

        let sumDebit = 0;
        let maxTma = -1;
        let maxTmaLocation = "TIDAK ADA";
        let maxTmaStatus: MatrixData["status"] = "NORMAL";
        const formattedMatrix: MatrixData[] = [];

        rawLogs.forEach((item: BackendLogItem) => {
          const tma = cleanFloat(item.tinggiMukaAir);
          const debit = cleanFloat(item.debitAir);
          const regionName = item.wilayah?.nama || "Unknown";

          sumDebit += debit;

          let currentStatus: MatrixData["status"] = "NORMAL";
          if (tma >= 0.57 && tma < 0.93) currentStatus = "WASPADA";
          else if (tma >= 0.93 && tma <= 1.3) currentStatus = "SIAGA";
          else if (tma > 1.3) currentStatus = "AWAS";

          if (tma > maxTma) {
            maxTma = tma;
            maxTmaLocation = regionName;
            maxTmaStatus = currentStatus;
          }

          formattedMatrix.push({
            id: item.id,
            region: regionName,
            post: item.pos?.nama || "Unknown",
            tma: `${tma.toString().replace(".", ",")} m`,
            debit: `${debit.toString().replace(".", ",")} m³/s`,
            status: currentStatus,
          });
        });

        setStatusMatrix(formattedMatrix); // Menyimpan data utuh untuk kebutuhan paginasi lokal
        setAvgDebit(rawLogs.length ? Math.round(sumDebit / rawLogs.length) : 0);
        
        if (maxTma > -1) {
          setHighestRisk({ location: maxTmaLocation.toUpperCase(), level: maxTmaStatus });
        }
      }

      // 3. Proses Log Aktivitas Sistem Kerja Petugas
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
          user: log.user?.name || "Sistem BBWS",
        }));
        setRecentLogs(formattedLogs);
      }

    } catch (error) {
      console.error("Dashboard critical synchronization error:", error);
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
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

  // Kalkulator Irisan Data Paginasi Matriks Sektoral
  const totalPages = Math.ceil(statusMatrix.length / ITEMS_PER_PAGE);
  const currentMatrixItems = statusMatrix.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusColor = (status: MatrixData["status"]) => {
    if (status === "AWAS") return "text-rose-600 bg-rose-50 border-rose-200";
    if (status === "SIAGA") return "text-blue-600 bg-blue-50 border-blue-200";
    if (status === "WASPADA") return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-emerald-600 bg-emerald-50 border-emerald-200";
  };

  const getActionColor = (action: string) => {
    if (action === "UPDATE" || action === "EDIT") return "text-blue-700 bg-blue-50 border-blue-100";
    if (action === "CREATE" || action === "ADD") return "text-emerald-700 bg-emerald-50 border-emerald-100";
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
            Ringkasan Eksekutif Hidrologi
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Pusat Pengendalian Operasional Wilayah Sungai Citarum Hulu
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase text-slate-600 shadow-sm">
          <Calendar size={14} className="text-blue-900" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* METRIK KINERJA UTAMA */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Cakupan Wilayah Kerja</p>
            <Map size={18} className="text-slate-400" />
          </div>
          <h3 className="text-3xl font-black text-blue-950">
            {totalWilayah} <span className="text-xs font-bold text-slate-400">WILAYAH</span>
          </h3>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Stasiun Sensor Terdaftar</p>
            <Radio size={18} className="text-slate-400" />
          </div>
          <h3 className="text-3xl font-black text-blue-950">
            {totalStasiun} <span className="text-xs font-bold text-slate-400">STASIUN</span>
          </h3>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Debit Aliran Rata-rata</p>
            <Waves size={18} className="text-blue-900" />
          </div>
          <h3 className="text-3xl font-black text-blue-950">
            {avgDebit} <span className="text-xs font-bold text-slate-400">m³/s</span>
          </h3>
        </div>

        <div className={`rounded-lg border p-5 shadow-sm ${highestRisk.level !== "NORMAL" ? "bg-rose-50 border-rose-200" : "bg-white border-slate-200"}`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-[10px] font-black uppercase tracking-wider ${highestRisk.level !== "NORMAL" ? "text-rose-700" : "text-slate-400"}`}>Indikator Risiko Tertinggi</p>
            <ShieldAlert size={18} className={highestRisk.level !== "NORMAL" ? "text-rose-600" : "text-slate-400"} />
          </div>
          <h3 className={`text-xl font-black uppercase tracking-tight ${highestRisk.level !== "NORMAL" ? "text-rose-700" : "text-blue-950"}`}>
            {highestRisk.level} ({highestRisk.location})
          </h3>
        </div>
      </div>

      {/* STRUKTUR UTAMA DASHBOARD - SINKRONISASI TINGGI KOTAK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* KIRI: MATRIKS SEKTORAL (DENGAN TINGGI TETAP & PAGINASI) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-115">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3.5 shrink-0">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-950">Matriks Pemantauan Sektoral</h3>
          </div>
          
          <div className="overflow-x-auto flex-1 custom-scrollbar min-h-0">
            <table className="w-full min-w-150 text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider bg-white">Cakupan Wilayah</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider bg-white">Stasiun Pemantau</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider bg-white">TMA terakhir</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider bg-white">Debit Air</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center bg-white">Status Keamanan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-semibold">
                {currentMatrixItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs font-bold uppercase text-slate-400 italic">Belum ada data pemantauan masuk</td>
                  </tr>
                ) : (
                  currentMatrixItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors h-16.25">
                      <td className="p-3 font-bold text-blue-950">{item.region}</td>
                      <td className="p-3 text-slate-500 font-medium">{item.post}</td>
                      <td className="p-3 text-slate-900 font-mono">{item.tma}</td>
                      <td className="p-3 text-slate-900 font-mono">{item.debit}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block min-w-18 text-center px-2 py-1 rounded border text-[9px] font-black tracking-widest ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER CONTROLLER PAGINASI MATRIKS */}
          <div className="shrink-0 border-t border-slate-100 bg-slate-50/50 px-4 py-3 flex items-center justify-between text-xs">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Total: <span className="text-blue-950">{statusMatrix.length}</span> Catatan
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

        {/* KANAN: LOG AKTIVITAS (TINGGI TETAP SINKRON) */}
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
              <div className="h-full w-full flex items-center justify-center text-xs font-bold text-slate-400 uppercase py-12">Tidak ada log transaksi baru</div>
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