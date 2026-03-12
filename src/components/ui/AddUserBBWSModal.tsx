"use client";

import React, { useState } from "react";
import { X, UserPlus } from "lucide-react";
import { NewUserPayload } from "@/app/dashboard/bbws/manajemen-user/page"; 

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (userData: NewUserPayload) => Promise<void>;
}

export const AddUserBBWSModal: React.FC<AddUserModalProps> = ({
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

  if (!isOpen) return null;

  const handleCloseModal = () => {
    onClose();
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
        username: formData.email,
      });

      setFormData({ email: "", name: "", password: "", role: "ADMIN" });
      setIsSubmitting(false);
    } catch (error) {
      console.error("Gagal mendaftarkan petugas:", error);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3 text-blue-950">
            <div className="flex h-8 w-8 items-center justify-center rounded-md text-blue-700">
              <UserPlus size={18} strokeWidth={2.5} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-950">
              Tambah Petugas BBWS
            </h3>
          </div>
          <button
            onClick={handleCloseModal}
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

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
              placeholder="Nama Lengkap"
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base font-bold text-blue-950 shadow-sm transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
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
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base font-bold text-blue-950 shadow-sm transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
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
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base font-bold text-blue-950 shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Otoritas Akses <span className="text-rose-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full cursor-pointer appearance-none rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base text-blue-950 shadow-sm transition-all focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
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
              className="min-w-32 rounded-md bg-blue-950 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-blue-900 disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? "MEMPROSES..." : "DAFTARKAN PETUGAS"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};