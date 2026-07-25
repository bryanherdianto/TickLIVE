-- Tickify modern schema
-- DESTRUCTIVE: this replaces the legacy Tickify tables and their data.
-- Run with: npm run db:reset

BEGIN;

DROP TABLE IF EXISTS ticket_seats CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS seats CASCADE;
DROP TABLE IF EXISTS event_images CASCADE;
DROP TABLE IF EXISTS event_lineup CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS venue_images CASCADE;
DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS app_users CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS ticket_status CASCADE;
DROP TYPE IF EXISTS seat_status CASCADE;
DROP TYPE IF EXISTS event_status CASCADE;
DROP TYPE IF EXISTS venue_status CASCADE;
DROP TYPE IF EXISTS role CASCADE;
DROP TYPE IF EXISTS event_category CASCADE;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE venue_status AS ENUM ('active', 'inactive');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE seat_status AS ENUM ('available', 'held', 'booked', 'unavailable');
CREATE TYPE ticket_status AS ENUM ('pending', 'paid', 'cancelled', 'refunded', 'expired');

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Clerk remains the identity provider. This table stores only app-specific profile data.
CREATE TABLE app_users (
  clerk_id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_clerk_id TEXT NOT NULL REFERENCES app_users(clerk_id) ON DELETE CASCADE,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  address TEXT NOT NULL,
  city VARCHAR(120) NOT NULL,
  country_code CHAR(2),
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  description TEXT,
  image_url TEXT,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  rating NUMERIC(2, 1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  audio_system TEXT,
  lighting_system TEXT,
  stage_area_sqm NUMERIC(10, 2),
  status venue_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE venue_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  position SMALLINT NOT NULL DEFAULT 0 CHECK (position >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (venue_id, position)
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_clerk_id TEXT NOT NULL REFERENCES app_users(clerk_id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE RESTRICT,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  category VARCHAR(80) NOT NULL,
  badge_text VARCHAR(80),
  summary TEXT,
  description TEXT,
  hero_image_url TEXT,
  doors_at TIMESTAMPTZ,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  status event_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (ends_at IS NULL OR ends_at > starts_at),
  CHECK (doors_at IS NULL OR doors_at <= starts_at)
);

CREATE TABLE event_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  position SMALLINT NOT NULL DEFAULT 0 CHECK (position >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, position)
);

CREATE TABLE event_lineup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(160) NOT NULL,
  role VARCHAR(160),
  image_url TEXT,
  position SMALLINT NOT NULL DEFAULT 0 CHECK (position >= 0)
);

-- Seats are event-specific because layouts, zones, and pricing can change per event.
CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  zone_code VARCHAR(24) NOT NULL,
  label VARCHAR(48) NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  status seat_status NOT NULL DEFAULT 'available',
  hold_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, label),
  CHECK ((status = 'held' AND hold_expires_at IS NOT NULL) OR (status <> 'held' AND hold_expires_at IS NULL))
);

CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
  customer_clerk_id TEXT NOT NULL REFERENCES app_users(clerk_id) ON DELETE RESTRICT,
  status ticket_status NOT NULL DEFAULT 'pending',
  currency CHAR(3) NOT NULL,
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  fees NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (fees >= 0),
  total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK ((status = 'pending' AND expires_at IS NOT NULL) OR status <> 'pending')
);

CREATE TABLE ticket_seats (
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  seat_id UUID NOT NULL REFERENCES seats(id) ON DELETE RESTRICT,
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  PRIMARY KEY (ticket_id, seat_id),
  UNIQUE (seat_id)
);

CREATE INDEX venues_city_idx ON venues(city);
CREATE INDEX venues_owner_idx ON venues(owner_clerk_id);
CREATE INDEX events_venue_idx ON events(venue_id);
CREATE INDEX events_owner_idx ON events(owner_clerk_id);
CREATE INDEX events_public_listing_idx ON events(status, starts_at);
CREATE INDEX seats_event_status_idx ON seats(event_id, status);
CREATE INDEX tickets_customer_idx ON tickets(customer_clerk_id, created_at DESC);
CREATE INDEX tickets_event_status_idx ON tickets(event_id, status);

CREATE TRIGGER app_users_updated_at BEFORE UPDATE ON app_users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER venues_updated_at BEFORE UPDATE ON venues FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER seats_updated_at BEFORE UPDATE ON seats FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
