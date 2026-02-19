"use client";

import React, { useState } from "react";
import {
  Waves,
  Search,
  Save,
  AlertCircle,
  ArrowLeft,
  History,
  Clock,
} from "lucide-react";
import { Outfit } from "next/font/google";
import { motion } from "framer-motion"; // FIX: AnimatePresence dihapus karena tidak digunakan
import Link from "next/link";
import Image from "next/image";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const initialTMAData = [
  {
    id: 1,
    lokasi: "Dayeuhkolot",
    sungai: "Citarum",
    tinggi: 120,
    status: "Aman",
    jam: "16:45",
  },
  {
    id: 2,
    lokasi: "Baleendah",
    sungai: "Citarum",
    tinggi: 150,
    status: "Waspada",
    jam: "16:30",
  },
  {
    id: 3,
    lokasi: "Bojongsoang",
    sungai: "Cisangkuy",
    tinggi: 110,
    status: "Aman",
    jam: "16:20",
  },
  {
    id: 4,
    lokasi: "Sapan",
    sungai: "Cikeruh",
    tinggi: 180,
    status: "Siaga",
    jam: "17:00",
  },
];

export default function UpdateTMAPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleUpdate = (id: number) => {
    setLoadingId(id);
    setTimeout(() => setLoadingId(null), 1000); // Simulasi simpan
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
              <h1 className="text-lg font-black uppercase tracking-tight leading-none">
                Update Tinggi Air
              </h1>
              <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-1">
                Sektor Pengairan BBWS Citarum
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 bg-blue-900/50 px-4 py-2 rounded-lg border border-white/5">
          <div className="text-right">
            <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">
              Operator Aktif
            </p>
            <p className="text-xs font-bold text-white uppercase">
              BBWS Pusat Control
            </p>
          </div>
          <div className="w-10 h-10 relative rounded-full overflow-hidden border border-amber-400 bg-white">
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
        {/* PENCARIAN & LOG */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari Nama Pos Pantau atau Sungai..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-950 shadow-sm outline-none transition-all font-semibold text-blue-950"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            href="/dashboard/bbws/log-aktivitas"
            className="w-full md:w-auto"
          >
            <button className="w-full bg-blue-950 text-white px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-900 transition-all shadow-lg">
              <History size={16} /> Riwayat Update
            </button>
          </Link>
        </div>

        {/* GRID CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {initialTMAData
            .filter((item) =>
              item.lokasi.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((item) => (
              <motion.div
                layout
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-blue-950 font-black text-lg uppercase tracking-tight">
                      {item.lokasi}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 mt-1">
                      <Waves size={12} className="text-blue-500" /> Sungai{" "}
                      {item.sungai}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                      item.status === "Aman"
                        ? "bg-green-50 text-green-600 border-green-200"
                        : item.status === "Waspada"
                          ? "bg-amber-50 text-amber-600 border-amber-200"
                          : "bg-red-50 text-red-600 border-red-200"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-end">
                    <div className="text-blue-950">
                      <p className="text-[9px] font-bold uppercase opacity-50">
                        Tinggi Terakhir
                      </p>
                      <p className="text-2xl font-black">
                        {item.tinggi}{" "}
                        <span className="text-sm font-normal">CM</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold uppercase opacity-50 flex items-center gap-1 justify-end">
                        <Clock size={10} /> {item.jam} WIB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      placeholder="Input Baru (CM)"
                      className="w-full pl-4 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-blue-950 focus:border-amber-500 outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleUpdate(item.id)}
                    disabled={loadingId === item.id}
                    className="bg-amber-400 hover:bg-amber-500 text-blue-950 p-3 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loadingId === item.id ? "..." : <Save size={20} />}
                  </button>
                </div>
              </motion.div>
            ))}
        </div>

        {/* INFO PENTING */}
        <div className="p-6 bg-blue-950 rounded-2xl flex items-start gap-4 border-l-8 border-amber-400 shadow-2xl">
          <AlertCircle className="text-amber-400 shrink-0 mt-1" size={24} />
          <div>
            <p className="text-amber-400 font-black text-xs uppercase tracking-widest mb-1">
              Prosedur Operasional
            </p>
            <p className="text-white text-[11px] font-medium leading-relaxed uppercase tracking-wider opacity-80">
              Setiap pembaruan data akan tercatat dalam log sistem. Pastikan
              alat ukur telah dikalibrasi. Data ini akan menjadi dasar
              peringatan dini bagi instansi{" "}
              <span className="text-red-400">BPBD</span> dan warga sekitar.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
