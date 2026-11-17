import { describe, expect, it } from "vitest";
import { buildOrderWhere } from "./orderFilters";

describe("buildOrderWhere", () => {
  it("returns an empty filter for no params", () => {
    expect(buildOrderWhere({})).toEqual({});
  });

  it("searches by name or phone and trims the query", () => {
    expect(buildOrderWhere({ search: "  Aysel " }).OR).toEqual([
      { customerFullName: { contains: "Aysel" } },
      { customerPhone: { contains: "Aysel" } },
    ]);
  });

  it("ignores a blank search", () => {
    expect(buildOrderWhere({ search: "   " })).toEqual({});
  });

  it("accepts a known status and ignores an unknown one", () => {
    expect(buildOrderWhere({ status: "READY" }).status).toBe("READY");
    expect(buildOrderWhere({ status: "BOGUS" })).toEqual({});
  });

  it("builds a one-day delivery range", () => {
    const where = buildOrderWhere({ date: "2026-02-28" });
    expect(where.deliveryDate?.gte.toISOString()).toBe("2026-02-28T00:00:00.000Z");
    expect(where.deliveryDate?.lt.toISOString()).toBe("2026-03-01T00:00:00.000Z");
  });

  it("ignores malformed dates", () => {
    expect(buildOrderWhere({ date: "not-a-date" })).toEqual({});
    expect(buildOrderWhere({ date: "2026-13-45" })).toEqual({});
  });

  it("maps the unassigned florist to null", () => {
    expect(buildOrderWhere({ florist: "unassigned" }).assignedToId).toBeNull();
    expect(buildOrderWhere({ florist: "u1" }).assignedToId).toBe("u1");
  });

  it("passes delivery time through and combines filters", () => {
    expect(buildOrderWhere({ time: "14:00", status: "NEW" })).toEqual({
      deliveryTime: "14:00",
      status: "NEW",
    });
  });
});
