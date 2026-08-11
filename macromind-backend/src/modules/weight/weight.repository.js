const pool = require("../../config/db");

async function upsertLog(userId, weightKg) {
  const result = await pool.query(
    `INSERT INTO weight_logs (user_id, weight_kg, logged_at)
     VALUES ($1, $2, CURRENT_DATE)
     ON CONFLICT (user_id, logged_at)
     DO UPDATE SET weight_kg = EXCLUDED.weight_kg
     RETURNING *`,
    [userId, weightKg]
  );

  return result.rows[0];
}

async function getLogsInRange(userId, days) {
  const result = await pool.query(
    `SELECT id, weight_kg, logged_at
     FROM weight_logs
     WHERE user_id = $1
     AND logged_at >= CURRENT_DATE - ($2 || ' days')::interval
     ORDER BY logged_at ASC`,
    [userId, days]
  );

  return result.rows;
}

async function getRecentLogs(userId, limit) {
  const result = await pool.query(
    `SELECT id, weight_kg, logged_at
     FROM weight_logs
     WHERE user_id = $1
     ORDER BY logged_at DESC
     LIMIT $2`,
    [userId, limit]
  );

  return result.rows;
}

async function getEarliestLog(userId) {
  const result = await pool.query(
    `SELECT weight_kg, logged_at
     FROM weight_logs
     WHERE user_id = $1
     ORDER BY logged_at ASC
     LIMIT 1`,
    [userId]
  );

  return result.rows[0];
}

module.exports = {
  upsertLog,
  getLogsInRange,
  getRecentLogs,
  getEarliestLog,
};