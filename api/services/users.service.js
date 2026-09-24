const pool = require("../config/database");

const createUser = async (name, email) => {
    const result = await pool.query(
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
        [name, email]
    );
    return result.rows[0];
};

const getUsers = async (limit = 10, offset = 0) => {
    const result = await pool.query(
        `SELECT id, name, email, created_at 
         FROM users 
         ORDER BY id 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );
    return result.rows;
};

module.exports = { createUser, getUsers };