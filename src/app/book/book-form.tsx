"use client";

import { track } from "@vercel/analytics";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitRaceInquiry, type FormState } from "@/app/actions/inquiries";
import {
  buttonPrimary,
  buttonSecondary,
  CheckboxGroup,
  Honeypot,
  SelectField,
  TextArea,
  TextField,
} from "@/components/form";
import { TurnstileField } from "@/components/turnstile-field";
import { booking } from "@/config/site";
import { lodgingOptions, raceBudgetRanges, raceFormats, services } from "@/lib/inquiry-options";
import { classifyLeadTime, leadTimeMessage, todayIso } from "@/lib/lead-time";
import { fieldErrors, formDataToObject, raceSteps, raceStepSchemas, type RaceStep } from "@/lib/validation";

const DRAFT_KEY = "diggsultra:book-draft:v1";

const stepFields: Record<RaceStep, string[]> = {
  race: ["raceName", "raceUrl", "raceStartDate", "raceEndDate", "city", "state", "country", "formats", "fieldSize", "streamProducer"],
  services: ["services"],
  logistics: ["expensesAcknowledged", "nearestAirport", "lodging", "budgetRange"],
  contact: ["contactName", "contactRole", "contactEmail", "contactPhone", "referralSource", "message"],
};

const localToday = () => {
  try {
    return todayIso(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    return todayIso();
  }
};

/* ---------- localStorage draft (wrapped: storage can throw or be missing) ---------- */

function saveDraft(form: HTMLFormElement) {
  try {
    const data: Record<string, string | string[]> = {};
    const fd = new FormData(form);
    for (const key of new Set(fd.keys())) {
      if (key === "website_hp" || key.startsWith("cf-") || key.startsWith("$")) continue;
      const all = fd.getAll(key).map(String);
      data[key] = key === "formats" || key === "services" ? all : all[0];
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* draft is a convenience only */
  }
}

function restoreDraft(form: HTMLFormElement): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, string | string[]>;
    for (const [key, value] of Object.entries(data)) {
      const els = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`[name="${CSS.escape(key)}"]`);
      els.forEach((el) => {
        if (el instanceof HTMLInputElement && el.type === "checkbox") {
          el.checked = Array.isArray(value) ? value.includes(el.value) : value === el.value || value === "on";
        } else if (!Array.isArray(value)) {
          el.value = value;
        }
      });
    }
    return data;
  } catch {
    return null;
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

/* ---------- Component ---------- */

export function BookForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [raceStart, setRaceStart] = useState("");
  const [state, formAction, pending] = useActionState<FormState, FormData>(submitRaceInquiry, { ok: false });

  const errors = { ...state.errors, ...clientErrors };
  const current = raceSteps[step];
  const lead = raceStart ? classifyLeadTime(raceStart, localToday()) : null;
  const leadMsg = lead ? leadTimeMessage(lead) : null;

  // Restore draft once.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const data = restoreDraft(form);
    if (typeof data?.raceStartDate === "string") setRaceStart(data.raceStartDate);
  }, []);

  // Funnel analytics: one event per step viewed.
  useEffect(() => {
    track("book_step", { step: step + 1, name: raceSteps[step].key });
  }, [step]);

  // Server returned field errors: jump to the first step that has one
  // (adjusting state during render, per React's "you might not need an effect").
  const [seenErrors, setSeenErrors] = useState(state.errors);
  if (state.errors !== seenErrors) {
    setSeenErrors(state.errors);
    const idx = raceSteps.findIndex((s) => stepFields[s.key].some((f) => state.errors?.[f]));
    if (idx >= 0) setStep(idx);
  }

  useEffect(() => {
    if (state.ok) {
      clearDraft();
      track("book_submit");
    }
  }, [state.ok]);

  function goTo(next: number) {
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function validateStep(key: RaceStep): boolean {
    const form = formRef.current;
    if (!form) return false;
    const values = formDataToObject(new FormData(form));
    const result = raceStepSchemas[key].safeParse(values);
    const errs = result.success ? {} : fieldErrors(result.error);

    if (key === "race" && typeof values.raceStartDate === "string") {
      const l = classifyLeadTime(values.raceStartDate, localToday());
      if (l.status === "past" || l.status === "too_far" || l.status === "invalid") {
        errs.raceStartDate = leadTimeMessage(l)!;
      }
    }
    setClientErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (validateStep(current.key)) goTo(step + 1);
  }

  if (state.ok) {
    return (
      <div role="status" className="rounded-sm border border-rule bg-paper-raised p-8">
        <h2 className="font-display text-3xl">Request sent.</h2>
        <p className="mt-4 text-lg text-ink-muted">
          Check your inbox for a confirmation. I&apos;ll get back to you {booking.responseTime}.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      onInput={(e) => {
        saveDraft(e.currentTarget);
        const target = e.target as HTMLInputElement;
        if (target.name === "raceStartDate") setRaceStart(target.value);
        if (clientErrors[target.name]) {
          setClientErrors((prev) => {
            const next = { ...prev };
            delete next[target.name];
            return next;
          });
        }
      }}
      onSubmit={(e) => {
        if (!validateStep("contact")) e.preventDefault();
      }}
      className="relative"
    >
      {/* Progress */}
      <ol className="mb-8 grid grid-cols-4 gap-2" aria-label="Progress">
        {raceSteps.map((s, i) => (
          <li key={s.key} aria-current={i === step ? "step" : undefined}>
            <span className={`block h-1.5 rounded-full ${i <= step ? "bg-accent" : "bg-rule"}`} />
            <span className={`mt-2 hidden text-xs font-semibold uppercase tracking-wide sm:block ${i === step ? "text-ink" : "text-ink-muted"}`}>
              {i + 1}. {s.title}
            </span>
          </li>
        ))}
      </ol>

      <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl outline-none">
        <span className="sr-only">Step {step + 1} of {raceSteps.length}: </span>
        {current.title}
      </h2>

      {/* All steps stay mounted so every field is submitted; only the active one is shown. */}
      <div hidden={step !== 0} className="mt-6 space-y-5">
        <TextField name="raceName" label="Race name" required error={errors.raceName} autoComplete="off" />
        <TextField name="raceUrl" label="Race website" type="url" inputMode="url" placeholder="yourrace.com" error={errors.raceUrl} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="raceStartDate" label="Start date" type="date" required error={errors.raceStartDate} />
          <TextField name="raceEndDate" label="End date" type="date" hint="For multi-day races" error={errors.raceEndDate} />
        </div>
        {leadMsg && !errors.raceStartDate && (
          <p
            role="status"
            className={`rounded-sm border px-4 py-3 text-sm ${lead?.status === "short" ? "border-accent bg-accent/5 font-semibold text-accent" : "border-rule bg-paper-raised text-ink-muted"}`}
          >
            {leadMsg}
          </p>
        )}
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField name="city" label="City" required autoComplete="address-level2" error={errors.city} />
          <TextField name="state" label="State" required autoComplete="address-level1" error={errors.state} />
          <TextField name="country" label="Country" required defaultValue="US" autoComplete="country" error={errors.country} />
        </div>
        <CheckboxGroup name="formats" label="Distance / format" required options={raceFormats} error={errors.formats} />
        <TextField name="fieldSize" label="Expected field size" type="number" inputMode="numeric" min={1} error={errors.fieldSize} />
        <TextField
          name="streamProducer"
          label="Is the race live streamed? Who produces it?"
          placeholder="e.g. Yes, produced in-house"
          error={errors.streamProducer}
        />
      </div>

      <div hidden={step !== 1} className="mt-6 space-y-5">
        <CheckboxGroup name="services" label="What do you want from Diggs?" required options={services} error={errors.services} />
      </div>

      <div hidden={step !== 2} className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="f-expensesAcknowledged"
            className="flex cursor-pointer items-start gap-3 rounded-sm border border-rule bg-paper-raised p-4 has-[:checked]:border-accent"
          >
            <input
              id="f-expensesAcknowledged"
              name="expensesAcknowledged"
              type="checkbox"
              aria-invalid={!!errors.expensesAcknowledged}
              aria-describedby={errors.expensesAcknowledged ? "f-expensesAcknowledged-error" : undefined}
              className="mt-0.5 size-4 accent-[var(--accent)]"
            />
            <span className="text-sm font-semibold">
              I understand the race covers all travel, lodging, and food for Diggs. <span className="text-accent">*</span>
            </span>
          </label>
          {errors.expensesAcknowledged && (
            <p id="f-expensesAcknowledged-error" role="alert" className="mt-1.5 text-sm font-semibold text-accent">
              {errors.expensesAcknowledged}
            </p>
          )}
        </div>
        <TextField name="nearestAirport" label="Nearest airport" placeholder="e.g. AUS" error={errors.nearestAirport} />
        <SelectField name="lodging" label="Lodging provided on site?" options={lodgingOptions} error={errors.lodging} />
        <SelectField
          name="budgetRange"
          label="Budget range for coverage"
          options={raceBudgetRanges}
          hint="Separate from travel costs. Helps me put together the right quote."
          error={errors.budgetRange}
        />
      </div>

      <div hidden={step !== 3} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="contactName" label="Your name" required autoComplete="name" error={errors.contactName} />
          <TextField name="contactRole" label="Your role" placeholder="Race director" autoComplete="organization-title" error={errors.contactRole} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="contactEmail" label="Email" type="email" required autoComplete="email" error={errors.contactEmail} />
          <TextField name="contactPhone" label="Phone" type="tel" autoComplete="tel" error={errors.contactPhone} />
        </div>
        <TextField name="referralSource" label="How did you hear about Diggs?" error={errors.referralSource} />
        <TextArea name="message" label="Anything else?" error={errors.message} />
        <TurnstileField />
      </div>

      <Honeypot />

      {state.message && !state.ok && (
        <p role="alert" className="mt-6 rounded-sm border border-accent bg-accent/5 px-4 py-3 text-sm font-semibold text-accent">
          {state.message}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        {step > 0 ? (
          <button type="button" onClick={() => goTo(step - 1)} className={buttonSecondary}>
            Back
          </button>
        ) : (
          <span />
        )}
        {step < raceSteps.length - 1 ? (
          <button type="button" onClick={next} className={buttonPrimary}>
            Next
          </button>
        ) : (
          <button type="submit" disabled={pending} className={buttonPrimary}>
            {pending ? "Sending…" : "Send request"}
          </button>
        )}
      </div>
    </form>
  );
}
