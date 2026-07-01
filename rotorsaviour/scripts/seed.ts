/**
 * Seeds data/*.json with a starting template (approximated from the
 * pasted "2026 HAEMATOLOGY ROTA" example — merged-cell structure could not
 * be recovered exactly from plain text, so section/column names here are a
 * best-effort reconstruction meant to be tuned via the Template admin page)
 * plus a set of demo staff, working patterns and leave so the app has data
 * to explore on first run.
 */
import { randomUUID } from "crypto";
import {
  saveStaff,
  savePatterns,
  saveLeave,
  saveTemplate,
} from "../src/lib/store";
import type {
  LeaveEntry,
  RotaColumn,
  Staff,
  WorkingPattern,
} from "../src/lib/types";

function mondayOnOrBefore(d: Date): Date {
  const day = (d.getDay() + 6) % 7;
  const out = new Date(d);
  out.setDate(d.getDate() - day);
  return out;
}
const ANCHOR = mondayOnOrBefore(new Date("2026-01-05"));
const anchorISO = ANCHOR.toISOString().slice(0, 10);

let order = 0;
function col(
  section: string,
  label: string,
  eligibleGrades?: RotaColumn["eligibleGrades"]
): RotaColumn {
  return { id: randomUUID(), section, label, order: order++, eligibleGrades };
}

const columns: RotaColumn[] = [
  col("AM CLINIC", "Clinic 1"),
  col("AM CLINIC", "Clinic 2"),
  col("AM CLINIC", "Clinic 3"),
  col("AM CLINIC", "Clinic 4"),
  col("AM CLINIC", "Clinic 5"),
  col("AM CLINIC SUPPORT", "Support 1"),
  col("AM CLINIC SUPPORT", "Support 2"),
  col("AM CLINIC SUPPORT", "Support 3"),
  col("AM CLINIC SUPPORT", "Support 4"),
  col("THROMBOSIS", "Throm"),
  col("PM CLINIC", "CONS", ["CONSULTANT"]),
  col("PM CLINIC", "REG", ["REGISTRAR", "SPR", "SHO"]),
  col("LYMPHOMA", "CONS", ["CONSULTANT"]),
  col("LYMPHOMA", "REG", ["REGISTRAR", "SPR", "SHO"]),
  col("WARD", "CONS", ["CONSULTANT"]),
  col("WARD", "REG", ["REGISTRAR", "SPR", "SHO"]),
  col("WARD", "BM Bx"),
  col("OUTLIERS", "CONS", ["CONSULTANT"]),
  col("OUTLIERS", "REG", ["REGISTRAR", "SPR", "SHO"]),
  col("BLEEP 1915", "CON", ["CONSULTANT"]),
  col("BLEEP 1915", "REG", ["REGISTRAR", "SPR", "SHO"]),
  col("LAB", "Lab"),
  col("BM BIOPSY / REPORT", "Biopsy"),
  col("BM BIOPSY / REPORT", "Report"),
  col("ON CALL", "CONS", ["CONSULTANT"]),
  col("ON CALL", "REG", ["REGISTRAR", "SPR", "SHO"]),
  col("LEAVE", "Annual (½)"),
  col("LEAVE", "Other"),
  col("SPA / NOT AT WORK", "AM"),
  col("SPA / NOT AT WORK", "PM"),
];

const PALETTE = [
  "#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ef4444",
  "#14b8a6", "#eab308", "#ec4899", "#6366f1", "#84cc16",
  "#06b6d4", "#f43f5e", "#8b5cf6", "#10b981", "#d946ef",
  "#0ea5e9", "#f59e0b", "#64748b", "#65a30d",
];

