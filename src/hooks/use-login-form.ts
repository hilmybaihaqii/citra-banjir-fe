"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Agency } from "@/types";

export const useLoginForm = (isOpen: boolean, onClose: () => void) => {
  const router = useRouter();
  const [step, setStep] = useState<"agency" | "form">("agency");
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          agency_id: selectedAgency?.id
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login gagal.");
      }

      localStorage.setItem("user_session", JSON.stringify(data.user));
      localStorage.setItem("auth_token", data.token);

      onClose();
      if (selectedAgency) {
        router.push(selectedAgency.path);
      }

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setStep("agency");
    setError("");
    setUsername("");
    setPassword("");
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