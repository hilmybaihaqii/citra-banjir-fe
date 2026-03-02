export interface KecamatanDetail {
  id: number;
  name: string;
  coords: [number, number];
  status: "Siaga 1" | "Siaga 2" | "Waspada" | "Aman";
  stats: {
    kepalaKeluarga: string;
    jiwaTerdampak: string;
    pengungsi: string;
    lukaLuka: string;
    meninggal: string;
    rumahTerendam: string;
    rumahRusakParah: string;
    fasilitasUmum: string;
    tempatIbadah: string;
  };
}

// Data Dummy Awal
export const KECAMATAN_DATA: KecamatanDetail[] = [
  { 
    id: 1, name: "Dayeuhkolot", coords: [-6.9881, 107.6284], status: "Siaga 1",
    stats: { kepalaKeluarga: "1200", jiwaTerdampak: "4250", pengungsi: "850", lukaLuka: "12", meninggal: "0", rumahTerendam: "1120", rumahRusakParah: "45", fasilitasUmum: "12", tempatIbadah: "4" }
  },
  { 
    id: 2, name: "Baleendah", coords: [-6.9946, 107.6306], status: "Siaga 1",
    stats: { kepalaKeluarga: "950", jiwaTerdampak: "3800", pengungsi: "720", lukaLuka: "8", meninggal: "1", rumahTerendam: "950", rumahRusakParah: "32", fasilitasUmum: "8", tempatIbadah: "2" }
  },
];