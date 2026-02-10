"use client";

import React, { useState } from "react";
import {
  Waves,
  ArrowLeft,
  Plus,
  Search,
  Edit3,
  Trash2,
  MapPin,
  Droplets,
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

// Mock Data Sungai di wilayah Kabupaten Bandung
const initialRivers = [
  {
    id: 1,
    nama: "Sungai Citarum",
    lokasi: "Dayeuhkolot",
    tma: "155 cm",
    status: "SIAGA 2",
    warna: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    id: 2,
    nama: "Sungai Cisangkuy",
    lokasi: "Kamasan",
    tma: "120 cm",
    status: "NORMAL",
    warna: "text-green-600",
    bg: "bg-green-50",
  },
  {
    id: 3,
    nama: "Sungai Citarum",
    lokasi: "Nanjung",
    tma: "180 cm",
    status: "SIAGA 1",
    warna: "text-red-600",
    bg: "bg-red-50",
  },
  {
    id: 4,
    nama: "Sungai Cikeruh",
    lokasi: "Cileunyi",
    tma: "90 cm",
    status: "NORMAL",
    warna: "text-green-600",
    bg: "bg-green-50",
  },
  {
    id: 5,
    nama: "Sungai Citepus",
    lokasi: "Cangkuang Wetan",
    tma: "110 cm",
    status: "WASPADA",
    warna: "text-orange-500",
    bg: "bg-orange-50",
  },
];

export default function UpdateSungaiPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    /* PERBAIKAN: Menggunakan h-screen dan overflow-y-auto agar bisa di-scroll */
    <div
      className={`h-screen overflow-y-auto bg-slate-50 ${outfit.className} scroll-smooth`}
    >
      {/* HEADER: Sticky tetap berfungsi */}
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
              Manajemen Sungai
            </h1>
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-1">
              Pengaturan Titik Pantau Aliran Sungai
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

      <main className="p-10 max-w-6xl mx-auto pb-20">
        {/* ACTION BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama sungai atau lokasi..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-sm text-sm text-blue-950 focus:ring-2 focus:ring-blue-950 outline-none transition-all font-medium shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="w-full md:w-auto bg-blue-950 hover:bg-amber-400 hover:text-blue-950 text-white font-black px-8 py-3 rounded-sm uppercase text-[10px] tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-3">
            <Plus size={18} /> Tambah Titik Sungai
          </button>
        </div>

        {/* TABEL SUNGAI */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 text-[10px] font-black text-blue-950 uppercase tracking-widest">
                    Detail Sungai
                  </th>
                  <th className="p-5 text-[10px] font-black text-blue-950 uppercase tracking-widest text-center">
                    TMA Saat Ini
                  </th>
                  <th className="p-5 text-[10px] font-black text-blue-950 uppercase tracking-widest text-center">
                    Status
                  </th>
                  <th className="p-5 text-[10px] font-black text-blue-950 uppercase tracking-widest text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initialRivers
                  .filter(
                    (r) =>
                      r.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      r.lokasi.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((river) => (
                    <tr
                      key={river.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-50 rounded-sm text-blue-600">
                            <Waves size={20} />
                          </div>
                          <div>
                            <p className="font-black text-blue-950 text-sm uppercase leading-none">
                              {river.nama}
                            </p>
                            <div className="flex items-center gap-1 mt-1.5 text-slate-500">
                              <MapPin size={12} />
                              <span className="text-[10px] font-bold uppercase tracking-tighter">
                                {river.lokasi}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-black text-blue-950 italic">
                            {river.tma}
                          </span>
                          <div className="flex items-center gap-1 text-[8px] text-slate-400 font-bold uppercase mt-1">
                            <Droplets size={10} /> Real-time
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div
                          className={`mx-auto w-fit px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${river.bg} ${river.warna} border border-current/20 shadow-sm`}
                        >
                          {river.status}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-all"
                            title="Edit Data"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all"
                            title="Hapus Sungai"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button className="p-2 text-blue-950 hover:bg-slate-100 rounded-sm transition-all">
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="mt-8 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-sm">
          <AlertTriangle className="text-amber-600 shrink-0" size={20} />
          <p className="text-[10px] text-amber-800 font-bold uppercase tracking-wide">
            Peringatan: Perubahan data pada daftar sungai akan mempengaruhi
            tampilan dashboard publik secara langsung.
          </p>
        </div>
      </main>
    </div>
  );
}
