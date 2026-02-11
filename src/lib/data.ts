import { Agency, User } from "@/types";

export const AGENCIES: Agency[] = [
  { 
    id: "bbws", 
    label: "BBWS Citarum", 
    color: "bg-blue-500", 
    logo: "/images/bbws.png", 
    path: "/dashboard/bbws" 
  },
  { 
    id: "bpbd", 
    label: "BPBD Jabar", 
    color: "bg-orange-500", 
    logo: "/images/BPBD.png", 
    path: "/dashboard/bpbd" 
  },
  { 
    id: "bmkg", 
    label: "BMKG", 
    color: "bg-emerald-500", 
    logo: "/images/BMKG.png", 
    path: "/dashboard/bmkg" 
  },
  { 
    id: "admin", 
    label: "Super Admin", 
    color: "bg-indigo-500", 
    logo: "/images/citrabanjir.png", 
    path: "/dashboard/admin" 
  },
];

// Database User Dummy
export const MOCK_USERS: User[] = [
  // --- 1. BBWS USERS ---
  {
    username: "super_bbws",
    password: "123",
    name: "Kepala BBWS",
    agencyId: "bbws",
    role: "superadmin"
  },
  {
    username: "staff_bbws",
    password: "123",
    name: "Operator BBWS",
    agencyId: "bbws",
    role: "admin"
  },

  // --- 2. BPBD USERS ---
  {
    username: "super_bpbd",
    password: "123",
    name: "Komandan BPBD",
    agencyId: "bpbd",
    role: "superadmin"
  },
  {
    username: "staff_bpbd",
    password: "123",
    name: "Petugas Lapangan BPBD",
    agencyId: "bpbd",
    role: "admin"
  },

  {
    username: "super_bmkg",
    password: "123",
    name: "Kepala BMKG",
    agencyId: "bmkg",
    role: "superadmin"
  },
  {
    username: "staff_bmkg",
    password: "123",
    name: "Staff Analis BMKG",
    agencyId: "bmkg",
    role: "admin"
  },

  // --- 4. ADMIN (Citra Banjir Pusat) ---
  {
    username: "root",
    password: "123",
    name: "Developer Pusat",
    agencyId: "admin",
    role: "superadmin"
  },
  {
    username: "staff_admin",
    password: "123",
    name: "Admin Moderator",
    agencyId: "admin",
    role: "admin"
  }
];