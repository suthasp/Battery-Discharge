"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import StepShell from "@/components/StepShell";
import { useSimulation } from "@/hooks/useSimulation";
import { generatePdfReport } from "@/utils/report";

export default function Step11() {
  const operatorName = useSimulation((s) => s.operatorName);
  const siteId = useSimulation((s) => s.siteId);
  const startedAt = useSimulation((s) => s.startedAt);
  const initialRecord = useSimulation((s) => s.initialRecord);
  const readings = useSimulation((s) => s.readings);
  const monitoringSamples = useSimulation((s) => s.monitoringSamples);
  const [generated, setGenerated] = useState(false);

  const durationSeconds = readings.elapsedSeconds;
  const passFail: "PASS" | "FAIL" =
    readings.batteryVoltage >= (initialRecord?.floatVoltage ?? 54) - 2 ? "PASS" : "FAIL";

  const handleGenerate = () => {
    generatePdfReport({
      operatorName,
      siteId,
      startedAt,
      durationSeconds,
      initialRecord,
      readings,
      monitoringSamples,
      passFail,
    });
    setGenerated(true);
  };

  return (
    <StepShell
      stepNumber={11}
      title="ออกรายงานผลการทดสอบ (Generate Report)"
      description="สรุปผลการทดสอบ Battery Discharge Test พร้อมออกรายงาน PDF"
      canProceed={generated}
      resultNode={
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <ResultItem label="Operator" value={operatorName} />
          <ResultItem label="Duration" value={`${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`} />
          <ResultItem label="Start Voltage" value={`${initialRecord?.batteryVoltage.toFixed(2) ?? "-"} V`} />
          <ResultItem label="End Voltage" value={`${readings.batteryVoltage.toFixed(2)} V`} />
          <ResultItem label="Battery Capacity" value={`${readings.batteryCapacity.toFixed(1)} %`} />
          <ResultItem
            label="Pass / Fail"
            value={passFail}
            highlight={passFail === "PASS" ? "text-emerald-300" : "text-red-300"}
          />
        </div>
      }
    >
      <button
        onClick={handleGenerate}
        className="flex items-center gap-2 rounded-lg bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/30"
      >
        <FileDown size={16} /> สร้างรายงาน PDF
      </button>
    </StepShell>
  );
}

function ResultItem({ label, value, highlight }: { label: string; value: string; highlight?: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-black/10 p-3">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className={`font-mono font-semibold ${highlight ?? "text-slate-200"}`}>{value}</p>
    </div>
  );
}
