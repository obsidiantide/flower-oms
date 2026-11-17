export type OrderListParams = {
  status?: string;
  date?: string;
  time?: string;
  florist?: string;
  search?: string;
};

export const ORDER_STATUSES = [
  "NEW",
  "IN_PROGRESS",
  "READY",
  "PICKUP",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
] as const;

export type OrderWhere = {
  OR?: Array<
    { customerFullName: { contains: string } } | { customerPhone: { contains: string } }
  >;
  status?: (typeof ORDER_STATUSES)[number];
  deliveryDate?: { gte: Date; lt: Date };
  deliveryTime?: string;
  assignedToId?: string | null;
};

function parseDay(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Builds the Prisma `where` clause for the orders list from URL search params.
 * Unknown statuses and malformed dates are ignored instead of reaching the database.
 */
export function buildOrderWhere(params: OrderListParams): OrderWhere {
  const where: OrderWhere = {};

  const search = params.search?.trim();
  if (search) {
    where.OR = [
      { customerFullName: { contains: search } },
      { customerPhone: { contains: search } },
    ];
  }

  if (params.status && (ORDER_STATUSES as readonly string[]).includes(params.status)) {
    where.status = params.status as OrderWhere["status"];
  }

  if (params.date) {
    const date = parseDay(params.date);
    if (date) {
      const nextDay = new Date(date);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      where.deliveryDate = { gte: date, lt: nextDay };
    }
  }

  if (params.time) {
    where.deliveryTime = params.time;
  }

  if (params.florist) {
    where.assignedToId = params.florist === "unassigned" ? null : params.florist;
  }

  return where;
}
