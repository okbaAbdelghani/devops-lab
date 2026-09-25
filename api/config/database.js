const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "devops_lab",
  user: process.env.DB_USER || "devops",
  password: process.env.DB_PASSWORD || "devops_password",
});


const {
  dbPoolTotal,
  dbPoolIdle,
  dbPoolWaiting,
} = require("../monitoring/metrics");

if (process.env.NODE_ENV !== "test") {
  setInterval(() => {
    dbPoolTotal.set(pool.totalCount);
    dbPoolIdle.set(pool.idleCount);
    dbPoolWaiting.set(pool.waitingCount);
  }, 5000);
}

module.exports = pool;