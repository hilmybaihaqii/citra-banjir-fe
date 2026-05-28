"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapWrapper } from "@/components/dashboard/MapWrapper";
import { PredictionButton } from "@/components/dashboard/PredictionButton";
import { PredictionModal } from "@/components/dashboard/PredictionModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface IntegratedPrediction {
  id: string | number;
  area: string;
  status: "normal" | "waspada" | "siaga" | "awas";
  date: string;
  rainfall: string;
  temp: string;
  wind: string;
  postName: string;
  waterDischarge: string;
  waterLevel: string;
  coords: [number, number];
  isFloodPredicted: boolean;
}

interface LogWilayahItem {
  id: string | number;
  curahHujan: string | number;
  debitAir: string | number;
  tinggiMukaAir: string | number;
  tinggiGenangan?: string | number;
  suhu?: string | number;
  kecepatanAngin?: string | number;
  waktuInput?: string;
  createdAt?: string;
  wilayah?: {
    nama: string;
    latitude: string | number;
    longitude: string | number;
  };
  pos?: {
    nama: string;
  };
}

export default function PublicHomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [predictions, setPredictions] = useState<IntegratedPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPublicPredictions = useCallback(async () => {
    setIsLoading(true);
    try {

      try {
        console.log(" Menghubungkan ke server");
        await fetch(`${API_BASE_URL}/health`, {
          method: "GET",
        });
        console.log("Server Express berhasil dibangunkan!");
      } catch (healthError) {
        console.warn(
          "Gagal melakukan handshake health check, mencoba langsung mengambil data...",
          healthError
        );
      }

      const resLogs = await fetch(`${API_BASE_URL}/pemantauan-terpadu`, {
        method: "GET",
      });

      if (!resLogs.ok)
        throw new Error("Gagal mengambil log dari server database");
      
      const dataLogs = await resLogs.json();
      const logsArray: LogWilayahItem[] = Array.isArray(dataLogs)
        ? dataLogs
        : dataLogs.data || [];

      if (logsArray.length === 0) {
        setPredictions([]);
        return;
      }

      const cleanFloat = (val: string | number | undefined): number => {
        if (val === undefined || val === null) return 0;
        if (typeof val === "number") return val;
        const sanitized = val.replace(/,/g, ".");
        const parsed = parseFloat(sanitized);
        return isNaN(parsed) ? 0 : parsed;
      };

      const integratedData = logsArray.map((log: LogWilayahItem, index: number) => {
        const tma = cleanFloat(log.tinggiMukaAir);

        let statusText: "normal" | "waspada" | "siaga" | "awas" = "normal";
        if (tma >= 0.57 && tma < 0.93) statusText = "waspada";
        else if (tma >= 0.93 && tma <= 1.3) statusText = "siaga";
        else if (tma > 1.3) statusText = "awas";

        return mapLogToUI(log, statusText, index);
      });

      setPredictions(integratedData);
    } catch (error) {
      console.error("Gagal memuat peta penanganan banjir publik:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const mapLogToUI = (
    log: LogWilayahItem,
    statusText: "normal" | "waspada" | "siaga" | "awas",
    index: number,
  ): IntegratedPrediction => {
    const timeStr =
      log.waktuInput || log.createdAt
        ? new Date(log.waktuInput || log.createdAt || "").toLocaleString(
            "id-ID",
            { dateStyle: "short", timeStyle: "short" },
          ) + " WIB"
        : "Baru Saja";

    const latNum =
      typeof log.wilayah?.latitude === "string"
        ? parseFloat(log.wilayah.latitude)
        : log.wilayah?.latitude || -6.98;
    const lngNum =
      typeof log.wilayah?.longitude === "string"
        ? parseFloat(log.wilayah.longitude)
        : log.wilayah?.longitude || 107.62;

    const parseStringValue = (val: string | number | undefined): string => {
      if (val === undefined || val === null) return "0";
      return val.toString();
    };

    return {
      id: log.id || `public-pred-${index}`,
      area: log.wilayah?.nama || "Area Pantauan",
      status: statusText,
      date: timeStr,
      rainfall: `${parseStringValue(log.curahHujan)} mm`,
      temp: log.suhu ? `${log.suhu}`.replace(".", ",") + " °C" : "27 °C",
      wind: log.kecepatanAngin
        ? `${log.kecepatanAngin}`.replace(".", ",") + " km/h"
        : "10 km/h",
      postName: log.pos?.nama || "Stasiun Hidrologi",
      waterDischarge: `${parseStringValue(log.debitAir)} m³/s`,
      waterLevel: `${parseStringValue(log.tinggiMukaAir)} m`,
      coords: [latNum, lngNum],
      isFloodPredicted: statusText !== "normal",
    };
  };

  useEffect(() => {
    fetchPublicPredictions();
  }, [fetchPublicPredictions]);

  return (
    <>
      <div className="w-full h-screen relative z-0 bg-slate-50 overflow-hidden">
        <PredictionButton onClick={() => setIsModalOpen(true)} />
        <MapWrapper data={predictions} isLoading={isLoading} />
      </div>

      <PredictionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={predictions}
      />
    </>
  );
}