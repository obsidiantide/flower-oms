import { describe, expect, it } from "vitest";
import { buildOrderWhere, pageHref, parsePage } from "./orderFilters";

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

describe("parsePage", () => {
  it("defaults to the first page", () => {
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage("")).toBe(1);
  });

  it("accepts positive integers", () => {
    expect(parsePage("3")).toBe(3);
  });

  it("rejects zero, negatives, fractions and junk", () => {
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-2")).toBe(1);
    expect(parsePage("1.5")).toBe(1);
    expect(parsePage("abc")).toBe(1);
    expect(parsePage("99999999999999999999")).toBe(1);
  });
});

describe("pageHref", () => {
  it("keeps filters and sets the page", () => {
    expect(pageHref({ status: "NEW", search: "" }, 2)).toBe("?status=NEW&page=2");
  });

  it("drops the page param for the first page", () => {
    expect(pageHref({ status: "NEW", page: "4" }, 1)).toBe("?status=NEW");
    expect(pageHref({}, 1)).toBe("?");
  });
});
