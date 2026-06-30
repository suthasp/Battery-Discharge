import { DEFAULT_CONFIG, SystemConfig } from "@/data/types";

/**
 * Approximates a VRLA/Li battery discharge curve: flat plateau around float
 * voltage, then accelerating drop as capacity depletes (knee curve), mirrored
 * on recharge. Capacity 0-100 maps to voltage via a cubic-ease knee.
 */
export function voltageForCapacity(
  capacityPercent: number,
  config: SystemConfig = DEFAULT_CONFIG
): number {
  const c = Math.max(0, Math.min(100, capacityPercent)) / 100;
  const { floatVoltage, lowVoltageThreshold } = config;
  const range = floatVoltage - lowVoltageThreshold;

  // Knee curve: stays near floatVoltage until ~30% remaining, then dives.
  const knee = 0.3;
  let normalized: number;
  if (c >= knee) {
    // gentle slope from 1.0 -> knee maps to 1.0 -> 0.82 of range retained
    const t = (c - knee) / (1 - knee);
    normalized = 0.82 + 0.18 * t;
  } else {
    const t = c / knee;
    normalized = 0.82 * Math.pow(t, 1.6);
  }
  return Math.round((lowVoltageThreshold + normalized * range) * 100) / 100;
}

export function dischargeStep(
  capacityPercent: number,
  loadCurrent: number,
  ahCapacity: number,
  deltaSeconds: number
): number {
  const ahRemoved = (loadCurrent * deltaSeconds) / 3600;
  const percentRemoved = (ahRemoved / ahCapacity) * 100;
  return Math.max(0, capacityPercent - percentRemoved);
}

export function chargeStep(
  capacityPercent: number,
  chargeCurrent: number,
  ahCapacity: number,
  deltaSeconds: number
): number {
  const ahAdded = (chargeCurrent * deltaSeconds) / 3600;
  const percentAdded = (ahAdded / ahCapacity) * 100;
  return Math.min(100, capacityPercent + percentAdded);
}

export function batteryStatusColor(capacityPercent: number): string {
  if (capacityPercent > 60) return "#22c55e"; // green
  if (capacityPercent > 30) return "#eab308"; // yellow
  if (capacityPercent > 15) return "#f97316"; // orange
  return "#ef4444"; // red
}

export function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export function rippleFor(rectifierOn: boolean, fault: boolean): number {
  if (fault) return 180 + Math.random() * 40;
  if (!rectifierOn) return 2 + Math.random() * 1;
  return 20 + Math.random() * 10;
}
