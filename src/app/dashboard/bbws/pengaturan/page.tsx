"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Camera,
  ShieldCheck,
  KeyRound,
  User,
  Mail,
  Lock,
} from "lucide-react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const AGENCIES: Record<string, string> = {
  bbws: "BBWS Citarum",
  bpbd: "BPBD Jawa Barat",
  bmkg: "BMKG Jawa Barat",
};

export default function BBWSSettingsPage() {
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
        setProfileForm({
          name: parsed.name || parsed.username,
          username: parsed.username,
        });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
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
        window.dispatchEvent(new Event("storage"));
      }
      setIsProfileModalOpen(false);
      setSuccessMessage("Profil BBWS Citarum diperbarui!");
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
      setSuccessMessage("Password berhasil diganti!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  const getRoleLabel = (role: string) => {
    return role === "superadmin"
      ? "Kepala Balai / Super Admin"
      : "Petugas Operasional";
  };

  if (!isMounted || !userData) return null;

  return (
    <div
      className={`mx-auto flex w-full max-w-xl flex-col pb-12 animate-in fade-in duration-500 ${outfit.className}`}
    >
      {/* Toast Notification */}
      <div
        className={`fixed left-1/2 top-6 z-100 -translate-x-1/2 rounded-md border border-emerald-200 bg-emerald-50 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-emerald-600 shadow-xl transition-all duration-300 ${successMessage ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-8 opacity-0"}`}
      >
        {successMessage}
      </div>

      <div className="mb-10 flex flex-col items-center">
        <h1 className="mb-8 text-2xl font-black uppercase tracking-tight text-blue-950 text-center">
          Pengaturan Akun BBWS
        </h1>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex h-32 w-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <span className="text-4xl font-black uppercase text-slate-400 group-hover:opacity-0 transition-opacity">
            {userData.name ? userData.name.substring(0, 2) : "BB"}
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

      <div className="flex flex-col gap-4">
        <div
          onClick={() => setIsProfileModalOpen(true)}
          className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-600 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
              <User
                size={18}
                className="text-slate-400 group-hover:text-blue-600"
              />
            </div>
            <div>
              <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                Nama Petugas Balai
              </p>
              <p className="text-sm font-black uppercase text-blue-950">
                {userData.name || userData.username}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
            Ubah
          </span>
        </div>

        <div
          onClick={() => setIsProfileModalOpen(true)}
          className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-600 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
              <Mail
                size={18}
                className="text-slate-400 group-hover:text-blue-600"
              />
            </div>
            <div>
              <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                ID Kredensial
              </p>
              <p className="text-base font-black text-blue-950">
                @{userData.username}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
            Ubah
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-5">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-lg border border-slate-100">
              <ShieldCheck size={18} className="text-blue-600 opacity-60" />
            </div>
            <div>
              <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                Instansi Afiliasi
              </p>
              <p className="text-sm font-bold uppercase text-slate-700">
                {AGENCIES[userData.agency_id] || "BBWS Citarum"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-5">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-lg border border-slate-100">
              <KeyRound size={18} className="text-blue-600 opacity-60" />
            </div>
            <div>
              <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                Otoritas Sistem
              </p>
              <p className="text-sm font-bold uppercase text-slate-700">
                {getRoleLabel(userData.role)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <button
          onClick={() => {
            setPasswordForm({ current: "", new: "", confirm: "" });
            setErrorMessage("");
            setIsPasswordModalOpen(true);
          }}
          className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-slate-200 bg-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-950 shadow-sm transition-all hover:bg-blue-950 hover:text-white hover:border-blue-950 active:scale-95"
        >
          <KeyRound size={16} /> Ganti Password Keamanan
        </button>
      </div>

      {/* Modal Profile */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm"
            onClick={() => setIsProfileModalOpen(false)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-950">
                Update Profil
              </h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                  Nama Lengkap
                </label>
                <input
                  required
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-blue-950 focus:border-blue-950 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                  Username
                </label>
                <input
                  required
                  type="text"
                  value={profileForm.username}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, username: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-blue-950 focus:border-blue-950 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 rounded-lg border border-slate-200 py-3 text-[10px] font-black uppercase text-slate-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-lg bg-blue-950 py-3 text-[10px] font-black uppercase text-white shadow-lg disabled:opacity-50"
                >
                  {isSaving ? "MEMPROSES..." : "SIMPAN"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Password */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm"
            onClick={() => setIsPasswordModalOpen(false)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-950">
                Ganti Password
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            {errorMessage && (
              <div className="mb-4 rounded bg-rose-50 p-3 text-[10px] font-bold uppercase text-rose-600 text-center border border-rose-100">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSavePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase text-slate-400 ml-1">
                  Password Baru
                </label>
                <div className="relative">
                  <Lock
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                  />
                  <input
                    required
                    type="password"
                    name="new"
                    value={passwordForm.new}
                    onChange={handlePasswordChange}
                    className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-bold text-blue-950 outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase text-slate-400 ml-1">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <Lock
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                  />
                  <input
                    required
                    type="password"
                    name="confirm"
                    value={passwordForm.confirm}
                    onChange={handlePasswordChange}
                    className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-bold text-blue-950 outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full mt-4 rounded-lg bg-blue-950 py-3 text-[10px] font-black uppercase text-white shadow-lg active:scale-95 disabled:opacity-50"
              >
                {isSaving ? "MEMPROSES..." : "UPDATE PASSWORD"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
