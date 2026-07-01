import { getLeave, getStaff } from "@/lib/store";
import { LEAVE_TYPES } from "@/lib/types";
import { createLeave, deleteLeave } from "@/lib/actions";

export default async function LeavePage() {
  const [leave, staff] = await Promise.all([getLeave(), getStaff()]);
  const byId = new Map(staff.map((s) => [s.id, s]));
  const sorted = [...leave].sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Leave</h1>
        <p className="text-sm text-slate-600">
          Leave entries override a person&apos;s normal working pattern in
          the rota grid and export, and populate the LEAVE / SPA columns.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Staff</th>
              <th className="px-3 py-2">Start</th>
              <th className="px-3 py-2">End</th>
              <th className="px-3 py-2">Period</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Notes</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((l) => (
              <tr key={l.id} className="border-t border-slate-100">
                <td className="px-3 py-2">{byId.get(l.staffId)?.initials ?? "?"}</td>
                <td className="px-3 py-2">{l.startDate}</td>
                <td className="px-3 py-2">{l.endDate}</td>
                <td className="px-3 py-2">{l.period}</td>
                <td className="px-3 py-2">{l.type}</td>
                <td className="px-3 py-2 text-slate-500">{l.notes}</td>
                <td className="px-3 py-2 text-right">
                  <form action={deleteLeave}>
                    <input type="hidden" name="id" value={l.id} />
                    <button className="text-red-600 hover:underline" type="submit">
                      Remove
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-slate-400">
                  No leave recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 font-medium">Add leave</h2>
        <form action={createLeave} className="grid grid-cols-2 gap-3 sm:grid-cols-6">
          <label className="flex flex-col text-xs text-slate-600">
            Staff
            <select
              name="staffId"
              required
              className="mt-1 rounded border border-slate-300 px-2 py-1"
            >
              {[...staff]
                .sort((a, b) => a.initials.localeCompare(b.initials))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.initials} &ndash; {s.fullName}
                  </option>
                ))}
            </select>
          </label>
          <label className="flex flex-col text-xs text-slate-600">
            Start date
            <input
              name="startDate"
              type="date"
              required
              className="mt-1 rounded border border-slate-300 px-2 py-1"
            />
          </label>
          <label className="flex flex-col text-xs text-slate-600">
            End date
            <input
              name="endDate"
              type="date"
              className="mt-1 rounded border border-slate-300 px-2 py-1"
            />
          </label>
          <label className="flex flex-col text-xs text-slate-600">
            Period
            <select
              name="period"
              defaultValue="FULL"
              className="mt-1 rounded border border-slate-300 px-2 py-1"
            >
              <option value="FULL">Full day</option>
              <option value="AM">AM only</option>
              <option value="PM">PM only</option>
            </select>
          </label>
          <label className="flex flex-col text-xs text-slate-600">
            Type
            <select
              name="type"
              className="mt-1 rounded border border-slate-300 px-2 py-1"
            >
              {LEAVE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-xs text-slate-600">
            Notes
            <input
              name="notes"
              className="mt-1 rounded border border-slate-300 px-2 py-1"
            />
          </label>
          <div className="col-span-full">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
            >
              Add leave
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
