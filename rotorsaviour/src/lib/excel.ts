import ExcelJS from "exceljs";
import { dayName, isWeekend, toISODate } from "./dates";
import { assignmentKey, type AssignmentMap, type RotaColumn, type Staff } from "./types";
import { groupedColumns } from "./queries";

function colLetter(n: number): string {
  let s = "";
  let num = n;
  while (num > 0) {
    const rem = (num - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    num = Math.floor((num - 1) / 26);
  }
  return s;
}

const DATE_COL = 1;
const DAY_COL = 2;
const FIRST_DATA_COL = 3;

export interface BuildRotaOptions {
  title: string;
  dates: Date[];
  columns: RotaColumn[];
  staff: Staff[];
  assignments: AssignmentMap;
}

export function buildRotaWorkbook(opts: BuildRotaOptions): ExcelJS.Workbook {
  const { title, dates, columns, staff, assignments } = opts;
  const sections = groupedColumns(columns);
  const lastCol = FIRST_DATA_COL + columns.length - 1;
  const lastColLetter = colLetter(lastCol);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "RotorSAVIOUR";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Rota", {
    views: [{ state: "frozen", xSplit: 2, ySplit: 4 }],
  });

  sheet.getColumn(DATE_COL).width = 11;
  sheet.getColumn(DAY_COL).width = 6;
  for (let c = FIRST_DATA_COL; c <= lastCol; c++) {
    sheet.getColumn(c).width = 9;
  }

  // Row 1: title
  sheet.mergeCells(1, 1, 1, lastCol);
  const titleCell = sheet.getCell(1, 1);
  titleCell.value = title;
  titleCell.font = { bold: true, size: 14 };
  titleCell.alignment = { vertical: "middle" };
  sheet.getRow(1).height = 22;

  // Row 2: instructions + highlight dropdown
  const highlightCol = lastCol;
  const instructionsEndCol = Math.max(FIRST_DATA_COL, lastCol - 2);
  sheet.mergeCells(2, 1, 2, instructionsEndCol);
  const instructionsCell = sheet.getCell(2, 1);
  instructionsCell.value =
    "To highlight your schedule select yourself from the dropdown at the far right. Select 'None' to clear.";
  instructionsCell.font = { italic: true, size: 9, color: { argb: "FF64748B" } };

  const highlightLabelCell = sheet.getCell(2, highlightCol - 1);
  highlightLabelCell.value = "Highlight:";
  highlightLabelCell.font = { bold: true, size: 9 };
  highlightLabelCell.alignment = { horizontal: "right" };

  const highlightCell = sheet.getCell(2, highlightCol);
  const staffList = ["None", ...staff.map((s) => s.initials)].join(",");
  highlightCell.value = "None";
  highlightCell.dataValidation = {
    type: "list",
    allowBlank: false,
    formulae: [`"${staffList}"`],
  };
  highlightCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFEF9C3" },
  };
  const highlightCellAddress = `$${colLetter(highlightCol)}$2`;

  // Row 3: section headers
  let sectionCol = FIRST_DATA_COL;
  for (const section of sections) {
    const start = sectionCol;
    const end = sectionCol + section.columns.length - 1;
    if (end > start) sheet.mergeCells(3, start, 3, end);
    const cell = sheet.getCell(3, start);
    cell.value = section.section;
    cell.font = { bold: true, size: 9 };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE2E8F0" },
    };
    sectionCol = end + 1;
  }
  sheet.mergeCells(3, DATE_COL, 4, DATE_COL);
  sheet.mergeCells(3, DAY_COL, 4, DAY_COL);

  // Row 4: column sub-headers
  sheet.getCell(4, DATE_COL).value = "Date";
  sheet.getCell(4, DAY_COL).value = "Day";
  let c = FIRST_DATA_COL;
  for (const column of columns) {
    const cell = sheet.getCell(4, c);
    cell.value = column.label;
    cell.font = { bold: true, size: 9 };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    c++;
  }
  for (let col = 1; col <= lastCol; col++) {
    const cell = sheet.getCell(4, col);
    cell.font = cell.font ?? { bold: true, size: 9 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF1F5F9" },
    };
  }

  // Data rows
  const staffByInitials = new Map(staff.map((s) => [s.id, s.initials]));
  let row = 5;
  for (const date of dates) {
    const iso = toISODate(date);
    const weekend = isWeekend(date);
    const [y, m, d] = iso.split("-");
    sheet.getCell(row, DATE_COL).value = `${d}/${m}/${y.slice(2)}`;
    sheet.getCell(row, DAY_COL).value = dayName(date);

    let col = FIRST_DATA_COL;
    for (const column of columns) {
      const a = assignments[assignmentKey(iso, column.id)];
      const initials = a?.staffId ? staffByInitials.get(a.staffId) ?? "" : "";
      sheet.getCell(row, col).value = initials;
      col++;
    }

    if (weekend) {
      for (let colIdx = 1; colIdx <= lastCol; colIdx++) {
        sheet.getCell(row, colIdx).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8FAFC" },
        };
      }
    }
    row++;
  }
  const lastRow = row - 1;

  for (let r = 1; r <= lastRow; r++) {
    for (let cIdx = 1; cIdx <= lastCol; cIdx++) {
      const cell = sheet.getCell(r, cIdx);
      cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };
    }
  }

  if (lastRow >= 5) {
    sheet.addConditionalFormatting({
      ref: `${colLetter(FIRST_DATA_COL)}5:${lastColLetter}${lastRow}`,
      rules: [
        {
          type: "expression",
          formulae: [`${colLetter(FIRST_DATA_COL)}5=${highlightCellAddress}`],
          style: {
            fill: {
              type: "pattern",
              pattern: "solid",
              bgColor: { argb: "FFFEF08A" },
            },
          },
        } as ExcelJS.ConditionalFormattingRule,
      ],
    });
  }

  return workbook;
}
