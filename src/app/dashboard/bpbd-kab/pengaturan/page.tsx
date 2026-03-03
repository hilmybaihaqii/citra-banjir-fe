"use client";

import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

const AGENCIES: Record<string, string> = {
  bbws: "BBWS Citarum",
  bpbd: "BPBD Jawa Barat",
  bpbd_kab: "BPBD Kab. Bandung",
  bmkg: "BMKG Jawa Barat",
  admin: "Citra Banjir Pusat",
};

export default function BPBDKabSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [userData, setUserData] = useState<{
    username: string;
    name: string;
    role: string;
    agency_id: string;
  } | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user_session");
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {
          console.error("Gagal parsing data user", e);
        }
      }
      return {
        username: "super_bpbdkab",
        name: "Kepala BPBD Kab. Bandung",
        role: "superadmin",
        agency_id: "bpbd_kab",
      };
    }
    return null;
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ 
    name: userData?.name || "", 
    username: userData?.username || "" 
  });
  
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage("");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setUserData((prev) =>
        prev ? { ...prev, name: profileForm.name, username: profileForm.username } : null
      );
      setIsProfileModalOpen(false);

      setSuccessMessage("Profil berhasil diperbarui!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      setErrorMessage("Konfirmasi password tidak cocok!");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsPasswordModalOpen(false);
      setPasswordForm({ current: "", new: "", confirm: "" });

      setSuccessMessage("Password keamanan berhasil diganti!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  const handleUploadPhoto = () => fileInputRef.current?.click();

  const getRoleLabel = (role: string) => {
    return role === "superadmin" ? "Super Admin Kabupaten" : "Admin Staff";
  };

  if (!isMounted || !userData) return null;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col pb-8">
      
      <div 
        className={`fixed left-1/2 top-6 z-100 -translate-x-1/2 rounded-md border border-emerald-200 bg-emerald-50 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-emerald-600 shadow-xl transition-all duration-300 ${
          successMessage ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-8 opacity-0"
        }`}
      >
        {successMessage}
      </div>

      <div className="mb-8 flex flex-col items-center">
        <h1 className="mb-8 text-2xl font-black uppercase tracking-tight text-blue-950">
          Pengaturan Akun
        </h1>
        
        <div
          onClick={handleUploadPhoto}
          className="group relative flex h-32 w-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md"
        >
          <span className="text-4xl font-black uppercase tracking-widest text-slate-500 transition-opacity group-hover:opacity-0">
            {userData.name ? userData.name.substring(0, 2) : "AD"}
          </span>
          <div className="absolute inset-0 flex items-center justify-center bg-blue-950/80 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Ganti</span>
          </div>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
      </div>

      <div className="flex w-full flex-col gap-3">
        
        <div
          onClick={() => {
            setProfileForm({ name: userData.name, username: userData.username });
            setIsProfileModalOpen(true);
          }}
          className="group flex cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-900"
        >
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Nama Lengkap</p>
            <p className="text-sm font-black uppercase tracking-wide text-blue-950">{userData.name}</p>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">UBAH</span>
        </div>

        <div
          onClick={() => {
            setProfileForm({ name: userData.name, username: userData.username });
            setIsProfileModalOpen(true);
          }}
          className="group flex cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-900"
        >
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Username</p>
            <p className="text-base font-black uppercase tracking-wide text-blue-950">@{userData.username}</p>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">UBAH</span>
        </div>

        <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-5">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Instansi</p>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-700">
              {AGENCIES[userData.agency_id] || "Tidak Diketahui"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-5">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Level Akses</p>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-700">{getRoleLabel(userData.role)}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => {
            setPasswordForm({ current: "", new: "", confirm: "" });
            setErrorMessage("");
            setIsPasswordModalOpen(true);
          }}
          className="w-full rounded-md border border-slate-300 bg-white px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-blue-950 shadow-sm transition-colors hover:border-blue-950 hover:bg-slate-50"
        >
          Ganti Password Keamanan
        </button>
      </div>

      {isProfileModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsProfileModalOpen(false)} />
          <div className="relative w-full max-w-sm overflow-hidden rounded-lg bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-950">Ubah Informasi</h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Nama Lengkap</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-blue-950 transition-all focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Username</label>
                <input
                  required
                  type="text"
                  name="username"
                  value={profileForm.username}
                  onChange={handleProfileChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-blue-950 transition-all focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsProfileModalOpen(false)} className="flex-1 rounded-md border border-slate-300 bg-white py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-50">
                  Batal
                </button>
                <button type="submit" disabled={isSaving} className="flex-1 rounded-md bg-blue-950 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition-colors hover:bg-blue-900 disabled:opacity-70">
                  {isSaving ? "MEMPROSES..." : "SIMPAN"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsPasswordModalOpen(false)} />
          <div className="relative w-full max-w-sm overflow-hidden rounded-lg bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-950">Ubah Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
            
            {errorMessage && (
              <div className="mb-5 rounded-md border border-rose-200 bg-rose-50 p-3 text-center text-[10px] font-bold uppercase tracking-widest text-rose-700">
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Password Saat Ini</label>
                <input required type="password" name="current" value={passwordForm.current} onChange={handlePasswordChange} className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-blue-950 transition-all focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Password Baru</label>
                <input required type="password" name="new" value={passwordForm.new} onChange={handlePasswordChange} className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-blue-950 transition-all focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Konfirmasi Password Baru</label>
                <input required type="password" name="confirm" value={passwordForm.confirm} onChange={handlePasswordChange} className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-blue-950 transition-all focus:border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="flex-1 rounded-md border border-slate-300 bg-white py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-50">
                  Batal
                </button>
                <button type="submit" disabled={isSaving} className="flex-1 rounded-md bg-blue-950 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition-colors hover:bg-blue-900 disabled:opacity-70">
                  {isSaving ? "MEMPROSES..." : "SIMPAN"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}