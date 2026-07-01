import type { LeaveEntry, PatternDay, WorkingPattern } from "./types";

function daysBetween(a: Date, b: Date): number {
  const ms = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) -
    Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  return Math.round(ms / 86_400_000);
}

function mondayIndex(date: Date): number {
  // JS getDay(): 0=Sun..6=Sat. We want 0=Mon..6=Sun.
  return (date.getDay() + 6) % 7;
}

/** Returns the staff's default AM/PM availability from their working pattern, ignoring leave. */
export function patternDayFor(
  pattern: WorkingPattern | undefined,
  date: Date
): PatternDay {
  if (!pattern || pattern.days.length === 0) return { am: true, pm: true };
  const anchor = new Date(pattern.cycleStartDate + "T00:00:00Z");
  const anchorMonday = new Date(anchor);
  anchorMonday.setUTCDate(anchor.getUTCDate() - mondayIndex(anchor));

  const dateUTC = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const totalDays = pattern.cycleWeeks * 7;
  const offset = daysBetween(anchorMonday, dateUTC);
  const dayIndex = ((offset % totalDays) + totalDays) % totalDays;
  return pattern.days[dayIndex] ?? { am: false, pm: false };
}

export function leaveOn(
  leave: LeaveEntry[],
  staffId: string,
  isoDate: string
): LeaveEntry | undefined {
  return leave.find(
    (l) =>
      l.staffId === staffId && l.startDate <= isoDate && isoDate <= l.endDate
  );
}

export interface Availability {
  am: boolean;
  pm: boolean;
  leave?: LeaveEntry;
}

export function availabilityFor(
  pattern: WorkingPattern | undefined,
  leave: LeaveEntry[],
  staffId: string,
  date: Date,
  isoDate: string
): Availability {
  const base = patternDayFor(pattern, date);
  const l = leaveOn(leave, staffId, isoDate);
  if (!l) return base;
  if (l.period === "FULL") return { am: false, pm: false, leave: l };
  if (l.period === "AM") return { am: false, pm: base.pm, leave: l };
  return { am: base.am, pm: false, leave: l };
}

export function emptyPatternDays(cycleWeeks: number): PatternDay[] {
  return Array.from({ length: cycleWeeks * 7 }, () => ({
    am: false,
    pm: false,
  }));
}
