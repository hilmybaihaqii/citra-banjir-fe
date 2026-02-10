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
  // --- BBWS USERS ---
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

  // --- BPBD USERS ---
  {
    username: "super_bpbd",
    password: "123",
    name: "Komandan BPBD",
    agencyId: "bpbd",
    role: "superadmin"
  },

  // --- BMKG USERS ---
  {
    username: "super_bmkg",
    password: "123",
    name: "Kepala BMKG",
    agencyId: "bmkg",
    role: "superadmin"
  },

  // --- GLOBAL ADMIN ---
  {
    username: "root",
    password: "123",
    name: "Developer Pusat",
    agencyId: "admin",
    role: "superadmin"
  }
];