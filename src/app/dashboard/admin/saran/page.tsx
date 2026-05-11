"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  Mail,
  Calendar,
  Phone,
  CheckCircle2,
  X,
  MessageSquare,
  Loader2,
  Trash2,
} from "lucide-react";
import Cookies from "js-cookie";

interface Feedback {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  description: string;
  createdAt: string;
  isRead: boolean;
}

export default function AdminSaran() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State Modal Detail
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // State Modal Hapus
  const [deleteTarget, setDeleteTarget] = useState<Feedback | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchFeedbacks = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get("auth_token");

      const response = await fetch(`${API_URL}/feedback`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        window.location.href = "/";
        return;
      }

      const data = await response.json();
      const result = data?.data?.items || data?.data || [];
      setFeedbacks(result);
    } catch (error) {
      console.error("Gagal fetch data saran:", error);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  // Handle Body Scroll untuk semua modal
  useEffect(() => {
    if (isModalOpen || deleteTarget) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, deleteTarget]);

  const handleMarkAsRead = async (id: number) => {
    if (isUpdating) return;
    try {
      setIsUpdating(true);
      const token = Cookies.get("auth_token");

      const response = await fetch(`${API_URL}/feedback/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setFeedbacks((prev) =>
          prev.map((f) => (f.id === id ? { ...f, isRead: true } : f)),
        );
        setIsModalOpen(false);
        setTimeout(() => setSelectedFeedback(null), 300);
      }
    } catch (error) {
      console.error("Gagal update status baca:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      const token = Cookies.get("auth_token");

      const response = await fetch(`${API_URL}/feedback/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setFeedbacks((prev) => prev.filter((f) => f.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        alert("Gagal menghapus data dari server.");
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat menghapus:", error);
      alert("Terjadi kesalahan sistem saat menghapus data.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 pb-12 sm:p-6 lg:pb-8 w-full max-w-350 mx-auto">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Saran & Masukan
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Daftar aspirasi dan laporan dari masyarakat terkait sistem.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative w-full shrink-0 sm:w-72">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari pengirim atau pesan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm transition-all focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="custom-scrollbar overflow-x-auto">
          {/* Perbaikan: Menggunakan min-w-[900px] agar tabel tidak gepeng di layar kecil */}
          <table className="w-full min-w-225 border-collapse text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="w-16 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  No
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Pengirim
                </th>
                <th className="w-48 p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Kontak
                </th>
                <th className="w-80 p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Pesan Singkat
                </th>
                <th className="w-40 p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Tanggal, Waktu
                </th>
                <th className="w-24 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Status
                </th>
                <th className="w-28 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <Loader2
                      className="mx-auto mb-2 animate-spin text-slate-300"
                      size={32}
                    />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Sinkronisasi Server...
                    </span>
                  </td>
                </tr>
              ) : filteredFeedbacks.length > 0 ? (
                filteredFeedbacks.map((feedback, index) => (
                  <tr
                    key={feedback.id}
                    className={`group transition-colors ${!feedback.isRead ? "bg-amber-50/20 hover:bg-amber-50/60" : "bg-white hover:bg-slate-50"}`}
                  >
                    <td className="p-4 text-center text-sm font-medium text-slate-500">
                      {index + 1}
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-bold uppercase text-blue-950 line-clamp-1">
                        {feedback.name}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-bold text-slate-600 line-clamp-1">
                        {feedback.email}
                      </p>
                      <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-400 whitespace-nowrap">
                        {feedback.whatsapp}
                      </p>
                    </td>
                    <td className="p-4">
                      <p
                        className={`line-clamp-2 pr-4 text-sm ${!feedback.isRead ? "font-bold text-blue-950" : "font-medium text-slate-600"}`}
                      >
                        {feedback.description}
                      </p>
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-600 whitespace-nowrap">
                      {formatDate(feedback.createdAt)}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex min-w-17.5 items-center justify-center rounded border px-2 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                          !feedback.isRead
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-slate-200 bg-slate-50 text-slate-600"
                        }`}
                      >
                        {!feedback.isRead ? "BARU" : "DIBACA"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedFeedback(feedback);
                            setIsModalOpen(true);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-950 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:ring-offset-1"
                          title="Lihat Detail"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(feedback)}
                          className="flex h-8 w-8 items-center justify-center rounded-md bg-rose-50 text-[10px] font-bold uppercase tracking-widest text-rose-600 shadow-sm transition-all hover:bg-rose-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-1"
                          title="Hapus Saran"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center align-middle">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <MessageSquare
                        size={32}
                        className="mb-3 text-slate-300"
                      />
                      <span className="text-sm font-medium">
                        Data saran belum tersedia atau tidak ditemukan.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================
          MODAL DETAIL MASUKAN
      ========================================= */}
      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => !isUpdating && setIsModalOpen(false)}
          />
          <div className="animate-in fade-in zoom-in-95 relative w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-950">
                <Mail size={16} /> DETAIL MASUKAN
              </h3>
              <button
                disabled={isUpdating}
                onClick={() => {
                  setIsModalOpen(false);
                  setTimeout(() => setSelectedFeedback(null), 300);
                }}
                className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus:outline-none disabled:opacity-50"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    PENGIRIM
                  </p>
                  <p className="text-base font-black uppercase text-blue-950">
                    {selectedFeedback.name}
                  </p>
                  <div className="mt-2 space-y-1.5">
                    <p className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Mail size={14} className="text-slate-400" />{" "}
                      {selectedFeedback.email}
                    </p>
                    <p className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Phone size={14} className="text-slate-400" />{" "}
                      {selectedFeedback.whatsapp}
                    </p>
                  </div>
                </div>
                <div className="md:text-right">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    WAKTU MASUK
                  </p>
                  <p className="flex items-center gap-2 text-sm font-bold text-blue-950 md:justify-end">
                    <Calendar size={14} className="text-slate-400" />{" "}
                    {formatDate(selectedFeedback.createdAt)}
                  </p>
                </div>
              </div>
              <div>
                <p className="mb-3 border-b border-slate-100 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  ISI PESAN
                </p>
                <div className="min-h-30 whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 p-5 text-sm font-medium leading-relaxed text-blue-950">
                  {selectedFeedback.description}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5">
              <button
                disabled={isUpdating}
                onClick={() => setIsModalOpen(false)}
                className="rounded-md border border-slate-300 bg-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-100 focus:outline-none disabled:opacity-50"
              >
                TUTUP
              </button>
              {!selectedFeedback.isRead ? (
                <button
                  onClick={() => handleMarkAsRead(selectedFeedback.id)}
                  disabled={isUpdating}
                  className="flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  {isUpdating ? "MEMPROSES..." : "TANDAI SUDAH DIBACA"}
                </button>
              ) : (
                <button
                  disabled
                  className="flex cursor-not-allowed items-center gap-2 rounded-md border border-slate-200 bg-slate-100 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400"
                >
                  <CheckCircle2 size={14} /> PESAN TELAH DIBACA
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => !isDeleting && setDeleteTarget(null)}
          />
          <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl border border-slate-200 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-rose-600">
                Hapus pesan
              </h3>
              <button
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus:outline-none disabled:opacity-50"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus masukan dari pengirim <span className="font-black uppercase text-blue-950">{deleteTarget.name}</span>? 
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-slate-300 bg-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-100 focus:outline-none disabled:opacity-50"
              >
                BATAL
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-md bg-rose-600 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-rose-700 focus:outline-none disabled:opacity-50 min-w-30 justify-center"
              >
                {isDeleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                {isDeleting ? "MEMPROSES..." : "YA, HAPUS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}