"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Save,
  MapPin,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  X,
  Users,
  Home,
  Loader2,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";

// Import langsung tipe data dari komponen MapPicker
import { RegionData } from "@/components/ui/map-picker/MapPicker";

const MapPicker = dynamic(
  () => import("@/components/ui/map-picker/MapPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-slate-50">
        <RefreshCcw size={24} className="animate-spin text-slate-300" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Menyiapkan Peta Interaktif...
        </p>
      </div>
    ),
  },
);

export default function BPBDKabUpdateWilayahPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [rawRegions, setRawRegions] = useState<RegionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Dapatkan tanggal hari ini format YYYY-MM-DD untuk default input
  const todayDate = new Date().toISOString().split("T")[0];

  const initialFormState = {
    recordDate: todayDate, // <--- TAMBAHAN BARU: Tanggal Pencatatan
    regionName: "",
    latitude: "",
    longitude: "",
    alertStatus: "AMAN",
    familyCount: "0",
    evacueeCount: "0",
    injuredCount: "0",
    deathCount: "0",
    submergedHouses: "0",
    heavilyDamagedHouses: "0",
    damagedPublicFacilities: "0",
    damagedWorshipPlaces: "0",
  };

  const [formData, setFormData] = useState(initialFormState);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
  };

  const fetchRegions = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch(`${API_URL}/regions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        const regionsData = data.data?.items || data.data || data || [];
        setRawRegions(regionsData);
      }
    } catch (error) {
      console.error("Gagal menarik data wilayah:", error);
      showToast("Gagal memuat data wilayah dari server.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    setIsMounted(true);
    fetchRegions();
  }, [fetchRegions]);

  const handleMapClick = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditRegion = (
    region: RegionData & { createdAt?: string; date?: string },
  ) => {
    setEditingId(region.id);

    let formattedDate = todayDate;
    if (region.createdAt || region.date) {
      const d = new Date((region.createdAt || region.date) as string);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toISOString().split("T")[0];
      }
    }

    setFormData({
      recordDate: formattedDate,
      regionName: region.regionName,
      latitude: region.latitude.toString(),
      longitude: region.longitude.toString(),
      alertStatus: region.alertStatus,
      familyCount: region.familyCount.toString(),
      evacueeCount: region.evacueeCount.toString(),
      injuredCount: region.injuredCount.toString(),
      deathCount: region.deathCount.toString(),
      submergedHouses: region.submergedHouses.toString(),
      heavilyDamagedHouses: region.heavilyDamagedHouses.toString(),
      damagedPublicFacilities: region.damagedPublicFacilities.toString(),
      damagedWorshipPlaces: region.damagedWorshipPlaces.toString(),
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.regionName) {
      showToast("Nama Wilayah tidak boleh kosong!", "error");
      return;
    }

    if (!formData.recordDate) {
      showToast("Tanggal pencatatan harus diisi!", "error");
      return;
    }

    const latNum = parseFloat(formData.latitude);
    const lngNum = parseFloat(formData.longitude);
    if (isNaN(latNum) || isNaN(lngNum)) {
      showToast("Pilih koordinat di peta terlebih dahulu!", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = Cookies.get("auth_token");

      const payload = {
        date: formData.recordDate,
        regionName: formData.regionName,
        alertStatus: formData.alertStatus,
        latitude: latNum,
        longitude: lngNum,
        familyCount: parseInt(formData.familyCount) || 0,
        deathCount: parseInt(formData.deathCount) || 0,
        evacueeCount: parseInt(formData.evacueeCount) || 0,
        injuredCount: parseInt(formData.injuredCount) || 0,
        submergedHouses: parseInt(formData.submergedHouses) || 0,
        heavilyDamagedHouses: parseInt(formData.heavilyDamagedHouses) || 0,
        damagedPublicFacilities:
          parseInt(formData.damagedPublicFacilities) || 0,
        damagedWorshipPlaces: parseInt(formData.damagedWorshipPlaces) || 0,
      };

      const url = editingId
        ? `${API_URL}/regions/${editingId}`
        : `${API_URL}/regions`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data wilayah");

      showToast(
        editingId
          ? `Data wilayah ${formData.regionName} berhasil diperbarui!`
          : `Wilayah ${formData.regionName} berhasil ditambahkan!`,
        "success",
      );

      fetchRegions();
      setEditingId(null);
      setFormData(initialFormState);
    } catch (error) {
      console.error(error);
      showToast("Terjadi kesalahan sistem saat menyimpan data.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRegion = async (id: number) => {
    const regionToDelete = rawRegions.find((loc) => loc.id === id);
    if (!regionToDelete) return;

    if (
      !window.confirm(
        `Yakin ingin menghapus wilayah ${regionToDelete.regionName} secara permanen?`,
      )
    ) {
      return;
    }

    try {
      const token = Cookies.get("auth_token");
      const res = await fetch(`${API_URL}/regions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal menghapus wilayah");

      if (editingId === id) handleCancelEdit();

      setRawRegions((prev) => prev.filter((r) => r.id !== id));
      showToast(
        `Wilayah ${regionToDelete.regionName} berhasil dihapus.`,
        "success",
      );
    } catch (error) {
      console.error(error);
      showToast("Gagal menghapus data wilayah.", "error");
    }
  };

  const selectedCoords: [number, number] | null =
    formData.latitude &&
    formData.longitude &&
    !isNaN(parseFloat(formData.latitude)) &&
    !isNaN(parseFloat(formData.longitude))
      ? [parseFloat(formData.latitude), parseFloat(formData.longitude)]
      : null;

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-6 p-4 pb-12 sm:p-6 lg:h-[calc(100dvh-5rem)] lg:pb-0 w-full max-w-350 mx-auto relative">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={`fixed z-200 flex items-center gap-3 rounded-lg border px-4 py-3.5 shadow-2xl backdrop-blur-md bottom-20 left-4 right-4 sm:bottom-10 sm:left-auto sm:right-10 sm:max-w-md ${
              toast.type === "success"
                ? "border-emerald-200/60 bg-emerald-50/95 text-emerald-700"
                : "border-rose-200/60 bg-rose-50/95 text-rose-700"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
            ) : (
              <XCircle size={20} className="shrink-0 text-rose-600" />
            )}
            <p className="text-sm font-bold tracking-wide">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="z-10 flex shrink-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Update Wilayah Terdampak
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Catat dan pantau penambahan data kerusakan berdasarkan tanggal
            kejadian untuk Kab. Bandung.
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row pb-6 lg:pb-8">
        {/* MAP SECTION */}
        <div className="relative z-0 flex h-100 w-full shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 lg:h-full lg:w-2/3 shadow-sm">
          {isLoading ? (
            <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 text-slate-400 gap-3">
              <Loader2 size={32} className="animate-spin" />
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Sinkronisasi Peta...
              </p>
            </div>
          ) : (
            <MapPicker
              locations={rawRegions}
              onMapClick={handleMapClick}
              selectedCoords={selectedCoords}
              onDeleteRegion={handleDeleteRegion}
              onEditRegion={handleEditRegion}
            />
          )}
        </div>

        {/* FORM SECTION */}
        <div
          className={`relative z-10 flex h-162.5 w-full shrink-0 flex-col overflow-hidden rounded-xl border shadow-sm transition-colors lg:h-full lg:w-1/3 ${
            editingId
              ? "border-amber-300 bg-amber-50/30"
              : "border-slate-200 bg-white"
          }`}
        >
          <div
            className={`flex shrink-0 items-center justify-between border-b p-4 ${
              editingId
                ? "border-amber-200 bg-amber-100/50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin
                size={16}
                className={editingId ? "text-amber-600" : "text-blue-950"}
              />
              <h2
                className={`text-xs font-black uppercase tracking-widest ${
                  editingId ? "text-amber-800" : "text-blue-950"
                }`}
              >
                {editingId ? "Mode Edit Data" : "Tambah Riwayat Baru"}
              </h2>
            </div>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="rounded-md p-1.5 text-amber-600 transition-colors hover:bg-amber-200 hover:text-amber-800"
                title="Batal Edit"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>

          <form
            id="updateRegionForm"
            onSubmit={handleSubmit}
            className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-5"
          >
            <div className="space-y-4">
              {/* INPUT TANGGAL KEJADIAN PENGGABUNGAN */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-md mb-2">
                <label className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <Calendar size={14} className="text-blue-600" /> Tanggal
                  Pencatatan <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="date"
                  name="recordDate"
                  value={formData.recordDate}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-blue-950 outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                <p className="text-[9px] text-slate-400 mt-1.5 leading-snug">
                  Pastikan tanggal sesuai dengan kapan laporan/kerusakan ini
                  terjadi agar infografis valid.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Nama Wilayah / Titik <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="regionName"
                  value={formData.regionName}
                  onChange={handleInputChange}
                  placeholder="Contoh: Baleendah"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-blue-950 outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Status Peringatan <span className="text-red-500">*</span>
                </label>
                <select
                  name="alertStatus"
                  value={formData.alertStatus}
                  onChange={handleInputChange}
                  className="w-full cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-blue-950 outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="AMAN">Aman (Hijau)</option>
                  <option value="RAWAN_BANJIR">Rawan Banjir (Merah)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Latitude
                  </label>
                  <input
                    required
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="Latitude"
                    className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Longitude
                  </label>
                  <input
                    required
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="Longitude"
                    className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200"></div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <Users size={16} className="text-slate-400" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-950">
                  Statistik Korban & Warga
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Kepala Keluarga
                  </span>
                  <input
                    type="number"
                    min="0"
                    name="familyCount"
                    value={formData.familyCount}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-blue-950 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Warga Mengungsi
                  </span>
                  <input
                    type="number"
                    min="0"
                    name="evacueeCount"
                    value={formData.evacueeCount}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-blue-950 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Luka-luka
                  </span>
                  <input
                    type="number"
                    min="0"
                    name="injuredCount"
                    value={formData.injuredCount}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-blue-950 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-rose-500">
                    Meninggal Dunia
                  </span>
                  <input
                    type="number"
                    min="0"
                    name="deathCount"
                    value={formData.deathCount}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Rumah Terendam
                  </span>
                  <input
                    type="number"
                    min="0"
                    name="submergedHouses"
                    value={formData.submergedHouses}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-blue-950 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Rusak Parah
                  </span>
                  <input
                    type="number"
                    min="0"
                    name="heavilyDamagedHouses"
                    value={formData.heavilyDamagedHouses}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-blue-950 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Fasilitas Umum
                  </span>
                  <input
                    type="number"
                    min="0"
                    name="damagedPublicFacilities"
                    value={formData.damagedPublicFacilities}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-blue-950 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Tempat Ibadah
                  </span>
                  <input
                    type="number"
                    min="0"
                    name="damagedWorshipPlaces"
                    value={formData.damagedWorshipPlaces}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-blue-950 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          </form>

          <div
            className={`shrink-0 border-t p-4 ${
              editingId
                ? "border-amber-200 bg-amber-50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <button
              type="submit"
              form="updateRegionForm"
              disabled={isSubmitting}
              className={`group flex w-full items-center justify-center gap-2 rounded-md py-3 text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-70 ${
                editingId
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-blue-950 hover:bg-blue-900"
              }`}
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save
                  size={16}
                  className="transition-transform group-hover:scale-110"
                />
              )}
              {isSubmitting
                ? "MENYIMPAN DATA..."
                : editingId
                  ? "SIMPAN PERUBAHAN"
                  : "SIMPAN & UPDATE PETA"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
