"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

// Import dinamis untuk menghindari SSR Error pada Leaflet
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
    // Memastikan wrapper memenuhi 100% viewport. 
    // pt-[72px] ditambahkan untuk memberi ruang pada Navbar agar peta tidak terpotong di atas.
    <main className={`${outfit.variable} font-sans w-full h-screen pt-18 bg-slate-100 overflow-hidden`}>
      <MapInformasiFull />
    </main>
  );
}