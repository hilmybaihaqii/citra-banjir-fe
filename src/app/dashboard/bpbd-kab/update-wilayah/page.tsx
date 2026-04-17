"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Save,
  MapPin,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  X,
  Users,
  Home,
} from "lucide-react";
import { KecamatanDetail } from "@/lib/mapData";
import { apiFetch } from "@/lib/api";

interface RegionApiResponse {
  id: number;
  regionName: string;
  latitude: number;
  longitude: number;
  alertStatus: string;
  familyCount: number;
  evacueeCount: number;
  injuredCount: number;
  deathCount: number;
  submergedHouses: number;
  heavilyDamagedHouses: number;
  damagedPublicFacilities: number;
  damagedWorshipPlaces: number;
}

const MapPicker = dynamic(() => import("@/components/ui/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-slate-50">
      <RefreshCcw size={24} className="animate-spin text-slate-300" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Menyiapkan Peta Interaktif...
      </p>
    </div>
  ),
});

export default function BPBDKabUpdateWilayahPage() {
  const [locations, setLocations] = useState<KecamatanDetail[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  const loadLocations = useCallback(async () => {
    try {
      const response = await apiFetch(
        "https://sicitra-banjir.onrender.com/api/regions",
      );
      const result = await response.json();
      if (result.success) {
        const mappedData: KecamatanDetail[] = result.data.map(
          (item: RegionApiResponse) => ({
            id: item.id,
            name: item.regionName,
            coords: [item.latitude, item.longitude],
            status: item.alertStatus === "RAWAN_BANJIR" ? "Waspada" : "Aman",
            stats: {
              kepalaKeluarga: item.familyCount?.toString() || "0",
              jiwaTerdampak: item.evacueeCount?.toString() || "0", // Map ke evacuee di BE
              pengungsi: item.evacueeCount?.toString() || "0",
              lukaLuka: item.injuredCount?.toString() || "0",
              meninggal: item.deathCount?.toString() || "0",
              rumahTerendam: item.submergedHouses?.toString() || "0",
              rumahRusakParah: item.heavilyDamagedHouses?.toString() || "0",
              fasilitasUmum: item.damagedPublicFacilities?.toString() || "0",
              tempatIbadah: item.damagedWorshipPlaces?.toString() || "0",
            },
          }),
        );
        setLocations(mappedData);
      }
    } catch {
      setErrorMessage("Gagal memuat data.");
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // PENYESUAIAN PAYLOAD: Pastikan kunci (keys) sesuai Dokumentasi API
    const payload = {
      regionName: formData.name,
      alertStatus: formData.status === "Aman" ? "AMAN" : "RAWAN_BANJIR",
      latitude: parseFloat(formData.lat),
      longitude: parseFloat(formData.lng),
      familyCount: parseInt(formData.kepalaKeluarga), // Statistik Korban
      evacueeCount: parseInt(formData.pengungsi), // Statistik Korban
      injuredCount: parseInt(formData.lukaLuka), // Statistik Korban
      deathCount: parseInt(formData.meninggal), // Statistik Korban
      submergedHouses: parseInt(formData.rumahTerendam),
      heavilyDamagedHouses: parseInt(formData.rumahRusakParah),
      damagedPublicFacilities: parseInt(formData.fasilitasUmum),
      damagedWorshipPlaces: parseInt(formData.tempatIbadah),
    };

    try {
      const url = editingId
        ? `https://sicitra-banjir.onrender.com/api/regions/${editingId}`
        : "https://sicitra-banjir.onrender.com/api/regions";
      const response = await apiFetch(url, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        setSuccessMessage("Berhasil memperbarui database server!");
        setEditingId(null);
        setFormData(initialFormState);
        await loadLocations(); // Refresh list agar data terbaru muncul
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch {
      setErrorMessage("Gagal menyimpan data ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rendering (Desain Tetap Sama)
  return (
    <div className="flex flex-col gap-6 pb-12 lg:h-[calc(100dvh-7rem)] lg:pb-0">
      <div className="z-10 flex shrink-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Update Wilayah
          </h1>
          <p className="mt-1 text-base font-medium tracking-wide text-slate-500">
            Data Statistik Korban & Bangunan terintegrasi BE.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-auto">
          {successMessage && (
            <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm">
              <CheckCircle2 size={16} /> {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-rose-600 shadow-sm">
              <AlertCircle size={16} /> {errorMessage}
            </div>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
        <div className="relative z-0 flex h-100 w-full shrink-0 flex-col overflow-hidden rounded-lg border border-slate-200 lg:h-full lg:w-2/3">
          <MapPicker
            locations={locations}
            onMapClick={(lat, lng) =>
              setFormData((p) => ({
                ...p,
                lat: lat.toFixed(6),
                lng: lng.toFixed(6),
              }))
            }
            selectedCoords={
              formData.lat && formData.lng
                ? [parseFloat(formData.lat), parseFloat(formData.lng)]
                : null
            }
            onDeleteRegion={async (id) => {
              if (window.confirm("Hapus?")) {
                await apiFetch(
                  `https://sicitra-banjir.onrender.com/api/regions/${id}`,
                  { method: "DELETE" },
                );
                loadLocations();
              }
            }}
            onEditRegion={(r) => {
              setEditingId(r.id);
              setFormData({
                ...initialFormState,
                name: r.name,
                lat: r.coords[0].toString(),
                lng: r.coords[1].toString(),
                status: r.status,
                ...r.stats,
              });
            }}
          />
        </div>

        <div
          className={`relative z-10 flex h-162.5 w-full shrink-0 flex-col overflow-hidden rounded-lg border shadow-sm transition-colors lg:h-full lg:w-1/3 ${editingId ? "border-amber-300 bg-amber-50/50" : "border-slate-200 bg-white"}`}
        >
          <div
            className={`flex shrink-0 items-center justify-between border-b p-4 ${editingId ? "border-amber-200 bg-amber-100" : "border-slate-200 bg-slate-50"}`}
          >
            <div className="flex items-center gap-2">
              <MapPin
                size={16}
                className={editingId ? "text-amber-700" : "text-blue-950"}
              />
              <h2 className="text-[10px] font-black uppercase tracking-widest">
                {editingId ? "Mode Edit Data" : "Tambah Wilayah"}
              </h2>
            </div>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setFormData(initialFormState);
                }}
                className="rounded-md p-1.5 text-amber-600 hover:bg-amber-200"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <form
            id="updateRegionForm"
            onSubmit={handleSubmit}
            className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-5"
          >
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Nama Wilayah *
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-bold text-blue-950 outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-bold text-blue-950 outline-none"
                >
                  <option value="Aman">Aman</option>
                  <option value="Waspada">Waspada</option>
                  <option value="Siaga 2">Siaga 2</option>
                  <option value="Siaga 1">Siaga 1</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="text"
                  name="lat"
                  value={formData.lat}
                  onChange={handleInputChange}
                  placeholder="Lat"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium"
                />
                <input
                  required
                  type="text"
                  name="lng"
                  value={formData.lng}
                  onChange={handleInputChange}
                  placeholder="Lng"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium"
                />
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200"></div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <Users size={16} className="text-slate-400" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-950">
                  Statistik Korban
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    "kepalaKeluarga",
                    "jiwaTerdampak",
                    "pengungsi",
                    "lukaLuka",
                  ] as const
                ).map((field) => (
                  <div key={field}>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      {field === "kepalaKeluarga"
                        ? "KK"
                        : field.replace(/([A-Z])/g, " $1")}
                    </span>
                    <input
                      type="number"
                      min="0"
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-bold text-blue-950 outline-none"
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-rose-500">
                    Meninggal Dunia
                  </span>
                  <input
                    type="number"
                    min="0"
                    name="meninggal"
                    value={formData.meninggal}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-base font-bold text-rose-700 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200"></div>
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Home size={16} className="text-slate-400" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-950">
                  Kerusakan Bangunan
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    "rumahTerendam",
                    "rumahRusakParah",
                    "fasilitasUmum",
                    "tempatIbadah",
                  ] as const
                ).map((field) => (
                  <div key={field}>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      {field.replace(/([A-Z])/g, " $1")}
                    </span>
                    <input
                      type="number"
                      min="0"
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-bold text-blue-950 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </form>

          <div className="shrink-0 border-t p-4 bg-slate-50">
            <button
              type="submit"
              form="updateRegionForm"
              disabled={isSubmitting}
              className={`group flex w-full items-center justify-center gap-2 rounded-md py-3.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition-all disabled:bg-slate-300 ${editingId ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-950 hover:bg-blue-900"}`}
            >
              {isSubmitting ? (
                <RefreshCcw size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isSubmitting
                ? "MENYIMPAN..."
                : editingId
                  ? "SIMPAN PERUBAHAN"
                  : "SIMPAN DATA"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
