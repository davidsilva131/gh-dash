import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./dates";

const NOW = new Date("2024-06-01T12:00:00Z");

describe("formatRelativeTime", () => {
  it("formats seconds as just now", () => {
    expect(formatRelativeTime("2024-06-01T11:59:45Z", NOW)).toBe("just now");
  });

  it("formats future timestamps as just now", () => {
    expect(formatRelativeTime("2024-06-02T00:00:00Z", NOW)).toBe("just now");
  });

  it("formats minutes ago", () => {
    expect(formatRelativeTime("2024-06-01T11:30:00Z", NOW)).toBe("30 minutes ago");
    expect(formatRelativeTime("2024-06-01T11:59:00Z", NOW)).toBe("1 minute ago");
  });

  it("formats hours ago", () => {
    expect(formatRelativeTime("2024-06-01T09:00:00Z", NOW)).toBe("3 hours ago");
    expect(formatRelativeTime("2024-06-01T11:00:00Z", NOW)).toBe("1 hour ago");
  });

  it("formats days ago", () => {
    expect(formatRelativeTime("2024-05-30T12:00:00Z", NOW)).toBe("2 days ago");
    expect(formatRelativeTime("2024-05-31T12:00:00Z", NOW)).toBe("1 day ago");
  });

  it("formats months ago", () => {
    expect(formatRelativeTime("2024-04-01T12:00:00Z", NOW)).toBe("2 months ago");
  });

  it("formats years ago", () => {
    expect(formatRelativeTime("2022-06-01T12:00:00Z", NOW)).toBe("2 years ago");
  });

  it("returns the raw input for unparseable dates", () => {
    expect(formatRelativeTime("2 days ago", NOW)).toBe("2 days ago");
    expect(formatRelativeTime("never", NOW)).toBe("never");
  });
});
