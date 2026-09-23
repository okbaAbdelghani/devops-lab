const express = require("express");
const os = require("os");
const { Pool } = require("pg");
const client = require("prom-client");

const app = express();
app.use(express.json());


const register = new client.Registry();
client.collectDefaultMetrics({ register });

const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "devops_lab",
  user: process.env.DB_USER || "devops",
  password: process.env.DB_PASSWORD || "devops_password",
});

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