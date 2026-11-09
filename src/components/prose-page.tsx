import type { ReactNode } from "react";

export function ProsePage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
      {updated && <p className="mt-3 text-sm text-ink-muted">Last updated {updated}</p>}
      <div className="mt-8 space-y-5 text-ink-muted [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink">
        {children}
      </div>
    </article>
  );
}
