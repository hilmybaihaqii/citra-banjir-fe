"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import {
  Save,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  List,
  Trash2,
  Edit2,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { RegionData } from "@/components/ui/map-picker/RegionMapPicker";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Interface respons data dari Backend
interface WilayahPantauanResponse {
  id: string | number;
  nama: string;
  latitude: string | number;
  longitude: string | number;
}

// Fungsi pembantu untuk menyisipkan Token Otorisasi dari Cookies
const getAuthHeaders = (contentType = false) => {
  const token = Cookies.get("auth_token");
  const headers: Record<string, string> = {};

  if (contentType) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

const RegionMapPicker = dynamic(
  () => import("@/components/ui/map-picker/RegionMapPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-slate-50">
        <RefreshCcw size={24} className="animate-spin text-slate-300" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Memuat Peta...
        </p>
      </div>
    ),
  },
);

export default function BBWSWilayahPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [rawRegions, setRawRegions] = useState<RegionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const initialFormState = { regionName: "", latitude: "", longitude: "" };
  const [formData, setFormData] = useState(initialFormState);

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setToast({ show: true, message, type });
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
    },
    [],
  );

  // MENGAMBIL DATA (GET)
  const fetchRegions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/wilayah-pantauan`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Gagal mengambil data wilayah");

      const data = await response.json();
      const actualArray = Array.isArray(data)
        ? data
        : data.data || data.results || [];

      const formattedRegions: RegionData[] = actualArray.map(
        (item: WilayahPantauanResponse) => ({
          id: item.id,
          regionName: item.nama,
          latitude:
            typeof item.latitude === "string"
              ? parseFloat(item.latitude)
              : item.latitude,
          longitude:
            typeof item.longitude === "string"
              ? parseFloat(item.longitude)
              : item.longitude,
        }),
      );

      setRawRegions(formattedRegions);
    } catch (error) {
      console.error("Fetch Error:", error);
      showToast("Gagal memuat data wilayah pantauan.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMounted) fetchRegions();
  }, [isMounted, fetchRegions]);

  const handleMapClick = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditRegion = (region: RegionData) => {
    setEditingId(region.id);
    setFormData({
      regionName: region.regionName || "",
      latitude: region.latitude.toString(),
      longitude: region.longitude.toString(),
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  // MENYIMPAN ATAU MENGUPDATE DATA (POST / PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.regionName) {
      showToast("Nama Wilayah wajib diisi.", "error");
      return;
    }

    const latNum = parseFloat(formData.latitude);
    const lngNum = parseFloat(formData.longitude);
    if (isNaN(latNum) || isNaN(lngNum)) {
      showToast("Tentukan titik koordinat wilayah.", "error");
      return;
    }

    setIsSubmitting(true);

    // Payload dikemas dengan tipe data Number asli sesuai skema Prisma database
    const payload = {
      nama: formData.regionName,
      latitude: latNum,
      longitude: lngNum,
    };

    try {
      const isEditing = Boolean(editingId);
      const safeId = isEditing ? Number(editingId) : null;

      const url = isEditing
        ? `${API_BASE_URL}/wilayah-pantauan/${safeId}`
        : `${API_BASE_URL}/wilayah-pantauan`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.message ||
          errorData?.error ||
          "Gagal menyimpan data wilayah";
        throw new Error(errorMessage);
      }

      showToast(
        `Wilayah ${formData.regionName} berhasil ${isEditing ? "diperbarui" : "ditambahkan"}.`,
        "success",
      );

      await fetchRegions();
      setEditingId(null);
      setFormData(initialFormState);
    } catch (error: unknown) {
      console.error("Submit Error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan data.";
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // MENGHAPUS DATA (DELETE)
  const handleDeleteRegion = async (id: string | number, name: string) => {
    if (!window.confirm(`Hapus Wilayah Pantauan ${name}?`)) return;

    try {
      const safeId = Number(id);
      const response = await fetch(
        `${API_BASE_URL}/wilayah-pantauan/${safeId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok)
        throw new Error("Gagal menghapus data. Periksa hak akses Anda.");

      if (editingId === id) handleCancelEdit();

      setRawRegions((prev) => prev.filter((r) => r.id !== id));
      showToast(`Wilayah ${name} berhasil dihapus.`, "success");
    } catch (error: unknown) {
      console.error("Delete Error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal menghapus wilayah pantauan.";
      showToast(errorMessage, "error");
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
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={`fixed z-50 flex items-center gap-3 rounded-lg border px-4 py-3.5 shadow-2xl backdrop-blur-md bottom-20 left-4 right-4 sm:bottom-10 sm:left-auto sm:right-10 sm:max-w-md ${toast.type === "success" ? "border-emerald-200/60 bg-emerald-50/95 text-emerald-700" : "border-rose-200/60 bg-rose-50/95 text-rose-700"}`}
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
            Wilayah Pantauan
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Daftarkan dan kelola titik koordinat wilayah kerja BBWS Citarum.
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row pb-6 lg:pb-8">
        <div className="relative z-0 flex h-100 w-full shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 lg:h-full lg:w-2/3 shadow-sm">
          {isLoading ? (
            <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 text-slate-400 gap-3">
              <Loader2 size={32} className="animate-spin" />
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Loading Maps...
              </p>
            </div>
          ) : (
            <RegionMapPicker
              locations={rawRegions}
              onMapClick={handleMapClick}
              selectedCoords={selectedCoords}
              onDeleteRegion={(id) =>
                handleDeleteRegion(
                  id,
                  rawRegions.find((r) => r.id === id)?.regionName || "",
                )
              }
              onEditRegion={handleEditRegion}
            />
          )}
        </div>

        <div
          className={`relative z-10 flex w-full shrink-0 flex-col overflow-hidden rounded-xl border shadow-sm transition-colors lg:h-full lg:w-1/3 ${editingId ? "border-amber-300 bg-amber-50/30" : "border-slate-200 bg-white"}`}
        >
          <div
            className={`flex shrink-0 items-center justify-between border-b p-4 ${editingId ? "border-amber-200 bg-amber-100/50" : "border-slate-200 bg-slate-50"}`}
          >
            <div className="flex items-center gap-2">
              <MapPin
                size={16}
                className={editingId ? "text-amber-600" : "text-blue-950"}
              />
              <h2
                className={`text-xs font-black uppercase tracking-widest ${editingId ? "text-amber-800" : "text-blue-950"}`}
              >
                {editingId ? "Edit Data Wilayah" : "Tambah Wilayah Baru"}
              </h2>
            </div>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="rounded-md p-1.5 text-amber-600 transition-colors hover:bg-amber-200 hover:text-amber-800"
                title="Batal"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto">
            <form
              id="updateRegionForm"
              onSubmit={handleSubmit}
              className="p-5 space-y-5"
            >
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-2">
                <p className="text-[10px] font-medium text-blue-800 leading-snug">
                  Gunakan form ini untuk mendaftarkan titik koordinat wilayah
                  pantauan baru.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Nama Wilayah <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="regionName"
                  value={formData.regionName}
                  onChange={handleInputChange}
                  placeholder="Contoh: Baleendah"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-bold text-blue-950 outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="-6.994300"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-bold text-blue-950 outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="107.630000"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-bold text-blue-950 outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </form>

            <div className="px-5 pb-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <List size={12} /> Daftar Wilayah
                </span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <div className="space-y-2.5">
                {rawRegions.length === 0 ? (
                  <div className="text-center py-6 bg-slate-50 rounded-md border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 italic">
                      Belum ada wilayah terdaftar.
                    </p>
                  </div>
                ) : (
                  rawRegions.map((region) => (
                    <div
                      key={region.id}
                      className={`flex items-center justify-between p-3 rounded-md border transition-all ${editingId === region.id ? "bg-amber-50 border-amber-200" : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm"}`}
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <h3 className="text-xs font-bold text-blue-950 truncate">
                          {region.regionName}
                        </h3>
                        <p className="text-[9px] text-slate-500 mt-0.5 truncate">
                          {region.latitude}, {region.longitude}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditRegion(region)}
                          className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-md transition-colors"
                          title="Edit Wilayah"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteRegion(region.id, region.regionName)
                          }
                          className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-md transition-colors"
                          title="Hapus Wilayah"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div
            className={`shrink-0 border-t p-4 ${editingId ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"}`}
          >
            <button
              type="submit"
              form="updateRegionForm"
              disabled={isSubmitting}
              className={`group flex w-full items-center justify-center gap-2 rounded-md py-3 text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-70 ${editingId ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-950 hover:bg-blue-900"}`}
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
                ? "MENYIMPAN..."
                : editingId
                  ? "SIMPAN PERUBAHAN"
                  : "SIMPAN WILAYAH BARU"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
