"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { OperationalInfo } from "@/components/ui/OperationalInfo";
import { AgencyAccordion } from "@/components/ui/AgencyAccordion";

const containerVar: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVar: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

// Data Sentral Instansi
const AGENCIES = [
  {
    id: "bbws",
    name: "BBWS Citarum",
    desc: "Balai Besar Wilayah Sungai Citarum",
    contacts: [
      {
        num: "01",
        label: "Lokasi Kantor",
        val: "Jl. Inspeksi Cidurian",
        sub: "Soekarno Hatta, Kota Bandung. (Klik lihat peta)",
        isExpandable: true,
        mapUrl: "https://maps.app.goo.gl/CR1nMAdxUM2uKQpJA",
        embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.552269476273!2d107.66700737736917!3d-6.948382075136395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68c2a75bc7e2f3%3A0xd91e40072eba9c8c!2sBalai%20Besar%20Wilayah%20Sungai%20Citarum!5e1!3m2!1sid!2sid!4v1771491325140!5m2!1sid!2sid",
      },
      {
        num: "02",
        label: "Call Center",
        val: "(022) 7562086",
        sub: "Layanan informasi dan pengaduan.",
        href: "tel:+62227562086",
      },
      {
        num: "03",
        label: "Email Resmi",
        val: "bbwscitarum@pu.go.id",
        isCopy: true,
      },
      {
        num: "04",
        label: "Website",
        val: "sda.pu.go.id/balai/bbwscitarum",
        href: "https://sda.pu.go.id/balai/bbwscitarum/",
      },
    ],
  },
  {
    id: "bpbd-jabar",
    name: "BPBD Jawa Barat",
    desc: "Badan Penanggulangan Bencana Daerah Prov. Jabar",
    contacts: [
      {
        num: "01",
        label: "Lokasi Kantor",
        val: "Jl. Soekarno Hatta No.629",
        sub: "Buahbatu, Kota Bandung. (Klik lihat peta)",
        isExpandable: true,
        mapUrl: "https://maps.app.goo.gl/hPqysecvUgNE611G7",
        embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.601962387559!2d107.64509197475729!3d-6.942173393057902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e81482f75959%3A0xb6a64e4d14cf6918!2sBadan%20Penanggulangan%20Bencana%20Daerah%20Provinsi%20Jawa%20Barat!5e1!3m2!1sid!2sid!4v1771490881018!5m2!1sid!2sid",
      },
      {
        num: "02",
        label: "Pusdalops Jabar",
        val: "0823-1701-2056",
        sub: "Nomor WhatsApp Darurat 24 Jam.",
        href: "https://wa.me/6282317012056",
      },
      {
        num: "03",
        label: "Email Resmi",
        val: "bpbd@jabarprov.go.id",
        isCopy: true,
      },
    ],
  },
  {
    id: "bpbd-kab",
    name: "BPBD Kab. Bandung",
    desc: "Pusat Pengendalian Operasi (PUSDALOPS) Kab. Bandung",
    contacts: [
      {
        num: "01",
        label: "Lokasi Kantor",
        val: "Komplek Pemkab Bandung",
        sub: "Jl. Raya Soreang - Banjaran, Soreang. (Klik lihat peta)",
        isExpandable: true,
        mapUrl: "https://maps.app.goo.gl/ZgfXhKJMaSpr4wZz8",
        embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.3966325303372!2d107.50512957736208!3d-6.842124875509263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e3fd50840b79%3A0xcacc63345b6d2893!2sBPBD%20Kabupaten%20Bandung%20Barat!5e1!3m2!1sid!2sid!4v1771490980514!5m2!1sid!2sid",
      },
      {
        num: "02",
        label: "Call Center",
        val: "(022) 5891111",
        sub: "Respons cepat kebencanaan Kab. Bandung.",
        href: "tel:+62225891111",
      },
      {
        num: "03",
        label: "Website",
        val: "bpbd.bandungkab.go.id",
        href: "https://bpbd.bandungkab.go.id",
      },
    ],
  },
  {
    id: "bmkg",
    name: "BMKG Jawa Barat",
    desc: "Stasiun Geofisika Bandung",
    contacts: [
      {
        num: "01",
        label: "Lokasi Kantor",
        val: "Jl. Cemara No.66",
        sub: "Pasteur, Sukajadi, Kota Bandung. (Klik lihat peta)",
        isExpandable: true,
        mapUrl: "https://maps.app.goo.gl/thr3z95JmhpUfm7h6",
        embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60242.71601320996!2d107.5470145680415!3d-6.87083702836385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6f4c548a4bd%3A0x4011d31170ef3b9b!2sStasiun%20Geofisika%20Bandung!5e1!3m2!1sid!2sid!4v1771491200210!5m2!1sid!2sid",
      },
      {
        num: "02",
        label: "Info Cuaca",
        val: "(022) 2037305",
        sub: "Layanan informasi prakiraan cuaca.",
        href: "tel:+62222037305",
      },
      {
        num: "03",
        label: "Website",
        val: "bmkg.go.id",
        href: "https://www.bmkg.go.id",
      },
    ],
  },
];

export default function ContactPage() {
  return (
    // PERBAIKAN: Menambahkan pt-28 md:pt-32 di container terluar agar aman dari Navbar & Ticker
    <div className="h-full w-full pt-28 md:pt-32 bg-white text-slate-900 font-sans overflow-y-auto selection:bg-blue-100 selection:text-blue-900 relative">
      
      {/* Background Noise */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 pt-4 md:pt-10">
        
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVar}
          className="mb-12 md:mb-16 border-b border-slate-200 pb-8 md:pb-10"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="overflow-hidden">
              <motion.span
                variants={itemVar}
                className="block text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4"
              >
                Hubungi Kami
              </motion.span>
              <motion.h1
                variants={itemVar}
                className="text-4xl md:text-7xl font-medium tracking-tighter text-slate-900 leading-tight pb-2"
              >
                Layanan <br /> <span className="text-slate-900">Terpadu.</span>
              </motion.h1>
            </div>
            
            <motion.div
              variants={itemVar}
              className="flex flex-col gap-2 text-left md:text-right items-start md:items-end pb-2"
            >
              <p className="text-slate-500 max-w-sm text-xs md:text-sm leading-relaxed">
                Direktori Instansi Kebencanaan.
                <br />
                Siap melayani informasi dan kedaruratan 24/7.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column - Info & Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 space-y-12"
          >
            <OperationalInfo />
            
            <div className="pl-4 border-l-2 border-slate-200">
              <p className="text-slate-400 text-base md:text-lg font-serif italic leading-relaxed">
                &quot;Sinergi antar lembaga demi menjaga keselamatan dan
                ketangguhan masyarakat Jawa Barat.&quot;
              </p>
            </div>
          </motion.div>

          {/* Right Column - Accordion List */}
          <motion.div
            className="lg:col-span-8"
            variants={containerVar}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={itemVar}
              className="flex flex-col border-t border-slate-200"
            >
              {AGENCIES.map((agency) => (
                <AgencyAccordion
                  key={agency.id}
                  agency={agency}

                />
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}