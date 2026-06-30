"use client";

import { useState } from "react";
import { CheckSquare, Square, TriangleAlert } from "lucide-react";
import StepShell from "@/components/StepShell";
import { useSimulation } from "@/hooks/useSimulation";

const CHECKS = [
  { key: "rectifier", label: "Rectifier Healthy — เครื่องเรียงกระแสทำงานปกติ" },
  { key: "voltage", label: "Battery Voltage Normal — แรงดันแบตเตอรี่อยู่ในเกณฑ์ปกติ" },
  { key: "temp", label: "Battery Temperature Normal — อุณหภูมิแบตเตอรี่อยู่ในเกณฑ์ปกติ" },
] as const;

export default function Step1() {
  const verifyHealth = useSimulation((s) => s.verifyHealth);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [verified, setVerified] = useState(false);
  const [warning, setWarning] = useState(false);

  const allChecked = CHECKS.every((c) => checked[c.key]);

  const handleVerify = () => {
    if (allChecked) {
      setVerified(true);
      setWarning(false);
      verifyHealth(true);
    } else {
      setWarning(true);
      verifyHealth(false);
    }
  };

  return (
    <StepShell
      stepNumber={1}
      title="ตรวจสอบสุขภาพระบบ (Check System Health)"
      description="Rectifier ON • Battery Float Charge • No Alarm — ตรวจสอบความพร้อมก่อนเริ่มการทดสอบ"
      canProceed={verified}
      resultNode={
        verified ? (
          <p className="text-sm text-emerald-300">ระบบพร้อมสำหรับการทดสอบ Discharge Test ✓</p>
        ) : warning ? (
          <div className="flex items-center gap-2 text-sm text-amber-300">
            <TriangleAlert size={16} /> กรุณายืนยันรายการตรวจสอบให้ครบถ้วนก่อนดำเนินการต่อ
          </div>
        ) : null
      }
    >
      <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-400">
        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-300">Rectifier ON</span>
        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-300">Battery Float Charge</span>
        <span className="rounded-full bg-slate-400/10 px-3 py-1 text-slate-300">No Alarm</span>
      </div>
      <div className="space-y-2">
        {CHECKS.map((c) => (
          <button
            key={c.key}
            onClick={() => setChecked((p) => ({ ...p, [c.key]: !p[c.key] }))}
            className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-black/10 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-cyan-400/40"
          >
            {checked[c.key] ? (
              <CheckSquare size={18} className="text-cyan-400" />
            ) : (
              <Square size={18} className="text-slate-500" />
            )}
            {c.label}
          </button>
        ))}
      </div>
      <button
        onClick={handleVerify}
        className="mt-4 rounded-lg bg-cyan-500/20 px-5 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/30"
      >
        ยืนยันการตรวจสอบ
      </button>
    </StepShell>
  );
}
