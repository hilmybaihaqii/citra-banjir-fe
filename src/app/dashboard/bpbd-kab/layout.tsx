"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  MapPinned,
  Inbox,
  Users,
  History,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Outfit } from "next/font/google";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export default function BPBDKabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [userData, setUserData] = useState<{
    username: string;
    role: string;
    agencyId?: string;
    name?: string;
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
    router.push("/");
  };

  if (!isLoaded) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === "/dashboard/bpbd-kab" && pathname === "/dashboard/bpbd-kab") return true;
    if (path !== "/dashboard/bpbd-kab" && pathname.startsWith(path)) return true;
    return false;
  };

  const activeClass = "w-full flex items-center justify-between p-3.5 bg-amber-400 text-blue-950 rounded-sm font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-400/10";
  const inactiveClass = "w-full flex items-center justify-between p-3.5 text-blue-200 hover:bg-white/5 rounded-sm text-xs uppercase tracking-widest transition-all";

  const handleMenuClick = () => setIsSidebarOpen(false);

  return (
    <div className={`h-screen bg-slate-50 flex overflow-hidden ${outfit.className}`}>
      
      {/* OVERLAY MOBILE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-blue-950/50 z-30 lg:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-blue-950 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
        {/* BRANDING LOGO */}
        <div className="h-20 px-8 border-b border-white/5 flex items-center justify-between">
          <Link href="/dashboard/admin" className="flex items-center">
            <Image src="/images/logo-citra-banjir.png" alt="Logo Citra Banjir" width={150} height={60} className="object-contain" priority />
          </Link>
          <button className="lg:hidden text-white hover:text-amber-400 transition-colors" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        {/* NAVIGASI MENU */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-3 mt-2 px-2">
            Menu Utama
          </p>
          
          <Link href="/dashboard/bpbd-kab" onClick={handleMenuClick}>
            <button className={isActive("/dashboard/bpbd-kab") ? activeClass : inactiveClass}>
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} /> Dashboard
              </div>
              {isActive("/dashboard/bpbd-kab") && <ChevronRight size={14} />}
            </button>
          </Link>
          
          <Link href="/dashboard/bpbd-kab/laporan" onClick={handleMenuClick}>
            <button className={isActive("/dashboard/bpbd-kab/laporan") ? activeClass : inactiveClass}>
              <div className="flex items-center gap-3">
                <Inbox size={18} /> Semua Laporan
              </div>
              {isActive("/dashboard/bpbd-kab/laporan") && <ChevronRight size={14} />}
            </button>
          </Link>
          
          <Link href="/dashboard/bpbd-kab/update-wilayah" onClick={handleMenuClick}>
            <button className={isActive("/dashboard/bpbd-kab/update-wilayah") ? activeClass : inactiveClass}>
              <div className="flex items-center gap-3">
                <MapPinned size={18} /> Update Wilayah
              </div>
              {isActive("/dashboard/bpbd-kab/update-wilayah") && <ChevronRight size={14} />}
            </button>
          </Link>

          <div className="pt-6 border-t border-white/5 mt-4">
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-3 px-2">
              Sistem & Administrasi
            </p>

            {/* KONDISI LEVELING: Hanya muncul jika role adalah superadmin */}
            {userData?.role === "superadmin" && (
              <Link href="/dashboard/bpbd-kab/manajemen-user" onClick={handleMenuClick}>
                <button className={isActive("/dashboard/bpbd-kab/manajemen-user") ? activeClass : inactiveClass}>
                  <div className="flex items-center gap-3">
                    <Users size={18} /> Manajemen User
                  </div>
                  {isActive("/dashboard/bpbd-kab/manajemen-user") && <ChevronRight size={14} />}
                </button>
              </Link>
            )}

            <Link href="/dashboard/bpbd-kab/log-aktivitas" onClick={handleMenuClick}>
              <button className={isActive("/dashboard/bpbd-kab/log-aktivitas") ? activeClass : inactiveClass}>
                <div className="flex items-center gap-3">
                  <History size={18} /> Log Aktivitas
                </div>
                {isActive("/dashboard/bpbd-kab/log-aktivitas") && <ChevronRight size={14} />}
              </button>
            </Link>
            
            <Link href="/dashboard/bpbd-kab/pengaturan" onClick={handleMenuClick}>
              <button className={isActive("/dashboard/bpbd-kab/pengaturan") ? activeClass : inactiveClass}>
                <div className="flex items-center gap-3">
                  <Settings size={18} /> Pengaturan
                </div>
                {isActive("/dashboard/bpbd-kab/pengaturan") && <ChevronRight size={14} />}
              </button>
            </Link>
          </div>
        </nav>

        {/* TOMBOL LOGOUT */}
        <div className="p-6 border-t border-white/5 bg-blue-950/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3.5 text-red-400 hover:bg-red-500/10 w-full rounded-sm text-xs font-bold uppercase tracking-widest transition-all"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        
        {/* HEADER ATAS */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between lg:justify-end px-6 lg:px-10 shadow-sm z-10 shrink-0">
          <button 
            className="lg:hidden p-2 -ml-2 text-blue-950 hover:bg-slate-100 rounded-md transition-colors" 
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={28} />
          </button>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-blue-950 uppercase tracking-wider leading-none">
                {userData?.name || userData?.username || "Petugas Kab."}
              </p>
              <p className="text-[9px] text-amber-600 font-bold uppercase tracking-widest mt-1.5 flex justify-end gap-1 items-center">
                {userData?.role === "superadmin" && (
                  <span className="bg-amber-100 text-amber-600 px-1 rounded">SUPERADMIN</span>
                )}
                <span>PUSDALOPS KAB. BANDUNG</span>
              </p>
            </div>

            <div className="h-10 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-200 hover:border-amber-400 transition-colors">
              <div className="w-11 h-11 relative rounded-full overflow-hidden border-2 border-white shadow-sm bg-white shrink-0">
                <Image
                  src="/images/LOGOBPBD.png"
                  alt="Logo BPBD"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-col hidden sm:flex">
                <span className="text-[10px] font-black text-blue-950 leading-tight">
                  BPBD KAB
                </span>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">
                  Kabupaten Bandung
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* AREA RENDER PAGE */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 custom-scrollbar">
          <div className="p-6 lg:p-10 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}