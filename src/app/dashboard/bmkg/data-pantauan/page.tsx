"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { 
  Save, 
  MapPin, 
  Radio, 
  CloudRain, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  AlertTriangle,
  ArrowRight,
  Droplets,
  List,
  Edit2,
  Trash2,
  Cpu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// --- DEFINISI TIPE DATA ---
interface RegionData {
  id: string;
  regionName: string;
}

interface PostData {
  id: string;
  postName: string;
}

interface MonitoringLog {
  id: string;
  regionId: string;
  regionName: string;
  postId: string;
  postName: string;
  curahHujan: string;
  debitAir: string;
  tinggiMukaAir: string;
  tinggiGenangan: string;
  suhu: string;
  kecepatanAngin: string;
  waktuInput: string;
  statusPrediksi: string;
}

// --- KOMPONEN INPUT ANGKA CUSTOM ---
const CustomNumberInput = ({
  label, unit, name, value, onChange, step = 0.1, disabled = false
}: {
  label: string; unit: string; name: string; value: string; onChange: (name: string, val: string) => void; step?: number; disabled?: boolean;
}) => {
  const handleIncrement = () => {
    if (disabled) return;
    const current = parseFloat(value.replace(",", ".")) || 0;
    onChange(name, (current + step).toFixed(2).replace(".", ","));
  };

  const handleDecrement = () => {
    if (disabled) return;
    const current = parseFloat(value.replace(",", ".")) || 0;
    if (current - step >= 0) {
      onChange(name, (current - step).toFixed(2).replace(".", ","));
    } else {
      onChange(name, "0,00");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = e.target.value.replace(/[^0-9,]/g, ""); 
    onChange(name, val);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className={`text-[11px] font-bold uppercase tracking-widest ${disabled ? 'text-slate-400' : 'text-slate-600'}`}>
        {label} <span className="font-medium opacity-70">({unit})</span>
      </label>
      <div className={`flex items-center justify-between border rounded-md px-3 py-2 transition-all shadow-sm ${
        disabled ? 'bg-slate-100 border-slate-200 opacity-70 cursor-not-allowed' : 'bg-white border-slate-300 focus-within:border-blue-950 focus-within:ring-1 focus-within:ring-blue-950'
      }`}>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`bg-transparent w-full font-black text-sm outline-none ${disabled ? 'text-slate-400 cursor-not-allowed' : 'text-blue-950'}`}
          placeholder="0,00"
        />
        <div className="flex items-center gap-3 shrink-0 select-none ml-2">
          <button type="button" onClick={handleDecrement} disabled={disabled} className={`w-6 h-6 flex items-center justify-center rounded transition-colors font-bold text-lg leading-none ${disabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-blue-950'}`}>−</button>
          <button type="button" onClick={handleIncrement} disabled={disabled} className={`w-6 h-6 flex items-center justify-center rounded transition-colors font-bold text-lg leading-none ${disabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-blue-950'}`}>+</button>
        </div>
      </div>
    </div>
  );
};

