"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  Lock,
  User,
  Briefcase,
  Activity,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import { Outfit } from "next/font/google";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const AGENCIES: Record<string, string> = {
  "CITRA_BANJIR": "Citra Banjir Pusat",
  "BBWS": "BBWS Citarum",
  "BPBD_JABAR": "BPBD Provinsi Jawa Barat",
  "BPBD_KAB": "BPBD Kab. Bandung",
  "BMKG": "BMKG Jawa Barat",
};

export default function BBWSSettingsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [userData, setUserData] = useState<{
    id: number;
    email: string;
    username?: string;
    name: string;
    role: string;
    agency: string | null;
  } | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [nameForm, setNameForm] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    new: "",
    confirm: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
  };

  useEffect(() => {
    setIsMounted(true);
    
    const fetchProfile = async () => {
      // GANTI: Membaca session dari Cookies, bukan localStorage
      const savedUserStr = Cookies.get("user_session");
      const token = Cookies.get("auth_token");

      if (savedUserStr && token) {
        try {
          const parsedUser = JSON.parse(savedUserStr);
          
          const res = await fetch(`${baseUrl}/users/${parsedUser.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const responseData = await res.json();

          if (res.ok && responseData.success) {
            const freshUser = responseData.data;
            setUserData(freshUser);
            setNameForm(freshUser.name || "");
            
            // GANTI: Memperbarui session di Cookies
            Cookies.set("user_session", JSON.stringify(freshUser), { path: "/" });
          } else {
            setUserData(parsedUser);
            setNameForm(parsedUser.name || "");
          }
        } catch (error) {
          console.error("Gagal menarik data profil:", error);
          const parsedUser = JSON.parse(savedUserStr);
          setUserData(parsedUser);
          setNameForm(parsedUser.name || "");
        } finally {
          setIsLoadingData(false);
        }
      } else {
        setIsLoadingData(false);
      }
    };

    fetchProfile();
  }, [baseUrl]);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    setIsSaving(true);
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch(`${baseUrl}/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nameForm }), 
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Gagal memperbarui nama.");

      const updatedUser = { ...userData, name: nameForm };
      setUserData(updatedUser);
      
      // GANTI: Perbarui data nama di cookie agar langsung berefek pada header/sidebar
      Cookies.set("user_session", JSON.stringify(updatedUser), { path: "/" });

      setIsProfileModalOpen(false);
      showToast("Nama berhasil diperbarui.", "success");
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Terjadi kesalahan sistem.";
      showToast(errMsg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    if (passwordForm.new !== passwordForm.confirm) {
      showToast("Konfirmasi password tidak cocok.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch(`${baseUrl}/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: passwordForm.new }), 
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Gagal memperbarui password.");

      closePasswordModal();
      showToast("Password berhasil diperbarui.", "success");
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Terjadi kesalahan sistem.";
      showToast(errMsg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordForm({ new: "", confirm: "" });
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  if (!isMounted) return null;

  if (isLoadingData || !userData) {
    return (
      <div className={`flex h-full w-full items-center justify-center ${outfit.className}`}>
        <LoadingSpinner message="Memuat profil BBWS..." />
      </div>
    );
  }

  return (
    <div className={`mx-auto flex w-full max-w-xl flex-col pb-12 lg:pb-8 relative ${outfit.className}`}>
      
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={`fixed z-200 flex items-center gap-3 rounded-sm border px-4 py-3.5 shadow-xl backdrop-blur-md bottom-20 left-4 right-4 sm:bottom-10 sm:left-auto sm:right-10 sm:max-w-md ${
              toast.type === "success"
                ? "border-emerald-200/60 bg-emerald-50/95 text-emerald-700"
                : "border-rose-200/60 bg-rose-50/95 text-rose-700"
            }`}
          >
            {toast.type === "success" ? (
              <ShieldCheck size={20} className="shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle size={20} className="shrink-0 text-rose-600" />
            )}
            <p className="text-sm font-medium tracking-wide">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 flex flex-col items-center">
        <h1 className="mb-8 text-xl font-medium uppercase tracking-tight text-slate-900 text-center">
          Pengaturan Akun
        </h1>
        <div className="flex h-24 w-24 flex-col items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 text-slate-600">
          <span className="text-3xl font-medium uppercase tracking-widest">
            {userData.name ? userData.name.substring(0, 2) : "BW"}
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        <div
          onClick={() => setIsProfileModalOpen(true)}
          className="group flex cursor-pointer items-center justify-between rounded-sm border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300"
        >
          <div className="flex items-center gap-4">
            <User size={18} className="text-slate-400" />
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-400">
                Nama Lengkap
              </p>
              <p className="text-sm font-medium text-slate-900">
                {userData.name}
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
            Ubah
          </span>
        </div>

        <div className="flex items-center justify-between rounded-sm border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-4">
            <Activity size={18} className="text-slate-400" />
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-400">
                Email
              </p>
              <p className="text-sm font-medium text-slate-700">
                {userData.email || userData.username}
              </p>
            </div>
          </div>
          <Lock size={14} className="text-slate-300" />
        </div>

        <div className="flex items-center justify-between rounded-sm border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-4">
            <Briefcase size={18} className="text-slate-400" />
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-400">
                Instansi
              </p>
              <p className="text-sm font-medium text-slate-700">
                {userData.agency ? (AGENCIES[userData.agency] || userData.agency) : "BBWS Citarum"}
              </p>
            </div>
          </div>
          <Lock size={14} className="text-slate-300" />
        </div>

        <div className="flex items-center justify-between rounded-sm border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-4">
            <ShieldCheck size={18} className="text-slate-400" />
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-400">
                Akses
              </p>
              <p className="text-sm font-medium text-slate-700">
                {userData.role.replace("_", " ")}
              </p>
            </div>
          </div>
          <Lock size={14} className="text-slate-300" />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 rounded-sm border border-slate-300 bg-white px-6 py-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Ubah Password
        </button>
      </div>

      {/* MODAL UBAH NAMA LENGKAP */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsProfileModalOpen(false)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-sm bg-white p-6 shadow-xl border border-slate-200">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-medium text-slate-900">
                Ubah Nama Lengkap
              </h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="rounded-sm p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveName} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-slate-500">
                  Nama Lengkap
                </label>
                <input
                  required
                  type="text"
                  value={nameForm}
                  onChange={(e) => setNameForm(e.target.value)}
                  className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  disabled={isSaving}
                  className="rounded-sm border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-600 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex min-w-22.5 items-center justify-center gap-2 rounded-sm bg-slate-900 px-4 py-2 text-xs font-medium text-white disabled:opacity-70"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : "Simpan"}
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
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={closePasswordModal}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-sm bg-white p-6 shadow-xl border border-slate-200">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-medium text-slate-900">
                Ubah Password
              </h3>
              <button
                onClick={closePasswordModal}
                className="rounded-sm p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-slate-500">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    required
                    type={showNewPassword ? "text" : "password"}
                    name="new"
                    value={passwordForm.new}
                    onChange={handlePasswordChange}
                    className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 focus:border-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-slate-500">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm"
                    value={passwordForm.confirm}
                    onChange={handlePasswordChange}
                    className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 focus:border-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={isSaving}
                  className="rounded-sm border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-600 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex min-w-22.5 items-center justify-center gap-2 rounded-sm bg-slate-900 px-4 py-2 text-xs font-medium text-white disabled:opacity-70"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}