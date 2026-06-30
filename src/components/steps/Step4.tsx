"use client";

import StepShell from "@/components/StepShell";
import BatterySVG from "@/components/BatterySVG";
import { useSimulation } from "@/hooks/useSimulation";

export default function Step4() {
  const capacity = useSimulation((s) => s.readings.batteryCapacity);
  const voltage = useSimulation((s) => s.readings.batteryVoltage);

  return (
    <StepShell
      stepNumber={4}
      title="แบตเตอรี่เริ่มคายประจุ (Battery Starts Discharging)"
      description="แบตเตอรี่จ่ายกระแสไฟให้กับโหลด DC แทน Rectifier — ระดับประจุและแรงดันจะลดลงอย่างต่อเนื่อง"
      canProceed={capacity < 99.5}
      resultNode={
        <p className="text-sm text-slate-300">
          Voltage: <span className="font-mono text-cyan-300">{voltage.toFixed(2)} V</span> — กำลังลดลงอย่างช้า ๆ ตามเส้นโค้งการคายประจุจริง
        </p>
      }
    >
      <div className="flex items-center gap-8">
        <BatterySVG capacity={capacity} />
        <p className="text-sm text-slate-400">
          ระดับประจุแบตเตอรี่กำลังลดลงจาก 100% ตามภาระโหลด DC ปัจจุบัน รอจนกว่าระดับจะลดลงต่ำกว่า 99.5%
          เพื่อดำเนินการขั้นตอนต่อไป
        </p>
      </div>
    </StepShell>
  );
}
