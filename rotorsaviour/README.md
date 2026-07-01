# RotorSAVIOUR

A monthly rota builder for an NHS team, aimed at replacing a hand-maintained
Excel rota with a small app that understands staff working patterns and
leave, and exports a spreadsheet in the team's existing format.

This is the **first phase** of the project: data model, a manually-editable
rota grid, and a faithful Excel export. Automatic rota *generation*
(optimising for continuity and fair workload spread) is phase two — see
[Roadmap](#roadmap-phase-2-automatic-generation) below.

## What it does today

- **Staff** — initials, name, grade, FTE%, active flag.
- **Working patterns** — a recurring cycle (1, 2, 4... weeks) of AM/PM
  availability per staff member, so irregular patterns, "every other week",
  and part-time staff are all representable. See `src/lib/pattern.ts`.
- **Leave** — date-range entries (AM/PM/full day, with a type: annual,
  study, SPA, sick, other) that override the working pattern for those
  days.
- **Rota template** — the section/column structure of the grid (e.g. "AM
  CLINIC" → Clinic 1..5, "ON CALL" → CONS/REG), editable at `/template`.
  Columns can optionally be restricted to specific grades.
- **Rota grid** (`/rota/[year]/[month]`) — one row per day, one column per
  rota slot, edited via dropdowns. Each dropdown lists staff eligible for
  that column, sorted with people who are actually working that day first,
  and annotates people who are on leave or off-pattern. A "highlight my
  schedule" selector mirrors the original spreadsheet's behaviour.
- **Excel export** (`/api/export/[year]?month=`) — generates a real
  `.xlsx` via [ExcelJS](https://github.com/exceljs/exceljs) with merged
  section headers, a highlight dropdown (Excel data validation) with
  conditional-format highlighting, and weekend shading — matching the shape
  of the original rota. Export a single month or the whole year.

## Data storage

Data is stored as JSON files under `data/` (`staff.json`, `patterns.json`,
`leave.json`, `template.json`, `assignments/<year>.json`) via
`src/lib/store.ts`. This was a deliberate choice for the MVP: it needs zero
external services to run, which matters in this dev environment (Prisma's
engine postinstall couldn't reach the network here). The read/write API in
`store.ts` is the only place that touches storage, so swapping in Postgres
(e.g. via Prisma or Supabase, both already used elsewhere in this
workspace) later is a contained change.

`data/*.json` (staff/patterns/leave/template) is committed as seed/demo
data; `data/assignments/*.json` (the actual day-to-day grid selections) is
gitignored — that's operational state, not source.

## Getting started

```bash
npm install
npm run seed   # populates data/*.json with demo staff + template
npm run dev
```

Open http://localhost:3000. Start at `/template` to adjust the rota
columns to match your department exactly (the seeded template is a
best-effort reconstruction — the original pasted rota's merged-cell
structure couldn't be recovered exactly from plain text), then `/staff` to
enter real names/patterns, then `/rota/<year>/<month>` to build a month.

## Known limitations of this phase

- The seeded template/columns and staff are **placeholders** reconstructed
  from a text dump of the real rota — merged cells and exact column names
  were lost in that translation. Adjust them via `/template` and `/staff`.
- No authentication — anyone with access to the app can edit anything.
  Fine for a trusted internal tool on day one; add auth before wider
  rollout.
- No conflict detection yet (e.g. assigning someone on leave, or double
  booking someone across two sections the same half-day) beyond the
  dropdown's "(leave)"/"(off)" annotations — it warns, doesn't block.
- No Microsoft 365 integration (SharePoint/OneDrive storage, Outlook/Teams
  sync) — v1 scope was agreed as Excel-file compatibility only. The
  exported `.xlsx` can be manually placed on SharePoint/OneDrive today;
  direct Graph API integration is a natural follow-up once this is proven.

## Roadmap: phase 2, automatic generation

The stated goal is a solver that, given the staff/pattern/leave data above,
proposes a full month's (or year's) assignments optimising for:

1. **Feasibility** — only assign staff who are working (per pattern) and
   not on leave, and who satisfy a column's grade restriction.
2. **Continuity** — prefer keeping the same person on a section for a
   run of consecutive days/weeks rather than churning daily.
3. **Fairness** — over an annual cycle, spread the count of
   sessions-per-column (and unsocial slots like on-call/weekends)
   evenly across staff, weighted by FTE.
4. **Hard constraints** — one assignment per person per half-day slot (no
   double-booking), respect leave.

Suggested approach: model each (date, column) as a variable and use a
constraint solver / local search (e.g. simulated annealing or a weighted
scoring function with hill-climbing) rather than hand-written heuristics,
since the objective is explicitly multi-criteria (continuity vs fairness
trade off). This slots in as a new "Generate" action on the rota grid that
proposes assignments the user can review/edit before saving — it should
never silently overwrite a manually-set cell.
