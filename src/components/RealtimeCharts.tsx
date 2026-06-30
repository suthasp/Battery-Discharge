"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartPoint } from "@/data/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Legend, Tooltip);

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 200 } as const,
  plugins: {
    legend: { labels: { color: "#94a3b8", font: { size: 10 } } },
    tooltip: { mode: "index" as const, intersect: false },
  },
  scales: {
    x: { ticks: { color: "#64748b", font: { size: 9 } }, grid: { color: "rgba(100,116,139,0.1)" } },
    y: { ticks: { color: "#64748b", font: { size: 9 } }, grid: { color: "rgba(100,116,139,0.1)" } },
  },
};

export default function RealtimeCharts({ data }: { data: ChartPoint[] }) {
  const labels = data.map((d) => `${d.t}m`);

  const voltageData = {
    labels,
    datasets: [
      {
        label: "Battery Voltage (V)",
        data: data.map((d) => d.voltage),
        borderColor: "#22d3ee",
        backgroundColor: "rgba(34,211,238,0.15)",
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const currentData = {
    labels,
    datasets: [
      {
        label: "Battery Current (A)",
        data: data.map((d) => d.current),
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.15)",
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const capacityData = {
    labels,
    datasets: [
      {
        label: "Battery Capacity (%)",
        data: data.map((d) => d.capacity),
        borderColor: "#34d399",
        backgroundColor: "rgba(52,211,153,0.15)",
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const tempData = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: data.map((d) => d.temperature),
        borderColor: "#f87171",
        backgroundColor: "rgba(248,113,113,0.15)",
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="h-44 rounded-xl border border-white/5 bg-black/10 p-3">
        <Line data={voltageData} options={baseOptions} />
      </div>
      <div className="h-44 rounded-xl border border-white/5 bg-black/10 p-3">
        <Line data={currentData} options={baseOptions} />
      </div>
      <div className="h-44 rounded-xl border border-white/5 bg-black/10 p-3">
        <Line data={capacityData} options={baseOptions} />
      </div>
      <div className="h-44 rounded-xl border border-white/5 bg-black/10 p-3">
        <Line data={tempData} options={baseOptions} />
      </div>
    </div>
  );
}
