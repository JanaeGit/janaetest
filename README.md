# Tropic West Booking Worker

Cloudflare Worker for the Tropic West Health Webflow appointment form. **Production deployment and patient/clinic email delivery have not been independently verified. Do not rely on this API for real patient bookings until end-to-end testing and privacy requirements have been completed.**

## Source of truth

- Worker name: `tropic-west-booking`
- Entrypoint: `src/index.js`
- Configuration: `wrangler.jsonc`
- Database schema: `schema.sql`
- Production Worker URL used by Webflow: `https://tropic-west-booking.garinejanae.workers.dev`
- Production origin: `https://www.tropicwesthealth.com`
- Secondary origin: `https://www.tropicwesthealthclinic.com`
- Preview origin: `https://tropicwesthealthf196da3d4-c438e70327a2a.webflow.io`

All three origins are explicitly permitted for appointment POST requests and the associated CORS preflight.

## Cloudflare deployment checklist

1. Open Cloudflare > Workers & Pages > `tropic-west-booking` > Settings > Build. Verify repository **JanaeGit/janaetest**, branch **main**, root directory **/**, deploy command **`npx wrangler deploy`**. If Git deployment is already connected and succeeding, inspect the latest deployment; otherwise trigger a new production deployment or use Wrangler CLI from the repository root (`npm install && npm run deploy`).
2. Under Settings > Bindings / Variables and Secrets, verify D1 binding name **DB** points to **tropic-west-appointments**, database ID **31b930bb-bcdb-4f57-9c81-a955291bf083**. The Wrangler config declares this binding. Do not create a second unrelated database.
3. Verify `schema.sql` was applied to the **remote** D1 database before a booking test: `npx wrangler d1 execute tropic-west-appointments --remote --file=schema.sql` (run only after selecting the intended account; this is an idempotent table/index creation script).
4. Confirm runtime variables `PUBLIC_ORIGIN`, `SECONDARY_PUBLIC_ORIGIN`, `PREVIEW_ORIGIN`, `CLINIC_NOTIFICATION_TO`, `CLINIC_NOTIFICATION_CC`, and `CLINIC_NOTIFY_URL` match `wrangler.jsonc`.
5. Confirm **`CLINIC_NOTIFY_SECRET`** exists as a **Secret**, not a plaintext variable. Its value must match the secret verified by the Google Apps Script notifier. This value must never be committed to GitHub or pasted in a public chat. If it does not exist, create a long random shared secret in Cloudflare and configure the Google Apps Script to check the same value. Verify the Apps Script Web App deployment is accessible to the Worker.
6. Validate `GET /health` (expect `{"status":"ok","bookingReady":true}` when DB is bound), then test availability and a controlled test booking from the live domain. Test with non-patient test data and remove or cancel test bookings afterward.
7. Verify a booking returns HTTP **201** with `{"status":"confirmed"}`, creates one confirmed D1 record, sends both clinic notification and patient confirmation (the actual email content/recipients must be verified in Apps Script), and prevents two confirmed bookings at the same date/time. Confirm the selected slot is no longer available.
8. Confirm healthcare privacy/security, relevant vendor agreements, retention policies, appropriate consent and disclosure, and actual clinic scheduling rules before accepting real patient appointment details.

## Current behavior of `src/index.js`

- `GET /health`
- `GET /api/appointments/availability?date=YYYY-MM-DD&service=SkinPen`
- `POST /api/appointments`, JSON with `service`, `date`, `time`, `customerName`, `customerEmail`, `customerPhone`, optional `additionalNotes`
- Currently advertises hourly start slots **9 AM through 6 PM Eastern, Monday–Friday**. Office hours, slot length, cutoff times, holidays, provider availability and other policies must be confirmed by the clinic before production use.
- Uses an atomic D1 unique partial index to prevent multiple **confirmed** bookings in the same time slot, across services.
- A booking requires `CLINIC_NOTIFY_URL` and `CLINIC_NOTIFY_SECRET`. Worker calls the Apps Script notifier; if that call fails, the booking is set to cancelled and a 503 error is returned. Actual clinic/patient email delivery is handled by Apps Script and cannot be established from the Worker source alone.
- Browser availability GET requests may work even when POST requests fail because GET currently allows `Access-Control-Allow-Origin: *`; a successful availability display is not sufficient proof of working booking.

## Safety checks

Do not submit real patient health or identifying information in tests or logs. Check that Cloudflare, D1, Apps Script and email workflows have the required access controls and healthcare-appropriate privacy protections before enabling real intake.
