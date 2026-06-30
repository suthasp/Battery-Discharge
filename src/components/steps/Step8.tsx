"use client";

import StepShell from "@/components/StepShell";
import { useSimulation } from "@/hooks/useSimulation";

export default function Step8() {
  const alarms = useSimulation((s) => s.alarms);
  const config = useSimulation((s) => s.config);
  const voltage = useSimulation((s) => s.readings.batteryVoltage);
  const lowVoltAlarm = alarms.find((a) => a.type === "BATTERY_LOW_VOLTAGE");
  const acknowledged = lowVoltAlarm?.acknowledged ?? false;

  return (
    <StepShell
      stepNumber={8}
      title="แบตเตอรี่แรงดันต่ำ (Battery Low Voltage)"
      description={`เมื่อแรงดันแบตเตอรี่ลดลงถึงเกณฑ์ ${config.lowVoltageThreshold}V (ระบบ ${config.nominalVoltage}V) ระบบจะแจ้งเตือน Battery Low Voltage`}
      canProceed={acknowledged || voltage <= config.lowVoltageThreshold + 0.5}
      resultNode={
        <p className="text-sm text-slate-300">
          แรงดันปัจจุบัน: <span className="font-mono text-cyan-300">{voltage.toFixed(2)} V</span> /{" "}
          เกณฑ์ {config.lowVoltageThreshold} V
        </p>
      }
    >
      <p className="text-sm text-slate-400">
        เฝ้าระวังแรงดันแบตเตอรี่อย่างใกล้ชิด เมื่อสัญญาณเตือนปรากฏ ให้กดรับทราบก่อนเข้าสู่ขั้นตอนการเชื่อมต่อชาร์จเจอร์กลับคืน
      </p>
    </StepShell>
  );
}
