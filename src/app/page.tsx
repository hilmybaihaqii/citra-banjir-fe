"use client";

import React, { useState } from "react";
import { MapWrapper } from "@/components/dashboard/MapWrapper";
import { PredictionButton } from "@/components/dashboard/PredictionButton";
import { PredictionModal } from "@/components/dashboard/PredictionModal";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Container utama (Peta) */}
      <div className="w-full h-full relative z-0 bg-slate-50 overflow-hidden">
        <PredictionButton onClick={() => setIsModalOpen(true)} />
        <MapWrapper />  
      </div>

      {/* Modal ditaruh di LUAR overflow-hidden agar bisa menutupi Navbar & Ticker */}
      <PredictionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}