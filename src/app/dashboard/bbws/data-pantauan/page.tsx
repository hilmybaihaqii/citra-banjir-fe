"use client";

import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Edit2,
  Trash2,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// --- DEFINISI TIPE DATA ---
interface RegionData {
  id: string | number;
  regionName: string;
}

interface PostData {
  id: string | number;
  postName: string;
}

interface MonitoringLog {
  id: string | number;
  regionId: string | number;
  regionName: string;
  postId: string | number;
  postName: string;
  curahHujan: string;
  debitAir: string;
  tinggiMukaAir: string;
  tinggiGenangan: string;
  suhu: string;
  kecepatanAngin: string;
  waktuInput: string;
  statusPrediksi: "normal" | "waspada" | "siaga" | "awas";
}

interface BackendRegionItem {
  id: string | number;
  nama: string;
}

interface BackendPostItem {
  id: string | number;
  nama: string;
}

interface BackendLogResponse {
  id: string | number;
  wilayahId: string | number;
  wilayah?: { nama: string };
  posId: string | number;
  pos?: { nama: string };
  curahHujan: number | string;
  debitAir: number | string;
  tinggiMukaAir: number | string;
  tinggiGenangan?: number | string;
  suhuUdara?: number | string;
  kecepatanAngin?: number | string;
  createdAt?: string;
  waktuInput?: string;
}

interface PemantauanPayload {
  wilayahId: number;
  posId: number;
  curahHujan: number;
  debitAir: number;
  tinggiMukaAir: number;
  tinggiGenangan: number;
  suhuUdara: number;
  kecepatanAngin: number;
}

