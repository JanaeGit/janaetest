CREATE TABLE IF NOT EXISTS appointments (id TEXT PRIMARY KEY, service TEXT NOT NULL, date TEXT NOT NULL, time TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'confirmed', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(date,time));
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date,status);
