"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  History,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  User,
  ShieldCheck,
} from "lucide-react";
import { Outfit } from "next/font/google";
import { apiFetch } from "@/lib/api";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

interface LogEntry {
  id: number;
  action: string;
  description: string;
  createdAt: string;
  user: {
    name: string;
    agency: string;
  } | null;
}

export default function LogAktivitasBMKGPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [logsList, setLogsList] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Pastikan baseUrl terbaca
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchLogs = useCallback(async () => {
    // DEBUG: Cek apakah fungsi ini terpanggil
    console.log("Memulai fetchLogs...");
    console.log("Base URL yang digunakan:", baseUrl);

    setIsLoading(true);
    try {
      const res = await apiFetch(`${baseUrl}/logs`);
      console.log("Status Response API:", res.status);

      const result = await res.json();
      console.log("Data JSON dari API:", result);

      if (res.ok && result.success) {
        setLogsList(result.data);
      } else {
        console.warn(
          "API Berhasil dipanggil tapi success false atau status bukan 200",
        );
      }
    } catch (error) {
      console.error("Gagal total mengambil log aktivitas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    // Set mounted terlebih dahulu
    setIsMounted(true);

    // Panggil logs
    fetchLogs();
  }, [fetchLogs]);

  const handleExportExcel = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Fitur Export sedang dalam pengembangan menggunakan SheetJS!");
    }, 1500);
  };

  const filteredLogs = logsList.filter(
    (log) =>
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
      case "DELETE":
        return "border-rose-200 bg-rose-50 text-rose-700";
      case "UPDATE":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "LOGIN":
        return "border-slate-200 bg-slate-50 text-slate-700";
      default:
        return "border-amber-200 bg-amber-50 text-amber-700";
    }
  };

  if (!isMounted) return null;

  return (
    <div className={`flex flex-col gap-6 pb-12 lg:pb-8 ${outfit.className}`}>
      {/* HEADER SECTION */}
      <div className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-blue-950 md:text-2xl">
            Log Aktivitas BMKG
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Riwayat pembaruan data cuaca dan transaksi sistem otomatis.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative w-full shrink-0 sm:w-64">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari aksi atau petugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchLogs}
              className="flex items-center justify-center rounded-md border border-slate-300 bg-white p-2.5 text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw
                size={18}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
            <button
              onClick={handleExportExcel}
              disabled={isExporting || isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-emerald-600 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm hover:bg-emerald-700 disabled:opacity-70 sm:w-auto"
            >
              {isExporting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileSpreadsheet size={16} />
              )}
              EXPORT
            </button>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm mx-4 sm:mx-0">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full min-w-225 border-collapse text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="w-16 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  No
                </th>
                <th className="w-48 p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Waktu (WIB)
                </th>
                <th className="w-28 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Aktivitas
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Detail Aktivitas
                </th>
                <th className="w-48 p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Personil
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-sm font-bold text-slate-400 italic"
                  >
                    MENYINKRONKAN DATA LOG DARI SERVER...
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="p-4 text-center text-sm font-medium text-slate-500">
                      {index + 1}
                    </td>
                    <td className="p-4 text-sm font-bold text-blue-950">
                      {new Date(log.createdAt).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WIB
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex min-w-20 items-center justify-center rounded border px-2 py-1.5 text-[10px] font-black uppercase tracking-widest ${getActionBadge(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold uppercase text-blue-950 leading-relaxed">
                      {log.description}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                          {log.user ? (
                            <User size={14} />
                          ) : (
                            <ShieldCheck size={14} />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">
                            {log.user?.name || "System"}
                          </p>
                          <p className="text-[9px] font-bold text-amber-600 uppercase tracking-tighter">
                            {log.user?.agency || "AUTOMATED"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center align-middle">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <History size={40} className="mb-4 text-slate-200" />
                      <span className="text-sm font-medium uppercase tracking-widest">
                        Tidak ada riwayat ditemukan.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
