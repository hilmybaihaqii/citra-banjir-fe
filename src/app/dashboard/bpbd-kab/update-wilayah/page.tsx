"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Save, MapPin, RefreshCcw, CheckCircle2, AlertCircle, X, Users, Home } from "lucide-react";

import { KECAMATAN_DATA, KecamatanDetail } from "@/lib/mapData";

const MapPicker = dynamic(() => import("@/components/ui/MapPicker"), { 
  ssr: false, 
  loading: () => (
    <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center border border-slate-200 rounded-sm gap-3">
      <RefreshCcw size={24} className="text-slate-300 animate-spin" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Menyiapkan Peta Interaktif...
      </p>
    </div>
  )
});

export default function BPBDKabUpdateWilayahPage() {
  const [locations, setLocations] = useState<KecamatanDetail[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null); 
  
  // State Awal
  const initialFormState = {
    name: "", lat: "", lng: "", status: "Waspada" as KecamatanDetail["status"],
    kepalaKeluarga: "0", jiwaTerdampak: "0", pengungsi: "0", lukaLuka: "0", meninggal: "0",
    rumahTerendam: "0", rumahRusakParah: "0", fasilitasUmum: "0", tempatIbadah: "0"
  };
  
  const [formData, setFormData] = useState(initialFormState);

  // Kunci penyimpanan harus SAMA dengan Jabar agar tersinkronisasi
  const STORAGE_KEY = "simulasi_database_banjir";

  useEffect(() => {
    const loadLocations = () => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        setLocations(JSON.parse(savedData));
      } else {
        setLocations(KECAMATAN_DATA);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(KECAMATAN_DATA));
      }
    };

    loadLocations();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setLocations(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, lat: lat.toFixed(6), lng: lng.toFixed(6) }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleEditRegion = (region: KecamatanDetail) => {
    setEditingId(region.id); 
    setFormData({
      name: region.name,
      lat: region.coords[0].toString(),
      lng: region.coords[1].toString(),
      status: region.status,
      kepalaKeluarga: region.stats.kepalaKeluarga,
      jiwaTerdampak: region.stats.jiwaTerdampak,
      pengungsi: region.stats.pengungsi,
      lukaLuka: region.stats.lukaLuka,
      meninggal: region.stats.meninggal,
      rumahTerendam: region.stats.rumahTerendam,
      rumahRusakParah: region.stats.rumahRusakParah,
      fasilitasUmum: region.stats.fasilitasUmum,
      tempatIbadah: region.stats.tempatIbadah,
    });
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { setErrorMessage("Nama Wilayah tidak boleh kosong!"); return; }
    if (!formData.lat || !formData.lng) { setErrorMessage("Koordinat Latitude dan Longitude harus diisi!"); return; }

    setIsSubmitting(true);
    setErrorMessage(null);

    setTimeout(() => {
      try {
        const regionData = {
          name: formData.name,
          coords: [parseFloat(formData.lat), parseFloat(formData.lng)] as [number, number],
          status: formData.status,
          stats: {
            kepalaKeluarga: formData.kepalaKeluarga || "0", 
            jiwaTerdampak: formData.jiwaTerdampak || "0", 
            pengungsi: formData.pengungsi || "0", 
            lukaLuka: formData.lukaLuka || "0", 
            meninggal: formData.meninggal || "0",
            rumahTerendam: formData.rumahTerendam || "0", 
            rumahRusakParah: formData.rumahRusakParah || "0", 
            fasilitasUmum: formData.fasilitasUmum || "0", 
            tempatIbadah: formData.tempatIbadah || "0"
          }
        };

        let updatedLocations;

        if (editingId) {
          updatedLocations = locations.map(loc => loc.id === editingId ? { ...loc, ...regionData } : loc);
          setSuccessMessage(`Data wilayah ${formData.name} berhasil diperbarui!`);
        } else {
          const newRegion: KecamatanDetail = { id: Date.now(), ...regionData };
          updatedLocations = [...locations, newRegion];
          setSuccessMessage(`Wilayah ${formData.name} berhasil ditambahkan!`);
        }

        setLocations(updatedLocations);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
        
        window.dispatchEvent(new Event("storage"));

        setTimeout(() => setSuccessMessage(null), 4000); 
        
        setEditingId(null);
        setFormData(initialFormState);
      } catch (error) {
        console.error("Gagal menyimpan:", error);
        setErrorMessage("Terjadi kesalahan sistem saat menyimpan data. Pastikan format angka benar.");
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  const handleDeleteRegion = (id: number) => {
    const regionToDelete = locations.find(loc => loc.id === id);
    if(window.confirm(`Yakin ingin menghapus wilayah ${regionToDelete?.name} secara permanen?`)) {
      const updatedLocations = locations.filter(loc => loc.id !== id);
      setLocations(updatedLocations);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
      
      window.dispatchEvent(new Event("storage")); 
      
      if (editingId === id) handleCancelEdit();

      setSuccessMessage(`Data wilayah ${regionToDelete?.name} berhasil dihapus.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  const selectedCoords: [number, number] | null = 
    formData.lat && formData.lng && !isNaN(parseFloat(formData.lat)) && !isNaN(parseFloat(formData.lng))
      ? [parseFloat(formData.lat), parseFloat(formData.lng)] : null;

  return (
    <div className="flex flex-col h-full gap-5 lg:gap-6 relative">
      
      {/* HEADER & NOTIFIKASI */}
      <div className="shrink-0 flex flex-col md:flex-row justify-between md:items-end gap-4 relative z-10">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-blue-950 uppercase tracking-tight">Update Wilayah Bencana</h1>
          <p className="text-slate-600 font-medium text-xs md:text-sm mt-1 tracking-wide">
            Pantau, tambahkan, atau perbarui data komprehensif daerah terdampak banjir di Kabupaten Bandung.
          </p>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-top-2 shadow-sm w-full md:w-auto">
            <CheckCircle2 size={16} className="shrink-0" /> <span className="truncate">{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-top-2 shadow-sm w-full md:w-auto">
            <AlertCircle size={16} className="shrink-0" /> <span className="truncate">{errorMessage}</span>
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 lg:min-h-150">
        
        {/* KIRI: PETA */}
        <div className="lg:col-span-2 h-100 lg:h-full relative flex flex-col z-0">
          <MapPicker 
            locations={locations} 
            onMapClick={handleMapClick} 
            selectedCoords={selectedCoords} 
            onDeleteRegion={handleDeleteRegion}
            onEditRegion={handleEditRegion}
          />
        </div>

        {/* KANAN: FORMULIR INPUT */}
        <div className={`border rounded-sm shadow-sm flex flex-col h-auto lg:h-full overflow-hidden z-10 relative transition-colors ${editingId ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'}`}>
          
          <div className={`p-4 border-b flex items-center justify-between shrink-0 ${editingId ? 'border-amber-200 bg-amber-100' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex items-center gap-2">
              <MapPin size={16} className={editingId ? "text-amber-700" : "text-blue-950"} />
              <h2 className={`text-[10px] font-black uppercase tracking-widest ${editingId ? "text-amber-800" : "text-blue-950"}`}>
                {editingId ? "Mode Edit Data Wilayah" : "Formulir Tambah Wilayah"}
              </h2>
            </div>
            {editingId && (
              <button onClick={handleCancelEdit} className="text-amber-600 hover:text-amber-800 transition-colors p-1" title="Batal Edit">
                <X size={16} strokeWidth={3} />
              </button>
            )}
          </div>

          <form id="updateRegionForm" onSubmit={handleSubmit} className={`flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar ${editingId ? 'bg-amber-50/30' : 'bg-white'}`}>
            
            {/* INFO DASAR */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Wilayah <span className="text-red-500">*</span></label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Contoh: Baleendah" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-sm text-sm font-bold text-blue-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Status Peringatan <span className="text-red-500">*</span></label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-sm text-sm font-bold text-blue-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none cursor-pointer">
                  <option value="Aman">Aman (Hijau)</option>
                  <option value="Waspada">Waspada (Kuning)</option>
                  <option value="Siaga 2">Siaga 2 (Merah)</option>
                  <option value="Siaga 1">Siaga 1 (Merah Pekat)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Latitude <span className="text-red-500">*</span></label>
                  <input required type="text" name="lat" value={formData.lat} onChange={handleInputChange} placeholder="-6.9147" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-sm text-sm font-bold text-blue-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Longitude <span className="text-red-500">*</span></label>
                  <input required type="text" name="lng" value={formData.lng} onChange={handleInputChange} placeholder="107.6098" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-sm text-sm font-bold text-blue-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 border-dashed"></div>

            {/* SEGMEN 1: DAMPAK MANUSIA */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users size={14} className="text-slate-400" />
                <h3 className="text-[10px] font-bold text-blue-950 uppercase tracking-widest">Statistik Korban & Warga</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Kepala Keluarga (KK)</span>
                  <input type="number" min="0" name="kepalaKeluarga" value={formData.kepalaKeluarga} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm font-bold text-blue-950 outline-none focus:border-amber-400" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Jiwa</span>
                  <input type="number" min="0" name="jiwaTerdampak" value={formData.jiwaTerdampak} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm font-bold text-blue-950 outline-none focus:border-amber-400" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Warga Mengungsi</span>
                  <input type="number" min="0" name="pengungsi" value={formData.pengungsi} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm font-bold text-blue-950 outline-none focus:border-amber-400" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Luka-luka</span>
                  <input type="number" min="0" name="lukaLuka" value={formData.lukaLuka} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm font-bold text-blue-950 outline-none focus:border-amber-400" />
                </div>
                <div className="col-span-2">
                  <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">Meninggal Dunia</span>
                  <input type="number" min="0" name="meninggal" value={formData.meninggal} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-sm text-sm font-bold outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500" />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 border-dashed"></div>

            {/* SEGMEN 2: KERUSAKAN INFRASTRUKTUR */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Home size={14} className="text-slate-400" />
                <h3 className="text-[10px] font-bold text-blue-950 uppercase tracking-widest">Kerusakan Bangunan</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rumah Terendam</span>
                  <input type="number" min="0" name="rumahTerendam" value={formData.rumahTerendam} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm font-bold text-blue-950 outline-none focus:border-amber-400" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rumah Rusak Parah</span>
                  <input type="number" min="0" name="rumahRusakParah" value={formData.rumahRusakParah} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm font-bold text-blue-950 outline-none focus:border-amber-400" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Fasilitas Umum</span>
                  <input type="number" min="0" name="fasilitasUmum" value={formData.fasilitasUmum} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm font-bold text-blue-950 outline-none focus:border-amber-400" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tempat Ibadah</span>
                  <input type="number" min="0" name="tempatIbadah" value={formData.tempatIbadah} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm font-bold text-blue-950 outline-none focus:border-amber-400" />
                </div>
              </div>
            </div>

          </form>

          {/* Tombol Submit */}
          <div className={`p-4 border-t shrink-0 ${editingId ? 'bg-amber-100 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
            <button 
              type="submit" 
              form="updateRegionForm"
              disabled={isSubmitting} 
              className={`w-full py-3.5 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all shadow-md flex items-center justify-center gap-2 group disabled:bg-slate-300 disabled:text-slate-500 ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-950 hover:bg-blue-900'}`}
            >
              {isSubmitting ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} className="group-hover:scale-110 transition-transform" />}
              {isSubmitting ? "MENYIMPAN DATA..." : (editingId ? "SIMPAN PERUBAHAN" : "SIMPAN & UPDATE PETA")}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}