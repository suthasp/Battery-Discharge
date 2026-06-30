"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Award, Home, RotateCcw } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { useSimulation } from "@/hooks/useSimulation";
import { formatElapsed } from "@/utils/simulation";

export default function Step12() {
  const router = useRouter();
  const scoreEvents = useSimulation((s) => s.scoreEvents);
  const readings = useSimulation((s) => s.readings);
  const operatorName = useSimulation((s) => s.operatorName);
  const finalizeHistory = useSimulation((s) => s.finalizeHistory);
  const resetSimulation = useSimulation((s) => s.resetSimulation);
  const finalizedRef = useRef(false);

  useEffect(() => {
    if (finalizedRef.current) return;
    finalizedRef.current = true;
    finalizeHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const score = scoreEvents.reduce((acc, e) => acc + e.delta, 0);
  const mistakes = scoreEvents.filter((e) => e.delta < 0).length;
  const passFail: "PASS" | "FAIL" = score >= 60 && mistakes <= 3 ? "PASS" : "FAIL";

  return (
    <div className="space-y-4">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-wide text-cyan-400">ขั้นตอนที่ 12 / 12</span>
        <h2 className="text-2xl font-bold text-slate-100">ผลการฝึกอบรม (Training Result)</h2>
      </div>

      <GlassCard className="p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-sky-500 text-white shadow-lg shadow-cyan-500/40"
        >
          <Award size={36} />
        </motion.div>
        <p className="text-sm text-slate-400">คะแนนรวม (Score)</p>
        <p className="text-4xl font-extrabold text-cyan-300">{score}</p>
        <p
          className={`mt-1 text-sm font-semibold ${
            passFail === "PASS" ? "text-emerald-300" : "text-red-300"
          }`}
        >
          {passFail === "PASS" ? "ผ่านการฝึกอบรม (PASS)" : "ไม่ผ่านการฝึกอบรม (FAIL)"}
        </p>
      </GlassCard>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <GlassCard className="p-4 text-center">
          <p className="text-xs text-slate-500">ข้อผิดพลาด (Mistakes)</p>
          <p className="text-2xl font-bold text-red-300">{mistakes}</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-xs text-slate-500">เวลาที่ใช้ (Completion Time)</p>
          <p className="text-2xl font-bold text-slate-200">{formatElapsed(readings.elapsedSeconds)}</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-xs text-slate-500">ผู้ปฏิบัติงาน</p>
          <p className="text-2xl font-bold text-slate-200">{operatorName}</p>
        </GlassCard>
      </div>

      <GlassCard className="space-y-2 p-5">
        <h3 className="text-sm font-semibold text-cyan-300">รายละเอียดคะแนน (Score Breakdown)</h3>
        <div className="max-h-48 space-y-1 overflow-y-auto scrollbar-thin pr-1">
          {scoreEvents.map((e, i) => (
            <div key={i} className="flex justify-between text-xs text-slate-400">
              <span>
                ขั้นตอน {e.step} — {e.label}
              </span>
              <span className={e.delta < 0 ? "text-red-300" : "text-emerald-300"}>
                {e.delta > 0 ? "+" : ""}
                {e.delta}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="border-2 border-cyan-400/30 p-6 text-center">
        <p className="text-xs uppercase tracking-widest text-cyan-400">Certificate of Completion</p>
        <p className="mt-2 text-lg font-bold text-slate-100">{operatorName}</p>
        <p className="text-sm text-slate-400">ได้ผ่านการฝึกอบรม Rectifier Battery Discharge Test Simulator</p>
        <p className="mt-2 text-xs text-slate-500">{new Date().toLocaleDateString("th-TH")}</p>
      </GlassCard>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => {
            resetSimulation();
            router.push("/");
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30"
        >
          <Home size={16} /> กลับสู่หน้าหลัก
        </button>
        <button
          onClick={() => {
            resetSimulation();
            router.push("/history");
          }}
          className="flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300"
        >
          <RotateCcw size={16} /> ดูประวัติการฝึก
        </button>
      </div>
    </div>
  );
}
