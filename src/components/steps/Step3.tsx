"use client";

import { motion } from "framer-motion";
import { PowerOff } from "lucide-react";
import StepShell from "@/components/StepShell";
import { useSimulation } from "@/hooks/useSimulation";

export default function Step3() {
  const chargerEnabled = useSimulation((s) => s.chargerEnabled);
  const disableCharger = useSimulation((s) => s.disableCharger);

  return (
    <StepShell
      stepNumber={3}
      title="ปลดชาร์จเจอร์ (Disable Battery Charger)"
      description="ปลดการชาร์จแบตเตอรี่เพื่อเริ่มการทดสอบ Discharge — Rectifier จะหยุดชาร์จและกระแสแบตเตอรี่จะกลับเป็นลบ"
      canProceed={!chargerEnabled}
      resultNode={
        !chargerEnabled ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-amber-300"
          >
            Rectifier หยุดชาร์จแบตเตอรี่ — Battery Current เปลี่ยนเป็นค่าลบ (Discharging Mode)
          </motion.p>
        ) : null
      }
    >
      <button
        onClick={disableCharger}
        disabled={!chargerEnabled}
        className="flex items-center gap-2 rounded-lg bg-amber-500/20 px-5 py-3 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/30 disabled:opacity-40"
      >
        <PowerOff size={16} /> Disable Charger
      </button>
    </StepShell>
  );
}
