"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Save,
  MapPin,
  RefreshCcw,
  CheckCircle2,
  X,
  Users,
  Home,
} from "lucide-react";

import { KECAMATAN_DATA, KecamatanDetail } from "@/lib/mapData";

const MapPicker = dynamic(() => import("@/components/ui/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-slate-50">
      <RefreshCcw size={24} className="animate-spin text-slate-300" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Menyiapkan Peta Meteorologi...
      </p>
    </div>
  ),
});

export default function BMKGUpdateWilayahPage() {
  const [locations, setLocations] = useState<KecamatanDetail[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialFormState = {
    name: "",
    lat: "",
    lng: "",
    status: "Waspada" as KecamatanDetail["status"],
    kepalaKeluarga: "0",
    jiwaTerdampak: "0",
    pengungsi: "0",
    lukaLuka: "0",
    meninggal: "0",
    rumahTerendam: "0",
    rumahRusakParah: "0",
    fasilitasUmum: "0",
    tempatIbadah: "0",
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
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const regionData = {
        name: formData.name,
        coords: [parseFloat(formData.lat), parseFloat(formData.lng)] as [
          number,
          number,
        ],
        status: formData.status,
        stats: {
          kepalaKeluarga: formData.kepalaKeluarga,
          jiwaTerdampak: formData.jiwaTerdampak,
          pengungsi: formData.pengungsi,
          lukaLuka: formData.lukaLuka,
          meninggal: formData.meninggal,
          rumahTerendam: formData.rumahTerendam,
          rumahRusakParah: formData.rumahRusakParah,
          fasilitasUmum: formData.fasilitasUmum,
          tempatIbadah: formData.tempatIbadah,
        },
      };

      let updatedLocations;
      if (editingId) {
        updatedLocations = locations.map((loc) =>
          loc.id === editingId ? { ...loc, ...regionData } : loc,
        );
        setSuccessMessage(`Wilayah ${formData.name} diperbarui!`);
      } else {
        const newRegion = { id: Date.now(), ...regionData };
        updatedLocations = [...locations, newRegion];
        setSuccessMessage(`Wilayah ${formData.name} ditambahkan!`);
      }

      setLocations(updatedLocations);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
      window.dispatchEvent(new Event("storage"));

      setIsSubmitting(false);
      setEditingId(null);
      setFormData(initialFormState);
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 800);
  };

  const selectedCoords: [number, number] | null =
    formData.lat && formData.lng
      ? [parseFloat(formData.lat), parseFloat(formData.lng)]
      : null;

  return (
    <div className="flex flex-col gap-6 pb-12 lg:h-[calc(100dvh-7rem)] lg:pb-0">
      <div className="z-10 flex shrink-0 flex-col gap-4 md:flex-row md:items-end md:justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Update Wilayah BMKG
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Manajemen koordinat titik pantau presipitasi dan potensi cuaca
            ekstrem.
          </p>
        </div>
        {successMessage && (
          <div className="flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={14} /> {successMessage}
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
        {/* PETA - Menggunakan canonical class h-87.5 (350px) */}
        <div className="relative z-0 flex h-87.5 w-full shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:h-full lg:w-2/3">
          <MapPicker
            locations={locations}
            onMapClick={handleMapClick}
            selectedCoords={selectedCoords}
            onEditRegion={handleEditRegion}
            onDeleteRegion={(id) => {
              if (window.confirm("Hapus wilayah ini?")) {
                const filtered = locations.filter((l) => l.id !== id);
                setLocations(filtered);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
                window.dispatchEvent(new Event("storage"));
              }
            }}
          />
        </div>

        {/* FORM - Menggunakan canonical class h-125 (500px) */}
        <div
          className={`relative z-10 flex h-125 w-full shrink-0 flex-col overflow-hidden rounded-xl border shadow-md transition-colors lg:h-full lg:w-1/3 ${editingId ? "border-amber-300 bg-amber-50/50" : "border-slate-200 bg-white"}`}
        >
          <div
            className={`flex shrink-0 items-center justify-between border-b p-4 ${editingId ? "border-amber-200 bg-amber-100" : "border-slate-200 bg-slate-50"}`}
          >
            <div className="flex items-center gap-2">
              <MapPin
                size={18}
                className={editingId ? "text-amber-700" : "text-blue-600"}
              />
              <h2
                className={`text-[10px] font-black uppercase tracking-widest ${editingId ? "text-amber-800" : "text-blue-950"}`}
              >
                {editingId ? "Mode Edit Koordinat" : "Input Titik Wilayah"}
              </h2>
            </div>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="rounded-md p-1.5 text-amber-600 hover:bg-amber-200 transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-5"
          >
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Nama Wilayah / Stasiun <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-blue-950 outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                  placeholder="Contoh: Pos Lembang"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                    Latitude
                  </label>
                  <input
                    required
                    name="lat"
                    value={formData.lat}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                    placeholder="-6.123"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                    Longitude
                  </label>
                  <input
                    required
                    name="lng"
                    value={formData.lng}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                    placeholder="107.123"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Status Potensi <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full cursor-pointer rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-blue-950 outline-none focus:border-blue-950"
                >
                  <option value="Aman">Aman (Normal)</option>
                  <option value="Waspada">Waspada (Siaga)</option>
                  <option value="Siaga 2">Siaga 2 (Darurat)</option>
                  <option value="Siaga 1">Siaga 1 (Kritis)</option>
                </select>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200"></div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-950">
                  Data Populasi Terdampak
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 text-nowrap">
                    Total Pengungsi
                  </span>
                  <input
                    type="number"
                    name="pengungsi"
                    value={formData.pengungsi}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-blue-950 outline-none focus:border-blue-950"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-rose-500 text-nowrap">
                    Meninggal Dunia
                  </span>
                  <input
                    type="number"
                    name="meninggal"
                    value={formData.meninggal}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200"></div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Home size={16} className="text-blue-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-950">
                  Kerusakan Aset
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Rumah Terendam
                  </span>
                  <input
                    type="number"
                    name="rumahTerendam"
                    value={formData.rumahTerendam}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-blue-950 outline-none focus:border-blue-950"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Fasilitas Umum
                  </span>
                  <input
                    type="number"
                    name="fasilitasUmum"
                    value={formData.fasilitasUmum}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-blue-950 outline-none focus:border-blue-950"
                  />
                </div>
              </div>
            </div>
          </form>

          <div
            className={`shrink-0 border-t p-4 ${editingId ? "border-amber-200 bg-amber-100/50" : "border-slate-200 bg-slate-50"}`}
          >
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex w-full items-center justify-center gap-2 rounded-md py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 ${editingId ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-950 hover:bg-blue-900"}`}
            >
              {isSubmitting ? (
                <RefreshCcw size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {editingId ? "Simpan Perubahan" : "Daftarkan Wilayah"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
