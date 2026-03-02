"use client";

import React, { useState } from "react";
import {
  Search,
  History,
  FileSpreadsheet,
  Loader2
} from "lucide-react";

// Mock Data Log Khusus BPBD Jabar
const MOCK_LOGS = [
  { id: 1, time: "01 Mar 2026, 14:30 WIB", userName: "Komandan BPBD Jabar", action: "UPDATE", detail: "Mengubah status Siaga 1 di Baleendah" },
  { id: 2, time: "01 Mar 2026, 12:15 WIB", userName: "Petugas Lapangan", action: "ADD", detail: "Menambah laporan dampak di Dayeuhkolot" },
  { id: 3, time: "01 Mar 2026, 09:05 WIB", userName: "Petugas Lapangan", action: "LOGIN", detail: "Masuk ke sistem dashboard" },
  { id: 4, time: "28 Feb 2026, 22:45 WIB", userName: "Komandan BPBD Jabar", action: "SETTING", detail: "Memperbarui konfigurasi notifikasi darurat" },
  { id: 5, time: "28 Feb 2026, 18:12 WIB", userName: "Petugas Lapangan", action: "DELETE", detail: "Menghapus data duplikat wilayah Bojongsoang" },
  { id: 6, time: "28 Feb 2026, 15:00 WIB", userName: "Admin BPBD", action: "UPDATE", detail: "Sinkronisasi data koordinat peta" },
  { id: 7, time: "27 Feb 2026, 21:30 WIB", userName: "Petugas Lapangan", action: "UPDATE", detail: "Memperbarui jumlah pengungsi di Tegalluar" },
];

export default function BPBDLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExportExcel = () => {
    setIsExporting(true);
    // Simulasi proses pembuatan file Excel
    setTimeout(() => {
      setIsExporting(false);
      alert("Berkas Excel 'Log_Aktivitas_BPBD_Jabar.xlsx' berhasil diunduh!");
    }, 2000);
  };

  const filteredLogs = MOCK_LOGS.filter(log => 
    log.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.detail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActionBadge = (action: string) => {
    switch (action) {
      case "ADD": return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "DELETE": return "bg-rose-100 text-rose-800 border-rose-300";
      case "UPDATE": return "bg-blue-100 text-blue-800 border-blue-300";
      case "LOGIN": return "bg-slate-200 text-slate-800 border-slate-300";
      case "SETTING": return "bg-amber-100 text-amber-800 border-amber-300";
      default: return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="p-6 lg:p-10 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto"> 

        {/* Header Konten */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tight">Log Aktivitas BPBD</h1>
            <p className="text-slate-600 text-sm mt-1 tracking-wide font-medium">Riwayat perubahan data dan aksi personil BPBD Jabar.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Cari aksi/personil..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-blue-950 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 w-full sm:w-64 transition-all"
              />
            </div>
            
            {/* Tombol Export Excel */}
            <button 
              onClick={handleExportExcel}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors shadow-sm shrink-0 disabled:opacity-70 disabled:cursor-wait min-w-40"
            >
              {isExporting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Mengunduh
                </>
              ) : (
                <>
                  <FileSpreadsheet size={16} /> Export Excel
                </>
              )}
            </button>
          </div>
        </div>

        {/* TABEL LOG PERUBAHAN */}
        <div className="bg-white border border-slate-300 rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-200">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="p-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest w-16 text-center">No</th>
                  <th className="p-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest w-56">Waktu (WIB)</th>
                  <th className="p-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest w-40 text-center">Aktivitas</th>
                  <th className="p-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest">Detail & Personil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm text-slate-700 text-center font-bold">{index + 1}</td>
                      <td className="p-4 text-sm font-bold text-blue-950">
                        {log.time}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest border min-w-24 ${getActionBadge(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-bold text-blue-950 uppercase tracking-tight">{log.detail}</p>
                        <p className="text-[11px] text-slate-600 mt-1 font-bold tracking-widest uppercase">
                          Oleh: {log.userName}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-16">
                      <div className="w-full flex flex-col items-center justify-center text-center text-slate-500 font-medium italic">
                        <History size={40} className="text-slate-300 mb-4" />
                        <span>Tidak ada riwayat aktivitas ditemukan.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Minimalis */}
          <div className="p-4 border-t border-slate-300 bg-slate-50 flex items-center justify-between">
            <p className="text-xs text-slate-700 font-medium">Menampilkan <span className="font-bold text-blue-950">{filteredLogs.length}</span> log aktivitas</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-300 rounded-sm text-[10px] uppercase tracking-widest font-bold text-slate-500 bg-slate-100 cursor-not-allowed transition-all">Prev</button>
              <button className="px-4 py-2 border border-slate-300 rounded-sm text-[10px] uppercase tracking-widest font-bold text-blue-950 bg-white hover:bg-slate-100 hover:border-blue-950 transition-all">Next</button>
            </div>
          </div>
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}