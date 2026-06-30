"use client";

import { motion } from "framer-motion";
import { Battery, Cable, Fuel, Plug, Server } from "lucide-react";
import { EquipmentState, EquipmentStatus, SystemReadings } from "@/data/types";
import { formatElapsed } from "@/utils/simulation";
import clsx from "clsx";

const statusColor: Record<EquipmentStatus, string> = {
  normal: "bg-emerald-400 shadow-emerald-400/60",
  warning: "bg-amber-400 shadow-amber-400/60",
  alarm: "bg-red-500 shadow-red-500/60",
  off: "bg-slate-500 shadow-slate-500/40",
};

const statusLabelTh: Record<EquipmentStatus, string> = {
  normal: "ปกติ",
  warning: "เฝ้าระวัง",
  alarm: "แจ้งเตือน",
  off: "ปิด",
};

function EquipmentDot({
  icon,
  label,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  status: EquipmentStatus;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl px-3 py-2">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full glass-panel text-cyan-300">
        {icon}
        <motion.span
          animate={{ scale: status === "alarm" ? [1, 1.3, 1] : 1 }}
          transition={{ repeat: status === "alarm" ? Infinity : 0, duration: 1 }}
          className={clsx(
            "absolute -right-1 -top-1 h-3 w-3 rounded-full shadow-md",
            statusColor[status]
          )}
        />
      </div>
      <span className="text-[11px] font-medium text-slate-300">{label}</span>
      <span className="text-[10px] text-slate-500">{statusLabelTh[status]}</span>
    </div>
  );
}

function Metric({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl border border-white/5 bg-black/10 px-3 py-2">
      <span className="text-[11px] text-slate-400">{label}</span>
      <span className="font-mono text-lg font-semibold text-cyan-200">
        {value}
        {unit && <span className="ml-1 text-xs text-slate-400">{unit}</span>}
      </span>
    </div>
  );
}

export default function StatusPanel({
  equipment,
  readings,
}: {
  equipment: EquipmentState;
  readings: SystemReadings;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        <EquipmentDot icon={<Plug size={18} />} label="Utility" status={equipment.utility} />
        <EquipmentDot icon={<Fuel size={18} />} label="Generator" status={equipment.generator} />
        <EquipmentDot icon={<Server size={18} />} label="Rectifier" status={equipment.rectifier} />
        <EquipmentDot icon={<Battery size={18} />} label="Battery" status={equipment.battery} />
        <EquipmentDot icon={<Cable size={18} />} label="DC Load" status={equipment.dcLoad} />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <Metric label="Battery Voltage" value={readings.batteryVoltage.toFixed(2)} unit="V" />
        <Metric label="Load Current" value={readings.loadCurrent.toFixed(1)} unit="A" />
        <Metric label="Battery Current" value={readings.batteryCurrent.toFixed(1)} unit="A" />
        <Metric label="Rectifier Current" value={readings.rectifierCurrent.toFixed(1)} unit="A" />
        <Metric label="Battery Capacity" value={readings.batteryCapacity.toFixed(1)} unit="%" />
        <Metric label="Elapsed Time" value={formatElapsed(readings.elapsedSeconds)} />
      </div>
    </div>
  );
}
