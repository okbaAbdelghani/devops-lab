const pool = require("../config/database");

const checkDatabase = async () => {
  await pool.query("SELECT 1");

  return true;
};

module.exports = {
  checkDatabase,
};