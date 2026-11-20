export type StockStatus = "ok" | "low" | "out";

/**
 * Stock level of a flower: "out" when nothing is left, "low" when the quantity
 * has reached the configured low-stock level, otherwise "ok".
 * Non-finite input (e.g. an empty form field parsed as NaN) is treated as "ok".
 */
export function stockStatus(quantity: number, lowStockLevel: number): StockStatus {
  if (!Number.isFinite(quantity) || !Number.isFinite(lowStockLevel)) return "ok";
  if (quantity <= 0) return "out";
  if (quantity <= lowStockLevel) return "low";
  return "ok";
}

/** Number of flowers that need restocking (low or out), ignoring inactive ones. */
export function countNeedingRestock(
  flowers: { stockQuantity: number; lowStockLevel: number; isActive: boolean }[],
): number {
  return flowers.filter((f) => f.isActive && stockStatus(f.stockQuantity, f.lowStockLevel) !== "ok").length;
}
