"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Definisikan ulang interface di sini agar MapWrapper tidak perlu mencari file luar
export interface IntegratedPrediction {
  id: string | number;
  area: string;
  status: "normal" | "waspada" | "siaga" | "awas";
  date: string;
  rainfall: string;
  temp: string;
  wind: string;
  postName: string;
  waterDischarge: string;
  waterLevel: string;
  coords: [number, number];
  isFloodPredicted: boolean;
}

const MapLoading = () => (
  <div className="w-full h-full bg-white flex flex-col items-center justify-center gap-3 border border-slate-100">
    <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
    <span className="text-xs font-medium text-slate-500 animate-pulse">
      Menghubungkan ke Model AI...
    </span>
  </div>
);

// Load FloodMap secara dinamis
const FloodMap = dynamic(() => import("./FloodMap"), {
  ssr: false,
  loading: () => <MapLoading />,
});

// Terima data langsung lewat props
export const MapWrapper = ({ data, isLoading }: { data: IntegratedPrediction[]; isLoading: boolean }) => {
  if (isLoading) return <MapLoading />;
  return <FloodMap predictionData={data} />;
};