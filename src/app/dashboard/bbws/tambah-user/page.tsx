"use client";

import React, { useState } from "react";
import {
  UserPlus,
  ArrowLeft,
  ShieldCheck,
  User,
  Lock,
  Mail,
  Save,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { Outfit } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export default function TambahUserPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className={`min-h-screen bg-slate-50 ${outfit.className}`}>
      {/* HEADER */}
      <header className="h-20 bg-blue-950 text-white flex items-center justify-between px-10 shadow-lg sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/bbws"
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-amber-400"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight leading-none">
              Manajemen User
            </h1>
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-1">
              Registrasi Akun Petugas Baru
            </p>
          </div>
        </div>
        <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-amber-400 bg-white">
          <Image
            src="/images/bbws-logo.jpg"
            alt="Logo"
            fill
            className="object-contain p-1"
          />
        </div>
      </header>

      <main className="p-10 max-w-4xl mx-auto">
        <div className="bg-white rounded-sm border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* SISI KIRI: INFO */}
          <div className="w-full md:w-1/3 bg-blue-950 p-10 text-white flex flex-col justify-between">
            <div>
              <div className="p-3 bg-amber-400 w-fit rounded-lg mb-6 shadow-lg shadow-amber-400/20">
                <UserPlus className="text-blue-950" size={32} />
              </div>
              <h2 className="text-2xl font-black uppercase leading-tight mb-4">
                Akses Kontrol Sistem
              </h2>
              <p className="text-blue-100 text-xs leading-relaxed font-medium">
                Gunakan formulir ini untuk membuat akun baru. Pastikan
                memberikan hak akses yang tepat sesuai wilayah kerja petugas.
              </p>
            </div>

            <div className="mt-10 md:mt-0">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider text-amber-400">
                <ShieldCheck size={18} /> Keamanan Terjamin
              </div>
            </div>
          </div>

          {/* SISI KANAN: FORM */}
          <div className="flex-1 p-10">
            {isSuccess && (
              <div className="mb-6 p-4 bg-green-600 border border-green-700 rounded-sm flex items-center gap-3 animate-in fade-in zoom-in duration-300 shadow-md">
                <CheckCircle2 className="text-white" />
                <p className="text-white text-xs font-black uppercase tracking-wider">
                  User Berhasil Didaftarkan!
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest">
                  Nama Lengkap Petugas
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    required
                    type="text"
                    placeholder="Masukkan nama lengkap..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-sm text-sm text-blue-950 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-950 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest">
                    Username
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                      size={18}
                    />
                    <input
                      required
                      type="text"
                      placeholder="Contoh: petugas_siaga"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-sm text-sm text-blue-950 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-950 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Role - PERBAIKAN: Default "Pilih Role" */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest">
                    Hak Akses (Role)
                  </label>
                  <div className="relative">
                    <select
                      required
                      defaultValue=""
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-sm text-sm text-blue-950 font-bold focus:ring-2 focus:ring-blue-950 outline-none transition-all appearance-none cursor-pointer invalid:text-slate-400"
                    >
                      <option value="" disabled>
                        Pilih Role
                      </option>
                      <option value="petugas">Petugas Lapangan</option>
                      <option value="admin">Admin Dinas</option>
                      <option value="superuser">Superuser BBWS</option>
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest">
                  Password Default
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-sm text-sm text-blue-950 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-950 outline-none transition-all font-bold"
                  />
                </div>
                <p className="text-[10px] text-slate-600 font-bold italic leading-tight">
                  * Berikan password ini kepada petugas terkait.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-950 hover:bg-amber-400 hover:text-blue-950 text-white font-black py-4 rounded-sm uppercase text-xs tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                >
                  <Save size={18} /> Simpan Akun Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
