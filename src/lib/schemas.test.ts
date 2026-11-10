import { describe, expect, it } from "vitest";
import {
  createCustomerSchema,
  createOrderSchema,
  readySchema,
  usageSchema,
} from "./schemas";

const validOrder = {
  customerFullName: "Aysel Məmmədova",
  customerPhone: "+994501234567",
  deliveryDate: "2025-03-08",
  deliveryTime: "14:30",
  orderType: "DELIVERY" as const,
  amount: 45,
};

describe("createOrderSchema", () => {
  it("accepts a minimal valid order", () => {
    expect(createOrderSchema.safeParse(validOrder).success).toBe(true);
  });

  it("rejects an unknown order type", () => {
    expect(createOrderSchema.safeParse({ ...validOrder, orderType: "COURIER" }).success).toBe(false);
  });

  it("rejects a negative amount but accepts zero", () => {
    expect(createOrderSchema.safeParse({ ...validOrder, amount: -1 }).success).toBe(false);
    expect(createOrderSchema.safeParse({ ...validOrder, amount: 0 }).success).toBe(true);
  });

  it("rejects empty required strings", () => {
    expect(createOrderSchema.safeParse({ ...validOrder, customerPhone: "" }).success).toBe(false);
    expect(createOrderSchema.safeParse({ ...validOrder, deliveryTime: "" }).success).toBe(false);
  });

  it("rejects a string amount", () => {
    expect(createOrderSchema.safeParse({ ...validOrder, amount: "45" }).success).toBe(false);
  });
});

describe("createCustomerSchema", () => {
  const validCustomer = { fullName: "Leyla Əliyeva", phone: "+994551112233" };

  it("accepts name and phone only", () => {
    expect(createCustomerSchema.safeParse(validCustomer).success).toBe(true);
  });

  it("accepts an empty email string but rejects a malformed one", () => {
    expect(createCustomerSchema.safeParse({ ...validCustomer, email: "" }).success).toBe(true);
    expect(createCustomerSchema.safeParse({ ...validCustomer, email: "not-an-email" }).success).toBe(false);
  });

  it("requires name and phone", () => {
    expect(createCustomerSchema.safeParse({ ...validCustomer, fullName: "" }).success).toBe(false);
    expect(createCustomerSchema.safeParse({ fullName: "X" }).success).toBe(false);
  });
});

describe("usageSchema", () => {
  it("accepts a list of flower usages", () => {
    const r = usageSchema.safeParse({
      items: [
        { flowerId: "f1", quantity: 3 },
        { flowerId: "f2", quantity: 0 },
      ],
    });
    expect(r.success).toBe(true);
  });

  it("rejects an empty items list", () => {
    expect(usageSchema.safeParse({ items: [] }).success).toBe(false);
  });

  it("rejects negative or fractional quantities", () => {
    expect(
      usageSchema.safeParse({ items: [{ flowerId: "f1", quantity: -1 }] }).success
    ).toBe(false);
    expect(
      usageSchema.safeParse({ items: [{ flowerId: "f1", quantity: 1.5 }] }).success
    ).toBe(false);
  });

  it("rejects an empty flowerId", () => {
    expect(
      usageSchema.safeParse({ items: [{ flowerId: "", quantity: 1 }] }).success
    ).toBe(false);
  });
});

describe("readySchema", () => {
  it("accepts an empty object and optional notes", () => {
    expect(readySchema.safeParse({}).success).toBe(true);
    expect(readySchema.safeParse({ prepNotes: "wrapped" }).success).toBe(true);
  });

  it("rejects non-string notes", () => {
    expect(readySchema.safeParse({ prepNotes: 5 }).success).toBe(false);
  });
});
