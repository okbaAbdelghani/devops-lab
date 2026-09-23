const express = require("express");
const os = require("os");
const { Pool } = require("pg");
const client = require("prom-client");

const app = express();


const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

app.use(express.json());

app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const duration = Number(process.hrtime.bigint() - start) / 1_000_000_000;

    const route = req.route?.path || req.path;
    httpRequestsTotal.inc({
      method: req.method,
      route: route,
      status_code: res.statusCode,
    });

    httpRequestDuration.observe({
      method: req.method,
      route: route,
      status_code: res.statusCode,
    }, duration);
  });

  next();
})


const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "devops_lab",
  user: process.env.DB_USER || "devops",
  password: process.env.DB_PASSWORD || "devops_password",
});

const dbPoolTotal = new client.Gauge({
  name: "db_pool_total_connections",
  help: "Total number of database connections in the pool",
  registers: [register],
});

const dbPoolIdle = new client.Gauge({
  name: "db_pool_idle_connections",
  help: "Number of idle database connections in the pool",
  registers: [register],
});

const dbPoolWaiting = new client.Gauge({
  name: "db_pool_waiting_requests",
  help: "Number of waiting requests for a database connection",
  registers: [register],
});

setInterval(() => {
  dbPoolTotal.set(pool.totalCount);
  dbPoolIdle.set(pool.idleCount);
  dbPoolWaiting.set(pool.waitingCount);
}, 5000);

app.get("/", (req, res) => {
  res.json({
    message: "Hello from my DevOps lab!",
    hostname: os.hostname(),
  });
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: "Failed to create user" 
    });
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
});

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to retrieve metrics"
    });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});