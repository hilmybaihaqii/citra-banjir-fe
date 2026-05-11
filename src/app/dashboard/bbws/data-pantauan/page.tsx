"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Edit,
  Trash2,
  Info,
  X
} from "lucide-react";

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

// --- KOMPONEN INPUT KORPORAT ---
const FormInput = ({
  label, unit, name, value, onChange, disabled = false
}: {
  label: string; unit: string; name: string; value: string; onChange: (name: string, val: string) => void; disabled?: boolean;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = e.target.value.replace(/[^0-9,]/g, ""); 
    onChange(name, val);
  };

  return (
    <div className="flex flex-col mb-4">
      <label className="text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className={`flex border rounded-md overflow-hidden transition-colors shadow-sm ${
        disabled ? 'bg-slate-100 border-slate-200' : 'bg-white border-slate-300 focus-within:border-blue-950 focus-within:ring-1 focus-within:ring-blue-950'
      }`}>
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full px-3 py-2 text-sm font-semibold outline-none ${disabled ? 'bg-transparent text-slate-400 cursor-not-allowed' : 'text-blue-950 bg-white'}`}
          placeholder="0,00"
        />
        <div className={`border-l px-3 py-2 text-sm font-medium flex items-center select-none ${disabled ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-600'}`}>
          {unit}
        </div>
      </div>
    </div>
  );
};

