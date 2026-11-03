export const ORDER_STATUSES = [
  "PICKUP",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "READY",
  "IN_PROGRESS",
  "NEW",
] as const;

export type OrderStatusValue = (typeof ORDER_STATUSES)[number];

const CALL_CENTER_STATUSES: ReadonlySet<string> = new Set([
  "PICKUP",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
]);

/**
 * Whether a user with the given role may move an order to `status`.
 * ADMIN may set any status; CALL_CENTER only the delivery-side ones;
 * FLORIST any status; other roles none.
 */
export function canSetStatus(role: string | undefined, status: OrderStatusValue): boolean {
  switch (role) {
    case "ADMIN":
    case "FLORIST":
      return true;
    case "CALL_CENTER":
      return CALL_CENTER_STATUSES.has(status);
    default:
      return false;
  }
}
