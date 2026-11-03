import { describe, expect, it } from "vitest";
import { ORDER_STATUSES, canSetStatus } from "@/lib/orderStatus";

describe("canSetStatus", () => {
  it("lets ADMIN and FLORIST set every status", () => {
    for (const role of ["ADMIN", "FLORIST"]) {
      for (const status of ORDER_STATUSES) {
        expect(canSetStatus(role, status)).toBe(true);
      }
    }
  });

  it("limits CALL_CENTER to delivery-side statuses", () => {
    expect(canSetStatus("CALL_CENTER", "PICKUP")).toBe(true);
    expect(canSetStatus("CALL_CENTER", "OUT_FOR_DELIVERY")).toBe(true);
    expect(canSetStatus("CALL_CENTER", "COMPLETED")).toBe(true);
    expect(canSetStatus("CALL_CENTER", "NEW")).toBe(false);
    expect(canSetStatus("CALL_CENTER", "IN_PROGRESS")).toBe(false);
    expect(canSetStatus("CALL_CENTER", "READY")).toBe(false);
  });

  it("denies unknown or missing roles", () => {
    expect(canSetStatus(undefined, "NEW")).toBe(false);
    expect(canSetStatus("GUEST", "COMPLETED")).toBe(false);
  });
});