export default function DataPantauanPage() {
  const pathname = usePathname();
  const isBMKG = pathname?.includes("/bmkg");
  const isBBWS = !isBMKG; 

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [regions, setRegions] = useState<RegionData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [monitoringLogs, setMonitoringLogs] = useState<MonitoringLog[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // State untuk Toast Notification
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false, message: "", type: "success",
  });

  // State untuk Custom Confirm Modal
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
          waktuInput: "10-05-2026 08:00",
          statusPrediksi: "Menunggu Validasi" 
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

  // Trigger Modal Konfirmasi Hapus
  const handleDeleteLog = (id: string, regionName: string) => {
    setConfirmModal({ isOpen: true, id, regionName });
  };

  // Eksekusi Hapus Data
  const confirmDelete = () => {
    if (editingId === confirmModal.id) handleCancelEdit();
    setMonitoringLogs((prev) => prev.filter((log) => log.id !== confirmModal.id));
    showToast(`Data pantauan ${confirmModal.regionName} berhasil dihapus.`, "success");
    setConfirmModal({ isOpen: false, id: "", regionName: "" });
  };

  // Batal Hapus Data
  const cancelDelete = () => {
    setConfirmModal({ isOpen: false, id: "", regionName: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.regionId || !formData.postId) {
      showToast("Wilayah dan Pos Pantau wajib dipilih.", "error");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const region = regions.find(r => r.id === formData.regionId);
      const post = posts.find(p => p.id === formData.postId);
      
      const newLog: MonitoringLog = {
        ...formData,
        id: editingId || `log-${Date.now()}`,
        regionName: region?.regionName || "-",
        postName: post?.postName || "-",
        waktuInput: new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
        statusPrediksi: "Diproses" 
      };

      if (editingId) {
        setMonitoringLogs(prev => prev.map(log => log.id === editingId ? newLog : log));
        showToast("Data berhasil diperbarui.", "success");
      } else {
        setMonitoringLogs(prev => [newLog, ...prev]);
        showToast("Data pemantauan berhasil disimpan.", "success");
      }
      
      setIsSubmitting(false);
      setEditingId(null);
      setFormData(initialFormState);
    }, 1000);
  };

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full gap-3 text-slate-500">
        <Loader2 size={28} className="animate-spin text-amber-500" />
        <p className="text-sm font-semibold">Memuat Data Server...</p>
      </div>
    );
  }

  if (regions.length === 0 || posts.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto w-full">
        <div className="bg-white border border-red-300 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 text-red-700 mb-4">
            <AlertCircle size={24} />
            <h2 className="text-lg font-bold">Data Master Tidak Lengkap</h2>
          </div>
          <p className="text-sm text-slate-700 mb-6">Diperlukan minimal 1 Wilayah dan 1 Pos Pantau untuk melakukan pencatatan.</p>
          <div className="flex gap-4">
            {regions.length === 0 && (
              <Link href={isBMKG ? "/dashboard/bmkg/wilayah" : "/dashboard/bbws/wilayah"} className="bg-blue-950 hover:bg-blue-800 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors">
                Kelola Wilayah
              </Link>
            )}
            {posts.length === 0 && (
              <Link href={isBMKG ? "#" : "/dashboard/bbws/pos-pantau"} className="bg-blue-950 hover:bg-blue-800 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors">
                Kelola Pos Pantau
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      
      {/* SOLID TOAST NOTIFICATION (Kiri Bawah & Full Responsive) */}
      {toast.show && (
        <div className={`fixed bottom-6 left-6 lg:left-78 z-100 flex items-center gap-3 px-4 py-3.5 rounded-md shadow-xl text-white font-medium text-sm max-w-[calc(100vw-3rem)] sm:max-w-sm transition-all duration-300 ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.type === "success" ? <CheckCircle size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
          <span className="leading-snug">{toast.message}</span>
        </div>
      )}

      {/* CUSTOM CONFIRM MODAL (Pengganti window.confirm) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4 transition-all">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={28} />
              </div>
              <h3 className="text-lg font-bold text-blue-950 mb-2">Hapus Data Pantauan?</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Anda yakin ingin menghapus log pemantauan untuk wilayah <span className="font-bold text-slate-700">{confirmModal.regionName}</span>? Tindakan ini permanen.
              </p>
            </div>
            <div className="flex bg-slate-50 p-4 gap-3 border-t border-slate-200">
              <button 
                onClick={cancelDelete}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-bold hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-md text-sm font-bold hover:bg-red-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Data Pemantauan Terpadu</h1>
          <p className="text-sm text-slate-500 mt-1">Formulir entri pembacaan sensor hidrologi dan meteorologi lapangan.</p>
        </div>
        {editingId && (
          <button onClick={handleCancelEdit} className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-medium rounded-md transition-colors shadow-sm">
            <X size={16} /> Batal Mode Edit
          </button>
        )}
      </div>

      {isBMKG && !editingId && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm flex items-start gap-3">
          <Info size={20} className="text-blue-700 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-900">
            <strong>Instruksi BMKG:</strong> Pilih data dari tabel riwayat di bawah, kemudian klik tombol <strong>Edit</strong> untuk melengkapi data meteorologi pada log yang telah dibuat oleh tim BBWS.
          </p>
        </div>
      )}

      {/* FORM SECTION */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* LOKASI & POS PANTAU */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Wilayah Pantauan <span className="text-red-500">*</span></label>
              <select 
                name="regionId" 
                value={formData.regionId} 
                onChange={handleInputChange} 
                required 
                disabled={isBMKG}
                className={`w-full border rounded-md px-3 py-2.5 text-sm font-semibold outline-none text-blue-950 shadow-sm transition-colors ${isBMKG ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white border-slate-300 focus:border-blue-950 focus:ring-1 focus:ring-blue-950'}`}
              >
                <option value="" disabled>-- Pilih Wilayah --</option>
                {regions.map((region) => (<option key={region.id} value={region.id}>{region.regionName}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Pos / Sensor <span className="text-red-500">*</span></label>
              <select 
                name="postId" 
                value={formData.postId} 
                onChange={handleInputChange} 
                required 
                disabled={isBMKG}
                className={`w-full border rounded-md px-3 py-2.5 text-sm font-semibold outline-none text-blue-950 shadow-sm transition-colors ${isBMKG ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white border-slate-300 focus:border-blue-950 focus:ring-1 focus:ring-blue-950'}`}
              >
                <option value="" disabled>-- Pilih Pos Pantau --</option>
                {posts.map((post) => (<option key={post.id} value={post.id}>{post.postName}</option>))}
              </select>
            </div>
          </div>
        </div>

        {/* DATA SENSOR GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* KOLOM HIDROLOGI */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
              <h2 className="text-sm font-bold text-blue-950">Entri Data Hidrologi (Sektor BBWS)</h2>
            </div>
            <div className="p-5">
              <FormInput label="Curah Hujan" unit="mm" name="curahHujan" value={formData.curahHujan} onChange={handleNumberChange} disabled={isBMKG} />
              <FormInput label="Debit Air" unit="m³/s" name="debitAir" value={formData.debitAir} onChange={handleNumberChange} disabled={isBMKG} />
              <FormInput label="Tinggi Muka Air (TMA)" unit="m" name="tinggiMukaAir" value={formData.tinggiMukaAir} onChange={handleNumberChange} disabled={isBMKG} />
              <FormInput label="Tinggi Genangan" unit="m" name="tinggiGenangan" value={formData.tinggiGenangan} onChange={handleNumberChange} disabled={isBMKG} />
            </div>
          </div>

          {/* KOLOM METEOROLOGI & SUBMIT */}
          <div className="flex flex-col gap-6">
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
                <h2 className="text-sm font-bold text-blue-950">Entri Data Meteorologi (Sektor BMKG)</h2>
              </div>
              <div className="p-5">
                <FormInput label="Suhu Udara" unit="°C" name="suhu" value={formData.suhu} onChange={handleNumberChange} disabled={isBBWS} />
                <FormInput label="Kecepatan Angin" unit="km/h" name="kecepatanAngin" value={formData.kecepatanAngin} onChange={handleNumberChange} disabled={isBBWS} />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <button 
                type="submit" 
                disabled={isSubmitting || (isBMKG && !editingId)} 
                className={`flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-bold transition-colors shadow-sm disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none ${
                  !isSubmitting && !(isBMKG && !editingId) && (editingId ? 'bg-amber-400 hover:bg-amber-500 text-blue-950' : 'bg-blue-950 hover:bg-blue-900 text-white')
                }`}
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isSubmitting ? "Menyimpan Data..." : editingId ? "Simpan Perubahan" : "Simpan & Proses Data"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* TABEL RIWAYAT */}
      <div className="mt-4 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold text-blue-950">Log Pemantauan & Status Prediksi</h2>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-max text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-500">
                <th className="px-5 py-3.5 font-semibold w-1/4">Waktu & Lokasi</th>
                <th className="px-5 py-3.5 font-semibold">Data Hidrologi</th>
                <th className="px-5 py-3.5 font-semibold">Data Meteorologi</th>
                <th className="px-5 py-3.5 font-semibold text-center">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {monitoringLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500">Belum ada data tercatat.</td>
                </tr>
              ) : (
                monitoringLogs.map((log) => (
                  <tr key={log.id} className={`border-b border-slate-100 transition-colors ${editingId === log.id ? 'bg-amber-50/50' : 'hover:bg-slate-50'}`}>
                    <td className="px-5 py-4 align-top">
                      <div className="font-bold text-blue-950">{log.regionName}</div>
                      <div className="text-slate-500 text-xs font-medium mt-0.5">{log.postName}</div>
                      <div className="text-slate-400 text-[11px] font-semibold mt-1.5">{log.waktuInput}</div>
                    </td>
                    <td className="px-5 py-4 align-top text-slate-600">
                      <ul className="space-y-1 text-xs">
                        <li>Hujan: <span className="font-semibold text-blue-950">{log.curahHujan} mm</span></li>
                        <li>Debit: <span className="font-semibold text-blue-950">{log.debitAir} m³/s</span></li>
                        <li>TMA: <span className="font-semibold text-blue-950">{log.tinggiMukaAir} m</span></li>
                        <li>Genangan: <span className="font-semibold text-blue-950">{log.tinggiGenangan} m</span></li>
                      </ul>
                    </td>
                    <td className="px-5 py-4 align-top text-slate-600">
                      <ul className="space-y-1 text-xs">
                        <li>Suhu: <span className="font-semibold text-blue-950">{log.suhu} °C</span></li>
                        <li>Angin: <span className="font-semibold text-blue-950">{log.kecepatanAngin} km/h</span></li>
                      </ul>
                    </td>
                    <td className="px-5 py-4 align-top text-center">
                      <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-md border ${
                        log.statusPrediksi.toLowerCase().includes('proses') || log.statusPrediksi.toLowerCase().includes('menunggu') 
                          ? 'bg-amber-50 border-amber-200 text-amber-700' 
                          : log.statusPrediksi.toLowerCase().includes('rawan') 
                            ? 'bg-red-50 border-red-200 text-red-700' 
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}>
                        {log.statusPrediksi}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditLog(log)} 
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-amber-100 border border-transparent hover:border-amber-200 text-slate-600 hover:text-amber-700 text-xs font-bold rounded-md transition-colors"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        {isBBWS && (
                          <button 
                            onClick={() => handleDeleteLog(log.id, log.regionName)} 
                            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-red-100 border border-transparent hover:border-red-200 text-slate-600 hover:text-red-700 text-xs font-bold rounded-md transition-colors"
                          >
                            <Trash2 size={14} /> Hapus
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