# Roadmap

Backlog grouped by domain. Mark items `- [x]` when done.

## A. Core features
- [ ] Order search and status filters on the orders list
- [ ] Low-stock warning badge on the flowers page
- [ ] Sales export by date range

## B. Test coverage
- [x] Vitest setup and tests for order status permission rules
- [x] Extract zod schemas from API routes into `src/lib/schemas.ts` and test them
- [x] Tests for the florist usage/ready payload schemas

## C. Architecture and refactoring
- [x] Extract role-based status rules into `src/lib/orderStatus.ts`
- [ ] Replace `(session.user as any)` casts with a typed session helper
- [ ] Share the role check between `orders` and `customers` routes

## D. Performance and polish
- [ ] Lazy-load the image upload component
- [ ] Paginate the orders API
- [ ] Dark theme pass for admin pages
