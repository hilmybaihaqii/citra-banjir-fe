"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Save, MapPin, RefreshCcw, CheckCircle2, AlertCircle, X, Users, Home } from "lucide-react";

import { KECAMATAN_DATA, KecamatanDetail } from "@/lib/mapData";

const MapPicker = dynamic(() => import("@/components/ui/MapPicker"), { 
  ssr: false, 
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-slate-50">
      <RefreshCcw size={24} className="animate-spin text-slate-300" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Menyiapkan Peta Interaktif...
      </p>
    </div>
  )
});

export default function BPBDJabarUpdateWilayahPage() {
  const [locations, setLocations] = useState<KecamatanDetail[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null); 
  
  const initialFormState = {
    name: "", lat: "", lng: "", status: "Waspada" as KecamatanDetail["status"],
    kepalaKeluarga: "0", jiwaTerdampak: "0", pengungsi: "0", lukaLuka: "0", meninggal: "0",
    rumahTerendam: "0", rumahRusakParah: "0", fasilitasUmum: "0", tempatIbadah: "0"
  };
  
  const [formData, setFormData] = useState(initialFormState);
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
    
    const latNum = parseFloat(formData.lat);
    const lngNum = parseFloat(formData.lng);
    if (isNaN(latNum) || isNaN(lngNum)) { 
      setErrorMessage("Koordinat tidak valid! Silakan masukkan angka atau klik pada Peta."); 
      return; 
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    setTimeout(() => {
      try {
        const regionData = {
          name: formData.name,
          coords: [latNum, lngNum] as [number, number],
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
        setErrorMessage("Terjadi kesalahan sistem saat menyimpan data.");
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
    <div className="flex flex-col gap-6 pb-12 lg:h-[calc(100dvh-7rem)] lg:pb-0">
      
      <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-end md:justify-between z-10">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">Update Wilayah</h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Pantau, tambahkan, atau perbarui data komprehensif daerah terdampak.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto">
          {successMessage && (
            <div className="flex w-full items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm md:w-auto">
              <CheckCircle2 size={16} className="shrink-0" /> <span className="truncate">{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="flex w-full items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-rose-600 shadow-sm md:w-auto">
              <AlertCircle size={16} className="shrink-0" /> <span className="truncate">{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 lg:flex-row min-h-0">
        

        <div className="relative z-0 flex h-100 w-full shrink-0 flex-col overflow-hidden rounded-lg border border-slate-200 lg:h-full lg:w-2/3">
          <MapPicker 
            locations={locations} 
            onMapClick={handleMapClick} 
            selectedCoords={selectedCoords} 
            onDeleteRegion={handleDeleteRegion}
            onEditRegion={handleEditRegion}
          />
        </div>

        <div className={`relative z-10 flex h-162.5 w-full shrink-0 flex-col overflow-hidden rounded-lg border shadow-sm transition-colors lg:h-full lg:w-1/3 ${editingId ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200 bg-white'}`}>
          
          <div className={`flex shrink-0 items-center justify-between border-b p-4 ${editingId ? 'border-amber-200 bg-amber-100' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex items-center gap-2">
              <MapPin size={16} className={editingId ? "text-amber-700" : "text-blue-950"} />
              <h2 className={`text-[10px] font-black uppercase tracking-widest ${editingId ? "text-amber-800" : "text-blue-950"}`}>
                {editingId ? "Mode Edit Data" : "Tambah Wilayah"}
              </h2>
            </div>
            {editingId && (
              <button onClick={handleCancelEdit} className="rounded-md p-1.5 text-amber-600 transition-colors hover:bg-amber-200 hover:text-amber-800" title="Batal Edit">
                <X size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>

          <form id="updateRegionForm" onSubmit={handleSubmit} className="custom-scrollbar flex-1 overflow-y-auto p-5 space-y-6">
            
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Nama Wilayah <span className="text-red-500">*</span></label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Contoh: Baleendah" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base font-bold text-blue-950 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400" />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Status Peringatan <span className="text-red-500">*</span></label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base font-bold text-blue-950 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400">
                  <option value="Aman">Aman </option>
                  <option value="Waspada">Waspada </option>
                  <option value="Siaga 2">Siaga 2 </option>
                  <option value="Siaga 1">Siaga 1 </option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input required type="text" name="lat" value={formData.lat} onChange={handleInputChange} placeholder="Latitude" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-medium text-slate-700 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400" />
                <input required type="text" name="lng" value={formData.lng} onChange={handleInputChange} placeholder="Longitude" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-medium text-slate-700 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400" />
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200"></div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <Users size={16} className="text-slate-400" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-950">Statistik Korban & Warga</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Kepala Keluarga (KK)</span>
                  <input type="number" min="0" name="kepalaKeluarga" value={formData.kepalaKeluarga} onChange={handleInputChange} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-bold text-blue-950 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Total Jiwa</span>
                  <input type="number" min="0" name="jiwaTerdampak" value={formData.jiwaTerdampak} onChange={handleInputChange} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-bold text-blue-950 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Warga Mengungsi</span>
                  <input type="number" min="0" name="pengungsi" value={formData.pengungsi} onChange={handleInputChange} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-bold text-blue-950 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Luka-luka</span>
                  <input type="number" min="0" name="lukaLuka" value={formData.lukaLuka} onChange={handleInputChange} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-bold text-blue-950 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400" />
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-rose-500">Meninggal Dunia</span>
                  <input type="number" min="0" name="meninggal" value={formData.meninggal} onChange={handleInputChange} className="mt-1 w-full rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-base font-bold text-rose-700 outline-none transition-colors focus:border-rose-500 focus:ring-1 focus:ring-rose-500" />
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200"></div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <Home size={16} className="text-slate-400" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-950">Kerusakan Bangunan</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Rumah Terendam</span>
                  <input type="number" min="0" name="rumahTerendam" value={formData.rumahTerendam} onChange={handleInputChange} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-bold text-blue-950 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Rusak Parah</span>
                  <input type="number" min="0" name="rumahRusakParah" value={formData.rumahRusakParah} onChange={handleInputChange} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-bold text-blue-950 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Fasilitas Umum</span>
                  <input type="number" min="0" name="fasilitasUmum" value={formData.fasilitasUmum} onChange={handleInputChange} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-bold text-blue-950 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Tempat Ibadah</span>
                  <input type="number" min="0" name="tempatIbadah" value={formData.tempatIbadah} onChange={handleInputChange} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-bold text-blue-950 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400" />
                </div>
              </div>
            </div>

          </form>

          <div className={`shrink-0 border-t p-4 ${editingId ? 'border-amber-200 bg-amber-100/50' : 'border-slate-200 bg-slate-50'}`}>
            <button 
              type="submit" 
              form="updateRegionForm"
              disabled={isSubmitting} 
              className={`group flex w-full items-center justify-center gap-2 rounded-md py-3.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition-all disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-950 hover:bg-blue-900'}`}
            >
              {isSubmitting ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} className="transition-transform group-hover:scale-110" />}
              {isSubmitting ? "MENYIMPAN DATA..." : (editingId ? "SIMPAN PERUBAHAN" : "SIMPAN & UPDATE PETA")}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}