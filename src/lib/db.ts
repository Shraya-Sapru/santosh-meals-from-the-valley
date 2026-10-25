import path from "node:path";
import fs from "node:fs";
import Database from "better-sqlite3";

const DATA_DIR = path.resolve(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "santosh.db");

declare global {
  var __santoshDb: Database.Database | undefined;
}

function createSchema(db: Database.Database) {
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS source_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      uploaded_at TEXT NOT NULL DEFAULT (datetime('now')),
      raw_text TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recipe_blocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      document_id INTEGER REFERENCES source_documents(id),
      slug TEXT NOT NULL,
      raw_text TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recipes (
      slug TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'extracted',
      version INTEGER NOT NULL DEFAULT 1,
      approved_at TEXT
    );

    CREATE TABLE IF NOT EXISTS review_edits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_slug TEXT NOT NULL,
      item_id TEXT NOT NULL,
      field TEXT NOT NULL,
      before TEXT,
      after TEXT,
      edited_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS story_sentences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_slug TEXT NOT NULL,
      text TEXT NOT NULL,
      source_text TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'in_review'
    );

    CREATE TABLE IF NOT EXISTS illustrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_slug TEXT NOT NULL,
      step_id TEXT NOT NULL,
      url TEXT NOT NULL,
      prompt TEXT,
      provider TEXT NOT NULL DEFAULT 'handmade',
      status TEXT NOT NULL DEFAULT 'approved'
    );

    CREATE TABLE IF NOT EXISTS memory_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_slug TEXT NOT NULL,
      text TEXT NOT NULL,
      author TEXT,
      status TEXT NOT NULL DEFAULT 'in_review'
    );

    CREATE TABLE IF NOT EXISTS photos (
      slot_id TEXT PRIMARY KEY,
      url TEXT,
      alt TEXT,
      status TEXT NOT NULL DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      seat_cap INTEGER NOT NULL,
      price_inr INTEGER NOT NULL,
      menu TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'draft'
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL REFERENCES events(id),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      seats INTEGER NOT NULL,
      dietary_notes TEXT,
      veg_only INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending_payment',
      payment_ref TEXT,
      hold_expires_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL REFERENCES events(id),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      seats INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pipeline_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_slug TEXT NOT NULL,
      model TEXT NOT NULL,
      input_tokens INTEGER,
      cached_input_tokens INTEGER,
      output_tokens INTEGER,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      finished_at TEXT,
      validator_results TEXT
    );
  `);
}

function seed(db: Database.Database) {
  const eventCount = db
    .prepare("SELECT COUNT(*) as count FROM events")
    .get() as { count: number };
  if (eventCount.count > 0) return;

  const nextSaturday = new Date();
  nextSaturday.setDate(
    nextSaturday.getDate() + ((6 - nextSaturday.getDay() + 7) % 7 || 7)
  );
  const dateStr = nextSaturday.toISOString().slice(0, 10);

  db.prepare(
    `INSERT INTO events (date, start_time, seat_cap, price_inr, menu, status)
     VALUES (?, ?, ?, ?, ?, 'open')`
  ).run(
    dateStr,
    "19:30",
    8,
    1800,
    JSON.stringify(["kehwa", "nadur-monje", "rogan-josh", "nadru-yakhni", "kong-phirin"])
  );
}

function migrate(db: Database.Database) {
  const bookingCols = db.prepare("PRAGMA table_info(bookings)").all() as Array<{
    name: string;
  }>;
  if (!bookingCols.some((c) => c.name === "veg_only")) {
    db.exec("ALTER TABLE bookings ADD COLUMN veg_only INTEGER NOT NULL DEFAULT 0");
  }
}

function openDb(): Database.Database {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const db = new Database(DB_PATH);
  createSchema(db);
  migrate(db);
  seed(db);
  return db;
}

export function getDb(): Database.Database {
  if (!global.__santoshDb) {
    global.__santoshDb = openDb();
  }
  return global.__santoshDb;
}
