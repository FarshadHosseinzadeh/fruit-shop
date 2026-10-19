# 🍎 Fruit Shop (فروت شاپ)

![CI](https://github.com/FarshadHosseinzadeh/fruit-shop/actions/workflows/ci.yml/badge.svg)
A full-stack online fruit shop with delivery-slot booking, built as a portfolio project.
Customers browse fruits sold by the kilogram, fill a cart, pick a delivery day and time slot, and pay cash on delivery.

**Live demo:** https://fruit-shop-llzr.vercel.app/

**Demo account:** phone `09120000000` / password `demo1234`

## Features

- Phone + password sign up and login (hashed passwords, httpOnly session cookie)
- Product list read from PostgreSQL, with low-stock and out-of-stock states
- Cart with whole-kilogram quantities, live totals and an invoice-style breakdown (persisted locally, cleared on logout)
- Checkout with delivery day (today or tomorrow) and time slots (9-12, 12-15, 15-18, 18-21)
- Order placed in a single database transaction, with stock decrement
- Order history, order detail page and a step-by-step status tracker (pending, preparing, on the way, delivered)
- Customers can cancel an order while it is still pending; stock is restored in the same database transaction (race-safe, only the owner can cancel)
- Admin panel with roles (USER/ADMIN): protected routes, all orders with a status filter, one-step-at-a-time status updates, and product price, stock and visibility management
- Persian UI, right-to-left layout, responsive design

## Implementation notes

- **Server-side validation:** the client only sends product ids and quantities. Prices, availability and stock are re-read from the database on the server, so the cart cannot be tampered with.
- **Delivery rule enforced on the server:** a slot is bookable only if it starts at least 3 hours from now, calculated in Tehran time, and only for today or tomorrow.
- **Price snapshot:** each order item stores the product name and unit price at purchase time, so old orders do not change when prices change.
- **Atomic stock update:** stock is decremented with a conditional update inside the same transaction that creates the order, so two orders cannot oversell a product.
- **Ordered status flow:** an order status can only move one step forward (a small script handles it until an admin panel is added).
- **No Google Fonts at runtime:** Vazirmatn is bundled locally.

## Tech stack

Next.js 16 (App Router, Server Actions), React 19, TypeScript, Tailwind CSS 4, Prisma 7 with PostgreSQL (Neon), Zustand, Zod, bcryptjs, jose (JWT session), deployed on Vercel.

## Getting started

Requirements: Node.js 20.19+ and pnpm.

```bash
pnpm install
cp .env.example .env        # then fill in DATABASE_URL and SESSION_SECRET
pnpm exec prisma migrate deploy
pnpm exec prisma db seed
pnpm dev
```

Open http://localhost:3000.

### Useful scripts

```bash
pnpm exec prisma db seed                              # seed 10 fruits
pnpm exec tsx prisma/set-status.ts <orderId> <STATUS> # move an order one step forward
pnpm exec tsx prisma/make-admin.ts <phone>             # promote an existing user to admin
pnpm test                                             # run unit tests (delivery slot rules)
pnpm build                                            # production build
```

## Project structure

```
prisma/            schema, migrations, seed and helper scripts
src/app/           pages and server actions (cart, checkout, orders, auth)
src/components/    header, footer, cart link, buttons
src/lib/           prisma client, session, auth helpers, formatters
src/store/         Zustand cart store
```

## Roadmap

- Discounts and sales statistics in the admin panel
- Search and filter for orders
- Map picker for the delivery address
- Product photos
