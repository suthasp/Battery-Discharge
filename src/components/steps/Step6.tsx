"use client";

import StepShell from "@/components/StepShell";
import { useSimulation } from "@/hooks/useSimulation";

export default function Step6() {
  const alarms = useSimulation((s) => s.alarms);
  const lowAlarm = alarms.find((a) => a.type === "BATTERY_LOW_95");
  const acknowledged = lowAlarm?.acknowledged ?? false;
  const capacity = useSimulation((s) => s.readings.batteryCapacity);

  return (
    <StepShell
      stepNumber={6}
      title="สัญญาณเตือนแบตเตอรี่ต่ำ (Battery Low Warning)"
      description="ระบบจะแจ้งเตือนอัตโนมัติเมื่อระดับประจุแบตเตอรี่ลดลงถึง 95% — ผู้ปฏิบัติงานต้องรับทราบสัญญาณเตือน"
      canProceed={acknowledged || capacity <= 90}
      resultNode={
        acknowledged ? (
          <p className="text-sm text-emerald-300">รับทราบสัญญาณเตือนแล้ว ดำเนินการทดสอบต่อไปได้</p>
        ) : (
          <p className="text-sm text-slate-400">รอสัญญาณเตือนเมื่อระดับประจุถึง 95% (ปัจจุบัน {capacity.toFixed(1)}%)</p>
        )
      }
    >
      <p className="text-sm text-slate-400">
        เมื่อแถบแจ้งเตือนปรากฏด้านบน ให้กดปุ่ม “รับทราบ” เพื่อยืนยันว่าได้รับทราบสถานะ Battery Low Warning
        ที่ระดับ 95%
      </p>
    </StepShell>
  );
}
