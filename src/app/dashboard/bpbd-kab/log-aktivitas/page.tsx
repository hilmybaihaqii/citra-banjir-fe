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
import Cookies from "js-cookie";
import * as XLSX from "xlsx";

interface ActivityLog {
  id: number;
  action: string;
  description: string;
  createdAt: string;
  user: {
    name: string;
    agency: string;
  };
}

export default function BPBDKabLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
  };

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("auth_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/logs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (res.ok) {
        const logsData = data.data?.items || data.data || data || [];
        setLogs(logsData);
      }
    } catch (error) {
      console.error("Gagal menarik data log:", error);
      showToast("Gagal memuat log aktivitas server.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    setIsMounted(true);
    fetchLogs();
  }, [fetchLogs]);

  const handleExportExcel = () => {
    if (logs.length === 0) {
      showToast("Tidak ada data untuk diekspor", "error");
      return;
    }
    
    setIsExporting(true);
    
    try {
      const excelData = logs.map((log, index) => ({
        "No": index + 1,
        "Waktu (WIB)": formatDate(log.createdAt),
        "Aksi": log.action,
        "Deskripsi Laporan": log.description,
        "Nama Pengguna": log.user?.name || "Sistem",
        "Instansi": log.user?.agency || "-",
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Log Aktivitas");

      const wscols = [
        { wch: 5 },
        { wch: 15 },
        { wch: 50 },
        { wch: 25 }, 
        { wch: 20 } 
      ];
      worksheet["!cols"] = wscols;

      XLSX.writeFile(workbook, `Log_Aktivitas_${new Date().getTime()}.xlsx`);
      showToast("Berkas Excel berhasil diunduh!", "success");
    } catch (error) {
      console.error("Gagal export excel:", error);
      showToast("Terjadi kesalahan saat membuat file Excel.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";
  };

  const getActionBadge = (action: string) => {
    const act = action?.toUpperCase();
    switch (act) {
      case "CREATE": 
      case "ADD": 
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
      case "DELETE": 
        return "border-rose-200 bg-rose-50 text-rose-700";
      case "UPDATE": 
      case "EDIT":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "LOGIN": 
        return "border-indigo-200 bg-indigo-50 text-indigo-700";
      case "SETTING": 
        return "border-amber-200 bg-amber-50 text-amber-700";
      default: 
        return "border-slate-200 bg-slate-50 text-slate-700";
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-6 p-4 pb-12 sm:p-6 lg:pb-8 w-full max-w-350 mx-auto relative">
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

      <div className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Log Aktivitas
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Riwayat perubahan data dan aksi pada sistem dashboard.
          </p>
        </div>
        
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative w-full shrink-0 sm:w-72">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari aksi, detail, atau personil..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
            />
          </div>
          
          <button 
            onClick={handleExportExcel}
            disabled={isExporting || isLoading || logs.length === 0}
            className="flex w-full shrink-0 items-center justify-center gap-2 rounded-md bg-emerald-600 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed sm:w-auto"
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

      <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full min-w-225 border-collapse text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="w-16 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">No</th>
                <th className="w-48 p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Waktu (WIB)</th>
                <th className="w-32 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Aktivitas</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Detail Laporan</th>
                <th className="w-56 p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Pengguna</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="mx-auto mb-2 animate-spin text-slate-300" size={32} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Mengambil Data Log...
                    </span>
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr key={log.id} className="transition-colors hover:bg-slate-50 group">
                    <td className="p-4 text-center text-sm font-medium text-slate-500 whitespace-nowrap">{index + 1}</td>
                    
                    <td className="p-4 text-sm font-bold text-slate-700 whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    
                    <td className="p-4 text-center">
                      <span className={`inline-flex min-w-20 items-center justify-center rounded border px-2 py-1.5 text-[10px] font-black uppercase tracking-widest ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <p className="text-sm font-bold text-blue-950 line-clamp-2">{log.description}</p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-bold uppercase text-slate-700 line-clamp-1">{log.user?.name || "Sistem"}</p>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 line-clamp-1">
                        {log.user?.agency?.replace("_", " ") || "Tidak diketahui"}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center align-middle">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <History size={32} className="mb-3 text-slate-300" />
                      <span className="text-sm font-medium">Tidak ada riwayat aktivitas ditemukan.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:gap-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Total Rekaman: <span className="font-black text-blue-950">{filteredLogs.length}</span> log
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            <button className="flex-1 cursor-not-allowed rounded-md border border-slate-200 bg-slate-100 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:flex-none transition-all">
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