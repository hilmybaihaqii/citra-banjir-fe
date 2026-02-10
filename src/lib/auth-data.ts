// lib/auth-data.ts

export type UserRole = "BBWS" | "BPBD" | "BMKG" | "SUPERADMIN";

export interface User {
  username: string;
  password: string;
  role: UserRole;
  name: string;
  agency_id: string;
}

export const USERS: User[] = [
  // 1. Pihak BBWS Citarum
  {
    username: "adminbbws",
    password: "bbws123", 
    role: "BBWS",
    name: "Admin BBWS Citarum",
    agency_id: "bbws",
  },
  // 2. Pihak BPBD Jabar
  {
    username: "adminbpbd",
    password: "bpbd123",
    role: "BPBD",
    name: "Operator BPBD Jawa Barat",
    agency_id: "bpbd",
  },
  // 3. BMKG Jabar
  {
    username: "adminbmkg",
    password: "bmkg123",
    role: "BMKG",
    name: "Petugas BMKG Jabar",
    agency_id: "bmkg",
  },
  // 4. Pihak Citra Banjir
  {
    username: "superadmin",
    password: "admin123",
    role: "SUPERADMIN",
    name: "Super Admin Citra Banjir",
    agency_id: "admin",
  },
];

export const findUser = (username: string) => {
  return USERS.find((u) => u.username === username);
};