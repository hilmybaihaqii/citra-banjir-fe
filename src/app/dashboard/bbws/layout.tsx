"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CloudRain,
  Waves,
  Droplets,
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

export default function BBWSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const [userData, setUserData] = useState<{
    email?: string;
    username?: string;
    role: string;
    name?: string;
  } | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Membaca dari Cookies untuk menghindari bug cache lintas-dashboard
      const savedUserStr = Cookies.get("user_session");
      const token = Cookies.get("auth_token");
      
      if (!savedUserStr || !token) {
        Cookies.remove("auth_token", { path: "/" });
        Cookies.remove("user_session", { path: "/" });
        window.location.href = "/";
        return;
      }

      try {
        setUserData(JSON.parse(savedUserStr));
        setIsLoaded(true);
      } catch (error) {
        console.error("Gagal membaca session:", error);
        Cookies.remove("auth_token", { path: "/" });
        Cookies.remove("user_session", { path: "/" });
        window.location.href = "/";
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    // Hapus seluruh Cookie saat Logout
    Cookies.remove("user_session", { path: "/" });
    Cookies.remove("auth_token", { path: "/" }); 
    window.location.href = "/";
  };

  const isActive = (path: string) => {
    if (path === "/dashboard/bbws" && pathname === "/dashboard/bbws")
      return true;
    return path !== "/dashboard/bbws" && pathname.startsWith(path);
  };

  const activeClass =
    "w-full flex items-center justify-between p-3.5 bg-amber-400 text-blue-950 rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-md shadow-amber-400/20";
  const inactiveClass =
    "w-full flex items-center justify-between p-3.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-xs uppercase tracking-widest transition-all";
  
  if (!isLoaded) return null;

  return (
    <div
      className={`flex h-dvh w-full overflow-hidden bg-slate-50 ${outfit.className}`}
    >
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-blue-950 text-white shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/dashboard/bbws"
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
            className="lg:hidden text-slate-300 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4 custom-scrollbar">
          <p className="mb-2 px-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
            Panel Kendali Hidrologi
          </p>

          <Link
            href="/dashboard/bbws"
            className="block"
            onClick={() => setIsSidebarOpen(false)}
          >
            <button
              className={
                isActive("/dashboard/bbws") ? activeClass : inactiveClass
              }
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} /> Dashboard
              </div>
              {isActive("/dashboard/bbws") && <ChevronRight size={14} />}
            </button>
          </Link>

          <Link
            href="/dashboard/bbws/update-tinggiair"
            className="block"
            onClick={() => setIsSidebarOpen(false)}
          >
            <button
              className={
                isActive("/dashboard/bbws/update-tinggiair")
                  ? activeClass
                  : inactiveClass
              }
            >
              <div className="flex items-center gap-3">
                <Waves size={18} /> Update Tinggi Air
              </div>
              {isActive("/dashboard/bbws/update-tinggiair") && (
                <ChevronRight size={14} />
              )}
            </button>
          </Link>

          <Link
            href="/dashboard/bbws/update-curahhujan"
            className="block"
            onClick={() => setIsSidebarOpen(false)}
          >
            <button
              className={
                isActive("/dashboard/bbws/update-curahhujan")
                  ? activeClass
                  : inactiveClass
              }
            >
              <div className="flex items-center gap-3">
                <CloudRain size={18} /> Update Curah Hujan
              </div>
              {isActive("/dashboard/bbws/update-curahhujan") && (
                <ChevronRight size={14} />
              )}
            </button>
          </Link>

          <Link
            href="/dashboard/bbws/update-sungai"
            className="block"
            onClick={() => setIsSidebarOpen(false)}
          >
            <button
              className={
                isActive("/dashboard/bbws/update-sungai")
                  ? activeClass
                  : inactiveClass
              }
            >
              <div className="flex items-center gap-3">
                <Droplets size={18} /> Update Debit Sungai
              </div>
              {isActive("/dashboard/bbws/update-sungai") && (
                <ChevronRight size={14} />
              )}
            </button>
          </Link>

          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
              Sistem & User
            </p>

            {userData?.role === "MASTER_ADMIN" && (
              <Link
                href="/dashboard/bbws/manajemen-user"
                className="block mb-1.5"
                onClick={() => setIsSidebarOpen(false)}
              >
                <button
                  className={
                    isActive("/dashboard/bbws/manajemen-user")
                      ? activeClass
                      : inactiveClass
                  }
                >
                  <div className="flex items-center gap-3">
                    <UserPlus size={18} /> Manajemen User
                  </div>
                  {isActive("/dashboard/bbws/manajemen-user") && (
                    <ChevronRight size={14} />
                  )}
                </button>
              </Link>
            )}

            <Link
              href="/dashboard/bbws/log-aktivitas"
              className="block mb-1.5"
              onClick={() => setIsSidebarOpen(false)}
            >
              <button
                className={
                  isActive("/dashboard/bbws/log-aktivitas")
                    ? activeClass
                    : inactiveClass
                }
              >
                <div className="flex items-center gap-3">
                  <History size={18} /> Log Aktivitas
                </div>
                {isActive("/dashboard/bbws/log-aktivitas") && (
                  <ChevronRight size={14} />
                )}
              </button>
            </Link>
            
            <Link
              href="/dashboard/bbws/pengaturan"
              className="block"
              onClick={() => setIsSidebarOpen(false)}
            >
              <button
                className={
                  isActive("/dashboard/bbws/pengaturan")
                    ? activeClass
                    : inactiveClass
                }
              >
                <div className="flex items-center gap-3">
                  <Settings size={18} /> Pengaturan
                </div>
                {isActive("/dashboard/bbws/pengaturan") && (
                  <ChevronRight size={14} />
                )}
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
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-blue-950 hover:text-blue-700 transition-colors"
          >
            <Menu size={26} />
          </button>
          <div className="flex items-center gap-3 lg:gap-5">
            <div className="hidden sm:block text-right">
              {/* Fallback Name Berjenjang */}
              <p className="text-sm font-black uppercase text-blue-950">
                {userData?.name || userData?.email || userData?.username || "Admin BBWS"}
              </p>
              <p className="text-[9px] font-bold uppercase text-amber-600 tracking-widest">
                BALAI BESAR WILAYAH SUNGAI
              </p>
            </div>
            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-amber-400 bg-white shadow-sm">
              <Image
                src="/images/bbws.png"
                alt="Logo BBWS"
                fill
                className="object-contain p-1"
              />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 pb-12 lg:p-8 bg-slate-50/50 custom-scrollbar">
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