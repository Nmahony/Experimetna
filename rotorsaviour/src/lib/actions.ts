"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import {
  assignmentKey,
  type Grade,
  type LeavePeriod,
  type LeaveType,
  type RotaColumn,
} from "./types";
import {
  getAssignments,
  getLeave,
  getPatterns,
  getStaff,
  saveAssignments,
  saveLeave,
  savePatterns,
  saveStaff,
  saveTemplate,
} from "./store";
import { emptyPatternDays } from "./pattern";

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function saveStaffMember(formData: FormData) {
  const id = str(formData, "id");
  const staff = await getStaff();

  const record = {
    id: id || randomUUID(),
    initials: str(formData, "initials").toUpperCase(),
    fullName: str(formData, "fullName"),
    grade: str(formData, "grade") as Grade,
    ftePercent: Number(str(formData, "ftePercent") || "100"),
    color: str(formData, "color") || "#64748b",
    active: formData.get("active") === "on",
  };

  const idx = staff.findIndex((s) => s.id === record.id);
  if (idx >= 0) staff[idx] = { ...staff[idx], ...record };
  else staff.push(record);
  await saveStaff(staff);

  if (idx < 0) {
    const patterns = await getPatterns();
    if (!patterns.some((p) => p.staffId === record.id)) {
      patterns.push({
        staffId: record.id,
        cycleWeeks: 1,
        cycleStartDate: new Date().toISOString().slice(0, 10),
        days: emptyPatternDays(1),
      });
      await savePatterns(patterns);
    }
  }

  revalidatePath("/staff");
  revalidatePath(`/staff/${record.id}`);
}

export async function savePattern(formData: FormData) {
  const staffId = str(formData, "staffId");
  const cycleWeeks = Math.max(1, Number(str(formData, "cycleWeeks") || "1"));
  const cycleStartDate = str(formData, "cycleStartDate");

  const days = Array.from({ length: cycleWeeks * 7 }, (_, i) => ({
    am: formData.get(`day-${i}-am`) === "on",
    pm: formData.get(`day-${i}-pm`) === "on",
  }));

  const patterns = await getPatterns();
  const idx = patterns.findIndex((p) => p.staffId === staffId);
  const record = { staffId, cycleWeeks, cycleStartDate, days };
  if (idx >= 0) patterns[idx] = record;
  else patterns.push(record);
  await savePatterns(patterns);

  revalidatePath(`/staff/${staffId}`);
}

export async function createLeave(formData: FormData) {
  const leave = await getLeave();
  leave.push({
    id: randomUUID(),
    staffId: str(formData, "staffId"),
    startDate: str(formData, "startDate"),
    endDate: str(formData, "endDate") || str(formData, "startDate"),
    period: str(formData, "period") as LeavePeriod,
    type: str(formData, "type") as LeaveType,
    notes: str(formData, "notes") || undefined,
  });
  await saveLeave(leave);
  revalidatePath("/leave");
  revalidatePath("/rota");
}

export async function deleteLeave(formData: FormData) {
  const id = str(formData, "id");
  const leave = await getLeave();
  await saveLeave(leave.filter((l) => l.id !== id));
  revalidatePath("/leave");
  revalidatePath("/rota");
}

export async function saveTemplateColumns(formData: FormData) {
  const raw = str(formData, "columns");
  const columns = JSON.parse(raw) as RotaColumn[];
  const name = str(formData, "name") || "Rota";
  await saveTemplate({ name, columns });
  revalidatePath("/template");
  revalidatePath("/rota");
}

export async function setAssignment(
  year: number,
  date: string,
  columnId: string,
  staffId: string | null
) {
  const assignments = await getAssignments(year);
  const key = assignmentKey(date, columnId);
  if (staffId) assignments[key] = { date, columnId, staffId };
  else delete assignments[key];
  await saveAssignments(year, assignments);
  revalidatePath(`/rota/${year}`);
}
