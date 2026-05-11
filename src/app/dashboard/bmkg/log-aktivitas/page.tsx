"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  History, 
  FileSpreadsheet, 
  Loader2,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Outfit } from "next/font/google";
import Cookies from "js-cookie";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

// Interface disesuaikan dengan payload API Backend
interface LogData {
  id: number;
  action: string;
  description: string;
  createdAt: string;
  user?: {
    name: string;
    agency?: string;
  };
}

export default function LogAktivitasBMKGPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [logs, setLogs] = useState<LogData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
  };

  // 1. FETCH DATA LOGS DARI API KHUSUS BMKG
  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch(`${API_URL}/bmkg/logs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        const logsData: LogData[] = data.data?.items || data.data || data || [];
        
        // Urutkan dari log terbaru ke terlama
        logsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLogs(logsData);
      } else {
        throw new Error("Gagal mengambil data dari server");
      }
    } catch (error) {
      console.error("Gagal menarik data log:", error);
      showToast("Gagal memuat riwayat aktivitas BMKG.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    setIsMounted(true);
    fetchLogs();
  }, [fetchLogs]);

  // 2. EXPORT EXCEL DARI API BMKG
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch(`${API_URL}/bmkg/logs/export`, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) throw new Error("Gagal mengunduh file Excel");

      // Menangani response berupa file Blob
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Log_Aktivitas_BMKG_Jabar_${new Date().getTime()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      showToast("Berkas Excel BMKG berhasil diunduh!", "success");
    } catch (error) {
      console.error("Export error:", error);
      showToast("Terjadi kesalahan saat mengunduh berkas.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  // FILTER PENCARIAN
  const filteredLogs = logs.filter((log) => {
    const userName = log.user?.name || "Sistem";
    const searchLower = searchQuery.toLowerCase();
    
    return (
      userName.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      log.description.toLowerCase().includes(searchLower)
    );
  });

  // FORMAT WARNA BADGE (Termasuk custom action BMKG)
  const getActionBadge = (action: string) => {
    switch (action.toUpperCase()) {
      case "ADD":
      case "CREATE":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
      case "DELETE":
      case "DANGER":
        return "border-rose-200 bg-rose-50 text-rose-700";
      case "UPDATE":
      case "EDIT":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "WEATHER":
        return "border-amber-200 bg-amber-50 text-amber-700";
      case "LOGIN":
      case "AUTH":
        return "border-slate-200 bg-slate-100 text-slate-700";
      case "SETTING":
        return "border-purple-200 bg-purple-50 text-purple-700";
      default:
        return "border-slate-200 bg-slate-50 text-slate-700";
    }
  };

  // FORMAT TANGGAL
  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString("id-ID", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    }).replace(".", ":") + " WIB";
  };

  if (!isMounted) return null;

  return (
    <div className={`flex flex-col gap-6 p-4 pb-12 sm:p-6 lg:pb-8 w-full max-w- mx-auto relative animate-in fade-in duration-500 ${outfit.className}`}>
      
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={`fixed z-200 flex items-center gap-3 rounded-lg border px-4 py-3.5 shadow-2xl backdrop-blur-md bottom-20 left-4 right-4 sm:bottom-10 sm:left-auto sm:right-10 sm:max-w-md ${
              toast.type === "success"
                ? "border-emerald-200/60 bg-emerald-50/95 text-emerald-700"
                : "border-rose-200/60 bg-rose-50/95 text-rose-700"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
            ) : (
              <XCircle size={20} className="shrink-0 text-rose-600" />
            )}
            <p className="text-sm font-bold tracking-wide">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <div className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-blue-950 md:text-2xl">
            Log Aktivitas BMKG
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Riwayat pembaruan data cuaca dan transaksi sistem BMKG Provinsi Jawa Barat.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative w-full shrink-0 sm:w-72">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari aksi atau personil..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          
          <button 
            onClick={handleExportExcel}
            disabled={isExporting || isLoading || logs.length === 0}
            className="flex w-full min-w-40 shrink-0 items-center justify-center gap-2 rounded-md bg-emerald-600 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98] sm:w-auto"
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> MENGUNDUH...
              </>
            ) : (
              <>
                <FileSpreadsheet size={16} /> EXPORT EXCEL
              </>
            )}
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full min-w-200 border-collapse text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="w-16 p-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">No</th>
                <th className="w-48 p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Waktu (WIB)</th>
                <th className="w-32 p-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">Aktivitas</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Detail Laporan</th>
                <th className="w-56 p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Personil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                      <Loader2 size={32} className="animate-spin text-blue-600" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Memuat Riwayat Aktivitas...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr key={log.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="p-4 text-center text-sm font-bold text-slate-400">{index + 1}</td>
                    
                    <td className="p-4 text-xs font-bold text-slate-600 tracking-wide">
                      {formatDate(log.createdAt)}
                    </td>
                    
                    <td className="p-4 text-center">
                      <span className={`inline-flex min-w-20 items-center justify-center rounded-md border px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <p className="text-sm font-bold text-blue-950 leading-relaxed">{log.description}</p>
                    </td>

                    <td className="p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-700">{log.user?.name || "Sistem BMKG"}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{log.user?.agency?.replace("_", " ") || "STASIUN METEOROLOGI"}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center align-middle">
                    <div className="flex flex-col items-center justify-center text-slate-500 gap-3">
                      <div className="p-4 bg-slate-100 rounded-full text-slate-300">
                        <History size={32} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">Tidak ada riwayat aktivitas ditemukan.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER PAGING */}
        <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:gap-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Menampilkan <span className="text-blue-950">{filteredLogs.length}</span> log aktivitas
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            <button className="flex-1 cursor-not-allowed rounded-md border border-slate-200 bg-slate-100 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-all sm:flex-none">
              PREV
            </button>
            <button className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-blue-950 shadow-sm transition-colors hover:bg-slate-50 hover:border-blue-950 sm:flex-none">
              NEXT
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}