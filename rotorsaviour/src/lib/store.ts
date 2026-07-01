import { promises as fs } from "fs";
import path from "path";
import type {
  AssignmentMap,
  LeaveEntry,
  RotaTemplate,
  Staff,
  WorkingPattern,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw err;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, file),
    JSON.stringify(data, null, 2) + "\n",
    "utf-8"
  );
}

export const getStaff = () => readJson<Staff[]>("staff.json", []);
export const saveStaff = (data: Staff[]) => writeJson("staff.json", data);

export const getPatterns = () =>
  readJson<WorkingPattern[]>("patterns.json", []);
export const savePatterns = (data: WorkingPattern[]) =>
  writeJson("patterns.json", data);

export const getLeave = () => readJson<LeaveEntry[]>("leave.json", []);
export const saveLeave = (data: LeaveEntry[]) => writeJson("leave.json", data);

export const getTemplate = () =>
  readJson<RotaTemplate>("template.json", { name: "Default", columns: [] });
export const saveTemplate = (data: RotaTemplate) =>
  writeJson("template.json", data);

export const getAssignments = (year: number) =>
  readJson<AssignmentMap>(`assignments/${year}.json`, {});
export const saveAssignments = (year: number, data: AssignmentMap) =>
  writeJson(`assignments/${year}.json`, data);
