"use client";

import React, { useState, useEffect } from "react";
import { MapPinned, Users, AlertTriangle, Siren } from "lucide-react";

export default function BPBDDashboardHome() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Set Tanggal Real-time hanya untuk tampilan header halaman ini
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
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tight">
            Situasi Terkini
          </h1>
          <p className="text-slate-500 text-sm mt-1 tracking-wide">
            Laporan Kebencanaan Wilayah Jawa Barat
          </p>
        </div>
        <div className="text-[10px] bg-white text-blue-700 px-4 py-2 rounded-md font-bold uppercase tracking-widest border border-slate-200 shadow-sm flex items-center">
          <span className="text-slate-400 mr-2">Update Terakhir:</span>{" "}
          {currentDate}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1: Daerah Terdampak */}
        <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 border-l-4 border-l-amber-400">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Area Terdampak
            </p>
            <MapPinned size={16} className="text-amber-400" />
          </div>
          <h3 className="text-3xl font-black text-blue-950 tracking-tighter">
            3{" "}
            <span className="text-sm font-normal text-slate-400 ml-1">
              Kecamatan
            </span>
          </h3>
        </div>

        {/* CARD 2: Jumlah Pengungsi */}
        <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 border-l-4 border-l-blue-950">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total Pengungsi
            </p>
            <Users size={16} className="text-blue-950" />
          </div>
          <h3 className="text-3xl font-black text-blue-950 tracking-tighter">
            128{" "}
            <span className="text-sm font-normal text-slate-400 ml-1">
              Jiwa
            </span>
          </h3>
        </div>

        {/* CARD 3: Status Bencana */}
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

      <div className="mt-10 bg-white border border-slate-200 rounded-sm p-20 flex flex-col items-center justify-center border-dashed">
        <div className="p-4 bg-slate-50 rounded-full mb-4">
          <Siren size={40} className="text-slate-200" />
        </div>
        <p className="text-slate-400 italic text-sm text-center">
          Pilih menu <b>Update Wilayah</b> di samping kiri untuk melaporkan
          kondisi banjir baru <br />
          atau masuk ke <b>Semua Laporan</b> untuk melihat rinciannya.
        </p>
      </div>
    </>
  );
}