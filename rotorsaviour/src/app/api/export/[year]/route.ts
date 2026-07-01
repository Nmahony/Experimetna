import { NextRequest, NextResponse } from "next/server";
import { buildRotaWorkbook } from "@/lib/excel";
import { daysInMonth, daysInYear, MONTH_NAMES } from "@/lib/dates";
import { loadRotaData } from "@/lib/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ year: string }> }
) {
  const { year: yearStr } = await params;
  const year = Number(yearStr);
  if (!Number.isInteger(year)) {
    return NextResponse.json({ error: "Invalid year" }, { status: 400 });
  }

  const monthParam = request.nextUrl.searchParams.get("month");
  const month = monthParam ? Number(monthParam) : undefined;
  if (month !== undefined && (!Number.isInteger(month) || month < 1 || month > 12)) {
    return NextResponse.json({ error: "Invalid month" }, { status: 400 });
  }

  const { staff, template, assignments } = await loadRotaData(year);
  const dates = month ? daysInMonth(year, month) : daysInYear(year);
  const title = month
    ? `${year} ${template.name.toUpperCase()} — ${MONTH_NAMES[month - 1]}`
    : `${year} ${template.name.toUpperCase()}`;

  const workbook = buildRotaWorkbook({
    title,
    dates,
    columns: template.columns,
    staff: staff.filter((s) => s.active),
    assignments,
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = month
    ? `rota-${year}-${String(month).padStart(2, "0")}.xlsx`
    : `rota-${year}.xlsx`;

  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
