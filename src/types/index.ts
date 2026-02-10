export type UserRole = "superadmin" | "admin" | "viewer";

export interface Agency {
  id: string;
  label: string;
  color: string;
  logo: string;
  path: string;
}

export interface User {
  username: string;
  password: string;
  name: string;
  agencyId: string;
  role: UserRole;
}

export interface UserSession {
  username: string;
  name: string;
  agencyId: string;
  role: UserRole;
  token?: string;
}