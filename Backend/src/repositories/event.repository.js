const db = require('../database/pg.database');

exports.getAllEvents = async () => {
    try {
        const res = await db.query('SELECT * FROM events');
        return res.rows;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}

exports.getEventById = async (id) => {
    try {
        const res = await db.query('SELECT * FROM events WHERE id = $1', [id]);
        return res.rows[0];
    } catch (error) {
        console.error('Error fetching event by ID:', error);
        throw error;
    }
}

exports.createEvent = async (event) => {
    try {
        const res = await db.query(
            'INSERT INTO events (name, id_host, date, location_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [event.name, event.id_host, event.date, event.location_id]
        );
        return res.rows[0];
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
}

exports.updateEvent = async (id, event) => {
    try {
        const res = await db.query(
            'UPDATE events SET name = $1, id_host = $2, date = $3, location_id = $4 WHERE id = $5 RETURNING *',
            [event.name, event.id_host, event.date, event.location_id, id]
        );
        return res.rows[0];
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
}

exports.deleteEvent = async (id) => {
    try {
        const res = await db.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
        return res.rows[0];
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
}