-- Run ONCE in existing Tropic West D1 database Console.
ALTER TABLE appointments ADD COLUMN notes TEXT NOT NULL DEFAULT '';
