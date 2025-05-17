require("dotenv").config();

const { Pool } = require("pg");
const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false,
    },
})

const connectDB = async () => {
    try {
        await pool.connect();
        console.log("PostgreSQL connected");
    } catch (error) {
        console.error("Error connecting to PostgreSQL", error);
        process.exit(1);
    }
}

connectDB();

const query = async (text, params) => {
    try {
        const res = await pool.query(text, params);
        return res;
    } catch (err) {
        console.error("Error executing query", err);
        throw err;
    }
}

module.exports = {
    query,
}