const getAuthHeaders = (contentType = false) => {
  const token = Cookies.get("auth_token");
  const headers: Record<string, string> = {};
  if (contentType) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// --- KOMPONEN INPUT ANGKA SINKRON UTAMA ---
const CustomNumberInput = ({
  label,
  unit,
  name,
  value,
  onChange,
  step = 0.1,
  disabled = false,
}: {
  label: string;
  unit: string;
  name: string;
  value: string;
  onChange: (name: string, val: string) => void;
  step?: number;
  disabled?: boolean;
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
      <label
        className={`text-[11px] font-bold uppercase tracking-widest ${disabled ? "text-slate-400" : "text-slate-600"}`}
      >
        {label} <span className="font-medium opacity-70">({unit})</span>
      </label>
      <div
        className={`flex items-center justify-between border rounded-md px-3 py-2.5 transition-all shadow-sm ${
          disabled
            ? "bg-slate-100 border-slate-200 opacity-70 cursor-not-allowed"
            : "bg-white border-slate-300 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        }`}
      >
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`bg-transparent w-full font-bold text-sm outline-none placeholder:text-slate-400 ${disabled ? "text-slate-400 cursor-not-allowed" : "text-slate-900"}`}
          placeholder="0,00"
        />
        <div className="flex items-center gap-3 shrink-0 select-none ml-2">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled}
            className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200 font-bold text-base leading-none"
          >
            −
          </button>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled}
            className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200 font-bold text-base leading-none"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DataPantauanPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [regions, setRegions] = useState<RegionData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [monitoringLogs, setMonitoringLogs] = useState<MonitoringLog[]>([]);
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

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    id: string | number;
    regionName: string;
  }>({
    isOpen: false,
    id: "",
    regionName: "",
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

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
  };

  const cleanFloat = (val: string | number | undefined): number => {
    if (val === undefined || val === null) return 0;
    if (typeof val === "number") return val;
    return parseFloat(val.replace(/,/g, ".")) || 0;
  };

  const fetchMasterData = useCallback(async () => {
    setIsLoading(true);
    try {
      const resRegions = await fetch(`${API_BASE_URL}/wilayah-pantauan`, {
        headers: getAuthHeaders(),
      });
      const dataRegions = await resRegions.json();
      const arrayRegions = Array.isArray(dataRegions)
        ? dataRegions
        : dataRegions.data || [];
      setRegions(
        arrayRegions.map((r: BackendRegionItem) => ({
          id: r.id,
          regionName: r.nama,
        })),
      );

      const resPosts = await fetch(`${API_BASE_URL}/pos-pantau`, {
        headers: getAuthHeaders(),
      });
      const dataPosts = await resPosts.json();
      const arrayPosts = Array.isArray(dataPosts)
        ? dataPosts
        : dataPosts.data || [];
      setPosts(
        arrayPosts.map((p: BackendPostItem) => ({
          id: p.id,
          postName: p.nama,
        })),
      );

      const resLogs = await fetch(`${API_BASE_URL}/pemantauan-terpadu`, {
        headers: getAuthHeaders(),
      });
      const dataLogs = await resLogs.json();
      const arrayLogs = Array.isArray(dataLogs)
        ? dataLogs
        : dataLogs.data || dataLogs.results || [];

      const formattedLogs: MonitoringLog[] = arrayLogs.map(
        (item: BackendLogResponse) => {
          const timeStr =
            item.waktuInput || item.createdAt
              ? new Date(
                  item.waktuInput || item.createdAt || "",
                ).toLocaleString("id-ID", {
                  dateStyle: "short",
                  timeStyle: "short",
                }) + " WIB"
              : "-";

          const tmaValue =
            typeof item.tinggiMukaAir === "number"
              ? item.tinggiMukaAir
              : parseFloat(item.tinggiMukaAir?.toString().replace(/,/g, ".")) ||
                0;

          // Klasifikasi status lokal terpadu berbasis threshold
          let calculatedStatus: "normal" | "waspada" | "siaga" | "awas" =
            "normal";
          if (tmaValue >= 0.57 && tmaValue < 0.93) calculatedStatus = "waspada";
          else if (tmaValue >= 0.93 && tmaValue <= 1.3)
            calculatedStatus = "siaga";
          else if (tmaValue > 1.3) calculatedStatus = "awas";

          return {
            id: item.id,
            regionId: item.wilayahId?.toString(),
            regionName: item.wilayah?.nama || "Tidak Diketahui",
            postId: item.posId?.toString(),
            postName: item.pos?.nama || "Tidak Diketahui",
            curahHujan: item.curahHujan?.toString().replace(".", ",") || "0,00",
            debitAir: item.debitAir?.toString().replace(".", ",") || "0,00",
            tinggiMukaAir:
              item.tinggiMukaAir?.toString().replace(".", ",") || "0,00",
            tinggiGenangan:
              item.tinggiGenangan?.toString().replace(".", ",") || "0,00",
            suhu: item.suhuUdara?.toString().replace(".", ",") || "0,00",
            kecepatanAngin:
              item.kecepatanAngin?.toString().replace(".", ",") || "0,00",
            waktuInput: timeStr,
            statusPrediksi: calculatedStatus,
          };
        },
      );

      setMonitoringLogs(formattedLogs);
    } catch (error) {
      console.error("Sinkronisasi gagal:", error);
      showToast("Gagal memuat sinkronisasi data dari server.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchMasterData();
  }, [fetchMasterData]);

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
      regionId: log.regionId.toString(),
      postId: log.postId.toString(),
      curahHujan: log.curahHujan,
      debitAir: log.debitAir,
      tinggiMukaAir: log.tinggiMukaAir,
      tinggiGenangan: log.tinggiGenangan,
      suhu: log.suhu,
      kecepatanAngin: log.kecepatanAngin,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleDeleteLog = (id: string | number, regionName: string) => {
    setConfirmModal({ isOpen: true, id, regionName });
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/pemantauan-terpadu/${Number(confirmModal.id)}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );
      if (!response.ok)
        throw new Error("Gagal menghapus log pemantauan dari server database");
      if (editingId === confirmModal.id) handleCancelEdit();
      setMonitoringLogs((prev) =>
        prev.filter((log) => log.id !== confirmModal.id),
      );
      showToast(
        `Data pantauan ${confirmModal.regionName} berhasil dihapus.`,
        "success",
      );
    } catch (error: unknown) {
      console.error("Delete Log Error:", error);
      const msg =
        error instanceof Error
          ? error.message
          : "Gagal menghapus log pemantauan.";
      showToast(msg, "error");
    } finally {
      setConfirmModal({ isOpen: false, id: "", regionName: "" });
    }
  };

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

    const payload: PemantauanPayload = {
      wilayahId: Number(formData.regionId),
      posId: Number(formData.postId),
      curahHujan: cleanFloat(formData.curahHujan),
      debitAir: cleanFloat(formData.debitAir),
      tinggiMukaAir: cleanFloat(formData.tinggiMukaAir),
      tinggiGenangan: cleanFloat(formData.tinggiGenangan),
      suhuUdara: cleanFloat(formData.suhu),
      kecepatanAngin: cleanFloat(formData.kecepatanAngin),
    };

    try {
      const isEditing = Boolean(editingId);
      const url = isEditing
        ? `${API_BASE_URL}/pemantauan-terpadu/${Number(editingId)}`
        : `${API_BASE_URL}/pemantauan-terpadu`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "Gagal menyimpan log pemantauan terpadu",
        );
      }

      showToast(
        isEditing
          ? "Data pemantauan berhasil diperbarui."
          : "Data pemantauan berhasil disimpan.",
        "success",
      );

      await fetchMasterData();
      setEditingId(null);
      setFormData(initialFormState);
    } catch (error: unknown) {
      console.error("Submit Error:", error);
      const msg =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan sistem saat menyimpan data.";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: "normal" | "waspada" | "siaga" | "awas") => {
    switch (status) {
      case "waspada":
        return "border-amber-200 bg-amber-50 text-amber-700";
      case "siaga":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "awas":
        return "border-rose-200 bg-rose-50 text-rose-700";
      default:
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }
  };

  if (!isMounted) return null;

  return (
    <div
      className={`flex flex-col gap-6 p-4 pb-12 sm:p-6 lg:pb-8 w-full max-w-350 mx-auto relative animate-in fade-in duration-500 ${outfit.className}`}
    >
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
              <AlertCircle size={20} className="shrink-0 text-rose-600" />
            )}
            <p className="text-sm font-bold tracking-wide">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRM MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs px-4">
          <div className="bg-white border border-slate-200 rounded shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
                <AlertCircle size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Hapus Data Pantauan?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anda yakin ingin menghapus log pemantauan untuk wilayah{" "}
                <span className="font-semibold text-slate-800">
                  {confirmModal.regionName}
                </span>
                ? Tindakan ini permanen.
              </p>
            </div>
            <div className="flex bg-slate-50 p-3 gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={cancelDelete}
                className="flex-1 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-blue-950 md:text-2xl">
            Data Pemantauan Terpadu
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Formulir entri pembacaan sensor hidrologi dan manajemen tingkat
            luapan air.
          </p>
        </div>
        {editingId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="flex w-full sm:w-auto items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 rounded-md transition-colors shadow-sm uppercase tracking-widest"
          >
            <X size={14} /> Batal Mode Edit
          </button>
        )}
      </div>

      {/* FORM ENTRI DATA */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div
          className={`bg-white border rounded-md p-5 shadow-sm transition-all ${editingId ? "border-amber-400" : "border-slate-200"} mx-4 sm:mx-0`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Wilayah Pemantauan
              </label>
              <select
                name="regionId"
                value={formData.regionId}
                onChange={handleInputChange}
                required
                className="w-full border border-slate-300 rounded px-3 py-2.5 text-xs font-semibold outline-none text-slate-900 bg-white focus:border-blue-600"
              >
                <option value="" disabled>
                  -- Pilih Cakupan Wilayah --
                </option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.regionName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Stasiun Sensor Hidrologi
              </label>
              <select
                name="postId"
                value={formData.postId}
                onChange={handleInputChange}
                required
                className="w-full border border-slate-300 rounded px-3 py-2.5 text-xs font-semibold outline-none text-slate-900 bg-white focus:border-blue-600"
              >
                <option value="" disabled>
                  -- Pilih Stasiun Terdaftar --
                </option>
                {posts.map((post) => (
                  <option key={post.id} value={post.id}>
                    {post.postName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mx-4 sm:mx-0">
          {/* SEKTOR BBWS */}
          <div className="border border-slate-200 rounded bg-white shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                Parameter Hidrologi (BBWS)
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <CustomNumberInput
                label="Curah Hujan"
                unit="mm"
                name="curahHujan"
                value={formData.curahHujan}
                onChange={handleNumberChange}
                step={1.5}
              />
              <CustomNumberInput
                label="Debit Aliran Air"
                unit="m³/s"
                name="debitAir"
                value={formData.debitAir}
                onChange={handleNumberChange}
                step={0.5}
              />
              <CustomNumberInput
                label="Tinggi Muka Air (TMA)"
                unit="m"
                name="tinggiMukaAir"
                value={formData.tinggiMukaAir}
                onChange={handleNumberChange}
                step={0.1}
              />
              <CustomNumberInput
                label="Tinggi Genangan Air"
                unit="m"
                name="tinggiGenangan"
                value={formData.tinggiGenangan}
                onChange={handleNumberChange}
                step={0.1}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* SEKTOR BMKG (MUTED) */}
            <div className="border border-slate-200 rounded bg-white shadow-sm opacity-70">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Parameter Meteorologi (BMKG)
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <CustomNumberInput
                  label="Suhu Udara"
                  unit="°C"
                  name="suhu"
                  value={formData.suhu}
                  onChange={handleNumberChange}
                  step={0.5}
                  disabled={true}
                />
                <CustomNumberInput
                  label="Kecepatan Angin"
                  unit="km/h"
                  name="kecepatanAngin"
                  value={formData.kecepatanAngin}
                  onChange={handleNumberChange}
                  step={1.0}
                  disabled={true}
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col gap-2">
              <p className="text-[10px] text-slate-400 text-center leading-snug font-medium uppercase tracking-wider">
                Data otomatis terintegrasi ke sistem pemetaan spasial dan model
                AI publik.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded bg-slate-900 py-3 text-xs font-bold uppercase tracking-widest transition-all text-white hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400"
              >
                {isSubmitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {isSubmitting
                  ? "MEMPROSES..."
                  : editingId
                    ? "PERBARUI LOG PEMANTAUAN"
                    : "SIMPAN LOG PEMANTAUAN"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* TABLE SECTION */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm mx-4 sm:mx-0">
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
          <List size={16} className="text-slate-700" />
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">
            Log Riwayat Pemantauan
          </h2>
        </div>
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full min-w-200 border-collapse text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Lokasi & Stasiun
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Pembacaan Hidrologi
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Pembacaan Meteorologi
                </th>
                <th className="w-32 p-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Status Prediksi AI
                </th>
                <th className="w-32 p-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                      <Loader2
                        size={32}
                        className="animate-spin text-blue-600"
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        Loading...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : monitoringLogs.length > 0 ? (
                monitoringLogs.map((log) => (
                  <tr
                    key={log.id}
                    className={`transition-colors ${editingId === log.id ? "bg-amber-50/50" : "hover:bg-slate-50/80"}`}
                  >
                    <td className="p-4">
                      <div className="text-sm font-bold text-blue-950 leading-none">
                        {log.regionName}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                        {log.postName}
                      </div>
                      <div className="text-[10px] font-medium text-slate-500 tracking-wide mt-2 font-mono bg-slate-100 inline-block px-1.5 py-0.5 rounded">
                        {log.waktuInput}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium text-xs">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 max-w-xs">
                        <span>
                          Hujan:{" "}
                          <b className="text-slate-900">{log.curahHujan} mm</b>
                        </span>
                        <span>
                          Debit:{" "}
                          <b className="text-slate-900">{log.debitAir} m³/s</b>
                        </span>
                        <span>
                          TMA:{" "}
                          <b className="text-slate-900">
                            {log.tinggiMukaAir} m
                          </b>
                        </span>
                        <span>
                          Genangan:{" "}
                          <b className="text-slate-900">
                            {log.tinggiGenangan} m
                          </b>
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium text-xs">
                      <div className="flex flex-col gap-1">
                        <span>
                          Suhu: <b className="text-slate-900">{log.suhu} °C</b>
                        </span>
                        <span>
                          Angin:{" "}
                          <b className="text-slate-900">
                            {log.kecepatanAngin} km/h
                          </b>
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex min-w-20 items-center justify-center rounded-md border px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusBadge(log.statusPrediksi)}`}
                      >
                        {log.statusPrediksi}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditLog(log)}
                          className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="Koreksi Log"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteLog(log.id, log.regionName)
                          }
                          className="p-2 border border-slate-200 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus Entri"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-xs font-bold uppercase tracking-widest text-slate-400 italic"
                  >
                    Belum ada riwayat entri log pemantauan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
