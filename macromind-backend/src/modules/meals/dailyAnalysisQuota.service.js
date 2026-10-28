const pool = require("../../config/db");

const DAILY_ANALYSIS_LIMIT = 4;

async function reserveAnalysis(userId) {
  const result = await pool.query(
    `
    INSERT INTO daily_analysis_usage (
      user_id,
      usage_date,
      analysis_count
    )
    VALUES (
      $1,
      (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date,
      1
    )
    ON CONFLICT (user_id, usage_date)
    DO UPDATE SET
      analysis_count = daily_analysis_usage.analysis_count + 1
    WHERE daily_analysis_usage.analysis_count < $2
    RETURNING analysis_count
    `,
    [userId, DAILY_ANALYSIS_LIMIT],
  );

  if (result.rowCount === 0) {
    const error = new Error(
      "Daily analysis limit reached. You can analyze up to 4 meals per day. Please try again tomorrow.",
    );

    error.statusCode = 429;
    error.code = "DAILY_ANALYSIS_LIMIT_REACHED";
    throw error;
  }

  return result.rows[0].analysis_count;
}

async function releaseAnalysis(userId) {
  await pool.query(
    `
    UPDATE daily_analysis_usage
    SET analysis_count = GREATEST(analysis_count - 1, 0)
    WHERE user_id = $1
      AND usage_date =
        (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date
    `,
    [userId],
  );
}

module.exports = {
  reserveAnalysis,
  releaseAnalysis,
  DAILY_ANALYSIS_LIMIT,
};
