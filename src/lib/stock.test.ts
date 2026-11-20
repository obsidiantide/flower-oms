import { describe, expect, it } from "vitest";
import { countNeedingRestock, stockStatus } from "./stock";

describe("stockStatus", () => {
  it("is ok above the low-stock level", () => {
    expect(stockStatus(11, 10)).toBe("ok");
  });

  it("is low at and below the level", () => {
    expect(stockStatus(10, 10)).toBe("low");
    expect(stockStatus(1, 10)).toBe("low");
  });

  it("is out at zero or negative quantity", () => {
    expect(stockStatus(0, 10)).toBe("out");
    expect(stockStatus(-3, 10)).toBe("out");
    expect(stockStatus(0, 0)).toBe("out");
  });

  it("ignores non-finite input", () => {
    expect(stockStatus(Number.NaN, 10)).toBe("ok");
    expect(stockStatus(5, Number.NaN)).toBe("ok");
  });
});

describe("countNeedingRestock", () => {
  it("counts only active low or out flowers", () => {
    expect(
      countNeedingRestock([
        { stockQuantity: 50, lowStockLevel: 10, isActive: true },
        { stockQuantity: 5, lowStockLevel: 10, isActive: true },
        { stockQuantity: 0, lowStockLevel: 10, isActive: true },
        { stockQuantity: 0, lowStockLevel: 10, isActive: false },
      ]),
    ).toBe(2);
  });

  it("returns 0 for an empty list", () => {
    expect(countNeedingRestock([])).toBe(0);
  });
});
