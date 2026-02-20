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
  Calendar,
} from "lucide-react";
import { Outfit } from "next/font/google";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

interface RiverData {
  id: number;
  nama: string;
  lokasi: string;
  debit: string;
  status: string;
  warna: string;
  bg: string;
  jam: string;
}

interface RiverInput {
  debit?: string;
  tanggal?: string;
  jam?: string;
}

const initialRivers: RiverData[] = [
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
  const [rivers, setRivers] = useState<RiverData[]>(initialRivers);
  const [inputs, setInputs] = useState<Record<number, RiverInput>>({});

  const handleInputChange = (
    id: number,
    field: keyof RiverInput,
    value: string,
  ) => {
    setInputs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleUpdate = (id: number) => {
    const currentInput = inputs[id];
    if (!currentInput?.debit) {
      alert("Silakan masukkan nilai debit air!");
      return;
    }

    setLoadingId(id);

    setTimeout(() => {
      setRivers((prevData) =>
        prevData.map((river) =>
          river.id === id
            ? {
                ...river,
                debit: currentInput.debit || river.debit,
                jam: currentInput.jam || river.jam,
              }
            : river,
        ),
      );
      setLoadingId(null);
      alert("Data Debit Sungai Berhasil Diperbarui!");
    }, 1000);
  };

  return (
    <div
      className={`h-screen flex flex-col bg-slate-50 ${outfit.className} overflow-hidden`}
    >
      {/* HEADER - Navbar Full */}
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
                Update Debit Sungai
              </h1>
              <p className="text-[8px] md:text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-1">
                Kabupaten Bandung • Manajemen Debit
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
        <div className="p-6 md:p-10 max-w-6xl mx-auto pb-24 text-blue-950">
          {/* SEARCH & HISTORY */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
            <div className="relative flex-1 w-full">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari Nama Sungai atau Lokasi..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold shadow-sm outline-none focus:ring-2 focus:ring-blue-950 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link
              href="/dashboard/bbws/log-aktivitas"
              className="w-full md:w-auto"
            >
              <button className="w-full bg-blue-950 text-white px-6 py-3 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-900 shadow-lg transition-all active:scale-95">
                <History size={16} /> Riwayat Debit
              </button>
            </Link>
          </div>

          {/* GRID CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {rivers
              .filter(
                (r) =>
                  r.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  r.lokasi.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((river) => (
                <motion.div
                  layout
                  key={river.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-blue-950 font-black text-sm md:text-base uppercase tracking-tight leading-none">
                        {river.nama}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 mt-1.5">
                        <MapPin size={12} className="text-blue-500" />{" "}
                        {river.lokasi}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase border ${river.bg} ${river.warna} border-current/20`}
                    >
                      {river.status}
                    </span>
                  </div>

                  {/* INFO DISPLAY */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100 flex justify-between items-end">
                    <div>
                      <p className="text-[9px] font-bold uppercase opacity-50">
                        Debit Terakhir
                      </p>
                      <p className="text-xl md:text-2xl font-black italic">
                        {river.debit}{" "}
                        <span className="text-[10px] font-normal not-italic opacity-60">
                          m³/s
                        </span>
                      </p>
                    </div>
                    <p className="text-[9px] font-bold uppercase opacity-40 flex items-center gap-1">
                      <Clock size={10} /> {river.jam} WIB
                    </p>
                  </div>

                  {/* FORM INPUT */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-blue-950/50 ml-1">
                        Update Debit (m³/s)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-blue-950 outline-none focus:border-amber-400"
                        onChange={(e) =>
                          handleInputChange(river.id, "debit", e.target.value)
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-blue-950/50 ml-1 flex items-center gap-1">
                          <Calendar size={10} /> Tanggal
                        </label>
                        <input
                          type="date"
                          className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-blue-950 outline-none"
                          onChange={(e) =>
                            handleInputChange(
                              river.id,
                              "tanggal",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-blue-950/50 ml-1 flex items-center gap-1">
                          <Clock size={10} /> Jam
                        </label>
                        <input
                          type="time"
                          className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-blue-950 outline-none"
                          onChange={(e) =>
                            handleInputChange(river.id, "jam", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleUpdate(river.id)}
                      disabled={loadingId === river.id}
                      className="w-full bg-amber-400 hover:bg-amber-500 text-blue-950 py-3 rounded-lg shadow-md font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {loadingId === river.id ? (
                        "Menyimpan..."
                      ) : (
                        <>
                          <Save size={16} /> Simpan Debit
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* FOOTER TIPS */}
          <div className="p-6 bg-blue-950 rounded-2xl flex items-start gap-4 border-l-8 border-amber-400 shadow-2xl">
            <Activity className="text-amber-400 shrink-0 mt-1" size={24} />
            <div>
              <p className="text-amber-400 font-black text-[10px] uppercase tracking-widest mb-1">
                Panduan Penginputan
              </p>
              <p className="text-white text-[10px] md:text-[11px] font-medium leading-relaxed uppercase tracking-wider opacity-80">
                Pastikan satuan debit adalah{" "}
                <span className="text-amber-400">m³/s</span>. Perubahan data
                akan berdampak langsung pada kalkulasi status{" "}
                <span className="text-red-400">SIAGA</span> di panel utama.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
