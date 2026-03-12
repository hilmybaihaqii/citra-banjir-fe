"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export const useLoginForm = (isOpen: boolean, onClose: () => void) => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setEmail("");
        setPassword("");
        setError("");
        setIsLoading(false);
        setShowPassword(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email, 
          password: password,
        }),
      });

      const responseData = await res.json();

      if (!res.ok || !responseData.success) {
        throw new Error(responseData.message || "Email atau password yang Anda masukkan salah.");
      }

      const userData = responseData.data;
      const token = responseData.token;

      let expiresAt: Date | number = 1;
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          if (payload.exp) {
            expiresAt = new Date(payload.exp * 1000);
          }
        }
      } catch (decodeErr) {
        console.error("Gagal membaca waktu expired token:", decodeErr);
      }

      Cookies.set("user_session", JSON.stringify(userData), { expires: expiresAt, path: "/" });
      Cookies.set("auth_token", token, { expires: expiresAt, path: "/" });
      const userAgency = userData.agency || "";
      let targetPath = "/dashboard/admin";
      
      switch (userAgency) {
        case "BBWS":
          targetPath = "/dashboard/bbws";
          break;
        case "BPBD_JABAR":
          targetPath = "/dashboard/bpbd-jabar";
          break;
        case "BPBD_KAB":
          targetPath = "/dashboard/bpbd-kab";
          break;
        case "BMKG":
          targetPath = "/dashboard/bmkg";
          break;
        case "CITRA_BANJIR":
          targetPath = "/dashboard/admin";
          break;
        default:
          targetPath = "/dashboard/admin";
      }

      console.log("Login Success! Redirect to:", targetPath);
      onClose();
      window.location.href = targetPath;

    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan sistem. Coba lagi nanti.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    showPassword,
    setShowPassword,
    handleSubmit,
  };
};