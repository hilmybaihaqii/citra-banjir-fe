"use client";

import React, { useState } from "react";
import {
  CloudSun,
  ArrowLeft,
  Save,
  Thermometer,
  Wind,
  CloudRain,
  Sun,
  Cloud,
  Navigation,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function UpdateCuacaBMKG() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    suhu: "",
    angin: "",
    prakiraan: "Berawan",
    keterangan: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulasi pengiriman data ke sistem
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        suhu: "",
        angin: "",
        prakiraan: "Berawan",
        keterangan: "",
      });
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER NAVIGATION */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/bmkg">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
            <div className="relative w-8 h-8">
              <Image
                src="/images/citrabanjir.png"
                alt="Logo Citra Banjir"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-black text-blue-950 uppercase tracking-tight leading-none">
                Update Data Cuaca
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                Pusat Meteorologi BMKG Jabar
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
          <CloudSun className="text-emerald-600" size={18} />
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            Stasiun Meteorologi
          </span>
        </div>
      </header>

      <main className="p-10 max-w-5xl mx-auto">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-emerald-500 text-white rounded-sm shadow-lg flex items-center gap-3"
          >
            <Save size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">
              Prakiraan Cuaca Berhasil Diperbarui
            </span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM SECTION */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Suhu */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
                    <Thermometer size={12} className="text-orange-500" /> Suhu
                    Udara (°C)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 26"
                    className="w-full p-3 bg-white border border-slate-300 rounded-sm text-sm text-blue-950 font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
                    value={formData.suhu}
                    onChange={(e) =>
                      setFormData({ ...formData, suhu: e.target.value })
                    }
                  />
                </div>

                {/* Input Angin */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
                    <Wind size={12} className="text-blue-500" /> Kecepatan Angin
                    (km/j)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 15"
                    className="w-full p-3 bg-white border border-slate-300 rounded-sm text-sm text-blue-950 font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
                    value={formData.angin}
                    onChange={(e) =>
                      setFormData({ ...formData, angin: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Prakiraan Selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
                  <CloudSun size={12} className="text-emerald-500" /> Kondisi
                  Prakiraan
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: "Cerah", icon: <Sun size={14} /> },
                    { id: "Berawan", icon: <Cloud size={14} /> },
                    { id: "Hujan", icon: <CloudRain size={14} /> },
                    {
                      id: "Badai",
                      icon: <Navigation size={14} className="rotate-45" />,
                    },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, prakiraan: p.id })
                      }
                      className={`p-3 text-[10px] font-bold uppercase border rounded-sm transition-all flex items-center justify-center gap-2 ${
                        formData.prakiraan === p.id
                          ? "bg-emerald-600 text-white border-transparent shadow-md"
                          : "bg-white text-blue-950 border-slate-300 hover:border-emerald-500"
                      }`}
                    >
                      {p.icon} {p.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest">
                  Keterangan Cuaca Ekstrim (Opsional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Masukkan peringatan dini atau catatan cuaca lainnya..."
                  className="w-full p-3 bg-white border border-slate-300 rounded-sm text-sm text-blue-950 font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                  value={formData.keterangan}
                  onChange={(e) =>
                    setFormData({ ...formData, keterangan: e.target.value })
                  }
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-xs tracking-[0.2em] py-4 rounded-sm shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  "Sinkronisasi Data..."
                ) : (
                  <>
                    <Save size={16} /> Update Status Cuaca
                  </>
                )}
              </button>
            </form>
          </div>

          {/* SIDE INFO */}
          <div className="space-y-6">
            <div className="bg-emerald-950 p-6 text-white rounded-sm shadow-xl border-l-4 border-emerald-400">
              <h4 className="text-[10px] text-emerald-400 font-bold uppercase mb-6 tracking-[0.2em]">
                Informasi Publik
              </h4>
              <p className="text-[11px] leading-relaxed opacity-80">
                Data prakiraan yang diupdate di sini akan tampil secara
                real-time di halaman utama aplikasi sebagai panduan masyarakat
                luas.
              </p>
              <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-emerald-400">
                    <Sun size={16} />
                  </div>
                  <div className="text-[10px]">
                    <p className="font-bold uppercase">Update Otomatis</p>
                    <p className="opacity-50">Setiap 3 Jam Sekali</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
