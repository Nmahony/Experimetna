import Link from "next/link";
import { getStaff } from "@/lib/store";
import { GRADES } from "@/lib/types";
import { saveStaffMember } from "@/lib/actions";

export default async function StaffPage() {
  const staff = await getStaff();
  const sorted = [...staff].sort((a, b) => a.initials.localeCompare(b.initials));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Staff</h1>
        <p className="text-sm text-slate-600">
          Each staff member has a working pattern (set from their detail
          page) used to work out rota availability.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Initials</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Grade</th>
              <th className="px-3 py-2">FTE %</th>
              <th className="px-3 py-2">Active</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="px-3 py-2">
                  <span
                    className="inline-block rounded px-2 py-0.5 font-mono text-xs text-white"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.initials}
                  </span>
                </td>
                <td className="px-3 py-2">{s.fullName}</td>
                <td className="px-3 py-2">{s.grade}</td>
                <td className="px-3 py-2">{s.ftePercent}%</td>
                <td className="px-3 py-2">{s.active ? "Yes" : "No"}</td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/staff/${s.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit / pattern
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 font-medium">Add staff member</h2>
        <form action={saveStaffMember} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label className="flex flex-col text-xs text-slate-600">
            Initials
            <input
              name="initials"
              required
              maxLength={4}
              className="mt-1 rounded border border-slate-300 px-2 py-1 uppercase"
            />
          </label>
          <label className="col-span-2 flex flex-col text-xs text-slate-600">
            Full name
            <input
              name="fullName"
              required
              className="mt-1 rounded border border-slate-300 px-2 py-1"
            />
          </label>
          <label className="flex flex-col text-xs text-slate-600">
            Grade
            <select
              name="grade"
              className="mt-1 rounded border border-slate-300 px-2 py-1"
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-xs text-slate-600">
            FTE %
            <input
              name="ftePercent"
              type="number"
              min={0}
              max={100}
              defaultValue={100}
              className="mt-1 rounded border border-slate-300 px-2 py-1"
            />
          </label>
          <label className="flex flex-col text-xs text-slate-600">
            Colour
            <input
              name="color"
              type="color"
              defaultValue="#64748b"
              className="mt-1 h-8 rounded border border-slate-300"
            />
          </label>
          <label className="flex items-center gap-2 self-end pb-1 text-xs text-slate-600">
            <input name="active" type="checkbox" defaultChecked /> Active
          </label>
          <div className="col-span-full">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
            >
              Add staff
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
