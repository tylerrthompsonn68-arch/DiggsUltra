import { describe, expect, it } from "vitest";
import { classifyLeadTime, daysBetween, todayIso } from "./lead-time";

const TODAY = "2026-11-08";
const rules = { minLeadDays: 30, preferredLeadDays: 90, maxLeadDays: 548 };
const inDays = (n: number) =>
  new Date(Date.parse(`${TODAY}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

describe("daysBetween", () => {
  it("counts whole days, across DST and month ends", () => {
    expect(daysBetween("2026-03-07", "2026-03-09")).toBe(2);
    expect(daysBetween("2026-10-31", "2026-11-02")).toBe(2);
  });
  it("is negative when the target is earlier", () => {
    expect(daysBetween(TODAY, "2026-11-01")).toBe(-7);
  });
  it("rejects malformed and impossible dates", () => {
    expect(daysBetween(TODAY, "11/20/2026")).toBeNull();
    expect(daysBetween(TODAY, "2026-02-31")).toBeNull();
    expect(daysBetween(TODAY, "")).toBeNull();
  });
});

describe("classifyLeadTime", () => {
  it("rejects past dates", () => {
    expect(classifyLeadTime(inDays(-1), TODAY, rules).status).toBe("past");
  });

  it("treats a race starting today as short notice, not past", () => {
    expect(classifyLeadTime(TODAY, TODAY, rules)).toEqual({ status: "short", days: 0 });
  });

  it("rejects dates more than 548 days out", () => {
    expect(classifyLeadTime(inDays(549), TODAY, rules).status).toBe("too_far");
    expect(classifyLeadTime(inDays(548), TODAY, rules).status).toBe("ok");
  });

  it("flags anything under MIN_LEAD_DAYS (30) as short notice", () => {
    expect(classifyLeadTime(inDays(7), TODAY, rules).status).toBe("short");
    expect(classifyLeadTime(inDays(29), TODAY, rules).status).toBe("short");
    expect(classifyLeadTime(inDays(30), TODAY, rules).status).not.toBe("short");
  });

  it("adds a soft note between 30 and 89 days", () => {
    expect(classifyLeadTime(inDays(30), TODAY, rules).status).toBe("soon");
    expect(classifyLeadTime(inDays(89), TODAY, rules).status).toBe("soon");
  });

  it("is ok at the preferred 90 days and beyond", () => {
    expect(classifyLeadTime(inDays(90), TODAY, rules)).toEqual({ status: "ok", days: 90 });
  });

  it("marks invalid input", () => {
    expect(classifyLeadTime("not-a-date", TODAY, rules)).toEqual({ status: "invalid", days: null });
  });
});

describe("todayIso", () => {
  it("uses the given time zone", () => {
    // 03:00 UTC on Nov 9 is still Nov 8 in Chicago.
    const now = new Date("2026-11-09T03:00:00Z");
    expect(todayIso("America/Chicago", now)).toBe("2026-11-08");
    expect(todayIso("UTC", now)).toBe("2026-11-09");
  });
});
