-- Adds Midtrans payment support to a database that already holds data.
-- Non-destructive and safe to run more than once.
-- Run with: npm run db:migrate
--
-- Note: existing events created in USD keep their currency and stay unpayable by design.
-- Update them to IDR with realistic rupiah prices, or recreate them, before checking out.

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM ('pending', 'settled', 'failed', 'expired', 'refunded');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL DEFAULT 'midtrans',
  status payment_status NOT NULL DEFAULT 'pending',
  gross_amount NUMERIC(12, 2) NOT NULL CHECK (gross_amount >= 0),
  currency CHAR(3) NOT NULL,
  snap_token TEXT,
  payment_type TEXT,
  transaction_status TEXT,
  fraud_status TEXT,
  raw_notification JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS payments_ticket_idx ON payments(ticket_id, created_at DESC);

DROP TRIGGER IF EXISTS payments_updated_at ON payments;
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE events ALTER COLUMN currency SET DEFAULT 'IDR';

-- One-time cleanup. Holds that expired under the previous behaviour left their ticket_seats
-- rows behind, and UNIQUE (seat_id) means those seats could never appear on another ticket.
-- Drop the dead rows and return the seats to circulation.
DELETE FROM ticket_seats ts USING tickets t
  WHERE t.id = ts.ticket_id AND t.status = 'expired';

UPDATE seats SET status = 'available', hold_expires_at = NULL
  WHERE status = 'held' AND hold_expires_at < NOW();

COMMIT;
