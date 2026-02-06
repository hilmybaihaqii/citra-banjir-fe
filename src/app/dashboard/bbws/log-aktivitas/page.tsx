"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Filter,
  User,
  Clock,
  Database,
  FileText,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Outfit } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const initialLogs = [
  {
    id: 1,
    admin: "Admin Dinas",
    aksi: "Update Tinggi Air",
    detail: "Dayeuhkolot: 120cm -> 155cm",
    waktu: "10 Menit yang lalu",
    tipe: "update",
  },
  {
    id: 2,
    admin: "Superuser_BBWS",
    aksi: "Tambah User Baru",
    detail: "Menambahkan petugas_rancaekek",
    waktu: "2 Jam yang lalu",
    tipe: "user",
  },
  {
    id: 3,
    admin: "Petugas Lapangan",
    aksi: "Login Sistem",
    detail: "Login sukses dari IP 110.12.33.1",
    waktu: "3 Jam yang lalu",
    tipe: "system",
  },
  {
    id: 4,
    admin: "Petugas Lapangan",
    aksi: "Update Tinggi Air",
    detail: "Baleendah: 150cm -> 140cm",
    waktu: "5 Jam yang lalu",
    tipe: "update",
  },
  {
    id: 5,
    admin: "Admin Dinas",
    aksi: "Hapus Titik Sungai",
    detail: "Menghapus titik pantau Sungai Cikijing",
    waktu: "Kemarin",
    tipe: "danger",
  },
  // Data tambahan untuk mengetes scroll
  {
    id: 6,
    admin: "Admin Dinas",
    aksi: "Update Bendungan",
    detail: "Cipanunjang: Kapasitas Normal",
    waktu: "Kemarin",
    tipe: "update",
  },
];

export default function LogAktivitasPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    /* PERBAIKAN: Mengaktifkan scroll pada layar penuh */
    <div
      className={`h-screen overflow-y-auto bg-slate-50 ${outfit.className} scroll-smooth`}
    >
      {/* HEADER: Sticky agar tidak ikut tergulung */}
      <header className="h-20 bg-blue-950 text-white flex items-center justify-between px-10 shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/bbws"
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-amber-400"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight leading-none text-white">
              Log Aktivitas
            </h1>
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-1">
              Audit Trail & Riwayat Operasi Sistem
            </p>
          </div>
        </div>
        <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-amber-400 bg-white">
          <Image
            src="/images/bbws-logo.jpg"
            alt="Logo"
            fill
            className="object-contain p-1"
          />
        </div>
      </header>

      <main className="p-10 max-w-5xl mx-auto pb-20">
        {/* ACTION BAR */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-24 z-40 bg-slate-50/90 backdrop-blur-sm py-2">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari aktivitas atau nama petugas..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-sm text-sm text-blue-950 focus:ring-2 focus:ring-blue-950 outline-none transition-all font-medium shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 rounded-sm text-[10px] font-black text-blue-950 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Filter size={16} /> Filter Tipe
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-950 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-md">
              <FileText size={16} /> Export Log
            </button>
          </div>
        </div>

        {/* LIST LOGS */}
        <div className="space-y-3">
          {initialLogs
            .filter(
              (log) =>
                log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.aksi.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((log) => (
              <div
                key={log.id}
                className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm hover:shadow-md transition-all border-l-4 group"
                style={{
                  borderLeftColor:
                    log.tipe === "update"
                      ? "#1d4ed8"
                      : log.tipe === "user"
                        ? "#f59e0b"
                        : log.tipe === "danger"
                          ? "#dc2626"
                          : "#475569",
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-sm ${
                        log.tipe === "update"
                          ? "bg-blue-50 text-blue-700"
                          : log.tipe === "user"
                            ? "bg-amber-50 text-amber-600"
                            : log.tipe === "danger"
                              ? "bg-red-50 text-red-600"
                              : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {log.tipe === "update" ? (
                        <Database size={20} />
                      ) : log.tipe === "user" ? (
                        <User size={20} />
                      ) : (
                        <Clock size={20} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-blue-950 text-sm uppercase tracking-tight">
                          {log.aksi}
                        </h3>
                        <span className="text-[9px] font-black px-2 py-0.5 bg-slate-100 text-slate-500 rounded-sm uppercase tracking-wider">
                          {log.waktu}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mt-1 font-medium italic">
                        &quot;{log.detail}&quot;
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-4 h-4 rounded-full bg-blue-950 flex items-center justify-center text-[8px] text-white font-bold">
                          {log.admin.charAt(0)}
                        </div>
                        <span className="text-[10px] font-black text-blue-950 uppercase tracking-tighter">
                          Petugas: {log.admin}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-950 transition-colors">
                    Detail <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* INFO FOOTER */}
        <div className="mt-10 p-4 bg-blue-50 border border-blue-200 rounded-sm flex items-center gap-3 shadow-sm text-blue-900">
          <AlertTriangle className="text-blue-700 shrink-0" size={20} />
          <p className="text-[10px] font-bold uppercase tracking-wide">
            Data riwayat aktivitas ini bersifat permanen dan tidak dapat dihapus
            untuk keperluan audit internal BBWS.
          </p>
        </div>
      </main>
    </div>
  );
}
