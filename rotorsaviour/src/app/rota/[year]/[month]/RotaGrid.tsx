"use client";

import { useMemo, useState, useTransition } from "react";
import { setAssignment } from "@/lib/actions";
import { assignmentKey, type AssignmentMap, type RotaColumn, type Staff } from "@/lib/types";

interface DayInfo {
  iso: string;
  day: string;
  weekend: boolean;
}

interface Section {
  section: string;
  columns: RotaColumn[];
}

interface AvailabilityEntry {
  am: boolean;
  pm: boolean;
  leaveType?: string;
}

export default function RotaGrid({
  year,
  days,
  sections,
  staff,
  assignments,
  availability,
}: {
  year: number;
  days: DayInfo[];
  sections: Section[];
  staff: Staff[];
  assignments: AssignmentMap;
  availability: Record<string, Record<string, AvailabilityEntry>>;
}) {
  const [local, setLocal] = useState<AssignmentMap>(assignments);
  const [highlightId, setHighlightId] = useState("");
  const [, startTransition] = useTransition();

  const staffById = useMemo(() => new Map(staff.map((s) => [s.id, s])), [staff]);
  const sortedStaff = useMemo(
    () => [...staff].sort((a, b) => a.initials.localeCompare(b.initials)),
    [staff]
  );

  function optionsFor(column: RotaColumn, iso: string) {
    const eligible = column.eligibleGrades
      ? sortedStaff.filter((s) => column.eligibleGrades!.includes(s.grade))
      : sortedStaff;
    return [...eligible].sort((a, b) => {
      const av = availability[iso]?.[a.id];
      const bv = availability[iso]?.[b.id];
      const aWorking = av ? av.am || av.pm : true;
      const bWorking = bv ? bv.am || bv.pm : true;
      if (aWorking !== bWorking) return aWorking ? -1 : 1;
      return a.initials.localeCompare(b.initials);
    });
  }

  function cellValue(iso: string, columnId: string): string {
    return local[assignmentKey(iso, columnId)]?.staffId ?? "";
  }

  function onChange(iso: string, columnId: string, staffId: string) {
    const key = assignmentKey(iso, columnId);
    setLocal((prev) => {
      const next = { ...prev };
      if (staffId) next[key] = { date: iso, columnId, staffId };
      else delete next[key];
      return next;
    });
    startTransition(() => {
      setAssignment(year, iso, columnId, staffId || null);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <label htmlFor="highlight" className="text-slate-600">
          Highlight my schedule:
        </label>
        <select
          id="highlight"
          value={highlightId}
          onChange={(e) => setHighlightId(e.target.value)}
          className="rounded border border-slate-300 px-2 py-1"
        >
          <option value="">None</option>
          {sortedStaff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.initials} &ndash; {s.fullName}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-auto rounded-lg border border-slate-200 bg-white" style={{ maxHeight: "75vh" }}>
        <table className="border-collapse text-xs">
          <thead className="sticky top-0 z-20 bg-slate-100">
            <tr>
              <th className="sticky left-0 z-30 min-w-[90px] border border-slate-200 bg-slate-100 px-2 py-1">
                Date
              </th>
              <th className="sticky left-[90px] z-30 min-w-[48px] border border-slate-200 bg-slate-100 px-2 py-1">
                Day
              </th>
              {sections.map((s) => (
                <th
                  key={s.section}
                  colSpan={s.columns.length}
                  className="border border-slate-200 bg-slate-200 px-2 py-1 text-center font-semibold uppercase tracking-wide"
                >
                  {s.section}
                </th>
              ))}
            </tr>
            <tr>
              <th className="sticky left-0 z-30 border border-slate-200 bg-slate-100 px-2 py-1" />
              <th className="sticky left-[90px] z-30 border border-slate-200 bg-slate-100 px-2 py-1" />
              {sections.flatMap((s) =>
                s.columns.map((c) => (
                  <th
                    key={c.id}
                    className="min-w-[92px] border border-slate-200 bg-slate-100 px-1 py-1 font-medium"
                  >
                    {c.label}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.iso} className={d.weekend ? "bg-slate-50" : undefined}>
                <td className="sticky left-0 z-10 border border-slate-200 bg-inherit px-2 py-1 font-mono">
                  {d.iso}
                </td>
                <td className="sticky left-[90px] z-10 border border-slate-200 bg-inherit px-2 py-1">
                  {d.day}
                </td>
                {sections.flatMap((s) =>
                  s.columns.map((c) => {
                    const value = cellValue(d.iso, c.id);
                    const isHighlighted = highlightId && value === highlightId;
                    const staffMember = value ? staffById.get(value) : undefined;
                    return (
                      <td
                        key={c.id}
                        className={`border border-slate-200 p-0 ${isHighlighted ? "bg-yellow-200" : ""}`}
                      >
                        <select
                          value={value}
                          onChange={(e) => onChange(d.iso, c.id, e.target.value)}
                          className="w-full min-w-[92px] bg-transparent px-1 py-1 text-xs outline-none"
                          style={
                            staffMember
                              ? { color: staffMember.color, fontWeight: 600 }
                              : undefined
                          }
                        >
                          <option value="" />
                          {optionsFor(c, d.iso).map((s) => {
                            const av = availability[d.iso]?.[s.id];
                            const working = av ? av.am || av.pm : true;
                            const suffix = av?.leaveType
                              ? ` (${av.leaveType.toLowerCase()})`
                              : !working
                              ? " (off)"
                              : "";
                            return (
                              <option key={s.id} value={s.id}>
                                {s.initials}
                                {suffix}
                              </option>
                            );
                          })}
                        </select>
                      </td>
                    );
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
