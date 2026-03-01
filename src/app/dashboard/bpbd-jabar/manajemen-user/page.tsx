"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  ShieldAlert,
  Users
} from "lucide-react";

// Import Modal & Data (Sesuaikan path ini dengan project Anda)
import { AddUserModal } from '@/components/ui/AddUserbpbd';
import { DeleteUserModal } from '@/components/ui/DeleteUserModal';
import { MOCK_USERS } from "@/lib/data"; 
import { User } from "@/types";

export default function BPBDUserManagement() {
  // 1. State Session (Otoritas)
  const [userData] = useState<{ username: string; role: string; agencyId: string } | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user_session");
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {
          console.error("Gagal parsing session", e);
        }
      }
      // Fallback default untuk BPBD
      return { username: "super_bpbd", role: "superadmin", agencyId: "bpbd" };
    }
    return null;
  });

  // 2. Filter User khusus instansi BPBD (agencyId: "bpbd")
  const [usersList, setUsersList] = useState<User[]>(
    MOCK_USERS.filter(user => user.agencyId === "bpbd")
  );
  
  const [searchQuery, setSearchQuery] = useState("");
  
  // 3. States untuk Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ name: string; username: string } | null>(null);

  const isSuperAdmin = userData?.role === "superadmin";

const handleAddUser = (newUser: User) => { 
    const formattedUser = { ...newUser, agencyId: "bpbd" };
    setUsersList(prev => [...prev, formattedUser]);
    setIsAddModalOpen(false);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsersList(usersList.filter(u => u.username !== selectedUser.username));
    }
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const filteredUsers = usersList.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Banner Read-Only untuk Admin Biasa (Persis Desain Admin) */}
        {!isSuperAdmin && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-sm p-4 flex items-start gap-3">
            <ShieldAlert className="text-blue-600 shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="text-sm font-bold text-blue-900">Mode Akses Terbatas</h4>
              <p className="text-xs text-blue-800 mt-1 font-medium">
                Anda login sebagai Petugas BPBD. Penambahan dan penghapusan akun dibatasi khusus untuk Komandan/Super Admin BPBD Jabar.
              </p>
            </div>
          </div>
        )}

        {/* Header Konten (Persis Desain Admin) */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tight">User Management BPBD</h1>
            <p className="text-slate-600 font-medium text-sm mt-1 tracking-wide">Daftar akses akun internal BPBD Provinsi Jawa Barat</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Cari nama/username..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-blue-950 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 w-full sm:w-64 transition-all"
              />
            </div>
            
            {isSuperAdmin && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-white px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors shadow-sm shrink-0"
              >
                <Plus size={16} /> Tambah Akun
              </button>
            )}
          </div>
        </div>

        {/* TABEL USERS (Persis Desain Admin - Status Dihilangkan) */}
        <div className="bg-white border border-slate-300 rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-175">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="p-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest w-16 text-center">No</th>
                  <th className="p-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest">Nama / Username</th>
                  <th className="p-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest">Instansi</th>
                  <th className="p-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest text-center">Level</th>
                  {isSuperAdmin && (
                    <th className="p-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest text-center">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user.username} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm text-slate-700 text-center font-bold">{index + 1}</td>
                      <td className="p-4">
                        <p className="text-sm font-bold text-blue-950">{user.name}</p>
                        <p className="text-[11px] text-slate-600 mt-1 font-bold tracking-wide italic">@{user.username}</p>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-300">
                          BPBD Jawa Barat
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${
                          user.role === 'superadmin' 
                            ? 'bg-amber-100 text-amber-800 border-amber-300' 
                            : 'bg-blue-100 text-blue-800 border-blue-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      
                      {isSuperAdmin && (
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => {
                              setSelectedUser({ name: user.name, username: user.username });
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-rose-700 hover:bg-rose-100 rounded-sm transition-colors inline-flex items-center justify-center disabled:opacity-50"
                            disabled={user.username === userData?.username} 
                            title="Hapus User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isSuperAdmin ? 5 : 4} className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-600 font-medium italic">
                        <Users size={40} className="text-slate-400 mb-4 opacity-30" />
                        <span>Tidak ada personil BPBD yang ditemukan.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination (Persis Desain Admin) */}
          <div className="p-4 border-t border-slate-300 bg-slate-50 flex items-center justify-between">
            <p className="text-xs text-slate-700 font-medium italic">
              Menampilkan <span className="font-bold text-blue-950">{filteredUsers.length}</span> personil BPBD
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-300 rounded-sm text-[10px] uppercase tracking-widest font-bold text-slate-500 bg-slate-100 cursor-not-allowed">Prev</button>
              <button className="px-4 py-2 border border-slate-300 rounded-sm text-[10px] uppercase tracking-widest font-bold text-blue-950 bg-white hover:bg-slate-100 transition-all">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
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