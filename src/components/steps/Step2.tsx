"use client";

import { useForm } from "react-hook-form";
import StepShell from "@/components/StepShell";
import { useSimulation } from "@/hooks/useSimulation";
import { InitialRecord } from "@/data/types";

export default function Step2() {
  const recordInitial = useSimulation((s) => s.recordInitial);
  const initialRecord = useSimulation((s) => s.initialRecord);
  const readings = useSimulation((s) => s.readings);
  const config = useSimulation((s) => s.config);

  const { register, handleSubmit, formState } = useForm<InitialRecord>({
    defaultValues: {
      batteryVoltage: readings.batteryVoltage,
      floatVoltage: config.floatVoltage,
      loadCurrent: readings.loadCurrent,
      roomTemperature: readings.roomTemperature,
      batteryTemperature: readings.batteryTemperature,
    },
  });

  const onSubmit = (values: InitialRecord) => {
    recordInitial({
      batteryVoltage: Number(values.batteryVoltage),
      floatVoltage: Number(values.floatVoltage),
      loadCurrent: Number(values.loadCurrent),
      roomTemperature: Number(values.roomTemperature),
      batteryTemperature: Number(values.batteryTemperature),
    });
  };

  const fields: { name: keyof InitialRecord; label: string; unit: string }[] = [
    { name: "batteryVoltage", label: "Battery Voltage", unit: "V" },
    { name: "floatVoltage", label: "Float Voltage", unit: "V" },
    { name: "loadCurrent", label: "Load Current", unit: "A" },
    { name: "roomTemperature", label: "Room Temperature", unit: "°C" },
    { name: "batteryTemperature", label: "Battery Temperature", unit: "°C" },
  ];

  return (
    <StepShell
      stepNumber={2}
      title="บันทึกค่าเริ่มต้น (Record Initial Value)"
      description="บันทึกค่าพารามิเตอร์เริ่มต้นก่อนทำการทดสอบ Discharge Test"
      canProceed={!!initialRecord}
      resultNode={
        initialRecord ? (
          <p className="text-sm text-emerald-300">บันทึกค่าเริ่มต้นสำเร็จ — พร้อมดำเนินการขั้นตอนต่อไป</p>
        ) : null
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="mb-1 block text-xs text-slate-400">
              {f.label} ({f.unit})
            </label>
            <input
              type="number"
              step="0.1"
              {...register(f.name, { required: true, valueAsNumber: true })}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm font-mono text-slate-100 outline-none focus:border-cyan-400"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={formState.isSubmitSuccessful && !!initialRecord}
          className="col-span-1 mt-2 rounded-lg bg-cyan-500/20 px-5 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/30 sm:col-span-2"
        >
          บันทึกค่าเริ่มต้น
        </button>
      </form>
    </StepShell>
  );
}
