"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BatteryCharging, BookOpen, History, Trophy, X, Zap } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import ThemeToggle from "@/components/ThemeToggle";
import { useSimulation } from "@/hooks/useSimulation";

export default function HomePage() {
  const router = useRouter();
  const startSimulation = useSimulation((s) => s.startSimulation);
  const [showStartModal, setShowStartModal] = useState(false);
  const [operatorName, setOperatorName] = useState("");
  const [siteId, setSiteId] = useState("");

  const handleStart = () => {
    if (!operatorName.trim()) return;
    startSimulation(operatorName.trim(), siteId.trim() || "SITE-001");
    router.push("/simulation");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.12),transparent_60%)]" />

      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 text-xs font-medium text-cyan-300"
      >
        <Zap size={14} /> SCADA Training Environment — Telecom Power System
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl text-center text-3xl font-extrabold leading-tight text-slate-50 sm:text-5xl"
      >
        เครื่องจำลองการทดสอบ
        <span className="bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
          {" "}
          Battery Discharge Test
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-4 max-w-xl text-center text-sm text-slate-400 sm:text-base"
      >
        Rectifier Battery Discharge Test Simulator — จำลองขั้นตอนปฏิบัติงานจริงของวิศวกรปฏิบัติการ
        บนระบบ Telecom Rectifier เพื่อการฝึกอบรมเชิงปฏิบัติ
      </motion.p>

      <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        <GlassCard delay={0.3} className="col-span-1 p-6 sm:col-span-2">
          <button
            onClick={() => setShowStartModal(true)}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 py-4 text-lg font-bold text-white shadow-xl shadow-cyan-500/30 transition hover:brightness-110"
          >
            <BatteryCharging size={22} />
            เริ่มการจำลอง (Start Simulation)
          </button>
        </GlassCard>

        <NavCard delay={0.4} href="/history" icon={<History size={20} />} title="ประวัติการฝึก" subtitle="History" />
        <NavCard delay={0.45} href="/score" icon={<Trophy size={20} />} title="คะแนนการฝึกอบรม" subtitle="Training Score" />
        <NavCard
          delay={0.5}
          href="/procedure"
          icon={<BookOpen size={20} />}
          title="ขั้นตอนปฏิบัติงาน"
          subtitle="Procedure"
          full
        />
      </div>

      {showStartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel relative w-full max-w-sm rounded-2xl p-6"
          >
            <button
              onClick={() => setShowStartModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200"
            >
              <X size={18} />
            </button>
            <h3 className="mb-4 text-lg font-bold text-slate-100">ข้อมูลผู้ปฏิบัติงาน</h3>
            <label className="mb-1 block text-xs text-slate-400">ชื่อผู้ปฏิบัติงาน (Operator Name)</label>
            <input
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              placeholder="เช่น สมชาย ใจดี"
              className="mb-3 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
            />
            <label className="mb-1 block text-xs text-slate-400">รหัสสถานี (Site ID)</label>
            <input
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              placeholder="เช่น BKK-RT-021"
              className="mb-5 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleStart}
              disabled={!operatorName.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 py-3 text-sm font-bold text-white transition disabled:opacity-30"
            >
              เริ่มการจำลอง
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function NavCard({
  href,
  icon,
  title,
  subtitle,
  delay,
  full,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  delay: number;
  full?: boolean;
}) {
  return (
    <GlassCard delay={delay} className={full ? "col-span-1 sm:col-span-2" : "col-span-1"}>
      <a
        href={href}
        className="flex items-center gap-3 px-5 py-4 text-slate-200 transition hover:text-cyan-300"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
          {icon}
        </span>
        <span>
          <span className="block font-semibold">{title}</span>
          <span className="block text-xs text-slate-500">{subtitle}</span>
        </span>
      </a>
    </GlassCard>
  );
}
