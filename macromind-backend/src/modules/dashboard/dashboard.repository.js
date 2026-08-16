const pool = require("../../config/db");

async function getTodaySummary(userId, date) {
  const result = await pool.query(
    `
    SELECT
      COALESCE(SUM(total_calories), 0) AS calories,
      COALESCE(SUM(total_protein), 0) AS protein,
      COALESCE(SUM(total_carbs), 0) AS carbs,
      COALESCE(SUM(total_fat), 0) AS fat,
      COUNT(*) AS meal_count
    FROM meals
    WHERE user_id = $1
    AND DATE(created_at) = COALESCE($2::date, CURRENT_DATE)
    `,
    [userId, date || null],
  );
  return result.rows[0];
}

async function getWeeklySummary(userId) {
  const result = await pool.query(
    `
    SELECT

      DATE(created_at) AS date,

      COALESCE(
        SUM(total_calories),
        0
      ) AS calories,

      COALESCE(
        SUM(total_protein),
        0
      ) AS protein,

      COALESCE(
        SUM(total_carbs),
        0
      ) AS carbs,

      COALESCE(
        SUM(total_fat),
        0
      ) AS fat

    FROM meals

    WHERE user_id = $1

    AND created_at >=
      CURRENT_DATE - INTERVAL '6 days'

    GROUP BY DATE(created_at)

    ORDER BY DATE(created_at)
    `,
    [userId],
  );

  return result.rows;
}

module.exports = {
  getTodaySummary,
  getWeeklySummary,
};
