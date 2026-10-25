import { getDb } from "@/lib/db";

export const MAX_SEATS_PER_BOOKING = 4;
const HOLD_MINUTES = 10;

export type EventRecord = {
  id: number;
  date: string;
  startTime: string;
  seatCap: number;
  priceInr: number;
  menu: string[];
  status: "draft" | "open" | "full" | "closed";
};

type EventRow = {
  id: number;
  date: string;
  start_time: string;
  seat_cap: number;
  price_inr: number;
  menu: string;
  status: string;
};

function rowToEvent(row: EventRow): EventRecord {
  return {
    id: row.id,
    date: row.date,
    startTime: row.start_time,
    seatCap: row.seat_cap,
    priceInr: row.price_inr,
    menu: JSON.parse(row.menu) as string[],
    status: row.status as EventRecord["status"],
  };
}

/** Pending holds older than HOLD_MINUTES never got paid — release their seats. */
function expireStaleHolds(): void {
  const db = getDb();
  db.prepare(
    `UPDATE bookings SET status = 'expired'
     WHERE status = 'pending_payment' AND hold_expires_at < datetime('now')`
  ).run();
}

export function bookedSeats(eventId: number): number {
  expireStaleHolds();
  const db = getDb();
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(seats), 0) as booked FROM bookings
       WHERE event_id = ? AND status IN ('pending_payment', 'confirmed')`
    )
    .get(eventId) as { booked: number };
  return row.booked;
}

export function seatsRemaining(event: EventRecord): number {
  return Math.max(event.seatCap - bookedSeats(event.id), 0);
}

export function listPublicEvents(): EventRecord[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM events WHERE status IN ('open', 'full') AND date >= date('now')
       ORDER BY date ASC`
    )
    .all() as EventRow[];
  return rows.map(rowToEvent);
}

export function listAllEvents(): EventRecord[] {
  const db = getDb();
  const rows = db.prepare(`SELECT * FROM events ORDER BY date ASC`).all() as EventRow[];
  return rows.map(rowToEvent);
}

export function getEvent(id: number): EventRecord | undefined {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM events WHERE id = ?`).get(id) as
    | EventRow
    | undefined;
  return row ? rowToEvent(row) : undefined;
}

export function createEvent(input: {
  date: string;
  startTime: string;
  seatCap: number;
  priceInr: number;
  menu: string[];
  status: EventRecord["status"];
}): number {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO events (date, start_time, seat_cap, price_inr, menu, status)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.date,
      input.startTime,
      input.seatCap,
      input.priceInr,
      JSON.stringify(input.menu),
      input.status
    );
  return Number(result.lastInsertRowid);
}

export type BookingInput = {
  eventId: number;
  name: string;
  email: string;
  phone: string;
  seats: number;
  dietaryNotes: string;
  vegOnly: boolean;
};

export type CreateBookingResult =
  | { ok: true; bookingId: number }
  | { ok: false; reason: "full" | "invalid" };

export type BookingRecord = {
  id: number;
  eventId: number;
  name: string;
  email: string;
  phone: string | null;
  seats: number;
  dietaryNotes: string | null;
  vegOnly: boolean;
  status: "pending_payment" | "confirmed" | "cancelled" | "expired";
  paymentRef: string | null;
  holdExpiresAt: string | null;
  createdAt: string;
};

type BookingRow = {
  id: number;
  event_id: number;
  name: string;
  email: string;
  phone: string | null;
  seats: number;
  dietary_notes: string | null;
  veg_only: number;
  status: string;
  payment_ref: string | null;
  hold_expires_at: string | null;
  created_at: string;
};

function rowToBooking(row: BookingRow): BookingRecord {
  return {
    id: row.id,
    eventId: row.event_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    seats: row.seats,
    dietaryNotes: row.dietary_notes,
    vegOnly: Boolean(row.veg_only),
    status: row.status as BookingRecord["status"],
    paymentRef: row.payment_ref,
    holdExpiresAt: row.hold_expires_at,
    createdAt: row.created_at,
  };
}

/**
 * Creates a pending (held) booking inside a single synchronous transaction.
 * better-sqlite3 calls are synchronous and Node is single-threaded, so the
 * read-then-write here can never interleave with another request — this is
 * what actually prevents overselling, the transaction wrapper just makes the
 * intent explicit and keeps the statements atomic on disk.
 */
export function createPendingBooking(input: BookingInput): CreateBookingResult {
  if (
    input.seats < 1 ||
    input.seats > MAX_SEATS_PER_BOOKING ||
    !input.name.trim() ||
    !input.email.trim()
  ) {
    return { ok: false, reason: "invalid" };
  }

  const db = getDb();
  const run = db.transaction((): CreateBookingResult => {
    expireStaleHolds();
    const event = getEvent(input.eventId);
    if (!event) return { ok: false, reason: "invalid" };

    const remaining = event.seatCap - bookedSeats(event.id);
    if (input.seats > remaining) return { ok: false, reason: "full" };

    const result = db
      .prepare(
        `INSERT INTO bookings
           (event_id, name, email, phone, seats, dietary_notes, veg_only, status, hold_expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_payment', datetime('now', '+${HOLD_MINUTES} minutes'))`
      )
      .run(
        input.eventId,
        input.name.trim(),
        input.email.trim(),
        input.phone.trim() || null,
        input.seats,
        input.dietaryNotes.trim() || null,
        input.vegOnly ? 1 : 0
      );

    if (input.seats >= remaining) {
      db.prepare(`UPDATE events SET status = 'full' WHERE id = ?`).run(input.eventId);
    }

    return { ok: true, bookingId: Number(result.lastInsertRowid) };
  });

  return run();
}

export function getBooking(id: number): BookingRecord | undefined {
  expireStaleHolds();
  const db = getDb();
  const row = db.prepare(`SELECT * FROM bookings WHERE id = ?`).get(id) as
    | BookingRow
    | undefined;
  return row ? rowToBooking(row) : undefined;
}

export function confirmBookingPayment(id: number): boolean {
  const db = getDb();
  const booking = getBooking(id);
  if (!booking || booking.status !== "pending_payment") return false;

  const paymentRef = `TEST-${Date.now().toString(36).toUpperCase()}`;
  db.prepare(
    `UPDATE bookings SET status = 'confirmed', payment_ref = ? WHERE id = ?`
  ).run(paymentRef, id);
  return true;
}

export function addToWaitlist(input: {
  eventId: number;
  name: string;
  email: string;
  seats: number;
}): number {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO waitlist (event_id, name, email, seats) VALUES (?, ?, ?, ?)`
    )
    .run(input.eventId, input.name.trim(), input.email.trim(), input.seats);
  return Number(result.lastInsertRowid);
}

export function listWaitlist(eventId: number): Array<{
  id: number;
  name: string;
  email: string;
  seats: number;
  createdAt: string;
}> {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM waitlist WHERE event_id = ? ORDER BY created_at ASC`)
    .all(eventId) as Array<{
    id: number;
    name: string;
    email: string;
    seats: number;
    created_at: string;
  }>;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    seats: r.seats,
    createdAt: r.created_at,
  }));
}

export function listAllBookings(): Array<
  BookingRecord & { eventDate: string; eventStartTime: string }
> {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT b.*, e.date as event_date, e.start_time as event_start_time
       FROM bookings b JOIN events e ON e.id = b.event_id
       ORDER BY e.date ASC, b.created_at ASC`
    )
    .all() as Array<BookingRow & { event_date: string; event_start_time: string }>;
  return rows.map((r) => ({
    ...rowToBooking(r),
    eventDate: r.event_date,
    eventStartTime: r.event_start_time,
  }));
}
