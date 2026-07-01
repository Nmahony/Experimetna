"use client";

import { useState } from "react";
import { saveTemplateColumns } from "@/lib/actions";
import { GRADES, type Grade, type RotaColumn } from "@/lib/types";

function newColumn(section: string, order: number): RotaColumn {
  return {
    id: crypto.randomUUID(),
    section,
    label: "New column",
    order,
    eligibleGrades: undefined,
  };
}

export default function TemplateEditor({
  name,
  columns,
}: {
  name: string;
  columns: RotaColumn[];
}) {
  const [rows, setRows] = useState<RotaColumn[]>(
    [...columns].sort((a, b) => a.order - b.order)
  );

  function update(id: string, patch: Partial<RotaColumn>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function remove(id: string) {
    setRows((rs) => rs.filter((r) => r.id !== id));
  }

  function move(id: string, dir: -1 | 1) {
    setRows((rs) => {
      const idx = rs.findIndex((r) => r.id === id);
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= rs.length) return rs;
      const next = [...rs];
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  }

  function addColumn() {
    const lastSection = rows[rows.length - 1]?.section ?? "NEW SECTION";
    setRows((rs) => [...rs, newColumn(lastSection, rs.length)]);
  }

  function toggleGrade(id: string, grade: Grade) {
    setRows((rs) =>
      rs.map((r) => {
        if (r.id !== id) return r;
        const current = r.eligibleGrades ?? [];
        const has = current.includes(grade);
        const next = has
          ? current.filter((g) => g !== grade)
          : [...current, grade];
        return { ...r, eligibleGrades: next.length ? next : undefined };
      })
    );
  }

  const normalized = rows.map((r, i) => ({ ...r, order: i }));
  const columnsJson = JSON.stringify(normalized);

  return (
    <form action={saveTemplateColumns} className="space-y-4">
      <input type="hidden" name="columns" value={columnsJson} />
      <label className="flex max-w-sm flex-col text-xs text-slate-600">
        Rota name
        <input
          name="name"
          defaultValue={name}
          className="mt-1 rounded border border-slate-300 px-2 py-1"
        />
      </label>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-2 py-2">Order</th>
              <th className="px-2 py-2">Section</th>
              <th className="px-2 py-2">Column</th>
              <th className="px-2 py-2">Eligible grades</th>
              <th className="px-2 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="px-2 py-1">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(r.id, -1)}
                      className="rounded bg-slate-200 px-1.5 hover:bg-slate-300"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(r.id, 1)}
                      className="rounded bg-slate-200 px-1.5 hover:bg-slate-300"
                    >
                      ↓
                    </button>
                  </div>
                </td>
                <td className="px-2 py-1">
                  <input
                    value={r.section}
                    onChange={(e) => update(r.id, { section: e.target.value })}
                    className="w-40 rounded border border-slate-300 px-2 py-1"
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    value={r.label}
                    onChange={(e) => update(r.id, { label: e.target.value })}
                    className="w-32 rounded border border-slate-300 px-2 py-1"
                  />
                </td>
                <td className="px-2 py-1">
                  <div className="flex flex-wrap gap-2 text-xs">
                    {GRADES.map((g) => (
                      <label key={g} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={r.eligibleGrades?.includes(g) ?? false}
                          onChange={() => toggleGrade(r.id, g)}
                        />
                        {g}
                      </label>
                    ))}
                    {!r.eligibleGrades && (
                      <span className="text-slate-400">(any grade)</span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-1 text-right">
                  <button
                    type="button"
                    onClick={() => remove(r.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={addColumn}
          className="rounded bg-slate-200 px-4 py-1.5 text-sm hover:bg-slate-300"
        >
          + Add column
        </button>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          Save template
        </button>
      </div>
    </form>
  );
}
