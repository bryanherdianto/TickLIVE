const db = require('../database/pg.database');

exports.getAllLocations = async () => {
    try {
        const res = await db.query('SELECT * FROM locations');
        return res.rows;
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}

exports.getLocationById = async (id) => {
    try {
        const res = await db.query('SELECT * FROM locations WHERE id = $1', [id]);
        return res.rows[0];
    } catch (error) {
        console.error('Error fetching location by ID:', error);
        throw error;
    }
}

exports.createLocation = async (location) => {
    try {
        const res = await db.query(
            'INSERT INTO locations (name, address, capacity) VALUES ($1, $2, $3) RETURNING *',
            [location.name, location.address, location.capacity]
        );
        return res.rows[0];
    } catch (error) {
        console.error('Error creating location:', error);
        throw error;
    }
}

exports.updateLocation = async (id, location) => {
    try {
        const res = await db.query(
            'UPDATE locations SET name = $1, address = $2, capacity = $3 WHERE id = $4 RETURNING *',
            [location.name, location.address, location.capacity, id]
        );
        return res.rows[0];
    } catch (error) {
        console.error('Error updating location:', error);
        throw error;
    }
}

exports.deleteLocation = async (id) => {
    try {
        const res = await db.query('DELETE FROM locations WHERE id = $1 RETURNING *', [id]);
        return res.rows[0];
    } catch (error) {
        console.error('Error deleting location:', error);
        throw error;
    }
}