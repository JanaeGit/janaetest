-- Create a separate D1 database for Tropic West; do not share other clinics' records.
CREATE TABLE IF NOT EXISTS appointments (
 id TEXT PRIMARY KEY,
 service TEXT NOT NULL,
 date TEXT NOT NULL,
 time TEXT NOT NULL,
 name TEXT NOT NULL,
 email TEXT NOT NULL,
 phone TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'confirmed',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS one_confirmed_appointment_per_time
 ON appointments(date, time) WHERE status = 'confirmed';
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date,status);
