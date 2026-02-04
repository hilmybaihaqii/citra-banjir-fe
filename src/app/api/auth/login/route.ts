import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const USERS = [
      {
        username: "superuserbbws",
        password: "bbws",
        role: "BBWS",
        name: "Superuser BBWS Citarum",
        logo: "/images/bbws-logo.jpg",
      },
      //   {
      //     username: "adminbmkg",
      //     password: "bmkg",
      //     role: "BMKG",
      //     name: "Admin BMKG Jawa Barat",
      //     logo: "/logos/bmkg-logo.png",
      //   },
    ];

    const user = USERS.find(
      (u) => u.username === username && u.password === password,
    );

    if (user) {
      return NextResponse.json({
        success: true,
        user: {
          username: user.username,
          name: user.name,
          role: user.role,
          logo: user.logo,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: "Username atau Password salah!" },
      { status: 401 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
