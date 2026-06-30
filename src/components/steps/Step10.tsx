"use client";

import StepShell from "@/components/StepShell";
import BatterySVG from "@/components/BatterySVG";
import { useSimulation } from "@/hooks/useSimulation";

export default function Step10() {
  const capacity = useSimulation((s) => s.readings.batteryCapacity);
  const voltage = useSimulation((s) => s.readings.batteryVoltage);

  return (
    <StepShell
      stepNumber={10}
      title="ฟื้นฟูสภาพแบตเตอรี่ (Recovery)"
      description="ระดับประจุและแรงดันแบตเตอรี่จะค่อย ๆ ฟื้นตัวกลับสู่สภาวะ Float Charge ปกติ"
      canProceed={capacity > 30}
      resultNode={
        <p className="text-sm text-slate-300">
          Voltage กำลังฟื้นตัว: <span className="font-mono text-cyan-300">{voltage.toFixed(2)} V</span>
        </p>
      }
    >
      <div className="flex items-center gap-8">
        <BatterySVG capacity={capacity} />
        <p className="text-sm text-slate-400">
          รอจนกว่าระดับประจุแบตเตอรี่ฟื้นตัวสูงกว่า 30% เพื่อเข้าสู่ขั้นตอนการออกรายงานผลการทดสอบ
        </p>
      </div>
    </StepShell>
  );
}
