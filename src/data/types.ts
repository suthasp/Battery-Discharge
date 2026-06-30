export type ThemeMode = "dark" | "light";

export type EquipmentKey =
  | "utility"
  | "generator"
  | "rectifier"
  | "battery"
  | "dcLoad";

export type EquipmentStatus = "normal" | "warning" | "alarm" | "off";

export interface EquipmentState {
  utility: EquipmentStatus;
  generator: EquipmentStatus;
  rectifier: EquipmentStatus;
  battery: EquipmentStatus;
  dcLoad: EquipmentStatus;
}

export interface SystemReadings {
  batteryVoltage: number;
  loadCurrent: number;
  batteryCurrent: number;
  rectifierCurrent: number;
  batteryCapacity: number; // %
  elapsedSeconds: number;
  roomTemperature: number;
  batteryTemperature: number;
  ripple: number; // mV
}

export interface InitialRecord {
  batteryVoltage: number;
  floatVoltage: number;
  loadCurrent: number;
  roomTemperature: number;
  batteryTemperature: number;
}

export interface MonitoringSample {
  timeMinutes: number;
  voltage: number;
  current: number;
  capacity: number;
  temperature: number;
}

export type AlarmType =
  | "BATTERY_LOW_95"
  | "BATTERY_LOW_VOLTAGE"
  | "RECTIFIER_FAIL"
  | "BATTERY_HIGH_TEMP"
  | "ROOM_TEMP_HIGH"
  | "FUSE_FAILURE"
  | "AC_INPUT_FAIL";

export interface ActiveAlarm {
  id: string;
  type: AlarmType;
  message: string;
  acknowledged: boolean;
  raisedAt: number;
}

export interface ScoreEvent {
  step: number;
  label: string;
  delta: number;
}

export interface SystemConfig {
  nominalVoltage: number; // 48
  cellsInString: number;
  floatVoltage: number;
  fullVoltage: number;
  lowVoltageThreshold: number; // e.g. 42V
  ahCapacity: number;
  loadCurrentBase: number;
}

export const DEFAULT_CONFIG: SystemConfig = {
  nominalVoltage: 48,
  cellsInString: 24,
  floatVoltage: 54.0,
  fullVoltage: 54.0,
  lowVoltageThreshold: 42.0,
  ahCapacity: 200,
  loadCurrentBase: 35,
};

export interface OperatorInfo {
  name: string;
  siteId: string;
}

export interface SimulationHistoryEntry {
  id: string;
  date: string;
  operator: string;
  score: number;
  mistakes: number;
  durationSeconds: number;
  passFail: "PASS" | "FAIL";
  startVoltage: number;
  endVoltage: number;
}

export interface ChartPoint {
  t: number;
  voltage: number;
  current: number;
  capacity: number;
  temperature: number;
}
