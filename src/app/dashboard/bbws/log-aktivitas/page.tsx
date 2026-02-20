"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  User,
  Clock,
  Database,
  FileText,
  AlertTriangle,
  CloudRain,
  Waves,
} from "lucide-react";
import { Outfit } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const initialLogs = [
  {
    id: 1,
    admin: "Petugas_BMKG_01",
    aksi: "Update Curah Hujan",
    detail: "Pos Nanjung: 12mm/hr (Status: Waspada)",
    waktu: "5 Menit yang lalu",
    tipe: "presipitasi",
  },
  {
    id: 2,
    admin: "Admin_BBWS_Pusat",
    aksi: "Update Tinggi Air",
    detail: "Dayeuhkolot: 120cm -> 155cm",
    waktu: "25 Menit yang lalu",
    tipe: "update",
  },
  {
    id: 3,
    admin: "Superuser_Citra",
    aksi: "Tambah User Baru",
    detail: "Menambahkan akses untuk instansi BPBD",
    waktu: "2 Jam yang lalu",
    tipe: "user",
  },
  {
    id: 4,
    admin: "Petugas_BBWS_Field",
    aksi: "Update Debit Sungai",
    detail: "Cisangkuy: 120 m³/s -> 145 m³/s",
    waktu: "4 Jam yang lalu",
    tipe: "update",
  },
  {
    id: 5,
    admin: "System_Security",
    aksi: "Login Gagal",
    detail: "Upaya login tidak sah dari IP 182.1.22.9",
    waktu: "Kemarin",
    tipe: "danger",
  },
];

export default function LogAktivitasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs] = useState(initialLogs);
  const [isExporting, setIsExporting] = useState(false);

  const getLogIcon = (tipe: string) => {
    switch (tipe) {
      case "presipitasi":
        return <CloudRain size={18} />;
      case "update":
        return <Waves size={18} />;
      case "user":
        return <User size={18} />;
      case "danger":
        return <AlertTriangle size={18} />;
      default:
        return <Database size={18} />;
    }
  };

  const getLogColor = (tipe: string) => {
    switch (tipe) {
      case "presipitasi":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "update":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "user":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "danger":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const handleExportExcel = () => {
    setIsExporting(true);
    // Simulasi proses export
    setTimeout(() => {
      setIsExporting(false);
      alert("Log Aktivitas berhasil di-export ke format .xlsx (Excel)");
    }, 1500);
  };

  return (
    <div
      className={`h-screen flex flex-col bg-slate-50 ${outfit.className} overflow-hidden`}
    >
      {/* HEADER - Navbar Full ke Atas */}
      <header className="h-16 md:h-20 bg-blue-950 text-white flex items-center justify-between px-4 md:px-10 shadow-lg shrink-0 z-50">
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/dashboard/bbws"
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-amber-400"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3 border-l pl-3 md:pl-4 border-white/10">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image
                src="/images/logo-citra-banjir2.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xs md:text-lg font-black uppercase tracking-tight leading-none text-white">
                Log Aktivitas
              </h1>
              <p className="text-[8px] md:text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-1">
                BBWS Citarum
              </p>
            </div>
          </div>
        </div>

        <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-amber-400 bg-white shadow-md shrink-0">
          <Image
            src="/images/bbws.png"
            alt="Logo BBWS"
            fill
            className="object-contain p-1"
          />
        </div>
      </header>

      {/* MAIN AREA - Scrollable */}
      <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
        <div className="p-4 md:p-10 max-w-6xl mx-auto pb-24 text-blue-950">
          {/* ACTION BAR */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="relative flex-1 w-full text-blue-950">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari aktivitas, petugas, atau detail..."
                className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold shadow-sm focus:ring-2 focus:ring-blue-950 outline-none transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 md:py-4 bg-blue-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-900 shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              <FileText size={16} />{" "}
              {isExporting ? "Processing..." : "Export Log (.xlsx)"}
            </button>
          </div>

          {/* LOG LIST */}
          <div className="space-y-3 md:space-y-4">
            <AnimatePresence initial={false}>
              {logs
                .filter(
                  (log) =>
                    log.admin
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    log.aksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    log.detail.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 md:gap-5">
                      <div
                        className={`p-3 md:p-4 rounded-xl border shrink-0 ${getLogColor(log.tipe)}`}
                      >
                        {getLogIcon(log.tipe)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-black text-blue-950 text-xs md:text-sm uppercase tracking-tight">
                            {log.aksi}
                          </h3>
                          <span className="text-[8px] md:text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full flex items-center gap-1">
                            <Clock size={10} /> {log.waktu}
                          </span>
                        </div>
                        <p className="text-blue-950/70 text-xs md:text-sm font-medium">
                          {log.detail}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <div className="w-5 h-5 rounded-full bg-blue-950 flex items-center justify-center text-[8px] text-white font-bold uppercase">
                            {log.admin.charAt(0)}
                          </div>
                          <span className="text-[9px] md:text-[10px] font-black text-blue-950/40 uppercase tracking-tighter">
                            Oleh:{" "}
                            <span className="text-blue-600">{log.admin}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Tombol Detail Dihapus Sesuai Permintaan */}
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {/* FOOTER NOTICE */}
          <div className="mt-10 p-5 md:p-6 bg-blue-950 rounded-2xl border-l-8 border-amber-400 flex items-start md:items-center gap-4 shadow-xl">
            <Database
              className="text-amber-400 shrink-0 mt-1 md:mt-0"
              size={24}
            />
            <p className="text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-loose opacity-80">
              Seluruh aktivitas dicatat otomatis sebagai protokol{" "}
              <span className="text-amber-400">Keamanan Data Nasional</span>.
              Riwayat ini bersifat permanen dan tidak dapat dimanipulasi.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
