import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

/** Accessible form primitives. Every control has a <label>; errors are linked via aria-describedby. */

const control =
  "mt-1.5 block w-full rounded-sm border border-rule bg-paper-raised px-3 py-2.5 text-base text-ink placeholder:text-ink-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 aria-[invalid=true]:border-accent";

type Base = { name: string; label: string; error?: string; hint?: ReactNode; required?: boolean };

function Label({ htmlFor, label, required }: { htmlFor: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold">
      {label}
      {required ? <span className="text-accent"> *</span> : <span className="font-normal text-ink-muted"> (optional)</span>}
    </label>
  );
}

function Help({ id, hint, error }: { id: string; hint?: ReactNode; error?: string }) {
  return (
    <>
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-muted">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-semibold text-accent">{error}</p>}
    </>
  );
}

const describedBy = (id: string, hint?: ReactNode, error?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

export function TextField({ name, label, error, hint, required, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const id = `f-${name}`;
  return (
    <div>
      <Label htmlFor={id} label={label} required={required} />
      <input
        id={id}
        name={name}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={describedBy(id, hint, error)}
        className={control}
        {...rest}
      />
      <Help id={id} hint={hint} error={error} />
    </div>
  );
}

export function TextArea({ name, label, error, hint, required, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = `f-${name}`;
  return (
    <div>
      <Label htmlFor={id} label={label} required={required} />
      <textarea
        id={id}
        name={name}
        rows={4}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, hint, error)}
        className={control}
        {...rest}
      />
      <Help id={id} hint={hint} error={error} />
    </div>
  );
}

export function SelectField({
  name,
  label,
  error,
  hint,
  required,
  options,
  placeholder = "Select…",
  ...rest
}: Base & SelectHTMLAttributes<HTMLSelectElement> & {
  options: readonly (string | { value: string; label: string })[];
  placeholder?: string;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <Label htmlFor={id} label={label} required={required} />
      <select
        id={id}
        name={name}
        defaultValue=""
        aria-invalid={!!error}
        aria-describedby={describedBy(id, hint, error)}
        className={control}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => {
          const { value, label: text } = typeof o === "string" ? { value: o, label: o } : o;
          return <option key={value} value={value}>{text}</option>;
        })}
      </select>
      <Help id={id} hint={hint} error={error} />
    </div>
  );
}

export function CheckboxGroup({
  name,
  label,
  error,
  hint,
  required,
  options,
}: Base & { options: readonly (string | { value: string; label: string })[] }) {
  const id = `f-${name}`;
  return (
    <fieldset aria-describedby={describedBy(id, hint, error)} aria-invalid={!!error}>
      <legend className="text-sm font-semibold">
        {label}
        {required ? <span className="text-accent"> *</span> : <span className="font-normal text-ink-muted"> (optional)</span>}
      </legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map((o) => {
          const { value, label: text } = typeof o === "string" ? { value: o, label: o } : o;
          const optId = `${id}-${value.replace(/\W+/g, "-")}`;
          return (
            <label
              key={value}
              htmlFor={optId}
              className="flex cursor-pointer items-center gap-3 rounded-sm border border-rule bg-paper-raised px-3 py-2.5 has-[:checked]:border-accent has-[:checked]:bg-accent/5"
            >
              <input id={optId} type="checkbox" name={name} value={value} className="size-4 accent-[var(--accent)]" />
              <span className="text-sm">{text}</span>
            </label>
          );
        })}
      </div>
      <Help id={id} hint={hint} error={error} />
    </fieldset>
  );
}

/** Hidden field that only bots fill in. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
      <label htmlFor="website_hp">Leave this empty</label>
      <input id="website_hp" name="website_hp" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export const buttonPrimary =
  "inline-flex min-h-11 items-center justify-center rounded-sm bg-accent px-6 py-3 font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60";
export const buttonSecondary =
  "inline-flex min-h-11 items-center justify-center rounded-sm border border-ink px-6 py-3 font-semibold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper";
