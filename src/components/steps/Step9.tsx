"use client";

import { motion } from "framer-motion";
import { PowerIcon } from "lucide-react";
import StepShell from "@/components/StepShell";
import { useSimulation } from "@/hooks/useSimulation";

export default function Step9() {
  const chargerEnabled = useSimulation((s) => s.chargerEnabled);
  const enableCharger = useSimulation((s) => s.enableCharger);

  return (
    <StepShell
      stepNumber={9}
      title="เชื่อมต่อชาร์จเจอร์กลับคืน (Reconnect Charger)"
      description="เปิดการทำงานของ Rectifier เพื่อชาร์จแบตเตอรี่กลับคืนหลังจบการคายประจุ"
      canProceed={chargerEnabled}
      resultNode={
        chargerEnabled ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-emerald-300">
            Rectifier Output เปิดทำงาน — Battery Charging — กระแสแบตเตอรี่เปลี่ยนเป็นค่าบวก
          </motion.p>
        ) : null
      }
    >
      <button
        onClick={enableCharger}
        disabled={chargerEnabled}
        className="flex items-center gap-2 rounded-lg bg-emerald-500/20 px-5 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/30 disabled:opacity-40"
      >
        <PowerIcon size={16} /> Enable Charger
      </button>
    </StepShell>
  );
}
