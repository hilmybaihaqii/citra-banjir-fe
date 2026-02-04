"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Droplets, Map, Phone, MessageSquarePlus, Home, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';
import { Outfit } from 'next/font/google';

// Import komponen LoginForm yang sudah dipisah
import { LoginForm } from '@/components/LoginForm';

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
});

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const BackgroundPattern = () => {
  const topoSVG = `data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E`;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-blue-950">
      <div 
        className="absolute inset-0 w-full h-full opacity-40"
        style={{
          backgroundImage: `url("${topoSVG}")`,
          backgroundSize: '60px 60px',
          backgroundRepeat: 'repeat',
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-950/40 to-blue-950/95"></div>
    </div>
  );
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false); // State untuk Popup Login
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mobileMenuVariants: Variants = {
    closed: { 
      opacity: 0, 
      height: 0, 
      transition: { duration: 0.3, ease: "easeInOut", when: "afterChildren" } 
    },
    open: { 
      opacity: 1, 
      height: "auto", 
      transition: { duration: 0.3, ease: "easeInOut", when: "beforeChildren", staggerChildren: 0.05 } 
    }
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${outfit.className} fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-amber-500/80 ${
          scrolled || isOpen 
            ? "shadow-2xl py-1"
            : "py-2"
        }`}
      >
        <BackgroundPattern />
        <div className="w-full px-4 md:px-6 relative z-10">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">

                <div className="relative hover:scale-110 transition-transform duration-300">
                    <div className="w-10 h-10 relative">
                      <Image 
                        src="/images/bbws.png" 
                        alt="Logo BBWS Citarum"
                        fill
                        className="object-contain drop-shadow-lg" 
                      />
                    </div>
                </div>

                <div className="relative hover:scale-110 transition-transform duration-300">
                    <div className="w-10 h-10 relative">
                      <Image 
                        src="/images/epics.png" 
                        alt=""
                        fill
                        className="object-contain drop-shadow-lg" 
                      />
                    </div>
                </div>

                <div className="flex items-center gap-3 pl-1">
                    <div className="relative group/logo hover:scale-105 transition-transform duration-300">
                      <div className="w-10 h-10 relative flex items-center justify-center">
                        <Image 
                            src="/images/citra-banjir.png" 
                            alt=""
                            fill
                            className="object-contain drop-shadow-xl" 
                        />
                      </div>
                      <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 -z-10 rounded-full"></div>
                    </div>
                </div>

              </Link>
            </div>
            <div className="hidden xl:flex items-center space-x-1">
              <DesktopNavLink href="/" active={pathname === "/"}>Beranda</DesktopNavLink>
              <DesktopNavLink href="/infografis" active={pathname === "/infografis"}>Infografis Bencana</DesktopNavLink>
              <DesktopNavLink href="/lapor" active={pathname === "/lapor"}>Lapor</DesktopNavLink>
              <DesktopNavLink href="/kontak" active={pathname === "/kontak"}>Kontak</DesktopNavLink>
              <DesktopNavLink href="/saran" active={pathname === "/saran"}>Masukan & Saran</DesktopNavLink>
              
              <div className="w-px h-6 bg-white/20 mx-2"></div>

              {/* Tombol Login Desktop - Membuka Modal */}
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="relative px-4 py-1.5 overflow-hidden font-semibold text-blue-950 bg-amber-400 rounded-md shadow-[0_0_15px_rgba(251,191,36,0.3)] group border border-amber-300 hover:bg-amber-300 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="relative flex items-center gap-2 text-[10px] uppercase tracking-widest">
                  Login<ChevronRight size={14} strokeWidth={3} />
                </span>
              </button>
            </div>

            <div className="xl:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-md transition-colors border border-white/20 shadow-sm"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="xl:hidden overflow-hidden bg-blue-950 relative z-20 border-b-4 border-amber-500 shadow-2xl"
            >
              <BackgroundPattern />

              <div className="relative px-4 pt-6 pb-8 space-y-2 z-10">
                <motion.div variants={menuItemVariants}>
                  <MobileNavLink href="/" onClick={() => setIsOpen(false)} icon={<Home size={18} />}>Beranda</MobileNavLink>
                </motion.div>
                <motion.div variants={menuItemVariants}>
                  <MobileNavLink href="/infografis" onClick={() => setIsOpen(false)} icon={<Map size={18} />}>Infografis Bencana</MobileNavLink>
                </motion.div>
                <motion.div variants={menuItemVariants}>
                  <MobileNavLink href="/lapor" onClick={() => setIsOpen(false)} icon={<AlertTriangle size={18} />}>Lapor Banjir</MobileNavLink>
                </motion.div>
                <motion.div variants={menuItemVariants}>
                  <MobileNavLink href="/kontak" onClick={() => setIsOpen(false)} icon={<Phone size={18} />}>Kontak</MobileNavLink>
                </motion.div>
                <motion.div variants={menuItemVariants}>
                  <MobileNavLink href="/saran" onClick={() => setIsOpen(false)} icon={<MessageSquarePlus size={18} />}>Masukan & Saran</MobileNavLink>
                </motion.div>
                
                <motion.div variants={menuItemVariants} className="mt-6 pt-4 border-t border-white/20">
                  {/* Tombol Login Mobile - Membuka Modal */}
                  <button 
                    onClick={() => { setIsOpen(false); setIsLoginOpen(true); }}
                    className="w-full py-3 bg-amber-400 text-blue-950 font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 hover:bg-amber-300 uppercase text-xs tracking-widest transition-colors"
                  >
                      Login<ChevronRight size={16} strokeWidth={3} />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      {/* Mobile Backdrop Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 xl:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* IMPLEMENTASI LOGIN FORM */}
      <LoginForm isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};


const DesktopNavLink = ({ href, children, active }: NavLinkProps) => (
  <Link href={href} className="relative px-3 py-2 group">
    <span className={`relative z-10 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors duration-200 ${active ? 'text-white' : 'text-blue-100 group-hover:text-white'}`}>
      {children}
    </span>
    {active && (
      <motion.div 
        layoutId="navbar-indicator"
        className="absolute bottom-0 left-3 right-3 h-px bg-amber-400"
        transition={{ type: "tween", ease: "circOut", duration: 0.3 }}
      />
    )}

    {!active && (
      <div className="absolute bottom-0 left-3 w-0 h-px bg-amber-400 transition-all duration-300 ease-out group-hover:w-[calc(100%-1.5rem)]" />
    )}
  </Link>
);

const MobileNavLink = ({ href, children, onClick, icon }: NavLinkProps & { icon?: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
      <Link href={href} onClick={onClick}>
        <div className={`flex items-center justify-between p-3 rounded-lg transition-all border ${isActive ? 'bg-white/10 text-white border-white/30 shadow-inner' : 'text-blue-100 border-transparent hover:bg-white/5 hover:border-white/10'}`}>
            <div className="flex items-center gap-3">
              {icon && <span className={`${isActive ? 'text-amber-400' : 'text-blue-300'}`}>{icon}</span>}
              <span className="font-medium text-xs uppercase tracking-widest">{children}</span>
            </div>
            {isActive && <Droplets size={16} className="text-amber-400" />}
        </div>
      </Link>
    );
};