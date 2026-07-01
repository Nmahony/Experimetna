import {
  getAssignments,
  getLeave,
  getPatterns,
  getStaff,
  getTemplate,
} from "./store";
import { availabilityFor } from "./pattern";
import { toISODate } from "./dates";
import type { RotaColumn, Staff } from "./types";

export async function loadRotaData(year: number) {
  const [staff, patterns, leave, template, assignments] = await Promise.all([
    getStaff(),
    getPatterns(),
    getLeave(),
    getTemplate(),
    getAssignments(year),
  ]);
  return { staff, patterns, leave, template, assignments };
}

export function groupedColumns(columns: RotaColumn[]) {
  const sorted = [...columns].sort((a, b) => a.order - b.order);
  const sections: { section: string; columns: RotaColumn[] }[] = [];
  for (const c of sorted) {
    const last = sections[sections.length - 1];
    if (last && last.section === c.section) last.columns.push(c);
    else sections.push({ section: c.section, columns: [c] });
  }
  return sections;
}

export function eligibleStaff(column: RotaColumn, staff: Staff[]): Staff[] {
  const active = staff.filter((s) => s.active);
  if (!column.eligibleGrades || column.eligibleGrades.length === 0)
    return active;
  return active.filter((s) => column.eligibleGrades!.includes(s.grade));
}

export function staffAvailability(
  staff: Staff[],
  patterns: Awaited<ReturnType<typeof getPatterns>>,
  leave: Awaited<ReturnType<typeof getLeave>>,
  date: Date
) {
  const iso = toISODate(date);
  const patternByStaff = new Map(patterns.map((p) => [p.staffId, p]));
  return new Map(
    staff.map((s) => [
      s.id,
      availabilityFor(patternByStaff.get(s.id), leave, s.id, date, iso),
    ])
  );
}

export function availabilityMatrix(
  dates: Date[],
  staff: Staff[],
  patterns: Awaited<ReturnType<typeof getPatterns>>,
  leave: Awaited<ReturnType<typeof getLeave>>
) {
  const patternByStaff = new Map(patterns.map((p) => [p.staffId, p]));
  const matrix: Record<
    string,
    Record<string, { am: boolean; pm: boolean; leaveType?: string }>
  > = {};
  for (const date of dates) {
    const iso = toISODate(date);
    matrix[iso] = {};
    for (const s of staff) {
      const a = availabilityFor(patternByStaff.get(s.id), leave, s.id, date, iso);
      matrix[iso][s.id] = { am: a.am, pm: a.pm, leaveType: a.leave?.type };
    }
  }
  return matrix;
}
