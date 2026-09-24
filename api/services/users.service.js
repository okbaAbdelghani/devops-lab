const pool = require("../config/database");

const createUser = async (name, email) => {
    const result = await pool.query(
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
        [name, email]
    );
    return result.rows[0];
};

const getUsers = async (limit = 100, after = 0) => {
    const result = await pool.query(
        `SELECT id, name, email, created_at 
         FROM users 
         WHERE id > $2
         ORDER BY id 
         LIMIT $1`,
        [limit, after]
    );
    return result.rows;
};

module.exports = { createUser, getUsers };