export interface FloodData {
  location: string;
  currentLevel: number; // mdpl
  status: "NORMAL" | "WASPADA" | "SIAGA" | "AWAS";
  aiPrediction: string;
  nextHourLevel: number;
  lastUpdate: string;
}