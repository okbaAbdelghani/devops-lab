const client = require("prom-client");

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

module.exports = { 
    register,
    httpRequestsTotal,
    httpRequestDuration,
    dbPoolTotal,
    dbPoolIdle,
    dbPoolWaiting
};