// src/app/dashboard/admin/layout.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  History,
  Users,
  Settings,
  MessageSquare,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import { Outfit } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // Untuk mendeteksi halaman aktif
  
  const [userData, setUserData] = useState<{ username: string; name: string; role: string; agency_id?: string; } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const savedUser = localStorage.getItem("user_session");
      if (!savedUser) {
        setUserData({ username: "root", name: "Developer Pusat", role: "superadmin", agency_id: "admin" }); 
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
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    localStorage.removeItem("auth_token");
    window.location.href = "/";
  };

  const isSuperAdmin = userData?.role === "superadmin";

  // Fungsi untuk mengecek menu aktif
  const isActive = (path: string) => {
    if (path === "/dashboard/admin" && pathname === "/dashboard/admin") return true;
    if (path !== "/dashboard/admin" && pathname.startsWith(path)) return true;
    return false;
  };

  if (!isLoaded) return null;

  return (
    <div className={`h-screen bg-slate-50 flex overflow-hidden ${outfit.className}`}>
      {/* OVERLAY UNTUK MOBILE */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-blue-950/50 z-30 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ========================================= */}
      {/* SIDEBAR KIRI UTAMA                        */}
      {/* ========================================= */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-blue-950 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-20 px-8 border-b border-white/5 flex items-center justify-between">
          <Link href="/dashboard/admin" className="flex items-center">
            <Image src="/images/logo-citra-banjir.png" alt="Logo Citra Banjir" width={150} height={60} className="object-contain" priority />
          </Link>
          <button className="lg:hidden text-white hover:text-amber-400 transition-colors" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-4 px-2">Menu Utama</p>
          
          <Link href="/dashboard/admin" className="block">
            <button className={`w-full flex items-center justify-between p-3.5 rounded-sm font-bold text-xs uppercase tracking-widest transition-all ${isActive("/dashboard/admin") ? "bg-amber-400 text-blue-950" : "text-blue-200 hover:bg-white/5"}`}>
              <div className="flex items-center gap-3"><LayoutDashboard size={18} /> Dashboard</div>
              {isActive("/dashboard/admin") && <ChevronRight size={14} />}
            </button>
          </Link>

          <Link href="/dashboard/admin/saran" className="block mt-2">
            <button className={`w-full flex items-center justify-between p-3.5 rounded-sm font-bold text-xs uppercase tracking-widest transition-all ${isActive("/dashboard/admin/saran") ? "bg-amber-400 text-blue-950" : "text-blue-200 hover:bg-white/5"}`}>
              <div className="flex items-center gap-3"><MessageSquare size={18} /> Saran & Masukan</div>
              {isActive("/dashboard/admin/saran") && <ChevronRight size={14} />}
            </button>
          </Link>

          <div className="pt-6 border-t border-white/5 mt-4">
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-4 px-2">Sistem & Administrasi</p>
            
            <Link href="/dashboard/admin/users" className="block">
              <button className={`w-full flex items-center justify-between p-3.5 rounded-sm font-bold text-xs uppercase tracking-widest transition-all ${isActive("/dashboard/admin/users") ? "bg-amber-400 text-blue-950" : "text-blue-200 hover:bg-white/5"}`}>
                <div className="flex items-center gap-3"><Users size={18} /> Manajemen User</div>
                {isActive("/dashboard/admin/users") && <ChevronRight size={14} />}
              </button>
            </Link>
            
            <Link href="/dashboard/admin/logs" className="block mt-2">
              <button className={`w-full flex items-center justify-between p-3.5 rounded-sm font-bold text-xs uppercase tracking-widest transition-all ${isActive("/dashboard/admin/logs") ? "bg-amber-400 text-blue-950" : "text-blue-200 hover:bg-white/5"}`}>
                <div className="flex items-center gap-3"><History size={18} /> Log Perubahan</div>
                {isActive("/dashboard/admin/logs") && <ChevronRight size={14} />}
              </button>
            </Link>

            <Link href="/dashboard/admin/settings" className="block mt-2">
              <button className={`w-full flex items-center justify-between p-3.5 rounded-sm font-bold text-xs uppercase tracking-widest transition-all ${isActive("/dashboard/admin/settings") ? "bg-amber-400 text-blue-950" : "text-blue-200 hover:bg-white/5"}`}>
                <div className="flex items-center gap-3"><Settings size={18} /> Pengaturan</div>
                {isActive("/dashboard/admin/settings") && <ChevronRight size={14} />}
              </button>
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 p-3.5 text-red-400 hover:bg-red-500/10 w-full rounded-sm text-xs font-bold uppercase tracking-widest transition-all">
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      {/* ========================================= */}
      {/* AREA KONTEN KANAN (HEADER + CHILDREN)       */}
      {/* ========================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        
        {/* HEADER ATAS UTAMA */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between lg:justify-end px-6 lg:px-10 shadow-sm z-10 shrink-0">
          <button className="lg:hidden p-2 text-blue-950" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={28} />
          </button>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-blue-950 uppercase tracking-wider leading-none">
                {userData?.name || "Administrator"}
              </p>
              <p className="text-[9px] text-amber-600 font-bold uppercase tracking-widest mt-1.5 flex items-center justify-end gap-1">
                {isSuperAdmin ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                {isSuperAdmin ? "Super Admin" : "Admin Staff"}
              </p>
            </div>
            <div className="h-10 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-200">
              
              {/* FOTO PROFIL HEADER: ROUNDED FULL */}
              <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold uppercase">
                  {userData?.name ? userData.name.substring(0, 2) : "AD"}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-blue-950">Pusdatin</span>
                <span className="text-[8px] text-slate-600 font-bold uppercase">Pusat</span>
              </div>
            </div>
          </div>
        </header>

        {/* TEMPAT UNTUK HALAMAN-HALAMAN LAIN DI-RENDER */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 custom-scrollbar">
           {children}
        </main>
      </div>
    </div>
  );
}