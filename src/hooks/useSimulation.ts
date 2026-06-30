"use client";

import { create } from "zustand";
import {
  ActiveAlarm,
  AlarmType,
  ChartPoint,
  DEFAULT_CONFIG,
  EquipmentState,
  InitialRecord,
  MonitoringSample,
  ScoreEvent,
  SimulationHistoryEntry,
  SystemConfig,
  SystemReadings,
} from "@/data/types";
import {
  batteryStatusColor,
  chargeStep,
  dischargeStep,
  rippleFor,
  voltageForCapacity,
} from "@/utils/simulation";

export const TOTAL_STEPS = 12;
export const SIM_SECONDS_PER_TICK = 15; // simulated seconds advanced per tick
export const TICK_INTERVAL_MS = 250; // real ms per tick

const HISTORY_KEY = "rbdts_history_v1";

interface SimulationState {
  step: number;
  running: boolean;
  operatorName: string;
  siteId: string;
  config: SystemConfig;
  equipment: EquipmentState;
  readings: SystemReadings;
  initialRecord: InitialRecord | null;
  monitoringSamples: MonitoringSample[];
  chartData: ChartPoint[];
  alarms: ActiveAlarm[];
  scoreEvents: ScoreEvent[];
  chargerEnabled: boolean;
  discharging: boolean;
  rectifierFault: boolean;
  startedAt: number | null;
  finishedAt: number | null;
  acknowledgedLowAlarm: boolean;
  lastRecordedMinuteMark: number;
  history: SimulationHistoryEntry[];

  startSimulation: (operatorName: string, siteId: string) => void;
  resetSimulation: () => void;
  goToStep: (n: number) => void;
  nextStep: () => void;
  applyScore: (label: string, delta: number) => void;
  verifyHealth: (correct: boolean) => void;
  recordInitial: (values: InitialRecord) => void;
  disableCharger: () => void;
  enableCharger: () => void;
  tick: () => void;
  recordMonitoringSample: () => void;
  acknowledgeAlarm: (id: string) => void;
  raiseAlarm: (type: AlarmType, message: string) => void;
  triggerRandomEvent: (type: AlarmType, message: string) => void;
  finalizeHistory: () => SimulationHistoryEntry;
  loadHistory: () => void;
}

const initialEquipment: EquipmentState = {
  utility: "normal",
  generator: "off",
  rectifier: "normal",
  battery: "normal",
  dcLoad: "normal",
};

