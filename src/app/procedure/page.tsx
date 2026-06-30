import GlassCard from "@/components/GlassCard";
import PageHeader from "@/components/PageHeader";

const PROCEDURE = [
  { title: "ตรวจสอบสุขภาพระบบ", detail: "ตรวจสอบ Rectifier ON, Battery Float Charge และไม่มีสัญญาณเตือนก่อนเริ่มการทดสอบ" },
  { title: "บันทึกค่าเริ่มต้น", detail: "บันทึก Battery Voltage, Float Voltage, Load Current, Room/Battery Temperature" },
  { title: "ปลดชาร์จเจอร์", detail: "Disable Charger เพื่อให้ Rectifier หยุดชาร์จและเริ่มสภาวะ Discharge" },
  { title: "แบตเตอรี่เริ่มคายประจุ", detail: "ระดับประจุและแรงดันลดลงตามเส้นโค้งการคายประจุจริง (Battery Discharge Curve)" },
  { title: "เฝ้าระวัง (Monitoring)", detail: "บันทึกค่า Voltage/Current/Capacity/Temperature ทุก 5 นาทีของการทดสอบ" },
  { title: "สัญญาณเตือนแบตเตอรี่ต่ำ 95%", detail: "รับทราบสัญญาณเตือน Battery Low Warning" },
  { title: "ดำเนินการทดสอบต่อเนื่อง", detail: "เฝ้าระวังกราฟเรียลไทม์ และตอบสนองต่อ Random Event ที่อาจเกิดขึ้น" },
  { title: "แบตเตอรี่แรงดันต่ำ", detail: "เมื่อแรงดันถึงเกณฑ์ Low Voltage Threshold ให้รับทราบสัญญาณเตือน" },
  { title: "เชื่อมต่อชาร์จเจอร์กลับคืน", detail: "Enable Charger เพื่อให้ Rectifier กลับมาชาร์จแบตเตอรี่" },
  { title: "ฟื้นฟูสภาพแบตเตอรี่", detail: "ระดับประจุและแรงดันฟื้นตัวกลับสู่สภาวะ Float Charge ปกติ" },
  { title: "ออกรายงานผลการทดสอบ", detail: "สร้างรายงาน PDF สรุปผล Operator, Duration, Start/End Voltage, Pass/Fail" },
  { title: "ผลการฝึกอบรม", detail: "แสดงคะแนน ข้อผิดพลาด เวลาที่ใช้ และ Certificate of Completion" },
];

const GLOSSARY = [
  ["SLD (Single Line Diagram)", "แผนภาพแสดงเส้นทางจ่ายไฟหลักของระบบ Power System แบบเส้นเดียว"],
  ["LVD (Low Voltage Disconnect)", "อุปกรณ์ตัดการเชื่อมต่อแบตเตอรี่เมื่อแรงดันต่ำเกินเกณฑ์เพื่อป้องกันความเสียหาย"],
  ["LVBD / LVLD", "Low Voltage Battery/Load Disconnect — ตัดวงจรแบตเตอรี่หรือโหลดตามลำดับความสำคัญ"],
  ["Equalize Charge / Float Charge", "โหมดการชาร์จแบบเร่งสมดุลเซลล์ และโหมดการชาร์จคงแรงดันปกติ"],
  ["Manual Bypass", "การบายพาสระบบ Rectifier ด้วยมือในกรณีบำรุงรักษาหรือเหตุฉุกเฉิน"],
  ["Battery String Selection", "การเลือกชุดแบตเตอรี่ (String A/B) ที่ใช้งานในระบบ"],
  ["Ripple", "แรงดันกระเพื่อมของไฟ DC ที่ออกจาก Rectifier ซึ่งบ่งบอกสุขภาพของระบบ"],
];

export default function ProcedurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8">
      <PageHeader title="ขั้นตอนปฏิบัติงาน" subtitle="Battery Discharge Test Procedure — 12 Steps" />

      <div className="space-y-3">
        {PROCEDURE.map((p, i) => (
          <GlassCard key={i} delay={i * 0.03} className="flex gap-4 p-4">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-bold text-cyan-300">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-100">{p.title}</p>
              <p className="text-xs text-slate-400">{p.detail}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold text-cyan-300">คำศัพท์ระบบไฟฟ้า (Glossary)</h2>
      <GlassCard className="divide-y divide-white/5 p-0">
        {GLOSSARY.map(([term, def], i) => (
          <div key={i} className="p-4">
            <p className="text-sm font-semibold text-slate-100">{term}</p>
            <p className="text-xs text-slate-400">{def}</p>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}
