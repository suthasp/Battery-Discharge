"use client";

import { motion } from "framer-motion";
import { batteryStatusColor } from "@/utils/simulation";

export default function BatterySVG({ capacity }: { capacity: number }) {
  const color = batteryStatusColor(capacity);
  const innerHeight = 90;
  const fillHeight = (capacity / 100) * innerHeight;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="70" height="130" viewBox="0 0 70 130">
        <rect x="26" y="2" width="18" height="8" rx="2" fill="#64748b" />
        <rect
          x="4"
          y="10"
          width="62"
          height="116"
          rx="8"
          fill="none"
          stroke="#475569"
          strokeWidth="3"
        />
        <clipPath id="batteryClip">
          <rect x="8" y="14" width="54" height="108" rx="5" />
        </clipPath>
        <g clipPath="url(#batteryClip)">
          <rect x="8" y="14" width="54" height="108" fill="rgba(148,163,184,0.08)" />
          <motion.rect
            x="8"
            width="54"
            rx="2"
            initial={false}
            animate={{ height: fillHeight, y: 122 - fillHeight, fill: color }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </g>
      </svg>
      <span className="font-mono text-sm font-bold" style={{ color }}>
        {capacity.toFixed(1)}%
      </span>
    </div>
  );
}
