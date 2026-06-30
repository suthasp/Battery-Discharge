"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { useSimulation, TICK_INTERVAL_MS } from "@/hooks/useSimulation";
import Step1 from "@/components/steps/Step1";
import Step2 from "@/components/steps/Step2";
import Step3 from "@/components/steps/Step3";
import Step4 from "@/components/steps/Step4";
import Step5 from "@/components/steps/Step5";
import Step6 from "@/components/steps/Step6";
import Step7 from "@/components/steps/Step7";
import Step8 from "@/components/steps/Step8";
import Step9 from "@/components/steps/Step9";
import Step10 from "@/components/steps/Step10";
import Step11 from "@/components/steps/Step11";
import Step12 from "@/components/steps/Step12";

const STEP_COMPONENTS = [
  null,
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
  Step8,
  Step9,
  Step10,
  Step11,
  Step12,
];

export default function SimulationPage() {
  const router = useRouter();
  const step = useSimulation((s) => s.step);
  const running = useSimulation((s) => s.running);
  const tick = useSimulation((s) => s.tick);
  const triggerRandomEvent = useSimulation((s) => s.triggerRandomEvent);
  const eventFiredRef = useRef(false);

  useEffect(() => {
    if (!running) router.replace("/");
  }, [running, router]);

  useEffect(() => {
    if (!running) return;
    const active = step >= 4 && step <= 10;
    if (!active) return;
    const interval = setInterval(tick, TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [running, step, tick]);

  useEffect(() => {
    if (step === 7 && !eventFiredRef.current) {
      eventFiredRef.current = true;
      const timeout = setTimeout(() => {
        triggerRandomEvent("ROOM_TEMP_HIGH", "อุณหภูมิห้องสูงขึ้นผิดปกติ — Room Temperature Increase");
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [step, triggerRandomEvent]);

  if (!running) return null;

  const StepComponent = STEP_COMPONENTS[step];

  return (
    <div className="relative min-h-screen px-4 py-6 sm:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.08),transparent_60%)]" />
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-sm font-bold text-slate-300">
            Rectifier Battery Discharge Test Simulator
          </h1>
          <ThemeToggle />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            {StepComponent && <StepComponent />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
