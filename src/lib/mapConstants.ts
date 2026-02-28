// lib/mapConstants.ts
import { BarChart3, ShieldAlert, Users, Home, Building2, MapPin, AlertTriangle } from "lucide-react";

export const MODAL_CONFIG = {
  data: {
    title: "Laporan Data Kejadian",
    subtitle: "Data terkini luapan Sungai Citarum (Siaga 1).",
    icon: BarChart3,
    color: "blue",
    stats: [
      { label: "Total Insiden", value: "128", unit: "Lokasi", icon: AlertTriangle, iconColor: "text-blue-600", bg: "bg-blue-100" },
      { label: "Wilayah", value: "5", unit: "Kecamatan", icon: MapPin, iconColor: "text-cyan-600", bg: "bg-cyan-100" },
      { label: "Tim Lapangan", value: "145", unit: "Personil", icon: Users, iconColor: "text-indigo-600", bg: "bg-indigo-100" },
    ]
  },
  dampak: {
    title: "Analisis Dampak",
    subtitle: "Kerusakan infrastruktur dan dampak sosial.",
    icon: ShieldAlert,
    color: "rose",
    stats: [
      { label: "Jiwa Terdampak", value: "14.2K", unit: "Jiwa", icon: Users, iconColor: "text-rose-500", bg: "bg-rose-100" },
      { label: "Rumah Terendam", value: "2.8K", unit: "Unit", icon: Home, iconColor: "text-orange-500", bg: "bg-orange-100" },
      { label: "Fasilitas Umum", value: "27", unit: "Unit", icon: Building2, iconColor: "text-blue-500", bg: "bg-blue-100" }, // Total dari 12+8+2+5
      { label: "Rusak Berat", value: "142", unit: "Rumah", icon: AlertTriangle, iconColor: "text-slate-500", bg: "bg-slate-100" },
    ]
  }
};