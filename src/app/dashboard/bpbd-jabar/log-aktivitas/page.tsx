"use client";

import React, { useState } from "react";
import {
  Search,
  History,
  FileSpreadsheet,
  Loader2
} from "lucide-react";

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
      case "ADD": return "border-emerald-200 bg-emerald-50 text-emerald-700";
      case "DELETE": return "border-rose-200 bg-rose-50 text-rose-700";
      case "UPDATE": return "border-blue-200 bg-blue-50 text-blue-700";
      case "LOGIN": return "border-slate-200 bg-slate-50 text-slate-700";
      case "SETTING": return "border-amber-200 bg-amber-50 text-amber-700";
      default: return "border-slate-200 bg-slate-50 text-slate-700";
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 lg:pb-8">
      <div className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-blue-950 md:text-2xl">
            Log Aktivitas BPBD
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Riwayat perubahan data dan aksi personil BPBD Jabar.
          </p>
        </div>
        
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative w-full shrink-0 sm:w-64">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari aksi atau personil..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
            />
          </div>
          
          <button 
            onClick={handleExportExcel}
            disabled={isExporting}
            className="flex w-full min-w-35 shrink-0 items-center justify-center gap-2 rounded-md bg-emerald-600 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> MENGUNDUH
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
                <th className="w-28 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Aktivitas</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Detail Laporan</th>
                <th className="w-48 p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Pengguna</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr key={log.id} className="transition-colors hover:bg-slate-50">
                    <td className="p-4 text-center text-sm font-medium text-slate-500">{index + 1}</td>
                    
                    <td className="p-4 text-sm font-bold text-blue-950">
                      {log.time}
                    </td>
                    
                    <td className="p-4 text-center">
                      <span className={`inline-flex min-w-20 items-center justify-center rounded border px-2 py-1.5 text-[10px] font-black uppercase tracking-widest ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <p className="text-sm font-bold uppercase text-blue-950">{log.detail}</p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-bold text-slate-700">{log.userName}</p>
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
          <p className="text-xs font-medium text-slate-600">
            Menampilkan <span className="font-bold text-blue-950">{filteredLogs.length}</span> log aktivitas
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            <button className="flex-1 cursor-not-allowed rounded-md border border-slate-200 bg-slate-100 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:flex-none">
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