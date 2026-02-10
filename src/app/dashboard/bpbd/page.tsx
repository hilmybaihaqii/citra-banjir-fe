"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  MapPinned, // Icon untuk Update Daerah
  Users, // Icon untuk Pengungsi
  AlertTriangle, // Icon untuk Status Bencana
  UserPlus,
  History,
  LogOut,
  ChevronRight,
  Siren, // Icon identitas BPBD
} from "lucide-react";
import { Outfit } from "next/font/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export default function BPBDDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<{
    username: string;
    role: string;
  } | null>(null);

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // 1. Load Data User
    const loadData = () => {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) {
        router.push("/");
        return;
      }
      try {
        const parsed = JSON.parse(savedUser);
        setUserData(parsed);
      } catch (e) {
        console.error("Gagal parsing data user", e);
      }
    };

    // 2. Set Tanggal Real-time
    const formatDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      setCurrentDate(now.toLocaleDateString("id-ID", options));
    };

    loadData();
    formatDate();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex ${outfit.className}`}>
      {/* SIDEBAR KIRI */}
      <aside className="w-72 bg-blue-950 text-white flex flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400 rounded-lg">
              {/* Menggunakan Siren untuk identitas Tanggap Bencana */}
              <Siren className="text-blue-950" size={24} />
            </div>
            <span className="font-black tracking-tighter text-xl italic uppercase">
              Citra <span className="text-amber-400">Banjir</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-4">
            Panel Kendali
          </p>

          {/* Button Dashboard (Halaman Aktif Saat Ini) */}
          <button className="w-full flex items-center justify-between p-4 bg-amber-400 text-blue-950 rounded-sm font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-400/10">
            <div className="flex items-center gap-3">
              <LayoutDashboard size={18} /> Dashboard
            </div>
            <ChevronRight size={14} />
          </button>

          {/* PERUBAHAN: Menu Update Kondisi Banjir */}
          <Link href="/dashboard/bpbd/update-kondisi">
            <button className="w-full flex items-center gap-3 p-4 text-blue-200 hover:bg-white/5 rounded-sm text-xs uppercase tracking-widest transition-all mt-3">
              <MapPinned size={18} /> Update Wilayah
            </button>
          </Link>

          <div className="pt-6 border-t border-white/5 mt-4">
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-4">
              Sistem & User
            </p>
            <Link href="/dashboard/bpbd/tambah-user">
              <button className="w-full flex items-center gap-3 p-4 text-blue-200 hover:bg-white/5 rounded-sm text-xs uppercase tracking-widest transition-all mt-1">
                <UserPlus size={18} /> Tambah User
              </button>
            </Link>
            <Link href="/dashboard/bpbd/log-aktivitas">
              <button className="w-full flex items-center gap-3 p-4 text-blue-200 hover:bg-white/5 rounded-sm text-xs uppercase tracking-widest transition-all">
                <History size={18} />
                <span>Log Aktivitas</span>
              </button>
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-4 text-red-400 hover:bg-red-500/10 w-full rounded-sm text-xs font-bold uppercase tracking-widest transition-all"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER ATAS */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-end px-10 shadow-sm z-10">
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-black text-blue-950 uppercase tracking-wider leading-none">
                {userData?.username || "Petugas Piket"}
              </p>
              <p className="text-[9px] text-amber-600 font-bold uppercase tracking-widest mt-1.5">
                Pusdalops PB Jabar
              </p>
            </div>

            <div className="h-10 w-px bg-slate-200" />

            {/* Logo Pojok Kanan Atas - Diubah menjadi BPBD */}
            <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-200 hover:border-amber-400 transition-colors">
              <div className="w-11 h-11 relative rounded-full overflow-hidden border-2 border-white shadow-sm bg-white">
                <Image
                  src="/images/BPBD.png" // Pastikan file logo ada
                  alt="Logo BPBD"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-blue-950 leading-tight">
                  BPBD
                </span>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">
                  Prov. Jawa Barat
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-10 overflow-y-auto bg-slate-50/50 flex-1">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tight">
                Situasi Terkini
              </h1>
              <p className="text-slate-500 text-sm mt-1 tracking-wide">
                Laporan Kebencanaan Wilayah Jawa Barat
              </p>
            </div>
            <div className="text-[10px] bg-white text-blue-700 px-4 py-2 rounded-md font-bold uppercase tracking-widest border border-slate-200 shadow-sm">
              <span className="text-slate-400 mr-2">Update Terakhir:</span>{" "}
              {currentDate}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CARD 1: Daerah Terdampak */}
            <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 border-l-4 border-l-amber-400">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Area Terdampak
                </p>
                <MapPinned size={16} className="text-amber-400" />
              </div>
              <h3 className="text-3xl font-black text-blue-950 tracking-tighter">
                3{" "}
                <span className="text-sm font-normal text-slate-400 ml-1">
                  Kecamatan
                </span>
              </h3>
            </div>

            {/* CARD 2: Jumlah Pengungsi */}
            <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 border-l-4 border-l-blue-950">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Total Pengungsi
                </p>
                <Users size={16} className="text-blue-950" />
              </div>
              <h3 className="text-3xl font-black text-blue-950 tracking-tighter">
                128{" "}
                <span className="text-sm font-normal text-slate-400 ml-1">
                  Jiwa
                </span>
              </h3>
            </div>

            {/* CARD 3: Status Bencana */}
            <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 border-l-4 border-l-red-500">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Status Siaga
                </p>
                <AlertTriangle size={16} className="text-red-500" />
              </div>
              <h3 className="text-3xl font-black text-red-600 tracking-tighter">
                WASPADA
              </h3>
            </div>
          </div>

          <div className="mt-10 bg-white border border-slate-200 rounded-sm p-20 flex flex-col items-center justify-center border-dashed">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <Siren size={40} className="text-slate-200" />
            </div>
            <p className="text-slate-400 italic text-sm text-center">
              Pilih menu <b>Update Wilayah</b> di samping kiri untuk melaporkan kondisi banjir baru <br />
              atau pantau log penanganan bencana.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}