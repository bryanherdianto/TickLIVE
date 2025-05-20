DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS seats CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TYPE IF EXISTS ticket_status CASCADE;
DROP TYPE IF EXISTS seat_status CASCADE;
DROP TYPE IF EXISTS seat_hierarchy CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE seat_hierarchy AS ENUM ('Silver', 'Gold', 'Platinum');
CREATE TYPE seat_status AS ENUM ('Booked', 'Available');
CREATE TYPE ticket_status AS ENUM ('Pending', 'Paid', 'Cancelled');

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    id_host VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    location_id UUID NOT NULL REFERENCES locations(id)
);

CREATE TABLE seats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id),
    position VARCHAR(10) NOT NULL,
    hierarchy seat_hierarchy NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status seat_status NOT NULL DEFAULT 'Available'
);

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seat_id UUID NOT NULL REFERENCES seats(id),
    user_id VARCHAR(255) NOT NULL,
    status ticket_status NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy locations
INSERT INTO locations (name, address, image, description) VALUES
('Gedung Serbaguna', 'Jl. Merdeka No.1', 'gedung.jpg', 'Gedung serbaguna untuk berbagai acara'),
('Auditorium Kampus', 'Jl. Kampus No.2', 'auditorium.jpg', 'Auditorium kampus utama');

-- Insert dummy events
INSERT INTO events (name, id_host, date, location_id) VALUES
('Seminar Teknologi', (SELECT id FROM users WHERE username='host1'), '2025-06-01 09:00:00', (SELECT id FROM locations WHERE name='Gedung Serbaguna')),
('Workshop Data', (SELECT id FROM users WHERE username='host1'), '2025-06-10 13:00:00', (SELECT id FROM locations WHERE name='Auditorium Kampus'));

-- Insert dummy seats
INSERT INTO seats (event_id, position, hierarchy, price, status) VALUES
((SELECT id FROM events WHERE name='Seminar Teknologi'), 'A1', 'Gold', 100000, 'Available'),
((SELECT id FROM events WHERE name='Seminar Teknologi'), 'A2', 'Silver', 80000, 'Available'),
((SELECT id FROM events WHERE name='Workshop Data'), 'B1', 'Platinum', 150000, 'Available');

-- Insert dummy tickets
INSERT INTO tickets (seat_id, user_id, status) VALUES
((SELECT id FROM seats WHERE position='A1'), (SELECT id FROM users WHERE username='user1'), 'Paid'),
((SELECT id FROM seats WHERE position='A2'), (SELECT id FROM users WHERE username='user2'), 'Pending');

ALTER TABLE events
    ADD COLUMN thumbnail VARCHAR(255) DEFAULT 'default_thumbnail.jpg',
    ADD COLUMN description_ TEXT DEFAULT 'No description available';
