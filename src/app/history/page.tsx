"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageHeader from "@/components/PageHeader";
import { useSimulation } from "@/hooks/useSimulation";
import { formatElapsed } from "@/utils/simulation";

export default function HistoryPage() {
  const history = useSimulation((s) => s.history);
  const loadHistory = useSimulation((s) => s.loadHistory);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8">
      <PageHeader title="ประวัติการฝึก" subtitle="History — บันทึกผลการฝึกอบรมที่ผ่านมา" />

      {history.length === 0 ? (
        <GlassCard className="p-8 text-center text-sm text-slate-400">
          ยังไม่มีประวัติการฝึกอบรม — เริ่มการจำลองครั้งแรกเพื่อบันทึกผลลัพธ์
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {history.map((h) => (
            <GlassCard key={h.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {h.passFail === "PASS" ? (
                  <CheckCircle2 className="text-emerald-400" size={22} />
                ) : (
                  <XCircle className="text-red-400" size={22} />
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-100">{h.operator}</p>
                  <p className="text-xs text-slate-500">{new Date(h.date).toLocaleString("th-TH")}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-lg font-bold text-cyan-300">{h.score}</p>
                <p className="text-xs text-slate-500">
                  {formatElapsed(h.durationSeconds)} • {h.mistakes} ผิดพลาด
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
