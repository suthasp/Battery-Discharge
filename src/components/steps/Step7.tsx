"use client";

import { useState } from "react";
import StepShell from "@/components/StepShell";
import RealtimeCharts from "@/components/RealtimeCharts";
import { useSimulation } from "@/hooks/useSimulation";

export default function Step7() {
  const chartData = useSimulation((s) => s.chartData);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <StepShell
      stepNumber={7}
      title="ดำเนินการทดสอบต่อเนื่อง (Continue Test)"
      description="ติดตามค่า Voltage / Current / Capacity แบบเรียลไทม์ผ่านกราฟขณะแบตเตอรี่คายประจุต่อเนื่อง"
      canProceed={confirmed}
      resultNode={<RealtimeCharts data={chartData} />}
    >
      <button
        onClick={() => setConfirmed(true)}
        disabled={confirmed}
        className="rounded-lg bg-cyan-500/20 px-5 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/30 disabled:opacity-40"
      >
        ยืนยันการเฝ้าระวังกราฟเรียลไทม์
      </button>
    </StepShell>
  );
}
