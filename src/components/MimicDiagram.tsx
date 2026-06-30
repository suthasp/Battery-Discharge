"use client";

import { motion } from "framer-motion";
import { EquipmentState } from "@/data/types";
import { batteryStatusColor } from "@/utils/simulation";
import clsx from "clsx";

interface MimicDiagramProps {
  equipment: EquipmentState;
  chargerEnabled: boolean;
  discharging: boolean;
  batteryCapacity: number;
}

function NodeBox({
  x,
  y,
  w,
  h,
  label,
  sub,
  active,
  alarm,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  active: boolean;
  alarm?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        className={clsx(
          "transition-all",
          alarm
            ? "fill-red-500/20 stroke-red-400"
            : active
            ? "fill-cyan-500/10 stroke-cyan-400"
            : "fill-slate-700/20 stroke-slate-500"
        )}
        strokeWidth={1.5}
      />
      <text x={x + w / 2} y={y + h / 2 - 2} textAnchor="middle" className="fill-current text-[11px] font-semibold" fill="currentColor">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" className="fill-slate-400 text-[9px]">
          {sub}
        </text>
      )}
    </g>
  );
}

function FlowLine({
  x1,
  y1,
  x2,
  y2,
  active,
  reverse,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  reverse?: boolean;
}) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={active ? "#22d3ee" : "#475569"}
        strokeWidth={2}
        className={active ? "flow-line" : ""}
        style={reverse ? { animationDirection: "reverse" } : undefined}
      />
      {active && (
        <motion.circle
          r={3}
          fill="#67e8f9"
          initial={{ offsetDistance: reverse ? "100%" : "0%" }}
          animate={{ offsetDistance: reverse ? "0%" : "100%" }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          style={{
            offsetPath: `path("M${x1},${y1} L${x2},${y2}")`,
          }}
        />
      )}
    </g>
  );
}

export default function MimicDiagram({
  equipment,
  chargerEnabled,
  discharging,
  batteryCapacity,
}: MimicDiagramProps) {
  const rectifierActive = equipment.rectifier !== "off" && equipment.utility !== "off";
  const battColor = batteryStatusColor(batteryCapacity);

  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 760 320" className="w-full min-w-[640px] text-slate-200" height={320}>
        <NodeBox x={20} y={20} w={120} h={50} label="Utility AC" sub="380/220V" active={equipment.utility !== "off"} alarm={equipment.utility === "alarm"} />
        <NodeBox x={20} y={110} w={120} h={50} label="Generator" sub="Standby" active={equipment.generator !== "off"} />
        <NodeBox x={220} y={65} w={140} h={60} label="Rectifier System" sub="R1 R2 R3 R4 R5 R6" active={rectifierActive} alarm={equipment.rectifier === "alarm"} />
        <NodeBox x={440} y={65} w={110} h={60} label="DC Bus" sub="-48V DC" active={true} />
        <NodeBox x={630} y={20} w={110} h={50} label="DC Load" sub="Telecom Equip." active={equipment.dcLoad !== "off"} />
        <NodeBox
          x={630}
          y={110}
          w={110}
          h={50}
          label="Battery Bank"
          sub={`${batteryCapacity.toFixed(0)}%`}
          active={true}
          alarm={equipment.battery === "alarm"}
        />

        <FlowLine x1={140} y1={45} x2={220} y2={75} active={equipment.utility !== "off"} />
        <FlowLine x1={140} y1={135} x2={220} y2={110} active={equipment.generator !== "off"} />
        <FlowLine x1={360} y1={95} x2={440} y2={95} active={rectifierActive} />
        <FlowLine x1={550} y1={85} x2={630} y2={45} active={equipment.dcLoad !== "off"} />
        <FlowLine
          x1={550}
          y1={105}
          x2={630}
          y2={135}
          active={chargerEnabled && !discharging}
        />
        <FlowLine
          x1={630}
          y1={135}
          x2={550}
          y2={105}
          active={discharging}
          reverse
        />

        {/* LVD / breaker labels */}
        <g className="fill-slate-400 text-[9px]">
          <text x={400} y={140}>LVD</text>
          <text x={400} y={155}>Breaker: {chargerEnabled ? "ON" : "OFF"}</text>
          <text x={595} y={155}>String A/B</text>
        </g>

        <rect x={20} y={200} width={720} height={100} rx={12} className="fill-black/10 stroke-slate-600" strokeWidth={1} />
        <text x={36} y={222} className="fill-cyan-300 text-[11px] font-semibold">DC Distribution / LVBD - LVLD</text>
        <circle cx={50} cy={250} r={6} fill={chargerEnabled ? "#22c55e" : "#64748b"} />
        <text x={64} y={254} className="fill-slate-300 text-[10px]">Charger Breaker</text>
        <circle cx={220} cy={250} r={6} fill="#22c55e" />
        <text x={234} y={254} className="fill-slate-300 text-[10px]">Load Breaker</text>
        <circle cx={390} cy={250} r={6} fill={discharging ? "#f59e0b" : "#22c55e"} />
        <text x={404} y={254} className="fill-slate-300 text-[10px]">LVBD (Battery)</text>
        <circle cx={560} cy={250} r={6} fill="#22c55e" />
        <text x={574} y={254} className="fill-slate-300 text-[10px]">LVLD (Load)</text>
        <text x={50} y={285} className="fill-slate-500 text-[9px]">Manual Bypass: OFF • Battery String: A (Selected) • Mode: {discharging ? "Discharge / Float Off" : chargerEnabled ? "Float Charge" : "Charger Disabled"}</text>
        <circle cx={45} cy={283} r={4} fill={battColor} />
      </svg>
    </div>
  );
}
