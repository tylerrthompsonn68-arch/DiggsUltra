"use client";

import { track } from "@vercel/analytics";
import { useActionState, useEffect } from "react";
import { submitSponsorInquiry, type FormState } from "@/app/actions/inquiries";
import { buttonPrimary, CheckboxGroup, Honeypot, SelectField, TextArea, TextField } from "@/components/form";
import { TurnstileField } from "@/components/turnstile-field";
import { booking } from "@/config/site";
import { partnershipTypes, sponsorBudgetRanges } from "@/lib/inquiry-options";

export function PartnerForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(submitSponsorInquiry, { ok: false });
  const errors = state.errors ?? {};

  useEffect(() => {
    if (state.ok) track("partner_submit");
  }, [state.ok]);

  if (state.ok) {
    return (
      <div role="status" className="rounded-sm border border-rule bg-paper-raised p-8">
        <h3 className="font-display text-3xl">Message sent.</h3>
        <p className="mt-4 text-lg text-ink-muted">Check your inbox for a confirmation. I&apos;ll get back to you {booking.responseTime}.</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="relative space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="brandName" label="Brand name" required autoComplete="organization" error={errors.brandName} />
        <TextField name="brandUrl" label="Website" type="url" inputMode="url" placeholder="yourbrand.com" error={errors.brandUrl} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="contactName" label="Your name" required autoComplete="name" error={errors.contactName} />
        <TextField name="contactRole" label="Your role" autoComplete="organization-title" error={errors.contactRole} />
      </div>
      <TextField name="contactEmail" label="Email" type="email" required autoComplete="email" error={errors.contactEmail} />
      <CheckboxGroup name="partnershipTypes" label="What are you interested in?" required options={partnershipTypes} error={errors.partnershipTypes} />
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField name="budgetRange" label="Budget range" options={sponsorBudgetRanges} error={errors.budgetRange} />
        <TextField name="timeline" label="Timeline" placeholder="e.g. Spring 2027 race season" error={errors.timeline} />
      </div>
      <TextArea name="message" label="Message" error={errors.message} />
      <TurnstileField />
      <Honeypot />

      {state.message && (
        <p role="alert" className="rounded-sm border border-accent bg-accent/5 px-4 py-3 text-sm font-semibold text-accent">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className={buttonPrimary}>
        {pending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
