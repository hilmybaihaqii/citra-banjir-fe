"use client";

import React, { useState } from "react";
import {
  CloudSun,
  Save,
  Thermometer,
  Wind,
  CloudRain,
  Sun,
  Cloud,
  Navigation,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      {" "}
      {/* Perkecil container jadi max-w-4xl */}
      {/* JUDUL HALAMAN - Lebih Compact */}
      <div className="mb-6 px-2">
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
          Update Status Cuaca
        </h1>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
          Stasiun Meteorologi Jawa Barat
        </p>
      </div>
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6 p-3 bg-emerald-500 text-white rounded-xl shadow-lg flex items-center gap-3 mx-2"
          >
            <Save size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Data Cuaca Berhasil Diperbarui
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FORM SECTION - Memakan 7 dari 12 kolom */}
        <div className="lg:col-span-8 px-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 md:p-7 rounded-2xl shadow-sm border border-slate-200 space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
                  <Thermometer size={12} className="text-orange-500" /> Suhu
                  (°C)
                </label>
                <input
                  type="number"
                  required
                  placeholder="26"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-blue-950 font-bold focus:outline-none focus:border-blue-950 transition-colors"
                  value={formData.suhu}
                  onChange={(e) =>
                    setFormData({ ...formData, suhu: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
                  <Wind size={12} className="text-blue-500" /> Angin (km/j)
                </label>
                <input
                  type="number"
                  required
                  placeholder="15"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-blue-950 font-bold focus:outline-none focus:border-blue-950 transition-colors"
                  value={formData.angin}
                  onChange={(e) =>
                    setFormData({ ...formData, angin: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
                <CloudSun size={12} className="text-blue-600" /> Prakiraan
                Kondisi
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                    className={`p-2.5 text-[9px] font-black uppercase border rounded-lg transition-all flex items-center justify-center gap-2 ${
                      formData.prakiraan === p.id
                        ? "bg-blue-950 text-white border-transparent shadow-md"
                        : "bg-white text-blue-950 border-slate-200 hover:border-blue-950"
                    }`}
                  >
                    {p.icon} {p.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest">
                Catatan Tambahan
              </label>
              <textarea
                rows={3}
                placeholder="Keterangan opsional..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-blue-950 font-medium focus:outline-none focus:border-blue-950 transition-colors"
                value={formData.keterangan}
                onChange={(e) =>
                  setFormData({ ...formData, keterangan: e.target.value })
                }
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-950 hover:bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] py-3.5 rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              {loading ? (
                "Sinkronisasi..."
              ) : (
                <>
                  <Save size={14} /> Update Cuaca
                </>
              )}
            </button>
          </form>
        </div>

        {/* SIDE INFO - Memakan 4 dari 12 kolom */}
        <div className="lg:col-span-4 space-y-4 px-2">
          <div className="bg-blue-950 p-5 text-white rounded-2xl shadow-xl border-l-4 border-amber-400">
            <h4 className="text-[9px] text-amber-400 font-bold uppercase mb-3 tracking-[0.2em] flex items-center gap-2">
              <Info size={12} /> Info Publik
            </h4>
            <p className="text-[10px] leading-relaxed opacity-70">
              Data ini akan langsung terbit di aplikasi Citra Banjir publik.
            </p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-amber-400">
                  <Sun size={14} />
                </div>
                <div className="text-[9px]">
                  <p className="font-bold uppercase">Siklus Update</p>
                  <p className="opacity-50">Setiap 3 Jam</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-100/30 rounded-xl border border-blue-100 flex items-start gap-3">
            <Info className="text-blue-600 shrink-0" size={16} />
            <p className="text-[9px] font-bold text-blue-900 uppercase leading-relaxed">
              Gunakan data observasi terbaru dari stasiun meteorologi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
