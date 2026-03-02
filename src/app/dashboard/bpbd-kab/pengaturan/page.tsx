"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
} from "lucide-react";

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

  // SOLUSI ERROR ESLint: Lazy Initializer untuk data user
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
      // Fallback khusus BPBD Kabupaten jika session kosong
      return {
        username: "super_bpbdkab",
        name: "Kepala BPBD Kab. Bandung",
        role: "superadmin",
        agency_id: "bpbd_kab",
      };
    }
    return null;
  });

  // Modal States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Form States (diinisialisasi dari userData)
  const [profileForm, setProfileForm] = useState({ 
    name: userData?.name || "", 
    username: userData?.username || "" 
  });
  
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Loading & Feedback States
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Mencegah hydration mismatch di Next.js
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

  // Handler Simpan Profil
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setUserData((prev) =>
        prev ? { ...prev, name: profileForm.name, username: profileForm.username } : null
      );
      setIsProfileModalOpen(false);

      setSuccessMessage("PROFIL BERHASIL DIPERBARUI");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  // Handler Simpan Password
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      setErrorMessage("KONFIRMASI PASSWORD TIDAK COCOK");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsPasswordModalOpen(false);
      setPasswordForm({ current: "", new: "", confirm: "" });

      setSuccessMessage("PASSWORD BERHASIL DIGANTI");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  const handleUploadPhoto = () => fileInputRef.current?.click();

  const getRoleLabel = (role: string) => {
    return role === "superadmin" ? "Super Admin Kabupaten" : "Admin Staff";
  };

  // Jangan render sebelum komponen terpasang untuk menghindari mismatch UI
  if (!isMounted || !userData) return null;

  return (
    <div className="flex-1 p-6 lg:p-10 bg-slate-50/50 flex flex-col items-center relative min-h-full">
      
      {/* Notifikasi Sukses Lokal */}
      <div className={`absolute top-0 left-0 right-0 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest p-3 text-center transition-all duration-300 z-50 shadow-md ${successMessage ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
        {successMessage}
      </div>

      <div className="w-full max-w-lg mt-4">
        {/* FOTO PROFIL */}
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tight text-center pb-10">
            PENGATURAN AKUN
          </h1>
          <div
            onClick={handleUploadPhoto}
            className="w-32 h-32 bg-slate-200 border-4 border-white shadow-md rounded-full flex flex-col items-center justify-center relative group cursor-pointer mb-5 overflow-hidden"
          >
            <span className="text-slate-500 text-4xl font-black uppercase tracking-widest transition-opacity group-hover:opacity-0">
              {userData.name ? userData.name.substring(0, 2) : "AD"}
            </span>
            <div className="absolute inset-0 bg-blue-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-[10px] font-bold uppercase tracking-widest">GANTI</span>
            </div>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
        </div>

        {/* DAFTAR INFORMASI */}
        <div className="w-full flex flex-col gap-3">
          <div
            onClick={() => {
              setProfileForm({ name: userData.name, username: userData.username });
              setIsProfileModalOpen(true);
            }}
            className="group bg-white border border-slate-300 p-5 rounded-sm flex justify-between items-center cursor-pointer hover:border-blue-900 transition-colors shadow-sm"
          >
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">NAMA LENGKAP</p>
              <p className="text-sm font-black text-blue-950 uppercase tracking-wide">{userData.name}</p>
            </div>
            <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">UBAH</span>
          </div>

          <div
            onClick={() => {
              setProfileForm({ name: userData.name, username: userData.username });
              setIsProfileModalOpen(true);
            }}
            className="group bg-white border border-slate-300 p-5 rounded-sm flex justify-between items-center cursor-pointer hover:border-blue-900 transition-colors shadow-sm"
          >
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">USERNAME</p>
              <p className="text-md font-black text-blue-950 uppercase tracking-wide">@{userData.username}</p>
            </div>
            <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">UBAH</span>
          </div>

          <div className="bg-slate-100 border border-slate-200 p-5 rounded-sm flex justify-between items-center">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">INSTANSI</p>
              <p className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                {AGENCIES[userData.agency_id] || "TIDAK DIKETAHUI"}
              </p>
            </div>
          </div>

          <div className="bg-slate-100 border border-slate-200 p-5 rounded-sm flex justify-between items-center">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">LEVEL AKSES</p>
              <p className="text-sm font-bold text-slate-700 uppercase tracking-wide">{getRoleLabel(userData.role)}</p>
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
            className="w-full px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-blue-950 bg-white border border-blue-950 rounded-sm hover:bg-blue-950 hover:text-white transition-all shadow-sm"
          >
            GANTI PASSWORD KEAMANAN
          </button>
        </div>
      </div>

      {/* MODAL EDIT PROFIL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-sm overflow-hidden border border-slate-300 p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <h3 className="font-black text-blue-950 uppercase tracking-widest text-xs">UBAH INFORMASI PROFIL</h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-rose-600 transition-colors">
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-blue-950 uppercase tracking-widest mb-2">NAMA LENGKAP</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-sm text-sm text-blue-950 font-bold focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-blue-950 uppercase tracking-widest mb-2">USERNAME</label>
                <input
                  required
                  type="text"
                  name="username"
                  value={profileForm.username}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-sm text-sm text-blue-950 font-bold focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 transition-all"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsProfileModalOpen(false)} className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white border border-slate-300 rounded-sm">BATAL</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-white bg-blue-950 border border-blue-950 rounded-sm hover:bg-blue-900 disabled:opacity-70">
                  {isSaving ? "MEMPROSES..." : "SIMPAN"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT PASSWORD */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-sm overflow-hidden border border-slate-300 p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <h3 className="font-black text-blue-950 uppercase tracking-widest text-xs">UBAH PASSWORD</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-rose-600 transition-colors">
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
            {errorMessage && (
              <div className="mb-4 bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-widest p-3 text-center rounded-sm border border-rose-300">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSavePassword} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-blue-950 uppercase tracking-widest mb-2">PASSWORD SAAT INI</label>
                <input required type="password" name="current" value={passwordForm.current} onChange={handlePasswordChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-sm text-sm text-blue-950 font-bold focus:outline-none focus:border-blue-950" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-blue-950 uppercase tracking-widest mb-2">PASSWORD BARU</label>
                <input required type="password" name="new" value={passwordForm.new} onChange={handlePasswordChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-sm text-sm text-blue-950 font-bold focus:outline-none focus:border-blue-950" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-blue-950 uppercase tracking-widest mb-2">KONFIRMASI PASSWORD BARU</label>
                <input required type="password" name="confirm" value={passwordForm.confirm} onChange={handlePasswordChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-sm text-sm text-blue-950 font-bold focus:outline-none focus:border-blue-950" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white border border-slate-300 rounded-sm">BATAL</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-white bg-blue-950 border border-blue-950 rounded-sm hover:bg-blue-900 disabled:opacity-70">
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