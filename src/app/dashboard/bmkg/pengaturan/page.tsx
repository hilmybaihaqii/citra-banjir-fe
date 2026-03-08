"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  X,
  ShieldCheck,
  Lock,
  User,
  Mail,
  KeyRound,
} from "lucide-react"; // Activity sudah dihapus
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const AGENCIES: Record<string, string> = {
  bbws: "BBWS Citarum",
  bpbd: "BPBD Jawa Barat",
  bpbd_kab: "BPBD Kab. Bandung",
  bmkg: "BMKG Jawa Barat",
  admin: "Citra Banjir Pusat",
};

export default function BMKGSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [userData, setUserData] = useState<{
    username: string;
    name: string;
    role: string;
    agency_id: string;
  } | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", username: "" });
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
      const savedUser = localStorage.getItem("user_session");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUserData(parsed);
        setProfileForm({ name: parsed.name, username: parsed.username });
      }
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
      if (userData) {
        const updated = {
          ...userData,
          name: profileForm.name,
          username: profileForm.username,
        };
        setUserData(updated);
        localStorage.setItem("user_session", JSON.stringify(updated));
      }
      setIsProfileModalOpen(false);
      setSuccessMessage("Profil BMKG diperbarui!");
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
      setSuccessMessage("Password keamanan diperbarui!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  if (!isMounted || !userData) return null;

  return (
    <div
      className={`mx-auto flex w-full max-w-xl flex-col pb-8 ${outfit.className}`}
    >
      {/* Toast Success */}
      <div
        className={`fixed left-1/2 top-6 z-100 -translate-x-1/2 rounded-xl border border-emerald-200 bg-white px-6 py-4 shadow-2xl transition-all duration-500 ${successMessage ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-8 opacity-0"}`}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-100 p-1.5 text-emerald-600">
            <ShieldCheck size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
            {successMessage}
          </span>
        </div>
      </div>

      <div className="mb-8 flex flex-col items-center">
        <h1 className="mb-8 text-2xl font-black uppercase tracking-tight text-blue-950">
          Pengaturan Akun
        </h1>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex h-32 w-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <span className="text-4xl font-black uppercase tracking-widest text-slate-500">
            {userData.name.substring(0, 2)}
          </span>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-950/80 opacity-0 group-hover:opacity-100 transition-opacity text-white">
            <Camera size={20} className="mb-1" />
            <span className="text-[8px] font-bold uppercase tracking-widest text-center">
              Ubah <br /> Foto
            </span>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
        />
      </div>

      <div className="flex w-full flex-col gap-3">
        <div
          onClick={() => setIsProfileModalOpen(true)}
          className="group flex cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-900"
        >
          <div className="flex items-center gap-4">
            <User size={18} className="text-slate-400" />
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                Nama Petugas BMKG
              </p>
              <p className="text-sm font-black uppercase text-blue-950">
                {userData.name}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 uppercase">
            Ubah
          </span>
        </div>

        <div
          onClick={() => setIsProfileModalOpen(true)}
          className="group flex cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-900"
        >
          <div className="flex items-center gap-4">
            <Mail size={18} className="text-slate-400" />
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                ID Username
              </p>
              <p className="text-sm font-black text-blue-950">
                @{userData.username}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 uppercase">
            Ubah
          </span>
        </div>

        <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-4">
            <ShieldCheck size={18} className="text-slate-400" />
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                Instansi Afiliasi
              </p>
              <p className="text-sm font-bold uppercase text-slate-700">
                {AGENCIES[userData.agency_id] || "BMKG Jawa Barat"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-4">
            <KeyRound size={18} className="text-slate-400" />
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                Otoritas Sistem
              </p>
              <p className="text-sm font-bold uppercase text-slate-700">
                {userData.role === "superadmin"
                  ? "Super Admin"
                  : "Petugas Teknis"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="w-full rounded-md border border-slate-300 bg-white px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-blue-950 shadow-sm transition-colors hover:border-blue-950 hover:bg-slate-50"
        >
          Ganti Password Keamanan
        </button>
      </div>

      {/* MODAL UBAH PROFIL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsProfileModalOpen(false)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-lg bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-950">
                Update Informasi Petugas
              </h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Nama Lengkap
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-blue-950 focus:border-blue-950 outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Username
                </label>
                <input
                  required
                  type="text"
                  name="username"
                  value={profileForm.username}
                  onChange={handleProfileChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-blue-950 focus:border-blue-950 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 rounded-md border border-slate-300 bg-white py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-md bg-blue-950 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md"
                >
                  {isSaving ? "PROSES..." : "SIMPAN"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GANTI PASSWORD */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsPasswordModalOpen(false)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-lg bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-950">
                Update Password
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            {errorMessage && (
              <div className="mb-5 rounded-md border border-rose-200 bg-rose-50 p-3 text-center text-[10px] font-bold uppercase text-rose-700">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSavePassword} className="space-y-4">
              {["current", "new", "confirm"].map((f) => (
                <div key={f}>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {f === "current"
                      ? "Password Saat Ini"
                      : f === "new"
                        ? "Password Baru"
                        : "Konfirmasi Password Baru"}
                  </label>
                  <div className="relative">
                    <Lock
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                    />
                    <input
                      required
                      type="password"
                      name={f}
                      value={passwordForm[f as keyof typeof passwordForm]}
                      onChange={handlePasswordChange}
                      className="w-full rounded-md border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-bold text-blue-950 focus:border-blue-950 outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 rounded-md border border-slate-300 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-md bg-blue-950 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md"
                >
                  {isSaving ? "PROSES..." : "SIMPAN"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
