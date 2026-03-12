"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Plus, Trash2, ShieldAlert, Users, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";

import { AddUserModal } from "@/components/ui/AddUserModal";
import { DeleteUserModal } from "@/components/ui/DeleteUserModal";

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
  username: string; 
  password?: string;
  role: string;
  agency: string;
}

// Fungsi untuk mengubah Enum Backend menjadi Label yang rapi di Tabel
const formatAgencyLabel = (agencyCode: string | null | undefined) => {
  switch (agencyCode) {
    case "CITRA_BANJIR": return "Citra Banjir Pusat";
    case "BBWS": return "BBWS Citarum";
    case "BMKG": return "BMKG Stasiun Jabar";
    case "BPBD_JABAR": return "BPBD Provinsi Jabar";
    case "BPBD_KAB": return "BPBD Kab. Bandung";
    case "SYSTEM": return "Sistem Utama";
    default: return agencyCode || "Citra Banjir Pusat"; // Fallback
  }
};

export default function AdminUsersManagement() {
  const [isMounted, setIsMounted] = useState(false);

  // MENGGUNAKAN COOKIES, BUKAN LOCAL STORAGE
  const [userData, setUserData] = useState<{ email?: string; role?: string; agency?: string } | null>(null);

  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  // Variabel untuk menentukan apakah user ini Super Admin
  const isSuperAdmin = userData?.role === "SUPER_ADMIN";
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
  };

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
      console.error("Gagal menarik data user:", error);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    setIsMounted(true);
    
    // Ambil Data Sesi dari Cookie saat komponen dimuat
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

  // FUNGSI POST
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
      showToast("Pengguna baru berhasil didaftarkan!", "success");
    } catch (error) {
      console.error(error);
      const errMsg = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
      showToast(errMsg, "error");
      throw error;
    }
  };

  // FUNGSI DELETE
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
      showToast("Akun berhasil dihapus permanen.", "success");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  if (!isMounted) return null;

  const filteredUsers = usersList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.agency && user.agency.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="flex flex-col gap-6 pb-12 lg:pb-8 relative">
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

      {/* Peringatan hanya muncul jika BUKAN Super Admin */}
      {!isSuperAdmin && (
        <div className="flex shrink-0 items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm animate-in fade-in zoom-in-95 duration-500">
          <ShieldAlert className="mt-0.5 shrink-0 text-blue-600" size={18} />
          <div>
            <h4 className="text-sm font-bold text-blue-900">Mode Akses Terbatas</h4>
            <p className="mt-1 text-xs font-medium text-blue-800">
              Anda login sebagai {userData?.role?.replace("_", " ")}. Penambahan dan penghapusan akun
              dibatasi khusus untuk Super Admin Pusat.
            </p>
          </div>
        </div>
      )}

      <div className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-blue-950">
            Manajemen User Global
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Kendali penuh akses akun untuk seluruh instansi
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative w-full shrink-0 sm:w-64">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, email, atau instansi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
            />
          </div>

          {/* Tombol Tambah User HANYA MUNCUL JIKA SUPER ADMIN */}
          {isSuperAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex w-full shrink-0 items-center justify-center gap-2 rounded-md bg-blue-950 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-colors hover:bg-blue-900 sm:w-auto"
            >
              <Plus size={16} /> Tambah User
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full min-w-175 border-collapse text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="w-16 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">No</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Nama / Email</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Instansi</th>
                <th className="w-32 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Level Akses</th>
                {isSuperAdmin && <th className="w-24 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 5 : 4} className="py-16 text-center">
                    <span className="text-sm font-medium text-slate-500">Memuat data pengguna global...</span>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => {
                  const isTopTier = user.role === "SUPER_ADMIN";
                  
                  return (
                    <tr key={user.id} className="transition-colors hover:bg-slate-50">
                      <td className="p-4 text-center text-sm font-medium text-slate-500">{index + 1}</td>
                      <td className="p-4">
                        <p className="text-sm font-bold uppercase text-blue-950">{user.name}</p>
                        <p className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-400">{user.email}</p>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                          {formatAgencyLabel(user.agency)}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                            isTopTier ? "border-amber-200 bg-amber-50 text-amber-700" : "border-blue-200 bg-blue-50 text-blue-700"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      {isSuperAdmin && (
                        <td className="p-4 text-center">
                          <button
                            onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                            className="mx-auto flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                            disabled={user.email === userData?.email}
                            title={user.email === userData?.email ? "Tidak dapat menghapus akun sendiri" : "Hapus User"}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isSuperAdmin ? 5 : 4} className="py-16 text-center align-middle">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <Users size={32} className="mb-3 text-slate-300" />
                      <span className="text-sm font-medium">Tidak ada data pengguna yang ditemukan.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddUser} />
      
      <DeleteUserModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => { setIsDeleteModalOpen(false); setSelectedUser(null); }} 
        onConfirm={handleDeleteUser} 
        userToDelete={selectedUser ? { name: selectedUser.name, email: selectedUser.email } : null} 
      />
    </div>
  );
}