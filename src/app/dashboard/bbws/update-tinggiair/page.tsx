"use client";

import React, { useState, useEffect } from "react";
import {
  Waves,
  Save,
  Clock,
  Calendar,
  MapPin,
  RefreshCcw,
  CheckCircle2,
  AlertTriangle,
  History,
} from "lucide-react";
import { Outfit } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const LOKASI_WILAYAH = [
  { id: "W1", name: "Jalan Raya Dayeuhkolot" },
  { id: "W2", name: "Kawasan Industri Cisirung" },
  { id: "W3", name: "Pemukiman Warga Baleendah" },
  { id: "W4", name: "Simpang Bojongsoang" },
];

const STATUS_LEVELS = [
  { id: "Normal", color: "bg-emerald-600", text: "text-emerald-600" },
  { id: "Waspada", color: "bg-amber-500", text: "text-amber-500" },
  { id: "Siaga", color: "bg-rose-600", text: "text-rose-600" },
];

export default function UpdateTMAPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState([
    { loc: "Kawasan Cisirung", val: "55 CM", status: "Waspada", time: "11:30" },
    {
      loc: "Jalan Raya Dayeuhkolot",
      val: "20 CM",
      status: "Normal",
      time: "10:05",
    },
  ]);

  const [formData, setFormData] = useState({
    lokasi: "",
    tinggi: "",
    status: "Normal",
    tanggal: "",
    jam: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      setFormData((prev) => ({
        ...prev,
        tanggal: new Date().toISOString().split("T")[0],
        jam: new Date()
          .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
          .replace(".", ":"),
      }));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const selectedName =
        LOKASI_WILAYAH.find((l) => l.id === formData.lokasi)?.name ||
        "Lokasi Umum";
      const newEntry = {
        loc: selectedName,
        val: `${formData.tinggi} CM`,
        status: formData.status,
        time: formData.jam,
      };
      setHistory([newEntry, ...history]);
      setLoading(false);
      setSuccess(true);
      setFormData({ ...formData, tinggi: "" });
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div
      className={`flex flex-col gap-6 pb-12 animate-in fade-in duration-500 ${outfit.className}`}
    >
      <div className="px-2">
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
          Update Tinggi Air Wilayah
        </h1>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
          Laporan Genangan Jalan & Pemukiman BBWS
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 text-blue-950">
                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ml-1">
                  <MapPin size={12} className="text-amber-500" /> Pilih Wilayah
                  Genangan
                </label>
                <select
                  required
                  value={formData.lokasi}
                  onChange={(e) =>
                    setFormData({ ...formData, lokasi: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:bg-white focus:border-blue-950 transition-all tracking-wider"
                >
                  <option value="">-- Pilih Wilayah --</option>
                  {LOKASI_WILAYAH.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 text-blue-950">
                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ml-1">
                  <Waves size={12} className="text-blue-500" /> Tinggi Genangan
                  (CM)
                </label>
                <input
                  required
                  type="number"
                  placeholder="0"
                  value={formData.tinggi}
                  onChange={(e) =>
                    setFormData({ ...formData, tinggi: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:bg-white focus:border-blue-950 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 ml-1">
                <AlertTriangle size={12} className="text-red-500" /> Tentukan
                Status Kondisi
              </label>
              <div className="grid grid-cols-3 gap-3">
                {STATUS_LEVELS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: s.id })}
                    className={`py-3 text-[10px] font-black uppercase rounded-xl border-2 transition-all ${formData.status === s.id ? `${s.color} text-white border-transparent shadow-lg scale-105` : `bg-white text-blue-950 border-slate-100 hover:border-blue-950`}`}
                  >
                    {s.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-blue-950">
                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ml-1">
                  <Calendar size={12} className="text-amber-500" /> Tanggal
                  Laporan
                </label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggal: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold"
                />
              </div>
              <div className="space-y-2 text-blue-950">
                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ml-1">
                  <Clock size={12} className="text-amber-500" /> Waktu Pantauan
                </label>
                <input
                  type="time"
                  value={formData.jam}
                  onChange={(e) =>
                    setFormData({ ...formData, jam: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.lokasi}
              className={`w-full flex items-center justify-center gap-3 rounded-xl py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 ${success ? "bg-emerald-500" : "bg-blue-950 hover:bg-slate-900"}`}
            >
              {loading ? (
                <RefreshCcw size={16} className="animate-spin" />
              ) : success ? (
                <CheckCircle2 size={16} />
              ) : (
                <Save size={16} />
              )}
              {loading
                ? "Menyinkronkan..."
                : success
                  ? "Berhasil Disimpan"
                  : "Simpan Data"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-blue-950 rounded-2xl p-5 text-white shadow-xl border-l-4 border-amber-400">
            <h4 className="text-[9px] text-amber-400 font-bold uppercase mb-5 flex items-center gap-2 tracking-[0.2em]">
              <History size={12} /> Riwayat Live
            </h4>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {history.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-black uppercase text-white/90 leading-tight flex-1">
                        {item.loc}
                      </p>
                      <span
                        className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase border ${item.status === "Normal" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : item.status === "Waspada" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-rose-500/20 text-rose-400 border-rose-500/30"}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-white/40 pt-1 border-t border-white/5">
                      <span className="text-[9px] font-bold italic text-amber-400">
                        {item.val}
                      </span>
                      <span className="text-[8px] flex items-center gap-1">
                        <Clock size={8} /> {item.time} WIB
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
