const express = require("express");
const os = require("os");
const { Pool } = require("pg");

const app = express();
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

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});