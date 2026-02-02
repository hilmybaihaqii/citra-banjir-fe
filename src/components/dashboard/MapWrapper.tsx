"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const MapLoading = () => (
  <div className="w-full h-full bg-white flex flex-col items-center justify-center gap-3 border border-slate-100">
    <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
    <span className="text-xs font-medium text-slate-500 animate-pulse">
      Loading data...
    </span>
  </div>
);

const FloodMap = dynamic(() => import("./FloodMap"), {
  ssr: false,
  loading: () => <MapLoading />,
});

export const MapWrapper = () => {
  return <FloodMap />;
};