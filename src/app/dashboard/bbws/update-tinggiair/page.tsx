"use client";

import React, { useState } from "react";
import {
  Waves,
  Search,
  Save,
  AlertCircle,
  ArrowLeft,
  TrendingUp,
  History,
} from "lucide-react";
import { Outfit } from "next/font/google";
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
  {
    id: 5,
    lokasi: "Cisangkuy",
    sungai: "Cisangkuy",
    tinggi: 90,
    status: "Aman",
    jam: "15:45",
  },
  // Tambahkan data duplikat untuk mengetes scroll jika perlu
];

export default function UpdateTMAPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    /* Perbaikan: Pastikan h-screen dan overflow-y-auto ada di pembungkus utama jika ingin scroll mandiri */
    <div
      className={`h-screen overflow-y-auto bg-slate-50 ${outfit.className} scroll-smooth`}
    >
      {/* HEADER: Sticky tetap berfungsi karena parent punya h-screen & overflow */}
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
              Update Tinggi Air
            </h1>
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-1">
              Kabupaten Bandung • Manajemen TMA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Petugas Lapangan
            </p>
            <p className="text-xs font-bold text-white uppercase leading-none">
              BBWS Admin
            </p>
          </div>
          <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-amber-400 bg-white">
            <Image
              src="/images/bbws-logo.jpg"
              alt="Logo"
              fill
              className="object-contain p-1"
            />
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="p-10 max-w-7xl mx-auto pb-20">
        {/* STATS RINGKAS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
              Total Titik
            </p>
            <p className="text-xl font-black text-blue-950 uppercase">
              24 Lokasi
            </p>
          </div>
          <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm border-l-4 border-l-red-500">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
              Status Siaga
            </p>
            <p className="text-xl font-black text-red-600 uppercase">
              1 Lokasi
            </p>
          </div>
          <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
              Terakhir Update
            </p>
            <p className="text-xl font-black text-blue-950 uppercase">
              17:05{" "}
              <span className="text-[10px] font-normal text-slate-400 italic font-serif">
                WIB
              </span>
            </p>
          </div>
          <Link
            href="/dashboard/bbws/log-aktivitas"
            className="bg-amber-400 p-4 rounded-sm shadow-md flex items-center justify-center hover:bg-amber-500 transition-colors"
          >
            <div className="flex items-center gap-2 text-blue-950 font-black text-xs uppercase tracking-tighter">
              <History size={16} /> Lihat Log Riwayat
            </div>
          </Link>
        </div>

        {/* TABEL */}
        <div className="bg-white rounded-sm border border-slate-200 shadow-xl overflow-hidden mb-10">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari Lokasi atau Nama Sungai..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:ring-2 focus:ring-blue-950 outline-none transition-all font-medium"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-4 py-2 text-[10px] font-black uppercase border border-slate-200 rounded-sm hover:bg-slate-50">
                Filter
              </button>
              <button className="flex-1 md:flex-none px-4 py-2 text-[10px] font-black uppercase bg-blue-950 text-white rounded-sm hover:bg-blue-900 shadow-md">
                Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Info Lokasi
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Ketinggian (CM)
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Waktu Ukur
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                    Update
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initialTMAData
                  .filter((item) =>
                    item.lokasi
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()),
                  )
                  .map((item) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-blue-50/30 transition-all"
                    >
                      <td className="px-8 py-6">
                        <p className="font-black text-blue-950 text-sm uppercase">
                          {item.lokasi}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                          <Waves size={10} /> Sungai {item.sungai}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 font-black text-blue-900 text-lg">
                          {item.tinggi}{" "}
                          <TrendingUp size={14} className="text-green-500" />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest border ${
                            item.status === "Aman"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : item.status === "Waspada"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-bold text-slate-400 italic">
                        Hari ini, {item.jam} WIB
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 max-w-36 mx-auto">
                          <input
                            type="number"
                            placeholder="CM"
                            className="w-full px-2 py-2 border border-slate-200 rounded-sm text-xs font-bold focus:border-amber-400 outline-none"
                          />
                          <button className="p-2 bg-blue-950 text-white rounded-sm hover:bg-amber-400 hover:text-blue-950 transition-all shadow-sm">
                            <Save size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ALERT BOX */}
        <div className="p-5 bg-blue-950 rounded-sm flex items-start md:items-center gap-4 border-l-8 border-amber-400 shadow-lg">
          <AlertCircle className="text-amber-400 shrink-0" size={24} />
          <p className="text-white text-[11px] font-medium leading-relaxed uppercase tracking-wide">
            <span className="text-amber-400 font-black">Penting: </span>
            Input ketinggian dalam satuan{" "}
            <span className="underline decoration-amber-400">Centimeter</span>.
            Sistem akan otomatis mengirim notifikasi kepada warga jika status
            berubah menjadi
            <span className="text-red-400 font-bold"> SIAGA</span>.
          </p>
        </div>
      </main>
    </div>
  );
}
