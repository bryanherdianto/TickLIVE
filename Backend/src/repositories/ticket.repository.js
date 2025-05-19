const db = require('../database/pg.database');

exports.getAlltickets = async () => {
    try {
        const res = await db.query('SELECT * FROM tickets');
        return res.rows;
    } catch (error) {
        console.error('Error fetching tickets:', error);
        throw error;
    }
}

exports.getTicketById = async (ticketId) => {
    try {
        const res = await db.query('SELECT * FROM tickets WHERE id = $1', [ticketId]);
        return res.rows[0];
    } catch (error) {
        console.error('Error fetching ticket by ID:', error);
        throw error;
    }
}

exports.createTicket = async (ticketData) => {
    try {
        const { seat_id, user_id } = ticketData;
        const res = await db.query('INSERT INTO tickets (seat_id, user_id) VALUES ($1, $2) RETURNING *', [seat_id, user_id]);
        if (res.rows.length === 0) {
            throw new Error('Ticket creation failed');
        }
        return res.rows[0];
    } catch (error) {
        console.error('Error creating ticket:', error);
        throw error;
    }
}

exports.updateTicket = async (ticketId, ticketData) => {
    try {
        const { user_id, seat_id, status } = ticketData;
        const res = await db.query('UPDATE tickets SET user_id = $2, seat_id = $1, status = $3 WHERE id = $4 RETURNING *', [user_id, seat_id, status, ticketId]);
        if (res.rows.length === 0) {
            throw new Error('Ticket update failed');
        }
        return res.rows[0];
    } catch (error) {
        console.error('Error updating ticket:', error);
        throw error;
    }
}

exports.deleteTicket = async (ticketId) => {
    try {
        const res = await db.query('DELETE FROM tickets WHERE id = $1 RETURNING *', [ticketId]);
        if (res.rows.length === 0) {
            throw new Error('Ticket deletion failed');
        }
        return res.rows[0];
    } catch (error) {
        console.error('Error deleting ticket:', error);
        throw error;
    }
}