"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  Building2,
  AlertTriangle,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default function AdminMainDashboard() {
  const [userData, setUserData] = useState<{ name: string; role: string; } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const savedUser = localStorage.getItem("user_session");

      if (!savedUser) {
        // Mode Simulasi
        setUserData({ name: "Developer Pusat", role: "superadmin" }); 
      } else {
        try {
          const parsed = JSON.parse(savedUser);
          setUserData(parsed);
        } catch (e) {
          console.error("Gagal parsing data user", e);
        }
      }
      setIsLoaded(true);
    };

    loadData();
  }, []);

  const isSuperAdmin = userData?.role === "superadmin";

  if (!isLoaded) return null;

  // PERHATIKAN: Kita tidak perlu lagi menulis tag <html>, <body>, <Sidebar>, atau <Header> di sini.
  // Semua itu sudah diurus oleh `src/app/dashboard/admin/layout.tsx`.
  // Kita hanya me-return isi kontennya saja.

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* WELCOME SECTION */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tight">
            Halo, {userData?.name || "Administrator"}
          </h1>
          <p className="text-slate-600 font-medium mt-2 tracking-wide">
            Selamat datang di Pusat Kendali Citra Banjir. Berikut adalah ringkasan status sistem hari ini.
          </p>
        </div>

        {/* SUMMARY CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1: Total Instansi */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-300 border-l-4 border-l-blue-950 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Instansi</p>
              <Building2 size={20} className="text-blue-950 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-4xl font-black text-blue-950 tracking-tighter">
              4 <span className="text-sm font-bold text-slate-400 ml-1 tracking-widest uppercase">Mitra</span>
            </h3>
          </div>

          {/* Card 2: Pengguna Aktif */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-300 border-l-4 border-l-emerald-600 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pengguna Sistem</p>
              <Users size={20} className="text-emerald-600 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-4xl font-black text-emerald-800 tracking-tighter">
              12 <span className="text-sm font-bold text-slate-400 ml-1 tracking-widest uppercase">Akun</span>
            </h3>
          </div>

          {/* Card 3: Laporan Masuk */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-300 border-l-4 border-l-amber-500 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Laporan Warga</p>
              <MessageSquare size={20} className="text-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-4xl font-black text-blue-950 tracking-tighter">
              24 <span className="text-sm font-bold text-slate-400 ml-1 tracking-widest uppercase">Pesan</span>
            </h3>
          </div>
        </div>

        {/* QUICK ACTIONS ATAU INFO TAMBAHAN */}
        <div className="bg-white border border-slate-300 rounded-sm p-8 lg:p-12 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
          {/* Background aksen */}
          <div className="absolute -right-10 -bottom-10 opacity-5 text-blue-950">
            <ShieldCheck size={200} />
          </div>

          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6 relative z-10 border border-slate-200">
            <AlertTriangle size={32} className="text-slate-400" />
          </div>
          <h2 className="text-lg font-black text-blue-950 uppercase tracking-widest mb-3 relative z-10">
            Pusat Integrasi Data Banjir
          </h2>
          <p className="text-sm text-slate-600 font-medium max-w-xl leading-relaxed relative z-10">
            Anda berada di halaman utama kendali. Gunakan menu navigasi di sebelah kiri untuk mengelola hak akses instansi, memantau riwayat aktivitas, dan meninjau laporan dari masyarakat.
          </p>
          
          {isSuperAdmin && (
            <Link href="/dashboard/admin/users">
              <button className="mt-8 px-8 py-3 bg-blue-950 hover:bg-blue-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all shadow-md relative z-10">
                Kelola Pengguna Sekarang
              </button>
            </Link>
          )}
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}