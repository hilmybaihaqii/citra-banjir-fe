"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Save,
  MapPin,
  History,
  Activity,
  Clock,
} from "lucide-react";
import { Outfit } from "next/font/google";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const initialRivers = [
  {
    id: 1,
    nama: "Sungai Citarum",
    lokasi: "Dayeuhkolot",
    debit: "450",
    status: "SIAGA 2",
    warna: "text-amber-600",
    bg: "bg-amber-50",
    jam: "11:15",
  },
  {
    id: 2,
    nama: "Sungai Cisangkuy",
    lokasi: "Kamasan",
    debit: "120",
    status: "NORMAL",
    warna: "text-green-600",
    bg: "bg-green-50",
    jam: "10:45",
  },
  {
    id: 3,
    nama: "Sungai Citarum",
    lokasi: "Nanjung",
    debit: "580",
    status: "SIAGA 1",
    warna: "text-red-600",
    bg: "bg-red-50",
    jam: "11:20",
  },
  {
    id: 4,
    nama: "Sungai Cikeruh",
    lokasi: "Cileunyi",
    debit: "85",
    status: "NORMAL",
    warna: "text-green-600",
    bg: "bg-green-50",
    jam: "09:30",
  },
];

export default function UpdateSungaiPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleUpdate = (id: number) => {
    setLoadingId(id);
    setTimeout(() => setLoadingId(null), 1000);
  };

  return (
    <div
      className={`h-screen overflow-y-auto bg-slate-50 ${outfit.className} scroll-smooth`}
    >
      {/* HEADER NAVIGATION */}
      <header className="h-20 bg-blue-950 text-white flex items-center justify-between px-10 shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/bbws"
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
              <h1 className="text-lg font-black uppercase tracking-tight leading-none text-white">
                Update Debit Sungai
              </h1>
              <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-1">
                Kabupaten Bandung • Manajemen Debit
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-amber-400 bg-white">
            <Image
              src="/images/bbws.png"
              alt="Logo BBWS"
              fill
              className="object-contain p-1"
            />
          </div>
        </div>
      </header>

      <main className="p-10 max-w-6xl mx-auto pb-24">
        {/* PENCARIAN & ACTION */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari Nama Sungai atau Lokasi..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-blue-950 shadow-sm outline-none focus:ring-2 focus:ring-blue-950 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            href="/dashboard/bbws/log-aktivitas"
            className="w-full md:w-auto"
          >
            <button className="w-full bg-blue-950 text-white px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-900 transition-all shadow-lg">
              <History size={16} /> Riwayat Debit
            </button>
          </Link>
        </div>

        {/* GRID CARDS (Ukuran Minimalis seperti TMA) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {initialRivers
            .filter(
              (r) =>
                r.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.lokasi.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((river) => (
              <motion.div
                layout
                key={river.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-blue-950 font-black text-base uppercase tracking-tight leading-none">
                      {river.nama}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 mt-1.5">
                      <MapPin size={12} className="text-blue-500" />{" "}
                      {river.lokasi}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${river.bg} ${river.warna} border-current/20`}
                  >
                    {river.status}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                  <div className="flex justify-between items-end">
                    <div className="text-blue-950">
                      <p className="text-[9px] font-bold uppercase opacity-50">
                        Debit Terakhir
                      </p>
                      <p className="text-2xl font-black italic">
                        {river.debit}{" "}
                        <span className="text-[10px] font-normal not-italic opacity-60">
                          m³/s
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold uppercase opacity-40 flex items-center gap-1 justify-end">
                        <Clock size={10} /> {river.jam} WIB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Debit Baru"
                      className="w-full pl-4 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-blue-950 focus:border-amber-500 outline-none transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => handleUpdate(river.id)}
                    disabled={loadingId === river.id}
                    className="bg-amber-400 hover:bg-amber-500 text-blue-950 p-3 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loadingId === river.id ? "..." : <Save size={20} />}
                  </button>
                </div>
              </motion.div>
            ))}
        </div>

        {/* INFO RINGKAS */}
        <div className="p-5 bg-blue-950 rounded-2xl flex items-center gap-4 border-l-8 border-amber-400 shadow-xl">
          <Activity className="text-amber-400 shrink-0" size={20} />
          <p className="text-white text-[10px] font-bold uppercase tracking-widest leading-loose">
            Input debit air dalam satuan{" "}
            <span className="text-amber-400 underline italic">
              meter kubik per detik
            </span>
            . Data akan otomatis memperbarui grafik hidrograf pada dashboard
            utama.
          </p>
        </div>
      </main>
    </div>
  );
}
