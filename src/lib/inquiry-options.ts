/** Option lists for the intake forms. Shared by forms, validation, emails, and admin. */

export const raceFormats = [
  "50K",
  "50M",
  "100K",
  "100M",
  "200M+",
  "Backyard / last person standing",
  "Multi-stage",
  "Other",
] as const;

export const services = [
  { value: "commentary", label: "Live stream commentary" },
  { value: "hype", label: "Update videos" },
  { value: "coverage", label: "Live race coverage (on socials)" },
  { value: "unsure", label: "Not sure, let's talk" },
] as const;

export const lodgingOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "can_arrange", label: "Can arrange" },
] as const;

export const raceBudgetRanges = [
  "Under $500",
  "$500 to $1,500",
  "$1,500 to $5,000",
  "$5,000+",
  "Prefer to discuss",
] as const;

export const partnershipTypes = [
  { value: "race_coverage", label: "Race coverage sponsorship" },
  { value: "product_integration", label: "Product integration" },
  { value: "dedicated_video", label: "Dedicated video" },
  { value: "event_activation", label: "Event activation" },
  { value: "other", label: "Other" },
] as const;

export const sponsorBudgetRanges = [
  "Under $1,000",
  "$1,000 to $5,000",
  "$5,000 to $15,000",
  "$15,000+",
  "Prefer to discuss",
] as const;

export const inquiryStatuses = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "call_scheduled", label: "Call scheduled" },
  { value: "quoted", label: "Quoted" },
  { value: "contract_sent", label: "Contract sent" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "declined", label: "Declined" },
] as const;

export const declineReasons = [
  { value: "short_notice", label: "Short notice" },
  { value: "budget", label: "Budget" },
  { value: "schedule_conflict", label: "Schedule conflict" },
  { value: "not_a_fit", label: "Not a fit" },
  { value: "other", label: "Other" },
] as const;

export type InquiryStatus = (typeof inquiryStatuses)[number]["value"];
export type DeclineReason = (typeof declineReasons)[number]["value"];

export const labelFor = <T extends { value: string; label: string }>(
  list: readonly T[],
  value: string | null | undefined,
) => list.find((o) => o.value === value)?.label ?? value ?? "";
