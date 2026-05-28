"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ActivitySquare,
  Map,
  UserPlus,
  History,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Outfit } from "next/font/google";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import LogoutModal from "@/components/LogoutModal";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

// FUNGSI UNTUK DECODE JWT TANPA LIBRARY EXTERNAL
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export default function BMKGLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const [userData, setUserData] = useState<{
    username?: string;
    email?: string;
    role: string;
    name?: string;
  } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("user_session", { path: "/" });
    Cookies.remove("auth_token", { path: "/" }); 
    window.location.href = "/";
  };

  useEffect(() => {
    let logoutTimer: NodeJS.Timeout;

    const checkSession = () => {
      const savedUserStr = Cookies.get("user_session");
      const token = Cookies.get("auth_token");

      if (!savedUserStr || !token) {
        handleLogout();
        return;
      }
      
      try {
        setUserData(JSON.parse(savedUserStr));

        // Decode Token JWT untuk mengecek waktu expired
        const decodedToken = parseJwt(token);
        
        if (decodedToken && decodedToken.exp) {
          const currentTime = Math.floor(Date.now() / 1000); // Waktu sekarang dalam detik
          const timeLeft = decodedToken.exp - currentTime; // Sisa waktu dalam detik

          if (timeLeft <= 0) {
            handleLogout();
            return;
          } else {
            logoutTimer = setTimeout(() => {
              alert("Sesi Anda telah habis. Silakan login kembali.");
              handleLogout();
            }, timeLeft * 1000);
          }
        }

        setIsLoaded(true);
      } catch (error) {
        console.error("Gagal membaca session:", error);
        handleLogout();
      }
    };

    checkSession();

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === "/dashboard/bmkg" && pathname === "/dashboard/bmkg")
      return true;
    return path !== "/dashboard/bmkg" && pathname.startsWith(path);
  };

  const activeClass =
    "w-full flex items-center justify-between p-3.5 bg-amber-400 text-blue-950 rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-md shadow-amber-400/20";
  const inactiveClass =
    "w-full flex items-center justify-between p-3.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-xs uppercase tracking-widest transition-all";

  if (!isLoaded) return null;

  return (
    <div className={`flex h-dvh w-full overflow-hidden bg-slate-50 ${outfit.className}`}>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-blue-950 text-white shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/dashboard/bmkg"
            className="flex items-center"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Image
              src="/images/logo-citra-banjir.png"
              alt="Logo"
              width={200}
              height={100}
              className="object-contain"
              priority
            />
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-300 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4 custom-scrollbar">
          <p className="mb-2 px-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
            Menu Utama
          </p>

          <Link href="/dashboard/bmkg" className="block" onClick={() => setIsSidebarOpen(false)}>
            <button className={isActive("/dashboard/bmkg") ? activeClass : inactiveClass}>
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} /> Dashboard
              </div>
              {isActive("/dashboard/bmkg") && <ChevronRight size={14} />}
            </button>
          </Link>

          {/* MENU BARU: DATA PEMANTAUAN */}
          <Link href="/dashboard/bmkg/data-pantauan" className="block" onClick={() => setIsSidebarOpen(false)}>
            <button className={isActive("/dashboard/bmkg/data-pantauan") ? activeClass : inactiveClass}>
              <div className="flex items-center gap-3">
                <ActivitySquare size={18} /> Data Pemantauan
              </div>
              {isActive("/dashboard/bmkg/data-pantauan") && <ChevronRight size={14} />}
            </button>
          </Link>

          {/* MENU BARU: WILAYAH PANTAUAN
          <Link href="/dashboard/bmkg/wilayah" className="block" onClick={() => setIsSidebarOpen(false)}>
            <button className={isActive("/dashboard/bmkg/wilayah") ? activeClass : inactiveClass}>
              <div className="flex items-center gap-3">
                <Map size={18} /> Wilayah Pantauan
              </div>
              {isActive("/dashboard/bmkg/wilayah") && <ChevronRight size={14} />}
            </button>
          </Link> */}

          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
              Sistem & Administrasi
            </p>
            
            {userData?.role === "MASTER_ADMIN" && (
              <Link href="/dashboard/bmkg/manajemen-user" className="block mb-1.5" onClick={() => setIsSidebarOpen(false)}>
                <button className={isActive("/dashboard/bmkg/manajemen-user") ? activeClass : inactiveClass}>
                  <div className="flex items-center gap-3">
                    <UserPlus size={18} /> Manajemen User
                  </div>
                  {isActive("/dashboard/bmkg/manajemen-user") && <ChevronRight size={14} />}
                </button>
              </Link>
            )}

            <Link href="/dashboard/bmkg/log-aktivitas" className="block mb-1.5" onClick={() => setIsSidebarOpen(false)}>
              <button className={isActive("/dashboard/bmkg/log-aktivitas") ? activeClass : inactiveClass}>
                <div className="flex items-center gap-3">
                  <History size={18} /> Log Aktivitas
                </div>
                {isActive("/dashboard/bmkg/log-aktivitas") && <ChevronRight size={14} />}
              </button>
            </Link>

            <Link href="/dashboard/bmkg/pengaturan" className="block" onClick={() => setIsSidebarOpen(false)}>
              <button className={isActive("/dashboard/bmkg/pengaturan") ? activeClass : inactiveClass}>
                <div className="flex items-center gap-3">
                  <Settings size={18} /> Pengaturan
                </div>
                {isActive("/dashboard/bmkg/pengaturan") && <ChevronRight size={14} />}
              </button>
            </Link>
          </div>
        </nav>

        <div className="shrink-0 border-t border-white/10 bg-blue-950/80 p-4">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg p-3 text-xs font-bold uppercase text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:justify-end lg:px-8 z-10 shadow-sm">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-blue-950 hover:text-blue-700">
            <Menu size={26} />
          </button>
          <div className="flex items-center gap-3 lg:gap-5">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-black uppercase text-blue-950">
                {userData?.name || userData?.email || userData?.username || "Petugas BMKG"}
              </p>
              <p className="text-[9px] font-bold uppercase text-amber-600 tracking-widest">
                STASIUN METEOROLOGI JABAR
              </p>
            </div>

            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-amber-400 bg-white shadow-sm">
              <Image src="/images/BMKG.png" alt="Logo BMKG" fill className="object-contain p-1" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-12 lg:p-8 bg-slate-50/50 custom-scrollbar">
          {children}
        </main>
      </div>

      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleLogout} />
    </div>
  );
}