export default function DataPantauanPage() {
  const pathname = usePathname();
  // LOGIC RBAC (Role-Based Access Control)
  const isBMKG = pathname?.includes("/bmkg");
  const isBBWS = !isBMKG; 

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [regions, setRegions] = useState<RegionData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [monitoringLogs, setMonitoringLogs] = useState<MonitoringLog[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false, message: "", type: "success",
  });

  // CUSTOM MODAL STATE (Pengganti window.confirm)
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string; regionName: string }>({
    isOpen: false, id: "", regionName: ""
  });

  const initialFormState = {
    regionId: "",
    postId: "",
    curahHujan: "0,00",
    debitAir: "0,00",
    tinggiMukaAir: "0,00",
    tinggiGenangan: "0,00",
    suhu: "0,00",
    kecepatanAngin: "0,00",
  };

  const [formData, setFormData] = useState(initialFormState);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
  }, []);

  const fetchMasterData = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setRegions([
        { id: "1", regionName: "Baleendah" },
        { id: "2", regionName: "Dayeuhkolot" },
      ]);
      setPosts([
        { id: "101", postName: "Pos AWLR Dayeuhkolot" },
        { id: "102", postName: "Pos Hujan Majalaya" },
      ]);
      
      setMonitoringLogs([
        {
          id: "log-1",
          regionId: "1",
          regionName: "Baleendah",
          postId: "102",
          postName: "Pos Hujan Majalaya",
          curahHujan: "45,50",
          debitAir: "12,00",
          tinggiMukaAir: "2,10",
          tinggiGenangan: "0,50",
          suhu: "0,00", 
          kecepatanAngin: "0,00",
          waktuInput: "10 Mei 2026, 08:00 WIB",
          statusPrediksi: "MENUNGGU CUACA" 
        }
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => { 
    const timer = setTimeout(() => {
      setIsMounted(true); 
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => { 
    if (isMounted) {
      const timer = setTimeout(() => {
        fetchMasterData();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isMounted, fetchMasterData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditLog = (log: MonitoringLog) => {
    setEditingId(log.id);
    setFormData({
      regionId: log.regionId,
      postId: log.postId,
      curahHujan: log.curahHujan,
      debitAir: log.debitAir,
      tinggiMukaAir: log.tinggiMukaAir,
      tinggiGenangan: log.tinggiGenangan,
      suhu: log.suhu,
      kecepatanAngin: log.kecepatanAngin,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  // FUNGSI UNTUK MEMBUKA MODAL HAPUS
  const handleDeleteLog = (id: string, regionName: string) => {
    setConfirmModal({ isOpen: true, id, regionName });
  };

  // FUNGSI EKSEKUSI HAPUS
  const confirmDelete = () => {
    if (editingId === confirmModal.id) handleCancelEdit();
    setMonitoringLogs((prev) => prev.filter((log) => log.id !== confirmModal.id));
    showToast(`Data pantauan ${confirmModal.regionName} berhasil dihapus.`, "success");
    setConfirmModal({ isOpen: false, id: "", regionName: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.regionId || !formData.postId) {
      showToast("Wilayah dan Pos Pantau wajib dipilih!", "error");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const region = regions.find(r => r.id === formData.regionId);
      const post = posts.find(p => p.id === formData.postId);
      
      const newLog: MonitoringLog = {
        ...formData,
        id: editingId || `log-${Math.floor(Math.random() * 10000)}`,
        regionName: region?.regionName || "Unknown",
        postName: post?.postName || "Unknown",
        waktuInput: "Baru Saja",
        statusPrediksi: "PROSES MODEL..." 
      };

      if (editingId) {
        setMonitoringLogs(prev => prev.map(log => log.id === editingId ? newLog : log));
        showToast("Data berhasil diperbarui.", "success");
      } else {
        setMonitoringLogs(prev => [newLog, ...prev]);
        showToast("Data pemantauan berhasil dikirim ke server.", "success");
      }
      
      setIsSubmitting(false);
      setEditingId(null);
      setFormData(initialFormState);
    }, 1200);
  };

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full gap-3 text-slate-400">
        <Loader2 size={32} className="animate-spin text-amber-500" />
        <p className="text-[10px] font-bold uppercase tracking-widest">Sinkronisasi Data...</p>
      </div>
    );
  }

  if (regions.length === 0 || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full px-4">
        <div className="bg-white border border-rose-200 rounded-xl p-8 max-w-md text-center shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} /></div>
          <h2 className="text-lg font-black text-blue-950 uppercase tracking-tight mb-2">Data Master Belum Lengkap</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">Anda wajib memiliki minimal 1 <b>Wilayah Pantauan</b> dan 1 <b>Pos Pantau</b> yang terdaftar di sistem.</p>
          <div className="flex flex-col gap-3">
            {regions.length === 0 && (
              <Link href={isBMKG ? "/dashboard/bmkg/wilayah" : "/dashboard/bbws/wilayah"} className="flex items-center justify-between bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border border-blue-100">
                <div className="flex items-center gap-2"><MapPin size={16} /> Tambah Wilayah</div><ArrowRight size={16} />
              </Link>
            )}
            {posts.length === 0 && (
              <Link href={isBMKG ? "#" : "/dashboard/bbws/pos-pantau"} className="flex items-center justify-between bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border border-emerald-100">
                <div className="flex items-center gap-2"><Radio size={16} /> {isBMKG ? 'Menunggu Pos BBWS' : 'Tambah Pos Pantau'}</div>{isBBWS && <ArrowRight size={16} />}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 w-full max-w-6xl mx-auto relative pb-12 lg:pb-8">
      
      {/* CUSTOM CONFIRM MODAL (MENGGANTIKAN window.confirm) */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-250 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle size={28} />
                </div>
                <h3 className="text-lg font-black uppercase text-blue-950 mb-2 tracking-tight">Hapus Data?</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Yakin ingin menghapus data pantauan untuk <span className="font-bold text-slate-800">{confirmModal.regionName}</span>?
                </p>
              </div>
              <div className="flex p-4 gap-3 border-t border-slate-100 bg-slate-50">
                <button 
                  onClick={() => setConfirmModal({ isOpen: false, id: "", regionName: "" })}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors shadow-sm"
                >
                  Batal
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-rose-700 transition-colors shadow-sm"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION - DIPINDAH KE KIRI BAWAH SESUAI PERMINTAAN */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={`fixed z-200 flex items-center gap-3 rounded-lg border px-4 py-3.5 shadow-2xl backdrop-blur-md bottom-6 left-6 lg:left-78 max-w-[calc(100vw-3rem)] sm:max-w-md ${toast.type === "success" ? "border-emerald-200/60 bg-emerald-50/95 text-emerald-700" : "border-rose-200/60 bg-rose-50/95 text-rose-700"}`}
          >
            {toast.type === "success" ? <CheckCircle2 size={20} className="shrink-0 text-emerald-600" /> : <XCircle size={20} className="shrink-0 text-rose-600" />}
            <p className="text-sm font-bold tracking-wide">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="z-10 flex shrink-0 flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">Data Pemantauan Terpadu</h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">Input hasil pembacaan sensor hidrologi dan meteorologi untuk diprediksi Model AI.</p>
        </div>
        {editingId && (
          <button onClick={handleCancelEdit} className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border border-amber-200 shadow-sm">
            <X size={16} /> Batal Edit Mode
          </button>
        )}
      </div>

      {isBMKG && !editingId && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm text-sm text-blue-800 flex items-center gap-3">
          <AlertTriangle size={20} className="shrink-0" />
          <p><b>Petugas BMKG:</b> Harap pilih data dari tabel Riwayat di bawah, lalu klik <b>Edit</b> untuk melengkapi informasi cuaca pada laporan wilayah yang telah dibuat BBWS.</p>
        </div>
      )}

      <form id="monitoringForm" onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className={`bg-white border rounded-xl p-5 shadow-sm transition-colors ${editingId ? 'border-amber-400 shadow-amber-400/20' : 'border-slate-200'} ${isBMKG ? 'opacity-80' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                <MapPin size={14} className={editingId ? 'text-amber-500' : 'text-blue-950'} /> Pilih Lokasi (Daerah) <span className="text-red-500">*</span>
              </label>
              <select name="regionId" value={formData.regionId} onChange={handleInputChange} required disabled={isBMKG}
                className={`w-full rounded-md border px-3 py-2.5 text-sm font-bold outline-none transition-colors ${isBMKG ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white border-slate-300 text-blue-950 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 cursor-pointer'}`}
              >
                <option value="" disabled>-- Pilih Wilayah --</option>
                {regions.map((region) => (<option key={region.id} value={region.id}>{region.regionName}</option>))}
              </select>
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                <Radio size={14} className="text-blue-950" /> Pilih Pos Pantau / Sensor <span className="text-red-500">*</span>
              </label>
              <select name="postId" value={formData.postId} onChange={handleInputChange} required disabled={isBMKG}
                className={`w-full rounded-md border px-3 py-2.5 text-sm font-bold outline-none transition-colors ${isBMKG ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white border-slate-300 text-blue-950 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 cursor-pointer'}`}
              >
                <option value="" disabled>-- Pilih Pos Pantau --</option>
                {posts.map((post) => (<option key={post.id} value={post.id}>{post.postName}</option>))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-colors ${editingId ? 'border-amber-400' : 'border-slate-200'} ${isBMKG ? 'opacity-80' : ''}`}>
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center gap-2">
              <Droplets size={18} className="text-blue-950" />
              <h2 className="text-xs font-black text-blue-950 uppercase tracking-widest">Data Hidrologi (BBWS)</h2>
            </div>
            <div className="p-5 space-y-5">
              <CustomNumberInput label="Curah Hujan" unit="mm" name="curahHujan" value={formData.curahHujan} onChange={handleNumberChange} step={1.5} disabled={isBMKG} />
              <CustomNumberInput label="Debit Air" unit="m³/s" name="debitAir" value={formData.debitAir} onChange={handleNumberChange} step={0.5} disabled={isBMKG} />
              <CustomNumberInput label="Tinggi Muka Air" unit="m" name="tinggiMukaAir" value={formData.tinggiMukaAir} onChange={handleNumberChange} step={0.1} disabled={isBMKG} />
              <CustomNumberInput label="Tinggi Genangan Air" unit="m" name="tinggiGenangan" value={formData.tinggiGenangan} onChange={handleNumberChange} step={0.1} disabled={isBMKG} />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-colors ${editingId ? 'border-amber-400' : 'border-slate-200'} ${isBBWS ? 'opacity-80' : ''}`}>
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center gap-2">
                <CloudRain size={18} className="text-amber-500" />
                <h2 className="text-xs font-black text-blue-950 uppercase tracking-widest">Data Cuaca (BMKG)</h2>
              </div>
              <div className="p-5 space-y-5">
                <CustomNumberInput label="Suhu Udara" unit="°C" name="suhu" value={formData.suhu} onChange={handleNumberChange} step={0.5} disabled={isBBWS} />
                <CustomNumberInput label="Kecepatan Angin" unit="km/h" name="kecepatanAngin" value={formData.kecepatanAngin} onChange={handleNumberChange} step={1.0} disabled={isBBWS} />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
              <p className="text-[10px] text-slate-500 text-center leading-snug font-medium">Pastikan data sudah benar. Setelah disimpan, data otomatis dikirim ke <b>Model Machine Learning</b> untuk proses Prediksi Banjir.</p>
              <button type="submit" disabled={isSubmitting || (isBMKG && !editingId)} 
                className={`group flex w-full items-center justify-center gap-2 rounded-md py-3.5 text-xs font-bold uppercase tracking-widest transition-all shadow-md 
                  disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:hover:translate-y-0 
                  ${editingId ? 'bg-amber-400 hover:bg-amber-500 text-blue-950 hover:-translate-y-0.5 hover:shadow-lg' : 'bg-blue-950 hover:bg-blue-900 text-white hover:-translate-y-0.5 hover:shadow-lg'}
                `}>
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="transition-transform group-hover:scale-110" />}
                {isSubmitting ? "MEMPROSES MODEL..." : editingId ? "SIMPAN PERUBAHAN & PREDIKSI ULANG" : "KIRIM KE MODEL PREDIKSI"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="mt-4 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-200 flex items-center gap-2 bg-slate-50">
          <List size={18} className="text-blue-950" />
          <h2 className="text-sm font-black text-blue-950 uppercase tracking-widest">Riwayat Pantauan & Prediksi Model</h2>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
            <thead>
              <tr>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 bg-slate-50">Waktu & Lokasi</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 bg-slate-50">Hidrologi</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 bg-slate-50">Meteorologi</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 bg-slate-50 text-center">Status Prediksi AI</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 bg-slate-50 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {monitoringLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm font-medium text-slate-400 italic">Belum ada riwayat data pemantauan.</td>
                </tr>
              ) : (
                monitoringLogs.map((log) => (
                  <tr key={log.id} className={`border-b border-slate-100 transition-colors ${editingId === log.id ? 'bg-amber-50/50' : 'hover:bg-slate-50'}`}>
                    <td className="px-5 py-4">
                      <p className="text-xs font-bold text-blue-950 mb-0.5">{log.regionName}</p>
                      <p className="text-[10px] text-slate-500 font-medium mb-1">{log.postName}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 inline-block px-2 py-0.5 rounded">{log.waktuInput}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                        <span className="text-slate-500">Hujan: <b className="text-slate-800">{log.curahHujan} mm</b></span>
                        <span className="text-slate-500">Debit: <b className="text-slate-800">{log.debitAir} m³/s</b></span>
                        <span className="text-slate-500">TMA: <b className="text-slate-800">{log.tinggiMukaAir} m</b></span>
                        <span className="text-slate-500">Genangan: <b className="text-slate-800">{log.tinggiGenangan} m</b></span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1 text-[11px]">
                        <span className="text-slate-500">Suhu: <b className={`${log.suhu === "0,00" ? 'text-rose-500' : 'text-slate-800'}`}>{log.suhu} °C</b></span>
                        <span className="text-slate-500">Angin: <b className={`${log.kecepatanAngin === "0,00" ? 'text-rose-500' : 'text-slate-800'}`}>{log.kecepatanAngin} km/h</b></span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm ${
                        log.statusPrediksi.includes('PROSES') || log.statusPrediksi.includes('MENUNGGU') ? 'bg-amber-50 border-amber-200 text-amber-700' :
                        log.statusPrediksi === 'RAWAN BANJIR' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                        'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}>
                        <Cpu size={14} className={log.statusPrediksi.includes('PROSES') || log.statusPrediksi.includes('MENUNGGU') ? 'animate-pulse' : ''} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{log.statusPrediksi}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditLog(log)} className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-md border border-amber-100 transition-colors" title="Edit Data">
                          <Edit2 size={14} />
                        </button>
                        {isBBWS && (
                          <button onClick={() => handleDeleteLog(log.id, log.regionName)} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md border border-rose-100 transition-colors" title="Hapus Data">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}