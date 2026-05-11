"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";

import {
  AddUserKabModal,
  NewUserPayload,
} from "@/components/ui/modal/AddUserbpbdKab";
import { DeleteUserModal } from "@/components/ui/modal/DeleteUserModal";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  agency?: string | null;
  createdAt?: string;
}

export default function BPBDKabUserManagement() {
  const [isMounted, setIsMounted] = useState(false);

  const [userData, setUserData] = useState<{
    email?: string;
    role?: string;
    agencyId?: string;
  } | null>(null);

  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const isMasterAdmin =
    userData?.role === "MASTER_ADMIN" || userData?.role === "SUPER_ADMIN";
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("auth_token");
      if (!token) return;

      const res = await fetch(`${baseUrl}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsersList(data.data?.items || data.data || []);
      }
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    setIsMounted(true);
    const sessionCookie = Cookies.get("user_session");
    if (sessionCookie) {
      try {
        setUserData(JSON.parse(sessionCookie));
      } catch (error) {
        console.error("Gagal mem-parse cookie session", error);
      }
    }
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (isAddModalOpen || isDeleteModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAddModalOpen, isDeleteModalOpen]);

  const handleAddUser = async (newUser: NewUserPayload) => {
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Gagal menambahkan user");

      fetchUsers();
      setIsAddModalOpen(false);
      showToast("Pengguna baru berhasil didaftarkan!", "success");
    } catch (error) {
      console.error(error);
      const errMsg =
        error instanceof Error ? error.message : "Terjadi kesalahan sistem";
      showToast(errMsg, "error");
      throw error;
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch(`${baseUrl}/users/${selectedUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(
          data.message || "Gagal menghapus pengguna. Akses ditolak.",
        );

      setUsersList((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setSelectedUser(null);
      setIsDeleteModalOpen(false);
      showToast("Akun berhasil dihapus secara permanen.", "success");
    } catch (error) {
      console.error(error);
      const errMsg =
        error instanceof Error ? error.message : "Gagal menghapus pengguna";
      showToast(errMsg, "error");
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
    <div className="flex flex-col gap-6 p-4 pb-12 sm:p-6 lg:pb-8 w-full max-w-350 mx-auto relative">
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

      {!isMasterAdmin && (
        <div className="flex shrink-0 items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm animate-in fade-in zoom-in-95 duration-500">
          <ShieldAlert className="mt-0.5 shrink-0 text-blue-600" size={18} />
          <div>
            <h4 className="text-sm font-bold text-blue-900">
              Mode Akses Terbatas
            </h4>
            <p className="mt-1 text-xs font-medium text-blue-800">
              Anda login sebagai Petugas/Admin biasa. Penambahan dan penghapusan
              akun dibatasi khusus untuk Kepala/Master Admin instansi.
            </p>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Manajemen User
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Daftar akses akun internal instansi
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
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
            />
          </div>

          {isMasterAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex w-full shrink-0 items-center justify-center gap-2 rounded-md bg-blue-950 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-blue-900 focus:ring-2 focus:ring-blue-950 focus:ring-offset-1 sm:w-auto"
            >
              <Plus size={16} /> TAMBAH AKUN
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-225 border-collapse text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="w-16 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  No
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Nama / Email
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Instansi
                </th>
                <th className="w-40 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Level Akses
                </th>
                {isMasterAdmin && (
                  <th className="w-28 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={isMasterAdmin ? 5 : 4}
                    className="py-20 text-center"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Sinkronisasi Server...
                    </span>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="group transition-colors hover:bg-slate-50"
                  >
                    <td className="p-4 text-center text-sm font-medium text-slate-500">
                      {index + 1}
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-bold uppercase text-blue-950 line-clamp-1">
                        {user.name}
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-slate-400">
                        {user.email}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded border border-blue-200 bg-blue-50 px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-700 whitespace-nowrap">
                        {user.agency || "INSTANSI INTERNAL"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex min-w-25 items-center justify-center rounded border px-2 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                          user.role === "MASTER_ADMIN" ||
                          user.role === "SUPER_ADMIN"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-blue-200 bg-blue-50 text-blue-700"
                        }`}
                      >
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    {isMasterAdmin && (
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteModalOpen(true);
                          }}
                          className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-rose-50 text-[10px] font-bold uppercase tracking-widest text-rose-600 shadow-sm transition-all hover:bg-rose-600 hover:text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-rose-50 disabled:hover:text-rose-600"
                          disabled={
                            user.role === "MASTER_ADMIN" ||
                            user.role === "SUPER_ADMIN" ||
                            user.email === userData?.email
                          }
                          title={
                            user.role === "MASTER_ADMIN" ||
                            user.role === "SUPER_ADMIN"
                              ? "Tidak dapat menghapus sesama Master Admin"
                              : "Hapus Pengguna"
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isMasterAdmin ? 5 : 4}
                    className="py-16 text-center align-middle"
                  >
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <Users size={32} className="mb-3 text-slate-300" />
                      <span className="text-sm font-medium">
                        Tidak ada personil yang ditemukan.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:gap-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Total Personil:{" "}
            <span className="font-black text-blue-950">
              {filteredUsers.length}
            </span>
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            <button className="flex-1 cursor-not-allowed rounded-md border border-slate-200 bg-slate-100 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-all sm:flex-none">
              PREV
            </button>
            <button className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-blue-950 shadow-sm transition-all hover:border-blue-950 hover:bg-slate-50 sm:flex-none">
              NEXT
            </button>
          </div>
        </div>
      </div>

      <AddUserKabModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTimeout(() => setSelectedUser(null), 300);
        }}
        onConfirm={handleDeleteUser}
        userToDelete={
          selectedUser
            ? { name: selectedUser.name, email: selectedUser.email }
            : null
        }
      />
    </div>
  );
}
