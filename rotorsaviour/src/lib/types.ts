export type Grade = "CONSULTANT" | "REGISTRAR" | "SPR" | "SHO" | "OTHER";

export const GRADES: Grade[] = ["CONSULTANT", "REGISTRAR", "SPR", "SHO", "OTHER"];

export interface Staff {
  id: string;
  initials: string;
  fullName: string;
  grade: Grade;
  ftePercent: number;
  color: string;
  active: boolean;
  notes?: string;
}

export interface PatternDay {
  am: boolean;
  pm: boolean;
}

/**
 * A recurring working pattern. `days` has length `cycleWeeks * 7`, index 0 is
 * Monday of week 0 of the cycle, index 6 is Sunday of week 0, index 7 is
 * Monday of week 1, etc. `cycleStartDate` anchors a Monday to week 0 so that
 * irregular / every-other-week / part-time patterns can be evaluated for any date.
 */
export interface WorkingPattern {
  staffId: string;
  cycleWeeks: number;
  cycleStartDate: string;
  days: PatternDay[];
}

export type LeaveType = "ANNUAL" | "STUDY" | "SPA" | "SICK" | "OTHER";
export type LeavePeriod = "AM" | "PM" | "FULL";

export const LEAVE_TYPES: LeaveType[] = ["ANNUAL", "STUDY", "SPA", "SICK", "OTHER"];

export interface LeaveEntry {
  id: string;
  staffId: string;
  startDate: string;
  endDate: string;
  period: LeavePeriod;
  type: LeaveType;
  notes?: string;
}

export interface RotaColumn {
  id: string;
  section: string;
  label: string;
  order: number;
  eligibleGrades?: Grade[];
}

export interface RotaTemplate {
  name: string;
  columns: RotaColumn[];
}

export interface RotaAssignment {
  date: string;
  columnId: string;
  staffId: string | null;
  note?: string;
}

export type AssignmentMap = Record<string, RotaAssignment>;

export function assignmentKey(date: string, columnId: string): string {
  return `${date}__${columnId}`;
}
