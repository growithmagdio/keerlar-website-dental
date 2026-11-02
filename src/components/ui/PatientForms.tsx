import fs from "node:fs";
import path from "node:path";
import { FileText, Phone } from "lucide-react";
import { site } from "@/lib/site";

// The original PDF links return 404 on keelerdental.org. Drop the PDFs into /public/site/downloads/
// with the same file names and these rows turn into download links automatically at build time.
export function PatientForms() {
  return (
    <ul className="grid gap-3">
      {site.patientForms.map((f) => {
        const exists = fs.existsSync(path.join(process.cwd(), "public", f.file));
        return (
          <li key={f.file} className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 ring-1 ring-line" data-reveal>
            <span className="flex items-center gap-3 font-medium text-brand-ink">
              <FileText className="h-5 w-5 shrink-0 text-brand" aria-hidden />
              {f.name}
            </span>
            {exists ? (
              <a href={f.file} download className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-deep">
                Download
              </a>
            ) : (
              <a href={site.phoneHref} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ice px-4 py-2 text-sm font-semibold text-brand-ink">
                <Phone className="h-3.5 w-3.5" aria-hidden /> Call to request
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
