# Tropic West Booking Worker

Development-stage Cloudflare Worker API, intended for the custom Webflow booking form. **Not live or approved for handling real patient appointments.**

## Current deployment setup

The checked-in `wrangler.jsonc` intentionally has **no database binding**. This allows the Worker to build without a fictitious D1 database ID, while the booking endpoints return HTTP 503 until the real database is connected. The health endpoint `/health` reports `bookingReady: false` until D1 is bound.

## To complete configuration

1. In the Cloudflare account, create a dedicated D1 database named `tropic-west-appointments`.
2. In Worker settings, bind it under **variable name `DB`**. If configuring through Wrangler instead, add the D1 database binding and actual database ID to `wrangler.jsonc` (do not use a placeholder ID).
3. Apply `schema.sql` with `npx wrangler d1 execute tropic-west-appointments --remote --file=schema.sql`.
4. Implement and configure a healthcare-appropriate secure notification handler, set `CLINIC_NOTIFY_URL` and `CLINIC_NOTIFY_SECRET` as Worker environment secrets. The current Worker intentionally rejects bookings without both; no real patient data should be used while configuring.
5. Verify office hours, service-specific appointment duration, holidays, time-zone/DST logic, provider capacity, lead times, abuse controls, appointment cancellation policies, and double-booking tests. The current example is **one provider, one-hour slots, Mon–Sat 9–5 Eastern**, which is **not** clinic-verified.
6. Confirm applicable medical privacy/security requirements and vendor contractual coverage (including BAAs where necessary) before storing actual patient information.
7. Test GET `/health`, GET `/api/appointments/availability?date=YYYY-MM-DD&service=SkinPen`, and POST `/api/appointments` including conflicting simultaneous bookings.
8. Only after full end-to-end tests, set `window.TWH_BOOKING_API_BASE` in Webflow to the deployed Worker URL; the Webflow form stays unavailable for booking until connected.

## Worker endpoints

- `GET /health`
- `GET /api/appointments/availability?date=YYYY-MM-DD&service=SkinPen`
- `POST /api/appointments`, JSON `{service,date,time,customerName,customerEmail,customerPhone}`

## Cloudflare build settings

- Repository: `JanaeGit/janaetest`
- Branch: `main`
- Root directory: `/`
- Build command: none
- Deploy command: `npx wrangler deploy`

A previous failed build showed a Git clone error. This repository's files cannot resolve Cloudflare↔GitHub authorization errors. Reauthorize repository access if cloning still fails.
