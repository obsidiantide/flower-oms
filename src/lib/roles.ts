export type Role = "ADMIN" | "CALL_CENTER" | "FLORIST";

/** Whether `role` is one of the `allowed` roles. Missing/unknown roles never match. */
export function hasRole(role: string | undefined | null, ...allowed: Role[]): boolean {
  return role != null && (allowed as string[]).includes(role);
}
