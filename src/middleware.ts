// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Ambil Token dari Cookies (Bukan LocalStorage, karena Middleware jalan di server)
  const token = request.cookies.get("auth_token");
  
  // 2. Cek apakah user sedang membuka halaman dashboard
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");
  
  // 3. LOGIKA PROTEKSI:
  // Jika mau masuk Dashboard TAPI tidak punya token => TENDANG KE LOGIN
  if (isDashboardPage && !token) {
    const url = new URL("/", request.url); // Redirect ke halaman login (root)
    return NextResponse.redirect(url);
  }

  // 4. (Opsional) PROTEKSI SILANG INSTANSI (RBAC)
  // Mencegah user BBWS masuk ke /dashboard/bpbd
  // Ini butuh token yang bisa didecode (JWT), untuk sekarang kita skip dulu agar tidak pusing.
  // Yang penting login dulu.

  return NextResponse.next();
}

// Tentukan halaman mana saja yang dijaga oleh Satpam ini
export const config = {
  matcher: ["/dashboard/:path*"], // Semua yang berawalan /dashboard DIKUNCI
};