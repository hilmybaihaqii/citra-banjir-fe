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
  ChevronRight,
  CloudRain,
  ShieldCheck,
  CloudSun,
} from "lucide-react";
import { Outfit } from "next/font/google";
import { motion } from "framer-motion";
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
    admin: "Prakirawan_Jabar",
    aksi: "Update Prakiraan Cuaca",
    detail: "Bandung Raya: Berawan -> Hujan Ringan",
    waktu: "45 Menit yang lalu",
    tipe: "weather",
  },
  {
    id: 3,
    admin: "Admin_BMKG_Pusat",
    aksi: "Tambah User Baru",
    detail: "Menambahkan akses petugas_lapangan_02",
    waktu: "3 Jam yang lalu",
    tipe: "user",
  },
  {
    id: 4,
    admin: "System_Security",
    aksi: "Login Sukses",
    detail: "Sesi dimulai dari perangkat Desktop (Chrome)",
    waktu: "5 Jam yang lalu",
    tipe: "system",
  },
  {
    id: 5,
    admin: "Admin_BMKG_Pusat",
    aksi: "Login Gagal",
    detail: "Upaya login tidak sah dari IP 112.12.99.1",
    waktu: "Kemarin",
    tipe: "danger",
  },
];

export default function LogAktivitasBMKGPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getLogIcon = (tipe: string) => {
    switch (tipe) {
      case "presipitasi":
        return <CloudRain size={18} />;
      case "weather":
        return <CloudSun size={18} />;
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
      case "weather":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "user":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "danger":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div
      className={`h-screen overflow-y-auto bg-slate-50 ${outfit.className} scroll-smooth`}
    >
      {/* HEADER */}
      <header className="h-20 bg-blue-950 text-white flex items-center justify-between px-10 shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/bmkg"
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-amber-400"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3 border-l pl-4 border-white/10">
            <div className="relative w-8 h-8">
              <Image
                src="/images/citrabanjir.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight leading-none">
                Log Aktivitas
              </h1>
              <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-1">
                BMKG • Riwayat Transaksi Data
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-blue-900/50 px-4 py-2 rounded-lg border border-white/5">
          <ShieldCheck className="text-amber-400" size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Sistem Terverifikasi
          </span>
        </div>
      </header>

      <main className="p-10 max-w-6xl mx-auto pb-24">
        {/* ACTION BAR (Tanpa Filter) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari aktivitas atau nama petugas BMKG..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-blue-950 shadow-sm focus:ring-2 focus:ring-blue-950 outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Hanya tombol Export yang tersisa */}
          <button className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-lg">
            <FileText size={16} /> Export Log
          </button>
        </div>

        {/* LOG LIST */}
        <div className="space-y-4">
          {initialLogs
            .filter(
              (log) =>
                log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.aksi.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((log) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={log.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-5">
                  <div
                    className={`p-4 rounded-xl border shrink-0 ${getLogColor(log.tipe)}`}
                  >
                    {getLogIcon(log.tipe)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-blue-950 text-sm uppercase tracking-tight">
                        {log.aksi}
                      </h3>
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full flex items-center gap-1">
                        <Clock size={10} /> {log.waktu}
                      </span>
                    </div>
                    <p className="text-blue-950/70 text-sm font-medium">
                      {log.detail}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-5 h-5 rounded-full bg-blue-950 flex items-center justify-center text-[8px] text-white font-bold uppercase">
                        {log.admin.charAt(0)}
                      </div>
                      <span className="text-[10px] font-black text-blue-950/40 uppercase tracking-tighter">
                        Oleh: <span className="text-blue-600">{log.admin}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-950 border border-transparent hover:border-slate-200 rounded-lg transition-all">
                  Detail <ChevronRight size={14} />
                </button>
              </motion.div>
            ))}
        </div>

        {/* FOOTER NOTICE */}
        <div className="mt-12 p-6 bg-blue-950 rounded-2xl border-l-8 border-amber-400 flex items-center gap-4 shadow-xl">
          <Database className="text-amber-400 shrink-0" size={24} />
          <p className="text-white text-[10px] font-bold uppercase tracking-widest leading-loose opacity-80">
            Seluruh aktivitas dicatat otomatis oleh sistem sebagai bagian dari
            protokol{" "}
            <span className="text-amber-400">Keamanan Data Nasional</span>.
            Riwayat ini tidak dapat dimanipulasi oleh pihak manapun.
          </p>
        </div>
      </main>
    </div>
  );
}
