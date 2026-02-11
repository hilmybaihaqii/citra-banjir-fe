"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Agency } from "@/types";

export const useLoginForm = (isOpen: boolean, onClose: () => void) => {
  const router = useRouter();

  // --- STATE ---
  const [step, setStep] = useState<"agency" | "form">("agency");
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Reset form saat modal tutup
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStep("agency");
        setSelectedAgency(null);
        setUsername("");
        setPassword("");
        setError("");
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const selectAgency = (agency: Agency) => {
    setSelectedAgency(agency);
    setStep("form");
    setError("");
  };

  const goBack = () => {
    setStep("agency");
    setError("");
    setUsername("");
    setPassword("");
  };

  // --- LOGIKA LOGIN SEDERHANA ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Hit API Login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          agency_id: selectedAgency?.id, // Opsional
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login gagal.");
      }

      // 2. Simpan Data User di LocalStorage (Supaya Dashboard tahu siapa yang login)
      localStorage.setItem("user_session", JSON.stringify(data.user));
      localStorage.setItem("auth_token", data.token); // Disimpan buat request API nanti

      // 3. Tentukan Tujuan (Logic Routing)
      // Kita ambil dari response server biar akurat
      const roleOrAgency = data.user.agency_id || data.user.agencyId; 
      
      let targetPath = "/dashboard/admin"; // Default

      switch (roleOrAgency) {
        case "bbws":
          targetPath = "/dashboard/bbws";
          break;
        case "bpbd":
          targetPath = "/dashboard/bpbd";
          break;
        case "bmkg":
          targetPath = "/dashboard/bmkg";
          break;
        case "admin":
          targetPath = "/dashboard/admin";
          break;
        default:
          targetPath = "/dashboard/admin";
          break;
      }

      console.log("Login Sukses! Mengarahkan ke:", targetPath);

      // 4. PINDAH HALAMAN (Tanpa mikirin cookie)
      onClose(); // Tutup modal biar bersih
      router.push(targetPath); 

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan sistem.");
      setIsLoading(false); // Stop loading kalau error
    } 
    // Note: Kalau sukses, biarkan loading true sampai halaman berpindah agar user gak klik 2x
  };

  return {
    step,
    selectedAgency,
    username, setUsername,
    password, setPassword,
    isLoading,
    error,
    showPassword, setShowPassword,
    selectAgency,
    handleSubmit,
    goBack,
  };
};