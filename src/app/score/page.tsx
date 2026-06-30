"use client";

import { useEffect } from "react";
import GlassCard from "@/components/GlassCard";
import PageHeader from "@/components/PageHeader";
import { useSimulation } from "@/hooks/useSimulation";

export default function ScorePage() {
  const history = useSimulation((s) => s.history);
  const loadHistory = useSimulation((s) => s.loadHistory);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const best = history.reduce((max, h) => Math.max(max, h.score), 0);
  const avg = history.length ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length) : 0;
  const passRate = history.length
    ? Math.round((history.filter((h) => h.passFail === "PASS").length / history.length) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8">
      <PageHeader title="คะแนนการฝึกอบรม" subtitle="Training Score Overview" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <GlassCard className="p-5 text-center">
          <p className="text-xs text-slate-500">คะแนนสูงสุด</p>
          <p className="text-3xl font-extrabold text-cyan-300">{best}</p>
        </GlassCard>
        <GlassCard className="p-5 text-center">
          <p className="text-xs text-slate-500">คะแนนเฉลี่ย</p>
          <p className="text-3xl font-extrabold text-slate-100">{avg}</p>
        </GlassCard>
        <GlassCard className="p-5 text-center">
          <p className="text-xs text-slate-500">อัตราการผ่าน</p>
          <p className="text-3xl font-extrabold text-emerald-300">{passRate}%</p>
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <h3 className="mb-3 text-sm font-semibold text-cyan-300">เกณฑ์การให้คะแนน (Scoring Rules)</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex justify-between border-b border-white/5 pb-2">
            <span>ปฏิบัติขั้นตอนถูกต้อง (Correct Step)</span>
            <span className="font-mono text-emerald-300">+10</span>
          </li>
          <li className="flex justify-between border-b border-white/5 pb-2">
            <span>ปฏิบัติขั้นตอนผิดพลาด (Wrong Step)</span>
            <span className="font-mono text-red-300">-5</span>
          </li>
          <li className="flex justify-between">
            <span>ข้ามขั้นตอน (Skipped Step)</span>
            <span className="font-mono text-red-300">-10</span>
          </li>
        </ul>
      </GlassCard>
    </div>
  );
}
