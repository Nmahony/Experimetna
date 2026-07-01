import Link from "next/link";
import { getLeave, getStaff, getTemplate } from "@/lib/store";

export default async function Home() {
  const [staff, template, leave] = await Promise.all([
    getStaff(),
    getTemplate(),
    getLeave(),
  ]);
  const activeStaff = staff.filter((s) => s.active);
  const now = new Date();

  const cards = [
    {
      href: `/rota/${now.getFullYear()}/${now.getMonth() + 1}`,
      title: "Open this month's rota",
      body: "View and edit the grid, highlight your own schedule, export to Excel.",
    },
    {
      href: "/staff",
      title: `Staff (${activeStaff.length} active)`,
      body: "Manage staff, grades, FTE and working patterns.",
    },
    {
      href: "/leave",
      title: `Leave (${leave.length} entries)`,
      body: "Record annual/study/SPA leave that feeds into rota availability.",
    },
    {
      href: "/template",
      title: `Template (${template.columns.length} columns)`,
      body: "Configure the sections/columns that make up the rota grid.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">RotorSAVIOUR</h1>
        <p className="mt-1 max-w-2xl text-slate-600">
          Monthly rota builder for the team. This MVP covers the data model,
          a manually-editable rota grid that respects working patterns and
          leave, and an Excel export matching your current rota layout.
          Automated rota generation (continuity + fair workload spread) is
          the next phase &mdash; see the README.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow"
          >
            <h2 className="font-medium">{c.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{c.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
