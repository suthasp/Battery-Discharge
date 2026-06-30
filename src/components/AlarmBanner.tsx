"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check } from "lucide-react";
import { ActiveAlarm } from "@/data/types";

export default function AlarmBanner({
  alarms,
  onAcknowledge,
}: {
  alarms: ActiveAlarm[];
  onAcknowledge: (id: string) => void;
}) {
  const active = alarms.filter((a) => !a.acknowledged);
  if (active.length === 0) return null;

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {active.map((alarm) => (
          <motion.div
            key={alarm.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center justify-between gap-3 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3"
          >
            <div className="flex items-center gap-2 text-red-300">
              <AlertTriangle size={18} className="pulse-glow" />
              <span className="text-sm font-medium">{alarm.message}</span>
            </div>
            <button
              onClick={() => onAcknowledge(alarm.id)}
              className="flex items-center gap-1 rounded-lg bg-red-400/20 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-400/30"
            >
              <Check size={14} /> รับทราบ
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
