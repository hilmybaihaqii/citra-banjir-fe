"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Plus, Trash2, ShieldAlert, Users, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";

import { AddUserBMKGModal } from "@/components/ui/AddUserBMKGModal";
import { DeleteUserModal } from "@/components/ui/DeleteUserModal";

// 1. Definisikan Interface Data
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  agency?: string | null;
  createdAt?: string;
}

export interface NewUserPayload {
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: string;
}

export default function ManajemenUserBMKG() {
  const [isMounted, setIsMounted] = useState(false);
  
  // STATE SEKARANG KOSONG DI AWAL, AKAN DIISI OLEH COOKIES DI USEEFFECT
  const [userData, setUserData] = useState<{ email?: string; role?: string; agencyId?: string } | null>(null);

  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 2. State untuk Toast Notification
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const isMasterAdmin = userData?.role === "MASTER_ADMIN";
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fungsi pemanggil Toast
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
  };

  // 3. Fungsi FETCH (GET)
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("auth_token");
      if(!token) return;

      const res = await fetch(`${baseUrl}/users`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsersList(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    setIsMounted(true);

    // BACA DATA DARI COOKIES BUKAN LOCAL STORAGE
    const sessionCookie = Cookies.get("user_session");
    if (sessionCookie) {
      try {
        const parsedSession = JSON.parse(sessionCookie);
        setUserData(parsedSession);
      } catch (error) {
        console.error("Gagal mem-parse cookie session", error);
      }
    }

    fetchUsers();
  }, [fetchUsers]);

  // 4. Fungsi ADD (POST)
  const handleAddUser = async (newUser: NewUserPayload) => {
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Gagal menambahkan user");

      fetchUsers();
      setIsAddModalOpen(false);
      showToast("Petugas BMKG berhasil didaftarkan!", "success");
    } catch (error) {
      console.error(error);
      const errMsg = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
      showToast(errMsg, "error");
      throw error;
    }
  };

  // 5. Fungsi DELETE (DELETE)
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch(`${baseUrl}/users/${selectedUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Gagal menghapus pengguna. Akses ditolak.");

      setUsersList((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setSelectedUser(null);
      setIsDeleteModalOpen(false);
      showToast("Akun berhasil dihapus secara permanen.", "success");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  if (!isMounted) return null;

  const filteredUsers = usersList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6 pb-8 relative">
      
      {/* KOMPONEN TOAST */}
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

      {/* ALERT MODE AKSES - Hanya tampil jika BUKAN MASTER_ADMIN */}
      {!isMasterAdmin && (
        <div className="flex shrink-0 items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <ShieldAlert className="mt-0.5 shrink-0 text-amber-600" size={18} />
          <div>
            <h4 className="text-sm font-bold text-amber-900">
              Mode Akses Terbatas
            </h4>
            <p className="mt-1 text-xs font-medium text-amber-800 leading-relaxed">
              Anda login sebagai Petugas BMKG biasa. Penambahan dan penghapusan akun
              dibatasi khusus untuk Master Admin/Kepala Stasiun BMKG.
            </p>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Manajemen User BMKG
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Daftar akses akun internal operasional BMKG Jawa Barat
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative w-full shrink-0 sm:w-64">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
            />
          </div>
          
          {/* Tombol Tambah Akun HANYA MUNCUL JIKA MASTER_ADMIN */}
          {isMasterAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex w-full shrink-0 items-center justify-center gap-2 rounded-md bg-blue-950 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-colors hover:bg-blue-900 sm:w-auto"
            >
              <Plus size={16} /> Tambah Akun
            </button>
          )}
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm mx-4 sm:mx-0">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-175 border-collapse text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="w-16 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">No</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Nama / Email</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Instansi</th>
                <th className="w-32 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Level Akses</th>
                {isMasterAdmin && <th className="w-24 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={isMasterAdmin ? 5 : 4} className="py-16 text-center">
                    <span className="text-sm font-medium text-slate-500">Memuat data pengguna...</span>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="transition-colors hover:bg-slate-50">
                    <td className="p-4 text-center text-sm font-medium text-slate-500">{index + 1}</td>
                    <td className="p-4">
                      <p className="text-sm font-bold uppercase text-blue-950">{user.name}</p>
                      <p className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-400">{user.email}</p>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-700">
                         {user.agency || "BMKG Jawa Barat"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                          user.role === "MASTER_ADMIN" || user.role === "SUPER_ADMIN" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-blue-200 bg-blue-50 text-blue-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    {isMasterAdmin && (
                      <td className="p-4 text-center">
                        <button
                          onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                          className="mx-auto flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                          disabled={user.role === "MASTER_ADMIN" || user.role === "SUPER_ADMIN" || user.email === userData?.email}
                          title={user.role === "MASTER_ADMIN" || user.role === "SUPER_ADMIN" ? "Tidak dapat menghapus sesama Master/Super Admin" : "Hapus User"}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isMasterAdmin ? 5 : 4} className="py-16 text-center align-middle text-slate-500 text-sm font-medium">
                     <div className="flex flex-col items-center justify-center text-slate-500">
                      <Users size={32} className="mb-3 text-slate-300" />
                      <span className="text-sm font-medium">Tidak ada personil BMKG yang ditemukan.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER / PAGINATION */}
        <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:gap-0">
          <p className="text-xs font-medium text-slate-600">
            Total personil: <span className="font-bold text-blue-950">{filteredUsers.length}</span>
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            <button className="flex-1 cursor-not-allowed rounded-md border border-slate-200 bg-slate-100 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-all sm:flex-none">PREV</button>
            <button className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-blue-950 shadow-sm transition-all hover:border-blue-950 hover:bg-slate-50 sm:flex-none">NEXT</button>
          </div>
        </div>
      </div>

      <AddUserBMKGModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddUser} />
      
      <DeleteUserModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => { setIsDeleteModalOpen(false); setSelectedUser(null); }} 
        onConfirm={handleDeleteUser} 
        userToDelete={selectedUser ? { name: selectedUser.name, email: selectedUser.email } : null} 
      />
    </div>
  );
}