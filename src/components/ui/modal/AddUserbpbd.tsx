"use client";

import React, { useState } from "react";
import { X, UserPlus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Pastikan import NewUserPayload sesuai path file BPBDUserManagement Anda
import { NewUserPayload } from "@/app/dashboard/bpbd-jabar/manajemen-user/page"; 

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (userData: NewUserPayload) => Promise<void>;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "ADMIN",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCloseModal = () => {
    onClose();
    // Delay reset state agar animasi tutup selesai dulu
    setTimeout(() => {
      setFormData({ email: "", name: "", password: "", role: "ADMIN" });
      setIsSubmitting(false);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onAdd({
        ...formData,
        username: formData.email, // Backend biasanya menggunakan email sebagai username login
      });

      handleCloseModal();
    } catch (error) {
      console.error("Gagal menambahkan user:", error);
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-500 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={!isSubmitting ? handleCloseModal : undefined}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-3 text-blue-950">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                  <UserPlus size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-blue-950">
                  Tambah Pengguna Baru
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-100 hover:text-rose-600 disabled:opacity-50"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-bold text-blue-950 shadow-sm transition-all placeholder:font-medium placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Email Akses <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className="w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-bold text-blue-950 shadow-sm transition-all placeholder:font-medium placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-bold text-blue-950 shadow-sm transition-all placeholder:font-medium placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Akses <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full cursor-pointer appearance-none rounded-md border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-bold text-blue-950 shadow-sm transition-all focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MASTER_ADMIN">Master Admin</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="rounded-md border border-slate-200 bg-slate-50 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-all hover:bg-slate-100 hover:text-blue-950 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex min-w-35 items-center justify-center gap-2 rounded-md bg-blue-950 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> PROSES...
                    </>
                  ) : (
                    "DAFTARKAN AKUN"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};