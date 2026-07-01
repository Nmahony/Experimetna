import { notFound } from "next/navigation";
import { getPatterns, getStaff } from "@/lib/store";
import { GRADES } from "@/lib/types";
import { saveStaffMember } from "@/lib/actions";
import PatternEditor from "./PatternEditor";

export default async function StaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [staff, patterns] = await Promise.all([getStaff(), getPatterns()]);
  const member = staff.find((s) => s.id === id);
  if (!member) notFound();

  const pattern = patterns.find((p) => p.staffId === id) ?? {
    staffId: id,
    cycleWeeks: 1,
    cycleStartDate: new Date().toISOString().slice(0, 10),
    days: Array.from({ length: 7 }, () => ({ am: false, pm: false })),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">
          {member.fullName} ({member.initials})
        </h1>
        <p className="text-sm text-slate-600">Edit details and working pattern.</p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 font-medium">Details</h2>
        <form
          action={saveStaffMember}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <input type="hidden" name="id" value={member.id} />
          <label className="flex flex-col text-xs text-slate-600">
            Initials
            <input
              name="initials"
              defaultValue={member.initials}
              required
              maxLength={4}
              className="mt-1 rounded border border-slate-300 px-2 py-1 uppercase"
            />
          </label>
          <label className="col-span-2 flex flex-col text-xs text-slate-600">
            Full name
            <input
              name="fullName"
              defaultValue={member.fullName}
              required
              className="mt-1 rounded border border-slate-300 px-2 py-1"
            />
          </label>
          <label className="flex flex-col text-xs text-slate-600">
            Grade
            <select
              name="grade"
              defaultValue={member.grade}
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
              defaultValue={member.ftePercent}
              className="mt-1 rounded border border-slate-300 px-2 py-1"
            />
          </label>
          <label className="flex flex-col text-xs text-slate-600">
            Colour
            <input
              name="color"
              type="color"
              defaultValue={member.color}
              className="mt-1 h-8 rounded border border-slate-300"
            />
          </label>
          <label className="flex items-center gap-2 self-end pb-1 text-xs text-slate-600">
            <input
              name="active"
              type="checkbox"
              defaultChecked={member.active}
            />{" "}
            Active
          </label>
          <div className="col-span-full">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 font-medium">Working pattern</h2>
        <p className="mb-3 text-xs text-slate-500">
          Tick AM/PM for each day the person normally works. For part-time or
          job-share staff use a longer cycle (e.g. 2 weeks for &ldquo;every
          other week&rdquo;) and only tick the weeks/days they actually work.
        </p>
        <PatternEditor staffId={member.id} pattern={pattern} />
      </section>
    </div>
  );
}
