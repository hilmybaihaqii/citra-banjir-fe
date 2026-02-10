import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Citra Banjir",
  description: "Sistem Peringatan Dini Banjir Kabupaten Bandung",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 flex flex-col h-dvh`}>
        <Navbar />
        <main className="flex-1 relative w-full overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
