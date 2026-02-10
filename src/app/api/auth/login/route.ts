import { NextResponse } from "next/server";
import { MOCK_USERS } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, agency_id } = body;

    if (!username || !password || !agency_id) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap." },
        { status: 400 }
      );
    }

    const user = MOCK_USERS.find((u) => u.username === username);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Username atau Password salah." },
        { status: 401 }
      );
    }

    const isGlobalAdmin = user.agencyId === 'admin';
    
    if (!isGlobalAdmin && user.agencyId !== agency_id) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Akses Ditolak. Akun ini hanya untuk portal ${user.agencyId.toUpperCase()}.` 
        },
        { status: 403 }
      );
    }

    const { password: _, ...userSession } = user;

    return NextResponse.json({
      success: true,
      user: userSession,
      token: "mock-jwt-token-xyz-123"
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}