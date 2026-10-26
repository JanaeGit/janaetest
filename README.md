# Tropic West booking API — development scaffold

This is a Cloudflare Workers/D1 rewrite of the booking interface contract; it is NOT deployed, tested or suitable for real patient scheduling yet.

## Deploy prerequisites
1. Create Cloudflare D1 database named tropic-west-appointments.
2. Replace REPLACE_WITH_ACTUAL_D1_DATABASE_ID in wrangler.jsonc with the real database ID.
3. Apply schema.sql with wrangler d1 execute tropic-west-appointments --remote --file=schema.sql.
4. Connect a secure, appropriate notification backend at CLINIC_NOTIFY_URL, and set CLINIC_NOTIFY_SECRET. It must atomically accept/reject messaging and send secure clinic and patient confirmation without leaking patient details.
5. Replace placeholder hours (Mon-Sat 9-17 ET and 60-minute slots) with clinic-verified hours, resource capacity and blackout logic before launch.
6. Audit HIPAA/privacy/BAA needs before processing real patient information. This is a prototype, not a production healthcare appointment system.
7. After testing, set window.TWH_BOOKING_API_BASE in Webflow to actual Worker URL. Until then form remains disabled.

POST /api/appointments expects service,date,time,customerName,customerEmail,customerPhone. GET /api/appointments/availability?date=YYYY-MM-DD&service=...