const initialReadings: SystemReadings = {
  batteryVoltage: DEFAULT_CONFIG.floatVoltage,
  loadCurrent: DEFAULT_CONFIG.loadCurrentBase,
  batteryCurrent: 1.2,
  rectifierCurrent: DEFAULT_CONFIG.loadCurrentBase + 1.2,
  batteryCapacity: 100,
  elapsedSeconds: 0,
  roomTemperature: 27,
  batteryTemperature: 28,
  ripple: 25,
};

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export const useSimulation = create<SimulationState>((set, get) => ({
  step: 0,
  running: false,
  operatorName: "",
  siteId: "",
  config: DEFAULT_CONFIG,
  equipment: initialEquipment,
  readings: initialReadings,
  initialRecord: null,
  monitoringSamples: [],
  chartData: [],
  alarms: [],
  scoreEvents: [],
  chargerEnabled: true,
  discharging: false,
  rectifierFault: false,
  startedAt: null,
  finishedAt: null,
  acknowledgedLowAlarm: false,
  lastRecordedMinuteMark: 0,
  history: [],

  startSimulation: (operatorName, siteId) =>
    set({
      step: 1,
      running: true,
      operatorName,
      siteId,
      equipment: initialEquipment,
      readings: { ...initialReadings },
      initialRecord: null,
      monitoringSamples: [],
      chartData: [],
      alarms: [],
      scoreEvents: [],
      chargerEnabled: true,
      discharging: false,
      rectifierFault: false,
      startedAt: Date.now(),
      finishedAt: null,
      acknowledgedLowAlarm: false,
      lastRecordedMinuteMark: 0,
    }),

  resetSimulation: () =>
    set({
      step: 0,
      running: false,
      equipment: initialEquipment,
      readings: { ...initialReadings },
      initialRecord: null,
      monitoringSamples: [],
      chartData: [],
      alarms: [],
      scoreEvents: [],
      chargerEnabled: true,
      discharging: false,
      rectifierFault: false,
      startedAt: null,
      finishedAt: null,
      acknowledgedLowAlarm: false,
      lastRecordedMinuteMark: 0,
    }),

  goToStep: (n) => set({ step: n }),
  nextStep: () => set((s) => ({ step: Math.min(TOTAL_STEPS, s.step + 1) })),

  applyScore: (label, delta) =>
    set((s) => ({
      scoreEvents: [...s.scoreEvents, { step: s.step, label, delta }],
    })),

  verifyHealth: (correct) => {
    if (correct) {
      get().applyScore("ตรวจสอบสุขภาพระบบถูกต้อง", 10);
    } else {
      get().applyScore("ตรวจสอบสุขภาพระบบผิดพลาด", -5);
    }
  },

  recordInitial: (values) => {
    set({
      initialRecord: values,
      readings: {
        ...get().readings,
        batteryVoltage: values.batteryVoltage,
        loadCurrent: values.loadCurrent,
        roomTemperature: values.roomTemperature,
        batteryTemperature: values.batteryTemperature,
      },
    });
    get().applyScore("บันทึกค่าเริ่มต้น", 10);
  },

  disableCharger: () => {
    set((s) => ({
      chargerEnabled: false,
      discharging: true,
      equipment: { ...s.equipment, rectifier: "warning" },
    }));
    get().applyScore("ปลดชาร์จเจอร์", 10);
  },

  enableCharger: () => {
    set((s) => ({
      chargerEnabled: true,
      discharging: false,
      equipment: { ...s.equipment, rectifier: "normal", battery: "normal" },
    }));
    get().applyScore("เชื่อมต่อชาร์จเจอร์กลับคืน", 10);
  },

  raiseAlarm: (type, message) => {
    const exists = get().alarms.some((a) => a.type === type && !a.acknowledged);
    if (exists) return;
    set((s) => ({
      alarms: [
        ...s.alarms,
        { id: makeId(), type, message, acknowledged: false, raisedAt: s.readings.elapsedSeconds },
      ],
    }));
  },

  triggerRandomEvent: (type, message) => {
    get().raiseAlarm(type, message);
    set((s) => ({
      equipment: {
        ...s.equipment,
        ...(type === "RECTIFIER_FAIL" ? { rectifier: "alarm" as const } : {}),
        ...(type === "BATTERY_HIGH_TEMP" ? { battery: "alarm" as const } : {}),
      },
      rectifierFault: type === "RECTIFIER_FAIL" ? true : s.rectifierFault,
    }));
  },

  acknowledgeAlarm: (id) => {
    set((s) => ({
      alarms: s.alarms.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    }));
    get().applyScore("รับทราบสัญญาณเตือน", 10);
  },

  recordMonitoringSample: () => {
    const r = get().readings;
    set((s) => ({
      monitoringSamples: [
        ...s.monitoringSamples,
        {
          timeMinutes: Math.round(r.elapsedSeconds / 60),
          voltage: r.batteryVoltage,
          current: r.batteryCurrent,
          capacity: r.batteryCapacity,
          temperature: r.batteryTemperature,
        },
      ],
    }));
    get().applyScore("บันทึกข้อมูลการเฝ้าระวัง", 10);
  },

  tick: () => {
    const s = get();
    if (!s.running) return;
    const dt = SIM_SECONDS_PER_TICK;
    const { config } = s;
    let { batteryCapacity, elapsedSeconds, batteryTemperature } = s.readings;
    const { roomTemperature } = s.readings;

    elapsedSeconds += dt;

    if (s.discharging) {
      batteryCapacity = dischargeStep(batteryCapacity, s.readings.loadCurrent, config.ahCapacity, dt);
      batteryTemperature = Math.min(45, batteryTemperature + dt * 0.001);
    } else if (s.chargerEnabled && batteryCapacity < 100) {
      const chargeCurrent = 18 * (1 - batteryCapacity / 100) + 2;
      batteryCapacity = chargeStep(batteryCapacity, chargeCurrent, config.ahCapacity, dt);
      batteryTemperature = Math.max(roomTemperature, batteryTemperature - dt * 0.0005);
    }

    const voltage = voltageForCapacity(batteryCapacity, config);
    const loadCurrent = s.readings.loadCurrent;
    let batteryCurrent: number;
    let rectifierCurrent: number;

    if (s.discharging) {
      batteryCurrent = -loadCurrent;
      rectifierCurrent = 0;
    } else if (s.chargerEnabled) {
      const chargeCurrent = batteryCapacity < 100 ? 18 * (1 - batteryCapacity / 100) + 2 : 1.2;
      batteryCurrent = chargeCurrent;
      rectifierCurrent = loadCurrent + chargeCurrent;
    } else {
      batteryCurrent = 0;
      rectifierCurrent = loadCurrent;
    }

    const ripple = rippleFor(s.chargerEnabled && !s.discharging, s.rectifierFault);

    // Auto alarms based on thresholds
    if (batteryCapacity <= 95 && batteryCapacity > 94.5 && s.discharging) {
      get().raiseAlarm("BATTERY_LOW_95", "แบตเตอรี่ลดลงถึง 95% — Battery Low Warning");
    }
    if (voltage <= config.lowVoltageThreshold && s.discharging) {
      get().raiseAlarm(
        "BATTERY_LOW_VOLTAGE",
        `แรงดันแบตเตอรี่ต่ำถึงเกณฑ์ ${config.lowVoltageThreshold}V — Battery Low Voltage`
      );
    }

    const newReadings: SystemReadings = {
      batteryVoltage: voltage,
      loadCurrent,
      batteryCurrent: Math.round(batteryCurrent * 100) / 100,
      rectifierCurrent: Math.round(rectifierCurrent * 100) / 100,
      batteryCapacity: Math.round(batteryCapacity * 100) / 100,
      elapsedSeconds,
      roomTemperature,
      batteryTemperature: Math.round(batteryTemperature * 100) / 100,
      ripple: Math.round(ripple * 10) / 10,
    };

    const newChartPoint: ChartPoint = {
      t: Math.round(elapsedSeconds / 60),
      voltage,
      current: newReadings.batteryCurrent,
      capacity: newReadings.batteryCapacity,
      temperature: newReadings.batteryTemperature,
    };

    set((st) => ({
      readings: newReadings,
      chartData: [...st.chartData.slice(-200), newChartPoint],
      equipment: {
        ...st.equipment,
        battery:
          batteryCapacity <= 20
            ? "alarm"
            : batteryCapacity <= 40
            ? "warning"
            : "normal",
      },
    }));
  },

  finalizeHistory: () => {
    const s = get();
    const score = s.scoreEvents.reduce((acc, e) => acc + e.delta, 0);
    const mistakes = s.scoreEvents.filter((e) => e.delta < 0).length;
    const duration = s.startedAt ? Math.round((Date.now() - s.startedAt) / 1000) : 0;
    const startVoltage = s.initialRecord?.batteryVoltage ?? s.config.floatVoltage;
    const entry: SimulationHistoryEntry = {
      id: makeId(),
      date: new Date().toISOString(),
      operator: s.operatorName || "Unknown",
      score,
      mistakes,
      durationSeconds: duration,
      passFail: score >= 60 && mistakes <= 3 ? "PASS" : "FAIL",
      startVoltage,
      endVoltage: s.readings.batteryVoltage,
    };
    const updated = [entry, ...s.history].slice(0, 50);
    set({ history: updated, finishedAt: Date.now(), running: false });
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch {
      /* ignore */
    }
    return entry;
  },

  loadHistory: () => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) set({ history: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  },
}));

export function batteryColorFor(capacity: number) {
  return batteryStatusColor(capacity);
}
