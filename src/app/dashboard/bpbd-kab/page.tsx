"use client";

import React, { useState, useEffect } from "react";
import { MapPinned, Users, AlertTriangle, Siren } from "lucide-react";

export default function BPBDKabBandungDashboard() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const formatDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      setCurrentDate(now.toLocaleDateString("id-ID", options));
    };
    formatDate();
  }, []);

  return (
    <>
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tight">
            Situasi Kabupaten
          </h1>
          <p className="text-slate-500 text-sm mt-1 tracking-wide">
            Laporan Kebencanaan Wilayah Kabupaten Bandung
          </p>
        </div>
        <div className="text-[10px] bg-white text-blue-700 px-4 py-2 rounded-md font-bold uppercase tracking-widest border border-slate-200 shadow-sm">
          <span className="text-slate-400 mr-2">Update Terakhir:</span>{" "}
          {currentDate}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 border-l-4 border-l-amber-400">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Titik Terdampak
            </p>
            <MapPinned size={16} className="text-amber-400" />
          </div>
          <h3 className="text-3xl font-black text-blue-950 tracking-tighter">
            8{" "}
            <span className="text-sm font-normal text-slate-400 ml-1">
              Lokasi
            </span>
          </h3>
        </div>

        <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 border-l-4 border-l-blue-950">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total Pengungsi
            </p>
            <Users size={16} className="text-blue-950" />
          </div>
          <h3 className="text-3xl font-black text-blue-950 tracking-tighter">
            84{" "}
            <span className="text-sm font-normal text-slate-400 ml-1">
              Jiwa
            </span>
          </h3>
        </div>

        <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Status Siaga
            </p>
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <h3 className="text-3xl font-black text-red-600 tracking-tighter">
            WASPADA
          </h3>
        </div>
      </div>

      <div className="mt-10 bg-white border border-slate-200 rounded-sm p-10 md:p-20 flex flex-col items-center justify-center border-dashed">
        <div className="p-4 bg-slate-50 rounded-full mb-4">
          <Siren size={40} className="text-slate-200" />
        </div>
        <p className="text-slate-400 italic text-sm text-center">
          Panel operasional Pusdalops Kabupaten Bandung. <br />
          Lakukan pembaruan data berkala untuk sinkronisasi dengan tingkat
          Provinsi.
        </p>
      </div>
    </>
  );
}