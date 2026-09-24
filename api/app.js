const express = require("express");

const usersRoute = require("./routes/users.routes");
const metricsMiddleware = require("./middleware/metrics");
const { register } = require("./monitoring/metrics");

const healthController = require("./controllers/health.controller");

const app = express();

app.use(express.json());
app.use(metricsMiddleware);
app.use("/users", usersRoute);


app.get("/", (req, res) => {
  res.json({
     message: "Welcome to the DevOps Lab API" 
    });
});

app.get("/health", healthController.healthCheck);

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

module.exports = app;