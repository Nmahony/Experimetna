import { getTemplate } from "@/lib/store";
import TemplateEditor from "./TemplateEditor";

export default async function TemplatePage() {
  const template = await getTemplate();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Rota template</h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Sections and columns that make up the rota grid, in display order.
          The seeded template is a best-effort reconstruction of the example
          rota &mdash; rename/reorder/add/remove columns here to match your
          department&apos;s exact layout. Restrict a column to specific
          grades (e.g. only Consultants) if needed.
        </p>
      </div>
      <TemplateEditor name={template.name} columns={template.columns} />
    </div>
  );
}
