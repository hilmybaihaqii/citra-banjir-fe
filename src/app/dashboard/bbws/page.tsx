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

  const [currentDate, setCurrentDate] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

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

  // FIX: Fungsi logout diarahkan ke halaman utama ("/")
  const handleLogout = () => {
    localStorage.removeItem("user_session");
    localStorage.removeItem("auth_token");
    // Gunakan window.location.href untuk memastikan state bersih total
    window.location.href = "/";
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <div
      className={`h-screen bg-slate-50 flex overflow-hidden ${outfit.className}`}
    >
      {/* SIDEBAR KIRI */}
      <aside className="w-72 bg-blue-950 text-white flex flex-col shadow-2xl z-20 shrink-0">
        <div className="p-8 border-b border-white/5">
          <Link
            href="/dashboard/bbws"
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src="/images/citrabanjir.png"
                alt="Logo Citra Banjir"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-black tracking-tighter text-xl italic uppercase leading-none">
              Citra <span className="text-amber-400">Banjir</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-3 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-4">
            Panel Kendali
          </p>

          <button className="w-full flex items-center justify-between p-4 bg-amber-400 text-blue-950 rounded-sm font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-400/10">
            <div className="flex items-center gap-3">
              <LayoutDashboard size={18} /> Dashboard
            </div>
            <ChevronRight size={14} />
          </button>

          <Link href="/dashboard/bbws/update-curahhujan">
            <button className="w-full flex items-center gap-3 p-4 text-blue-200 hover:bg-white/5 rounded-sm text-xs uppercase tracking-widest transition-all mt-3">
              <CloudRain size={18} /> Update Curah Hujan
            </button>
          </Link>

          <Link href="/dashboard/bbws/update-tinggiair">
            <button className="w-full flex items-center gap-3 p-4 text-blue-200 hover:bg-white/5 rounded-sm text-xs uppercase tracking-widest transition-all mt-1">
              <Droplets size={18} /> Update Tinggi Air
            </button>
          </Link>

          <Link href="/dashboard/bbws/update-sungai">
            <button className="w-full flex items-center gap-3 p-4 text-blue-200 hover:bg-white/5 rounded-sm text-xs uppercase tracking-widest transition-all mt-1">
              <Waves size={18} /> Update Debit Sungai
            </button>
          </Link>

          <div className="pt-6 border-t border-white/5 mt-4">
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-4">
              Sistem & User
            </p>
            <Link href="/dashboard/bbws/tambah-user">
              <button className="w-full flex items-center gap-3 p-4 text-blue-200 hover:bg-white/5 rounded-sm text-xs uppercase tracking-widest transition-all mt-1">
                <UserPlus size={18} /> Tambah User
              </button>
            </Link>
            <Link href="/dashboard/bbws/log-aktivitas">
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-end px-10 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-black text-blue-950 uppercase tracking-wider leading-none">
                {userData?.username || "Admin"}
              </p>
              <p className="text-[9px] text-amber-600 font-bold uppercase tracking-widest mt-1.5">
                Balai Besar Wilayah Sungai
              </p>
            </div>

            <div className="h-10 w-px bg-slate-200" />

            <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-200 hover:border-amber-400 transition-colors">
              <div className="w-11 h-11 relative rounded-full overflow-hidden border-2 border-white shadow-sm bg-white">
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

        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tight">
                  Ringkasan Data
                </h1>
                <p className="text-slate-500 text-sm mt-1 tracking-wide">
                  Wilayah Kerja Sungai Citarum
                </p>
              </div>
              <div className="text-[10px] bg-white text-blue-700 px-4 py-2 rounded-md font-bold uppercase tracking-widest border border-slate-200 shadow-sm">
                <span className="text-slate-400 mr-2">Update Terakhir:</span>{" "}
                {currentDate}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 border-l-4 border-l-amber-400">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Titik Pantau TMA
                  </p>
                  <Waves size={16} className="text-amber-400" />
                </div>
                <h3 className="text-3xl font-black text-blue-950 tracking-tighter">
                  24{" "}
                  <span className="text-sm font-normal text-slate-400 ml-1">
                    Lokasi
                  </span>
                </h3>
              </div>

              <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 border-l-4 border-l-blue-950">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Rata-rata Curah Hujan
                  </p>
                  <CloudRain size={16} className="text-blue-950" />
                </div>
                <h3 className="text-3xl font-black text-blue-950 tracking-tighter">
                  12{" "}
                  <span className="text-sm font-normal text-slate-400 ml-1">
                    mm/hr
                  </span>
                </h3>
              </div>

              <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 border-l-4 border-l-green-500">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status DAS Citarum
                  </p>
                  <LayoutDashboard size={16} className="text-green-500" />
                </div>
                <h3 className="text-3xl font-black text-green-600 tracking-tighter">
                  AMAN
                </h3>
              </div>
            </div>

            <div className="mt-10 bg-white border border-slate-200 rounded-sm p-20 flex flex-col items-center justify-center border-dashed min-h-100">
              <div className="p-4 bg-slate-50 rounded-full mb-4">
                <Waves size={40} className="text-slate-200" />
              </div>
              <p className="text-slate-400 italic text-sm text-center">
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
