import { describe, expect, it } from "vitest";
import { hasRole } from "./roles";

describe("hasRole", () => {
  it("matches a single allowed role", () => {
    expect(hasRole("ADMIN", "ADMIN")).toBe(true);
    expect(hasRole("FLORIST", "ADMIN")).toBe(false);
  });

  it("matches any of several allowed roles", () => {
    expect(hasRole("CALL_CENTER", "ADMIN", "CALL_CENTER")).toBe(true);
    expect(hasRole("FLORIST", "ADMIN", "CALL_CENTER")).toBe(false);
  });

  it("rejects missing, empty and unknown roles", () => {
    expect(hasRole(undefined, "ADMIN")).toBe(false);
    expect(hasRole(null, "ADMIN")).toBe(false);
    expect(hasRole("", "ADMIN")).toBe(false);
    expect(hasRole("GUEST", "ADMIN", "CALL_CENTER", "FLORIST")).toBe(false);
  });

  it("rejects everything when no roles are allowed", () => {
    expect(hasRole("ADMIN")).toBe(false);
  });
});
