"use client";

import StepShell from "@/components/StepShell";
import { useSimulation } from "@/hooks/useSimulation";
import { formatElapsed } from "@/utils/simulation";
import { ClipboardList } from "lucide-react";

export default function Step5() {
  const readings = useSimulation((s) => s.readings);
  const samples = useSimulation((s) => s.monitoringSamples);
  const recordMonitoringSample = useSimulation((s) => s.recordMonitoringSample);

  return (
    <StepShell
      stepNumber={5}
      title="เฝ้าระวังค่าพารามิเตอร์ (Monitoring)"
      description="บันทึกค่า Voltage / Current / Capacity / Temperature ทุก ๆ 5 นาทีตามรอบการทดสอบ"
      canProceed={samples.length >= 1}
      resultNode={
        samples.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400">
                <tr>
                  <th className="py-1 pr-4">เวลา (นาที)</th>
                  <th className="py-1 pr-4">Voltage</th>
                  <th className="py-1 pr-4">Current</th>
                  <th className="py-1 pr-4">Capacity</th>
                  <th className="py-1 pr-4">Temp</th>
                </tr>
              </thead>
              <tbody className="font-mono text-slate-200">
                {samples.map((s, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-1 pr-4">{s.timeMinutes}</td>
                    <td className="py-1 pr-4">{s.voltage.toFixed(2)}V</td>
                    <td className="py-1 pr-4">{s.current.toFixed(1)}A</td>
                    <td className="py-1 pr-4">{s.capacity.toFixed(1)}%</td>
                    <td className="py-1 pr-4">{s.temperature.toFixed(1)}°C</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null
      }
    >
      <p className="mb-3 text-sm text-slate-400">
        เวลาที่ผ่านไป: <span className="font-mono text-cyan-300">{formatElapsed(readings.elapsedSeconds)}</span>
      </p>
      <button
        onClick={recordMonitoringSample}
        className="flex items-center gap-2 rounded-lg bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/30"
      >
        <ClipboardList size={16} /> Record Data
      </button>
    </StepShell>
  );
}
