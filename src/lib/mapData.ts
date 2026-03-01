// lib/mapData.ts
export interface KecamatanDetail {
  id: number;
  name: string;
  coords: [number, number];
  status: "Siaga 1" | "Siaga 2" | "Waspada" | "Aman";
  stats: {
    jiwaTerdampak: string;
    rumahTerendam: string;
    rumahRusak: string;
    pengungsi: string;
    fasilitasUmum: string;
  };
}

export const KECAMATAN_DATA: KecamatanDetail[] = [
  { 
    id: 1, name: "Dayeuhkolot", coords: [-6.9881, 107.6284], status: "Siaga 1",
    stats: { jiwaTerdampak: "4.250", rumahTerendam: "1.120", rumahRusak: "45", pengungsi: "850", fasilitasUmum: "12" }
  },
  { 
    id: 2, name: "Baleendah", coords: [-6.9946, 107.6306], status: "Siaga 1",
    stats: { jiwaTerdampak: "3.800", rumahTerendam: "950", rumahRusak: "32", pengungsi: "720", fasilitasUmum: "8" }
  },
  { 
    id: 3, name: "Bojongsoang", coords: [-6.9806, 107.6432], status: "Waspada",
    stats: { jiwaTerdampak: "1.200", rumahTerendam: "240", rumahRusak: "5", pengungsi: "150", fasilitasUmum: "3" }
  },
  { 
    id: 4, name: "Margahayu", coords: [-6.9631, 107.5752], status: "Waspada",
    stats: { jiwaTerdampak: "850", rumahTerendam: "115", rumahRusak: "2", pengungsi: "40", fasilitasUmum: "1" }
  },
  { 
    id: 5, name: "Margaasih", coords: [-6.9467, 107.5564], status: "Aman",
    stats: { jiwaTerdampak: "0", rumahTerendam: "0", rumahRusak: "0", pengungsi: "0", fasilitasUmum: "0" }
  },
  { 
    id: 6, name: "Majalaya", coords: [-7.0450, 107.7547], status: "Siaga 2",
    stats: { jiwaTerdampak: "2.100", rumahTerendam: "480", rumahRusak: "18", pengungsi: "310", fasilitasUmum: "6" }
  },
];