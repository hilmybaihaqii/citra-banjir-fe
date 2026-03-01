"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Droplets,
  Waves,
  UserPlus,
  History,
  LogOut,
  ChevronRight,
  CloudRain,
  Menu,
  X,
} from "lucide-react";
import { Outfit } from "next/font/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export default function BBWSDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<{
    username: string;
    role: string;
    agency_id?: string;
  } | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const savedUser = localStorage.getItem("user_session");

      if (!savedUser) {
        router.push("/");
        return;
      }

      try {
        const parsed = JSON.parse(savedUser);
        setUserData(parsed);
        setIsLoaded(true);
      } catch (e) {
        console.error("Gagal parsing data user", e);
        localStorage.removeItem("user_session");
        router.push("/");
      }
    };

    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    localStorage.removeItem("auth_token");
    window.location.href = "/";
  };

  if (!isLoaded) return null;

  return (
    <div
      className={`h-screen bg-slate-50 flex overflow-hidden ${outfit.className}`}
    >
      {/* OVERLAY UNTUK MOBILE */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-blue-950/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR KIRI */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 bg-blue-950 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* LOGO AREA */}
        <div className="h-20 px-8 border-b border-white/5 flex items-center justify-between">
          <Link href="/dashboard/bbws" className="flex items-center">
            <Image
              src="/images/logo-citra-banjir.png"
              alt="Logo Citra Banjir"
              width={150}
              height={60}
              className="object-contain"
              priority
            />
          </Link>
          <button
            className="lg:hidden text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-4 px-2">
            Panel Kendali
          </p>

          <button className="w-full flex items-center justify-between p-3.5 bg-amber-400 text-blue-950 rounded-lg font-bold text-xs uppercase tracking-widest transition-all">
            <div className="flex items-center gap-3">
              <LayoutDashboard size={18} /> Dashboard
            </div>
            <ChevronRight size={14} />
          </button>

          <Link href="/dashboard/bbws/update-curahhujan" className="block">
            <button className="w-full flex items-center gap-3 p-3.5 text-blue-200 hover:bg-white/5 rounded-lg text-xs uppercase tracking-widest transition-all">
              <CloudRain size={18} /> Update Curah Hujan
            </button>
          </Link>

          <Link href="/dashboard/bbws/update-tinggiair" className="block">
            <button className="w-full flex items-center gap-3 p-3.5 text-blue-200 hover:bg-white/5 rounded-lg text-xs uppercase tracking-widest transition-all">
              <Droplets size={18} /> Update Tinggi Air
            </button>
          </Link>

          <Link href="/dashboard/bbws/update-sungai" className="block">
            <button className="w-full flex items-center gap-3 p-3.5 text-blue-200 hover:bg-white/5 rounded-lg text-xs uppercase tracking-widest transition-all">
              <Waves size={18} /> Update Debit Sungai
            </button>
          </Link>

          <div className="pt-6 border-t border-white/5 mt-4">
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-4 px-2">
              Sistem & User
            </p>
            <Link href="/dashboard/bbws/tambah-user" className="block">
              <button className="w-full flex items-center gap-3 p-3.5 text-blue-200 hover:bg-white/5 rounded-lg text-xs uppercase tracking-widest transition-all">
                <UserPlus size={18} /> Tambah User
              </button>
            </Link>
            <Link href="/dashboard/bbws/log-aktivitas" className="block">
              <button className="w-full flex items-center gap-3 p-3.5 text-blue-200 hover:bg-white/5 rounded-lg text-xs uppercase tracking-widest transition-all">
                <History size={18} /> Log Aktivitas
              </button>
            </Link>
          </div>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3.5 text-red-400 hover:bg-red-500/10 w-full rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* HEADER / NAVBAR */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between lg:justify-end px-6 lg:px-10 shadow-sm z-10 shrink-0">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-blue-950"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={28} />
          </button>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-blue-950 uppercase tracking-wider leading-none">
                {userData?.username || "Guest User"}
              </p>
              <p className="text-[9px] text-amber-600 font-bold uppercase tracking-widest mt-1.5">
                Balai Besar Wilayah Sungai
              </p>
            </div>

            <div className="h-10 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-200">
              <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-white shadow-sm bg-white shrink-0">
                <Image
                  src="/images/bbws.png"
                  alt="Logo BBWS"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-blue-950 leading-tight">
                  BBWS
                </span>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">
                  Citarum
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50/50 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tight">
                Ringkasan Data
              </h1>
              <p className="text-slate-500 text-sm mt-1 tracking-wide">
                Wilayah Kerja Sungai Citarum
              </p>
            </div>

            {/* CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-amber-400 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Titik Pantau TMA
                  </p>
                  <Waves size={20} className="text-amber-400" />
                </div>
                <h3 className="text-3xl font-black text-blue-950 tracking-tighter">
                  24{" "}
                  <span className="text-sm font-normal text-slate-400 ml-1">
                    Lokasi
                  </span>
                </h3>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-blue-950 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Rata-rata Curah Hujan
                  </p>
                  <CloudRain size={20} className="text-blue-950" />
                </div>
                <h3 className="text-3xl font-black text-blue-950 tracking-tighter">
                  12{" "}
                  <span className="text-sm font-normal text-slate-400 ml-1">
                    mm/hr
                  </span>
                </h3>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status DAS Citarum
                  </p>
                  <LayoutDashboard size={20} className="text-green-500" />
                </div>
                <h3 className="text-3xl font-black text-green-600 tracking-tighter uppercase">
                  Aman
                </h3>
              </div>
            </div>

            {/* EMPTY STATE / WELCOME AREA */}
            <div className="mt-10 bg-white border border-slate-200 rounded-xl p-8 lg:p-20 flex flex-col items-center justify-center border-dashed text-center">
              <div className="p-6 bg-slate-50 rounded-full mb-6">
                <Waves size={48} className="text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-blue-950 mb-2">
                Selamat Datang di Dashboard BBWS
              </h2>
              <p className="text-slate-500 italic text-sm max-w-md leading-relaxed">
                Silahkan pilih menu di samping kiri untuk mengelola data tinggi
                air, curah hujan, dan debit sungai. <br />
                Akses pembaruan dibatasi sesuai kewenangan instansi
                masing-masing.
              </p>
            </div>

            <div className="h-10" />
          </div>
        </div>
      </main>
    </div>
  );
}
