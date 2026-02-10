"use client";
import { CloudRain } from "lucide-react";

export default function BMKGPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6 text-emerald-600">
        <CloudRain size={40} />
        <h1 className="text-2xl font-bold uppercase tracking-widest">Dashboard Admin</h1>
      </div>
      <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
        <p>LOG DATA SEMUA AKAN ADA DISINI</p>
      </div>
    </div>
  );
}