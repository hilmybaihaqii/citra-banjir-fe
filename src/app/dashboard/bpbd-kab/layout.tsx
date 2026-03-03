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

import LogoutModal from "@/components/LogoutModal";

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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

  const activeClass = "w-full flex items-center justify-between p-3.5 bg-amber-400 text-blue-950 rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-md shadow-amber-400/20";
  const inactiveClass = "w-full flex items-center justify-between p-3.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-xs uppercase tracking-widest transition-all";

  const handleMenuClick = () => setIsSidebarOpen(false);

  return (
    <div className={`flex h-dvh w-full overflow-hidden bg-slate-50 ${outfit.className}`}>
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity lg:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
          aria-hidden="true"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-blue-950 text-white shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <Link href="/dashboard/admin" className="flex items-center" onClick={handleMenuClick}>
            <Image 
              src="/images/logo-citra-banjir.png" 
              alt="Logo Citra Banjir" 
              width={200} 
              height={100} 
              className="object-contain" 
              priority 
            />
          </Link>
          <button 
            className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white lg:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="custom-scrollbar flex-1 space-y-1.5 overflow-y-auto p-4">
          <p className="mb-2 px-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
            Menu Utama
          </p>
          
          <Link href="/dashboard/bpbd-kab" onClick={handleMenuClick} className="block">
            <div className={isActive("/dashboard/bpbd-kab") ? activeClass : inactiveClass}>
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} /> Dashboard
              </div>
              {isActive("/dashboard/bpbd-kab") && <ChevronRight size={14} />}
            </div>
          </Link>
          
          <Link href="/dashboard/bpbd-kab/laporan" onClick={handleMenuClick} className="block">
            <div className={isActive("/dashboard/bpbd-kab/laporan") ? activeClass : inactiveClass}>
              <div className="flex items-center gap-3">
                <Inbox size={18} /> Semua Laporan
              </div>
              {isActive("/dashboard/bpbd-kab/laporan") && <ChevronRight size={14} />}
            </div>
          </Link>
          
          <Link href="/dashboard/bpbd-kab/update-wilayah" onClick={handleMenuClick} className="block">
            <div className={isActive("/dashboard/bpbd-kab/update-wilayah") ? activeClass : inactiveClass}>
              <div className="flex items-center gap-3">
                <MapPinned size={18} /> Update Wilayah
              </div>
              {isActive("/dashboard/bpbd-kab/update-wilayah") && <ChevronRight size={14} />}
            </div>
          </Link>

          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
              Sistem & Administrasi
            </p>
            {userData?.role === "superadmin" && (
              <Link href="/dashboard/bpbd-kab/manajemen-user" onClick={handleMenuClick} className="mb-1.5 block">
                <div className={isActive("/dashboard/bpbd-kab/manajemen-user") ? activeClass : inactiveClass}>
                  <div className="flex items-center gap-3">
                    <Users size={18} /> Manajemen User
                  </div>
                  {isActive("/dashboard/bpbd-kab/manajemen-user") && <ChevronRight size={14} />}
                </div>
              </Link>
            )}

            <Link href="/dashboard/bpbd-kab/log-aktivitas" onClick={handleMenuClick} className="mb-1.5 block">
              <div className={isActive("/dashboard/bpbd-kab/log-aktivitas") ? activeClass : inactiveClass}>
                <div className="flex items-center gap-3">
                  <History size={18} /> Log Aktivitas
                </div>
                {isActive("/dashboard/bpbd-kab/log-aktivitas") && <ChevronRight size={14} />}
              </div>
            </Link>
            
            <Link href="/dashboard/bpbd-kab/pengaturan" onClick={handleMenuClick} className="block">
              <div className={isActive("/dashboard/bpbd-kab/pengaturan") ? activeClass : inactiveClass}>
                <div className="flex items-center gap-3">
                  <Settings size={18} /> Pengaturan
                </div>
                {isActive("/dashboard/bpbd-kab/pengaturan") && <ChevronRight size={14} />}
              </div>
            </Link>
          </div>
        </nav>

        <div className="shrink-0 border-t border-white/10 bg-blue-950/80 p-4">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg p-3 text-xs font-bold uppercase tracking-widest text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="z-10 flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:justify-end lg:px-8">
          <button 
            className="rounded-lg p-2 text-blue-950 transition-colors hover:bg-slate-100 lg:hidden" 
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={26} />
          </button>
          
          <div className="flex items-center gap-3 lg:gap-5">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-black uppercase leading-none tracking-wider text-blue-950">
                {userData?.name || userData?.username || "Petugas Kab."}
              </p>
              <div className="mt-1.5 flex items-center justify-end gap-1.5 text-[9px] font-bold uppercase tracking-widest text-amber-600">
                {userData?.role === "superadmin" && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5">SUPERADMIN</span>
                )}
                <span>PUSDALOPS KAB. BANDUNG</span>
              </div>
            </div>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 pr-3 transition-colors hover:border-amber-400 lg:pr-4">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm">
                <Image
                  src="/images/LOGOBPBD.png"
                  alt="Logo BPBD"
                  fill
                  sizes="40px"
                  className="object-contain p-0.5"
                />
              </div>
              <div className="hidden flex-col sm:flex">
                <span className="text-[11px] font-black leading-tight text-blue-950">
                  BPBD KAB
                </span>
                <span className="text-[8px] font-bold uppercase tracking-tighter text-slate-400">
                  Kabupaten Bandung
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="custom-scrollbar flex-1 overflow-y-auto bg-slate-50/50 p-4 lg:p-8">
          {children}
        </main>
      </div>


      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleLogout} 
      />
    </div>
  );
}