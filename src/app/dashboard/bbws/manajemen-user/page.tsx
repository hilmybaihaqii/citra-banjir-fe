"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, ShieldAlert } from "lucide-react";
import { AddUserBBWSModal } from "@/components/ui/AddUserBBWSModal";
import { DeleteUserModal } from "@/components/ui/DeleteUserModal";
import { MOCK_USERS } from "@/lib/data";
import { User } from "@/types";

export default function ManajemenUserBBWS() {
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
          console.error(e);
        }
      }
      return { username: "admin_bbws", role: "superadmin", agencyId: "bbws" };
    }
    return null;
  });

  const [usersList, setUsersList] = useState<User[]>([]);
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
      setUsersList(MOCK_USERS.filter((user) => user.agencyId === "bbws"));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  // Normalisasi role untuk pengecekan (case-insensitive)
  const userRoleLower = userData?.role?.toLowerCase() || "";
  const isSuperAdmin = userRoleLower === "superadmin";

  const handleAddUser = (newUser: User) => {
    setUsersList((prev) => [...prev, { ...newUser, agencyId: "bbws" }]);
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
    <div className="flex flex-col gap-6 pb-8 animate-in fade-in duration-500">
      {/* ALERT MODE AKSES */}
      {!isSuperAdmin && (
        <div className="flex shrink-0 items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <ShieldAlert className="mt-0.5 shrink-0 text-amber-600" size={18} />
          <div>
            <h4 className="text-sm font-bold text-amber-900">
              Mode Akses Terbatas
            </h4>
            <p className="mt-1 text-xs font-medium text-amber-800 leading-relaxed">
              Anda login sebagai petugas Balai. Penambahan dan penghapusan akun
              dibatasi khusus untuk Kepala Balai / Super Admin BBWS.
            </p>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
            Manajemen Personil BBWS
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-slate-500">
            Daftar petugas operasional Balai Besar Wilayah Sungai Citarum
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
              className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 transition-all placeholder:text-slate-400"
            />
          </div>
          {isSuperAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex w-full shrink-0 items-center justify-center gap-2 rounded-md bg-blue-950 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg hover:bg-blue-900 transition-all sm:w-auto active:scale-95"
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
                <th className="w-16 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  No
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Nama / Username
                </th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Instansi
                </th>
                <th className="w-40 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
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
                filteredUsers.map((user, index) => {
                  // Cek role untuk styling warna badge
                  const role = user.role.toLowerCase();
                  const isRoleSuper = role === "superadmin";

                  return (
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
                          BBWS CITARUM
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex min-w-100px justify-center items-center rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                            isRoleSuper
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
                            className="mx-auto flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30"
                            disabled={
                              isRoleSuper ||
                              user.username === userData?.username
                            }
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
                  <td
                    colSpan={isSuperAdmin ? 5 : 4}
                    className="py-20 text-center align-middle text-slate-400 text-sm font-medium uppercase tracking-widest"
                  >
                    Data petugas tidak ditemukan.
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
            <button className="flex-1 cursor-not-allowed rounded-md border border-slate-200 bg-slate-100 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-all sm:flex-none">
              PREV
            </button>
            <button className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-blue-950 shadow-sm transition-all hover:border-blue-950 hover:bg-slate-50 sm:flex-none">
              NEXT
            </button>
          </div>
        </div>
      </div>

      <AddUserBBWSModal
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
