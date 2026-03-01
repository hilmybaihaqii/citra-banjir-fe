"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const MapInformasiFull = dynamic(() => import("@/components/infografis/MapInformasi"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-slate-500 text-sm font-medium animate-pulse uppercase tracking-widest">Memuat Peta Luasan...</p>
    </div>
  ),
});

export default function PetaInformasiPage() {
  return (
    // PERBAIKAN: Gunakan h-[100dvh] sebagai ganti h-screen agar aman di Safari Mobile
    <main className={`${outfit.variable} font-sans pt-28 w-full h-dvh bg-slate-100 overflow-hidden`}>
      <MapInformasiFull />
    </main>
  );
}