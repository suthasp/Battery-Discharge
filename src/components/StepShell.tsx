"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import StatusPanel from "@/components/StatusPanel";
import MimicDiagram from "@/components/MimicDiagram";
import AlarmBanner from "@/components/AlarmBanner";
import { useSimulation, TOTAL_STEPS } from "@/hooks/useSimulation";

interface StepShellProps {
  stepNumber: number;
  title: string;
  description: string;
  children: ReactNode;
  resultNode?: ReactNode;
  canProceed: boolean;
  onNext?: () => void;
  nextLabel?: string;
}

export default function StepShell({
  stepNumber,
  title,
  description,
  children,
  resultNode,
  canProceed,
  onNext,
  nextLabel = "ขั้นตอนต่อไป",
}: StepShellProps) {
  const { equipment, readings, alarms, acknowledgeAlarm, chargerEnabled, discharging, nextStep } =
    useSimulation();

  const handleNext = () => {
    onNext?.();
    nextStep();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-cyan-400">
            ขั้นตอนที่ {stepNumber} / {TOTAL_STEPS}
          </span>
          <h2 className="text-xl font-bold text-slate-100">{title}</h2>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-sky-500"
            initial={{ width: 0 }}
            animate={{ width: `${(stepNumber / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <AlarmBanner alarms={alarms} onAcknowledge={acknowledgeAlarm} />

      <GlassCard className="p-4">
        <MimicDiagram
          equipment={equipment}
          chargerEnabled={chargerEnabled}
          discharging={discharging}
          batteryCapacity={readings.batteryCapacity}
        />
      </GlassCard>

      <GlassCard className="p-4">
        <StatusPanel equipment={equipment} readings={readings} />
      </GlassCard>

      <GlassCard className="p-5">
        <h3 className="mb-3 text-sm font-semibold text-cyan-300">การปฏิบัติงาน (User Action)</h3>
        {children}
      </GlassCard>

      {resultNode && (
        <GlassCard className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-cyan-300">ผลลัพธ์ (Result)</h3>
          {resultNode}
        </GlassCard>
      )}

      <div className="flex justify-end">
        <button
          disabled={!canProceed}
          onClick={handleNext}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition disabled:cursor-not-allowed disabled:opacity-30"
        >
          {nextLabel} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
