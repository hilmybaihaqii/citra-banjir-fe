"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, ShieldAlert, Users } from "lucide-react";

import { AddUserModal } from "@/components/ui/AddUserbpbd";
import { DeleteUserModal } from "@/components/ui/DeleteUserModal";
import { MOCK_USERS } from "@/lib/data";
import { User } from "@/types";

export default function BPBDUserManagement() {
  const [isMounted, setIsMounted] = useState(false);

  const [userData] = useState<{
    username: string;
    role: string;
    agencyId: string;
  } | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user_session");
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {
          console.error("Gagal parsing session", e);
        }
      }
      return { username: "super_bpbd", role: "superadmin", agencyId: "bpbd" };
    }
    return null;
  });

  const [usersList, setUsersList] = useState<User[]>(() =>
    MOCK_USERS.filter((user) => user.agencyId === "bpbd"),
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    name: string;
    username: string;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  const isSuperAdmin = userData?.role === "superadmin";

  const handleAddUser = (newUser: User) => {
    const formattedUser = { ...newUser, agencyId: "bpbd" };
    setUsersList((prev) => [...prev, formattedUser]);
    setIsAddModalOpen(false);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsersList(
        usersList.filter((u) => u.username !== selectedUser.username),
      );
    }
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const filteredUsers = usersList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6 pb-8">
      {!isSuperAdmin && (
        <div className="flex shrink-0 items-start gap-3 rounded-md border border-blue-200 bg-blue-50 p-4">
          <ShieldAlert className="mt-0.5 shrink-0 text-blue-600" size={18} />
          <div>
            <h4 className="text-sm font-bold text-blue-900">
              Mode Akses Terbatas
            </h4>
            <p className="mt-1 text-xs font-medium text-blue-800">
              Anda login sebagai Petugas BPBD. Penambahan dan penghapusan akun
              dibatasi khusus untuk Komandan/Super Admin BPBD Jabar.
            </p>
          </div>
        </div>
      )}

      <div className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Manajemen User
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Daftar akses akun internal BPBD Provinsi Jawa Barat
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative w-full shrink-0 sm:w-64">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari nama atau username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
            />
          </div>

          {isSuperAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex w-full shrink-0 items-center justify-center gap-2 rounded-md bg-blue-950 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-colors hover:bg-blue-900 sm:w-auto"
            >
              <Plus size={16} /> Tambah Akun
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-175 border-collapse text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="w-16 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  No
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Nama / Username
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Instansi
                </th>
                <th className="w-32 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Level Akses
                </th>
                {isSuperAdmin && (
                  <th className="w-24 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.username}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="p-4 text-center text-sm font-medium text-slate-500">
                      {index + 1}
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-bold uppercase text-blue-950">
                        {user.name}
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-400">
                        @{user.username}
                      </p>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center rounded border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-700">
                        BPBD Jawa Barat
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                          user.role === "superadmin"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-blue-200 bg-blue-50 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {isSuperAdmin && (
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedUser({
                              name: user.name,
                              username: user.username,
                            });
                            setIsDeleteModalOpen(true);
                          }}
                          className="mx-auto flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                          disabled={
                            user.role === "superadmin" ||
                            user.username === userData?.username
                          }
                          title={
                            user.role === "superadmin"
                              ? "Tidak dapat menghapus sesama Super Admin"
                              : "Hapus User"
                          }
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isSuperAdmin ? 5 : 4}
                    className="py-16 text-center align-middle"
                  >
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <Users size={32} className="mb-3 text-slate-300" />
                      <span className="text-sm font-medium">
                        Tidak ada personil BPBD yang ditemukan.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:gap-0">
          <p className="text-xs font-medium text-slate-600">
            Total personil:{" "}
            <span className="font-bold text-blue-950">
              {filteredUsers.length}
            </span>
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            <button className="flex-1 cursor-not-allowed rounded-md border border-slate-200 bg-slate-100 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:flex-none">
              PREV
            </button>
            <button className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-blue-950 shadow-sm transition-colors hover:bg-slate-50 hover:border-blue-950 sm:flex-none">
              NEXT
            </button>
          </div>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
        userToDelete={selectedUser}
      />
    </div>
  );
}
