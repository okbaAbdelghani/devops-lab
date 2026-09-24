const {
    httpRequestsTotal,
    httpRequestDuration,
} = require("../monitoring/metrics");

const metricsMiddleware = (req, res, next) => {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
        const duration = Number(process.hrtime.bigint() - start) / 1e9; // Convert nanoseconds to seconds
        
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
};

module.exports = metricsMiddleware;