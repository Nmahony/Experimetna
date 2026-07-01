"use client";

import { useState } from "react";
import { savePattern } from "@/lib/actions";
import type { PatternDay, WorkingPattern } from "@/lib/types";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function resize(days: PatternDay[], length: number): PatternDay[] {
  const next = days.slice(0, length);
  while (next.length < length) next.push({ am: false, pm: false });
  return next;
}

export default function PatternEditor({
  staffId,
  pattern,
}: {
  staffId: string;
  pattern: WorkingPattern;
}) {
  const [cycleWeeks, setCycleWeeks] = useState(pattern.cycleWeeks);
  const [cycleStartDate, setCycleStartDate] = useState(pattern.cycleStartDate);
  const [days, setDays] = useState<PatternDay[]>(
    resize(pattern.days, pattern.cycleWeeks * 7)
  );

  function updateCycleWeeks(n: number) {
    setCycleWeeks(n);
    setDays((d) => resize(d, n * 7));
  }

  function toggle(i: number, period: "am" | "pm") {
    setDays((d) =>
      d.map((day, idx) => (idx === i ? { ...day, [period]: !day[period] } : day))
    );
  }

  function fillWeek(weekIdx: number, value: boolean) {
    setDays((d) =>
      d.map((day, idx) =>
        idx >= weekIdx * 7 && idx < weekIdx * 7 + 7
          ? { am: value, pm: value }
          : day
      )
    );
  }

  return (
    <form action={savePattern} className="space-y-4">
      <input type="hidden" name="staffId" value={staffId} />
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col text-xs text-slate-600">
          Cycle length (weeks)
          <select
            name="cycleWeeks"
            value={cycleWeeks}
            onChange={(e) => updateCycleWeeks(Number(e.target.value))}
            className="mt-1 rounded border border-slate-300 px-2 py-1"
          >
            {[1, 2, 3, 4, 6, 8].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-xs text-slate-600">
          Cycle anchor Monday
          <input
            name="cycleStartDate"
            type="date"
            value={cycleStartDate}
            onChange={(e) => setCycleStartDate(e.target.value)}
            className="mt-1 rounded border border-slate-300 px-2 py-1"
          />
          <span className="mt-1 max-w-xs text-[11px] text-slate-500">
            Any Monday that falls in week 1 of the cycle &mdash; used to work
            out which week of the cycle any given date falls in.
          </span>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-20 border border-slate-200 bg-slate-100 px-2 py-1 text-left text-xs">
                Week
              </th>
              {DAY_LABELS.map((d) => (
                <th
                  key={d}
                  className="border border-slate-200 bg-slate-100 px-2 py-1 text-xs"
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: cycleWeeks }, (_, w) => (
              <tr key={w}>
                <td className="border border-slate-200 px-2 py-1 text-xs text-slate-600">
                  <div className="flex flex-col gap-1">
                    <span>Week {w + 1}</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => fillWeek(w, true)}
                        className="rounded bg-slate-200 px-1 text-[10px] hover:bg-slate-300"
                      >
                        all
                      </button>
                      <button
                        type="button"
                        onClick={() => fillWeek(w, false)}
                        className="rounded bg-slate-200 px-1 text-[10px] hover:bg-slate-300"
                      >
                        none
                      </button>
                    </div>
                  </div>
                </td>
                {DAY_LABELS.map((_, d) => {
                  const i = w * 7 + d;
                  const day = days[i] ?? { am: false, pm: false };
                  return (
                    <td key={i} className="border border-slate-200 px-2 py-1 text-center">
                      <div className="flex flex-col items-center gap-1 text-[11px]">
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            name={`day-${i}-am`}
                            checked={day.am}
                            onChange={() => toggle(i, "am")}
                          />
                          AM
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            name={`day-${i}-pm`}
                            checked={day.pm}
                            onChange={() => toggle(i, "pm")}
                          />
                          PM
                        </label>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
      >
        Save pattern
      </button>
    </form>
  );
}
