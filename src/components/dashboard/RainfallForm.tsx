"use client";

import React, { useState } from "react";
import {
  CloudRain,
  ArrowLeft,
  Save,
  History,
  MapPin,
  Clock,
  Droplets,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface RainfallFormProps {
  agencyType: "bbws" | "bmkg";
}

export const RainfallForm = ({ agencyType }: RainfallFormProps) => {
  // Hapus const router = useRouter() jika memang tidak dipakai di fungsi mana pun
  // untuk menghilangkan peringatan linting.

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    lokasi: "",
    intensitas: "",
    status: "Normal",
    keterangan: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        lokasi: "",
        intensitas: "",
        status: "Normal",
        keterangan: "",
      });
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const backPath =
    agencyType === "bbws" ? "/dashboard/bbws" : "/dashboard/bmkg";
  const themeColor =
    agencyType === "bbws" ? "text-blue-600" : "text-emerald-600";
  const accentColor = agencyType === "bbws" ? "bg-blue-600" : "bg-emerald-600";
  const bgColor = agencyType === "bbws" ? "bg-blue-50" : "bg-emerald-50";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href={backPath}>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
            <div className="relative w-8 h-8">
              <Image
                src="/images/citrabanjir.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-black text-blue-950 uppercase tracking-tight leading-none">
                Update Curah Hujan
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                Sistem Integrasi BBWS & BMKG
              </p>
            </div>
          </div>
        </div>
        <div
          className={`flex items-center gap-3 ${bgColor} px-4 py-2 rounded-lg border border-opacity-20`}
        >
          <CloudRain className={themeColor} size={18} />
          <span
            className={`text-xs font-bold ${themeColor} uppercase tracking-wider`}
          >
            {agencyType.toUpperCase()} Control
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
              Data Berhasil Disinkronkan ke Seluruh Instansi
            </span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- LOKASI POS --- */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={12} className="text-amber-500" /> Lokasi Pos
                    Pantau
                  </label>
                  <select
                    required
                    className="w-full p-3 bg-white border border-slate-300 rounded-sm text-sm text-blue-950 font-semibold focus:outline-none focus:border-amber-400 transition-colors"
                    value={formData.lokasi}
                    onChange={(e) =>
                      setFormData({ ...formData, lokasi: e.target.value })
                    }
                  >
                    <option value="" className="text-slate-400">
                      Pilih Pos Pengamatan...
                    </option>
                    <option value="Cisanti" className="text-blue-950">
                      Hulu Cisanti
                    </option>
                    <option value="Majalaya" className="text-blue-950">
                      Pos Majalaya
                    </option>
                    <option value="Dayeuhkolot" className="text-blue-950">
                      Pos Dayeuhkolot
                    </option>
                    <option value="Nanjung" className="text-blue-950">
                      Pos Nanjung
                    </option>
                  </select>
                </div>

                {/* --- INTENSITAS --- */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
                    <Droplets size={12} className="text-blue-500" /> Intensitas
                    (mm/hr)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="Contoh: 15.5"
                    className="w-full p-3 bg-white border border-slate-300 rounded-sm text-sm text-blue-950 font-semibold placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                    value={formData.intensitas}
                    onChange={(e) =>
                      setFormData({ ...formData, intensitas: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* --- STATUS --- */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle size={12} className="text-red-500" /> Status
                  Cuaca
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Normal", "Waspada", "Siaga"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: s })}
                      className={`p-3 text-[10px] font-bold uppercase border rounded-sm transition-all ${
                        formData.status === s
                          ? `${accentColor} text-white border-transparent shadow-md`
                          : "bg-white text-blue-950 border-slate-300 hover:border-amber-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* --- KETERANGAN --- */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
                  Keterangan Tambahan
                </label>
                <textarea
                  rows={4}
                  placeholder="Informasi tambahan kondisi di lapangan..."
                  className="w-full p-3 bg-white border border-slate-300 rounded-sm text-sm text-blue-950 font-medium placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                  value={formData.keterangan}
                  onChange={(e) =>
                    setFormData({ ...formData, keterangan: e.target.value })
                  }
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-400 hover:bg-amber-500 text-blue-950 font-black uppercase text-xs tracking-[0.2em] py-4 rounded-sm shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Menyinkronkan..."
                ) : (
                  <>
                    <Save size={16} /> Simpan & Bagikan Data
                  </>
                )}
              </button>
            </form>
          </div>

          {/* --- HISTORY --- */}
          <div className="space-y-6">
            <div className="bg-blue-950 p-6 text-white rounded-sm shadow-xl">
              <h4 className="text-[10px] text-amber-400 font-bold uppercase mb-6 flex items-center gap-2 tracking-[0.2em]">
                <History size={14} /> Riwayat Bersama (Live)
              </h4>
              <div className="space-y-5">
                {[
                  {
                    pos: "Nanjung",
                    val: "22 mm",
                    time: "10:15",
                    agency: "BMKG",
                  },
                  {
                    pos: "Dayeuhkolot",
                    val: "18 mm",
                    time: "09:30",
                    agency: "BBWS",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="border-l-2 border-amber-400 pl-4 py-1 space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold uppercase">{item.pos}</p>
                      <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-amber-400 font-bold">
                        {item.agency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center opacity-90">
                      <span className="text-[10px] italic font-medium">
                        {item.val}
                      </span>
                      <span className="text-[9px] flex items-center gap-1 font-bold">
                        <Clock size={10} /> {item.time} WIB
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