const STAFF_SEED: Array<{
  initials: string;
  grade: Staff["grade"];
  fte: number;
}> = [
  { initials: "CA", grade: "CONSULTANT", fte: 100 },
  { initials: "MG", grade: "CONSULTANT", fte: 100 },
  { initials: "EB", grade: "CONSULTANT", fte: 80 },
  { initials: "DR", grade: "CONSULTANT", fte: 100 },
  { initials: "RA", grade: "CONSULTANT", fte: 60 },
  { initials: "HD", grade: "CONSULTANT", fte: 100 },
  { initials: "GM", grade: "CONSULTANT", fte: 100 },
  { initials: "SK", grade: "CONSULTANT", fte: 80 },
  { initials: "TEC", grade: "REGISTRAR", fte: 100 },
  { initials: "RC", grade: "REGISTRAR", fte: 100 },
  { initials: "HJ", grade: "REGISTRAR", fte: 100 },
  { initials: "AB", grade: "REGISTRAR", fte: 100 },
  { initials: "KM", grade: "REGISTRAR", fte: 100 },
  { initials: "BM", grade: "REGISTRAR", fte: 100 },
  { initials: "IJ", grade: "REGISTRAR", fte: 50 },
  { initials: "JY", grade: "REGISTRAR", fte: 100 },
  { initials: "PC", grade: "SPR", fte: 100 },
  { initials: "ML", grade: "SPR", fte: 100 },
  { initials: "SS", grade: "SHO", fte: 100 },
];

const staff: Staff[] = STAFF_SEED.map((s, i) => ({
  id: randomUUID(),
  initials: s.initials,
  fullName: `Dr ${s.initials} (placeholder name)`,
  grade: s.grade,
  ftePercent: s.fte,
  color: PALETTE[i % PALETTE.length],
  active: true,
}));

function fullTimePattern(staffId: string): WorkingPattern {
  return {
    staffId,
    cycleWeeks: 1,
    cycleStartDate: anchorISO,
    days: [
      { am: true, pm: true },
      { am: true, pm: true },
      { am: true, pm: true },
      { am: true, pm: true },
      { am: true, pm: true },
      { am: false, pm: false },
      { am: false, pm: false },
    ],
  };
}

function partTimePattern(staffId: string, ftePercent: number): WorkingPattern {
  // Approximate part-time as N working days/week (Mon-first), full AM+PM those days.
  const daysPerWeek = Math.max(1, Math.round((ftePercent / 100) * 5));
  const days = Array.from({ length: 7 }, (_, i) => ({
    am: i < daysPerWeek,
    pm: i < daysPerWeek,
  }));
  return { staffId, cycleWeeks: 1, cycleStartDate: anchorISO, days };
}

function alternateWeekPattern(staffId: string): WorkingPattern {
  const workWeek = Array.from({ length: 5 }, () => ({ am: true, pm: true }));
  const weekend = [{ am: false, pm: false }, { am: false, pm: false }];
  const offWeek = Array.from({ length: 7 }, () => ({ am: false, pm: false }));
  return {
    staffId,
    cycleWeeks: 2,
    cycleStartDate: anchorISO,
    days: [...workWeek, ...weekend, ...offWeek],
  };
}

const patterns: WorkingPattern[] = staff.map((s) => {
  if (s.initials === "RA") return alternateWeekPattern(s.id);
  if (s.ftePercent < 100) return partTimePattern(s.id, s.ftePercent);
  return fullTimePattern(s.id);
});

const byInitials = (i: string) => staff.find((s) => s.initials === i)!.id;

const leave: LeaveEntry[] = [
  {
    id: randomUUID(),
    staffId: byInitials("EB"),
    startDate: "2026-02-16",
    endDate: "2026-02-20",
    period: "FULL",
    type: "ANNUAL",
    notes: "Half-term leave",
  },
  {
    id: randomUUID(),
    staffId: byInitials("HJ"),
    startDate: "2026-02-04",
    endDate: "2026-02-04",
    period: "PM",
    type: "SPA",
  },
  {
    id: randomUUID(),
    staffId: byInitials("PC"),
    startDate: "2026-02-10",
    endDate: "2026-02-11",
    period: "FULL",
    type: "STUDY",
    notes: "Course",
  },
];

async function main() {
  await saveTemplate({ name: "Haematology Rota", columns });
  await saveStaff(staff);
  await savePatterns(patterns);
  await saveLeave(leave);
  console.log(
    `Seeded ${staff.length} staff, ${columns.length} columns, ${leave.length} leave entries.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
