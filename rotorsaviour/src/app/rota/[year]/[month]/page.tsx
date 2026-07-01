import Link from "next/link";
import { notFound } from "next/navigation";
import { loadRotaData } from "@/lib/queries";
import { availabilityMatrix, groupedColumns } from "@/lib/queries";
import { daysInMonth, MONTH_NAMES, toISODate, dayName, isWeekend } from "@/lib/dates";
import RotaGrid from "./RotaGrid";

export default async function RotaMonthPage({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year: yearStr, month: monthStr } = await params;
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    notFound();
  }

  const { staff, patterns, leave, template, assignments } = await loadRotaData(
    year
  );
  const dates = daysInMonth(year, month);
  const sections = groupedColumns(template.columns);
  const matrix = availabilityMatrix(dates, staff, patterns, leave);

  const days = dates.map((d) => ({
    iso: toISODate(d),
    day: dayName(d),
    weekend: isWeekend(d),
  }));

  const prevMonth = month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
  const nextMonth = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">
            {template.name} &mdash; {MONTH_NAMES[month - 1]} {year}
          </h1>
          <p className="text-sm text-slate-600">
            Click a cell to assign staff. Select yourself below to highlight
            your schedule.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href={`/rota/${prevMonth.year}/${prevMonth.month}`}
            className="rounded border border-slate-300 px-3 py-1 hover:bg-slate-100"
          >
            ← Prev
          </Link>
          <Link
            href={`/rota/${nextMonth.year}/${nextMonth.month}`}
            className="rounded border border-slate-300 px-3 py-1 hover:bg-slate-100"
          >
            Next →
          </Link>
          <a
            href={`/api/export/${year}?month=${month}`}
            className="rounded bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-700"
          >
            Export month (.xlsx)
          </a>
          <a
            href={`/api/export/${year}`}
            className="rounded bg-emerald-700 px-3 py-1 text-white hover:bg-emerald-800"
          >
            Export year (.xlsx)
          </a>
        </div>
      </div>

      <RotaGrid
        year={year}
        days={days}
        sections={sections}
        staff={staff.filter((s) => s.active)}
        assignments={assignments}
        availability={matrix}
      />
    </div>
  );
}
