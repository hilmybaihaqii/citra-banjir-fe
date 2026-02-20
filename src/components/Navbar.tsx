"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { Outfit } from "next/font/google";
import {
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Droplets,
  Home,
  PieChart,
  AlertTriangle,
  Phone,
  MessageSquare,
} from "lucide-react";

import { LoginForm } from "@/components/LoginForm";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
});

interface SubLink {
  href: string;
  label: string;
}

interface NavLinkItem {
  href?: string;
  label: string;
  icon: React.ElementType;
  subLinks?: SubLink[];
}

const NAV_LINKS: NavLinkItem[] = [
  { href: "/", label: "Beranda", icon: Home },
  {
    label: "Infografis Bencana",
    icon: PieChart,
    subLinks: [
      { href: "/infografis/data-infografis", label: "Data Kejadian Banjir" },
      { href: "/infografis/peta-informasi", label: "Peta Informasi Banjir" },
    ],
  },
  { href: "/lapor", label: "Lapor", icon: AlertTriangle },
  { href: "/kontak", label: "Kontak", icon: Phone },
  { href: "/saran", label: "Masukan & Saran", icon: MessageSquare },
];

const BackgroundPattern = () => {
  const topoSVG = `data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E`;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-blue-950">
      <div
        className="absolute inset-0 w-full h-full opacity-40"
        style={{
          backgroundImage: `url("${topoSVG}")`,
          backgroundSize: "60px 60px",
          backgroundRepeat: "repeat",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-950/40 to-blue-950/95"></div>
    </div>
  );
};

// --- 3. KOMPONEN NAVIGASI DESKTOP ---
const DesktopNavItem = ({ item, pathname }: { item: NavLinkItem; pathname: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = item.href 
    ? pathname === item.href 
    : item.subLinks?.some(link => pathname === link.href);

  return (
    <div 
      className="relative group h-full flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item.href ? (
        <Link href={item.href} className="relative px-3 py-2 flex items-center gap-1 group/link">
          <span className={`relative z-10 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 ${isActive ? "text-white" : "text-blue-100 group-hover/link:text-white"}`}>
            {item.label}
          </span>
          {isActive && (
            <motion.div layoutId="navbar-indicator" className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-400" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
          )}
          {!isActive && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-400 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover/link:scale-x-100" />
          )}
        </Link>
      ) : (
        <div className="relative px-3 py-2 flex items-center gap-1 cursor-pointer group/link">
          <span className={`relative z-10 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 ${isActive ? "text-white" : "text-blue-100 group-hover/link:text-white"}`}>
            {item.label}
          </span>
          <ChevronDown size={14} className={`text-blue-100 transition-transform duration-300 ${isHovered ? "rotate-180" : ""}`} />
          {isActive && (
            <motion.div layoutId="navbar-indicator" className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-400" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
          )}
          {!isActive && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-400 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover/link:scale-x-100" />
          )}
        </div>
      )}

      {item.subLinks && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-0 w-62.5 bg-blue-950 border-x border-b border-amber-500/20 rounded-b-md shadow-2xl overflow-hidden z-50"
            >
              <div className="py-2 flex flex-col">
                {item.subLinks.map((subLink) => (
                  <Link
                    key={subLink.href}
                    href={subLink.href}
                    className="group/sub relative px-5 py-3.5 flex items-center overflow-hidden transition-colors duration-200"
                  >
                    <div className={`absolute inset-0 transition-colors duration-200 ${pathname === subLink.href ? "bg-white/10" : "group-hover/sub:bg-white/5"}`} />
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-amber-400 transition-transform duration-300 origin-bottom ${pathname === subLink.href ? "scale-y-100" : "scale-y-0 group-hover/sub:scale-y-100"}`} />
                    
                    <span className={`relative z-10 text-[11.5px] font-semibold tracking-widest uppercase transition-all duration-300 ${
                      pathname === subLink.href
                        ? "text-amber-400 translate-x-2"
                        : "text-blue-100 group-hover/sub:text-white group-hover/sub:translate-x-2"
                    }`}>
                      {subLink.label}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

// --- KOMPONEN NAVIGASI MOBILE ---
const MobileNavItem = ({ item, pathname, onClick }: { item: NavLinkItem; pathname: string; onClick: () => void }) => {
  const [isSubOpen, setIsSubOpen] = useState(false);
  const isActive = item.href ? pathname === item.href : item.subLinks?.some(link => pathname === link.href);

  return (
    <div className="w-full">
      {item.href ? (
        <Link href={item.href} onClick={onClick} className="block w-full">
          <div className={`flex items-center justify-between p-3.5 rounded-md transition-colors border ${isActive ? "bg-blue-900 text-white border-blue-800" : "text-blue-100 border-transparent hover:bg-blue-900/50"}`}>
            <div className="flex items-center gap-3">
              <item.icon size={18} className={isActive ? "text-amber-400" : "text-blue-300"} />
              <span className="font-medium text-xs uppercase tracking-widest">{item.label}</span>
            </div>
            {isActive && <Droplets size={16} className="text-amber-400" />}
          </div>
        </Link>
      ) : (
        <div className="flex flex-col">
          <button onClick={() => setIsSubOpen(!isSubOpen)} className={`flex items-center justify-between p-3.5 rounded-md transition-colors border w-full text-left ${isActive ? "bg-blue-900 text-white border-blue-800" : "text-blue-100 border-transparent hover:bg-blue-900/50"}`}>
            <div className="flex items-center gap-3">
              <item.icon size={18} className={isActive ? "text-amber-400" : "text-blue-300"} />
              <span className="font-medium text-xs uppercase tracking-widest">{item.label}</span>
            </div>
            <motion.div animate={{ rotate: isSubOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={16} className="text-blue-300" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {isSubOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden ml-6 mt-1.5 flex flex-col gap-1 border-l-2 border-blue-800/50 pl-2"
              >
                {item.subLinks?.map((subLink) => (
                  <Link
                    key={subLink.href}
                    href={subLink.href}
                    onClick={onClick}
                    className={`block w-full p-3 rounded-md text-xs font-medium transition-colors ${pathname === subLink.href ? "text-amber-400 bg-blue-900/50" : "text-blue-200 hover:text-white hover:bg-blue-900/30"}`}
                  >
                    {subLink.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/dashboard")) return null;

  const mobileMenuVariants: Variants = {
    closed: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeInOut" } },
    open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`${outfit.className} fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-amber-500/80 bg-blue-950 ${
          scrolled || isOpen ? "shadow-lg" : ""
        }`}
      >
        <BackgroundPattern />
        
        <div className="w-full px-4 md:px-6 relative z-10 max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="hidden sm:flex items-center gap-3">
                  <div className="relative w-9 h-9"><Image src="/images/bbws.png" alt="Logo BBWS Citarum" fill className="object-contain" /></div>
                  <div className="relative w-9 h-9"><Image src="/images/BPBD.png" alt="Logo BPBD" fill className="object-contain" /></div>
                  <div className="relative w-9 h-9"><Image src="/images/BMKG.png" alt="Logo BMKG" fill className="object-contain" /></div>
                </div>
                <div className="w-px h-8 bg-white/20 mx-1 hidden sm:block"></div>
                
                <div className="flex items-center gap-2 pl-1">
                  <div className="w-10 h-10 relative flex items-center justify-center bg-blue-900 rounded-md border border-white/10 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                    <Image src="/images/citrabanjir.png" alt="Logo Citra Banjir" fill className="object-contain p-1.5" />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-white font-black tracking-tighter text-base italic uppercase">
                      Citra <span className="text-amber-400">Banjir</span>
                    </span>
                    <span className="text-[8px] mt-0.5 text-blue-200/80 uppercase tracking-[0.2em] font-bold">
                      Monitoring System
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* --- NAVIGASI DESKTOP --- */}
            <div className="hidden xl:flex items-center space-x-1 h-full">
              {NAV_LINKS.map((item, idx) => (
                <DesktopNavItem key={idx} item={item} pathname={pathname} />
              ))}
              <div className="w-px h-7 bg-white/20 mx-3"></div>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="relative px-5 py-2 font-semibold text-blue-950 bg-amber-400 rounded-sm border border-amber-300 hover:bg-amber-300 transition-all duration-300 active:scale-95 flex items-center gap-2"
              >
                <span className="text-xs uppercase tracking-widest">Login</span>
                <ChevronRight size={16} strokeWidth={3} />
              </button>
            </div>

            <div className="xl:hidden relative z-50">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-md transition-colors  focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* --- MOBILE MENU --- */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="xl:hidden absolute top-full left-0 right-0 bg-blue-950 border-b-4 border-amber-500 shadow-xl overflow-hidden"
            >
              <BackgroundPattern />
              <div className="relative px-4 pt-4 pb-8 space-y-2 z-10 max-h-[85vh] overflow-y-auto">
                {NAV_LINKS.map((item, idx) => (
                  <MobileNavItem key={idx} item={item} pathname={pathname} onClick={() => !item.subLinks && setIsOpen(false)} />
                ))}

                <button
                  onClick={() => { setIsOpen(false); setIsLoginOpen(true); }}
                  className="w-full py-3.5 mt-4 bg-amber-400 text-blue-950 font-bold rounded-md flex items-center justify-center gap-2 hover:bg-amber-300 uppercase text-xs tracking-widest transition-colors active:scale-95"
                >
                  Login
                  <ChevronRight size={18} strokeWidth={3} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 z-40 xl:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <LoginForm isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};