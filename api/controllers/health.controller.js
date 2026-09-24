const healthService = require("../services/health.service");

const healthCheck = async (req, res) => {
    try {
        await healthService.checkDatabase();
        res.status(200).json({ 
            status: "ok",
            database: "connected",
         });
    } catch (error) {
        console.error("Health check failed:", error);
        res.status(500).json({
            status: "error",
            database: "disconnected"
        });
    }
};

module.exports = { healthCheck };