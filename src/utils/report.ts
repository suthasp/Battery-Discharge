import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { InitialRecord, MonitoringSample, SystemReadings } from "@/data/types";

interface ReportInput {
  operatorName: string;
  siteId: string;
  startedAt: number | null;
  durationSeconds: number;
  initialRecord: InitialRecord | null;
  readings: SystemReadings;
  monitoringSamples: MonitoringSample[];
  passFail: "PASS" | "FAIL";
}

export function generatePdfReport(input: ReportInput) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Battery Discharge Test Report", 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Rectifier Battery Discharge Test Simulator", 14, 24);

  autoTable(doc, {
    startY: 32,
    head: [["Field", "Value"]],
    body: [
      ["Operator", input.operatorName],
      ["Site ID", input.siteId],
      ["Date", input.startedAt ? new Date(input.startedAt).toLocaleString() : "-"],
      ["Duration", `${Math.floor(input.durationSeconds / 60)} min ${input.durationSeconds % 60} sec`],
      ["Start Voltage", `${input.initialRecord?.batteryVoltage.toFixed(2) ?? "-"} V`],
      ["End Voltage", `${input.readings.batteryVoltage.toFixed(2)} V`],
      ["Battery Capacity (final)", `${input.readings.batteryCapacity.toFixed(1)} %`],
      ["Result", input.passFail],
    ],
    theme: "striped",
    headStyles: { fillColor: [14, 165, 233] },
  });

  if (input.monitoringSamples.length > 0) {
    autoTable(doc, {
      startY: (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8,
      head: [["Time (min)", "Voltage (V)", "Current (A)", "Capacity (%)", "Temp (°C)"]],
      body: input.monitoringSamples.map((s) => [
        s.timeMinutes,
        s.voltage.toFixed(2),
        s.current.toFixed(1),
        s.capacity.toFixed(1),
        s.temperature.toFixed(1),
      ]),
      theme: "grid",
      headStyles: { fillColor: [6, 182, 212] },
    });
  }

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
  doc.setFontSize(10);
  doc.text("Operator Signature: ____________________", 14, finalY);
  doc.text("Supervisor Signature: ____________________", 14, finalY + 10);

  doc.save(`battery-discharge-report-${Date.now()}.pdf`);
}
