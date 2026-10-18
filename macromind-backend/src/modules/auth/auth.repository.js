const pool = require("../../config/db");
const { calculateSuggestedCalories } = require("../users/calorieCalculator");

async function createUser(user) {
  const query = `
    INSERT INTO users (
      email,
      password_hash,
      name,
      age,
      height_cm,
      weight_kg,
      goal_type,
      email_verified
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
    RETURNING id, email, name, age, height_cm, weight_kg, goal_type, created_at
  `;

  const values = [
    user.email,
    user.passwordHash,
    user.name,
    user.age ?? null,
    user.heightCm ?? null,
    user.weightKg ?? null,
    user.goalType ?? null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

async function findByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  return result.rows[0];
}

async function findPendingSignup(email) {
  const result = await pool.query(
    "SELECT * FROM pending_signups WHERE email = $1",
    [email],
  );

  return result.rows[0];
}

async function savePendingSignup(signup) {
  const query = `
    INSERT INTO pending_signups (
      email,
      name,
      password_hash,
      age,
      gender,
      height_cm,
      weight_kg,
      goal_type,
      otp_hash,
      expires_at,
      attempts,
      last_sent_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9,
      NOW() + INTERVAL '10 minutes',
      0,
      NOW()
    )
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      password_hash = EXCLUDED.password_hash,
      age = EXCLUDED.age,
      gender = EXCLUDED.gender,
      height_cm = EXCLUDED.height_cm,
      weight_kg = EXCLUDED.weight_kg,
      goal_type = EXCLUDED.goal_type,
      otp_hash = EXCLUDED.otp_hash,
      expires_at = EXCLUDED.expires_at,
      attempts = 0,
      last_sent_at = NOW(),
      verified_at = NULL
    RETURNING email
  `;

  const values = [
    signup.email,
    signup.name,
    signup.passwordHash,
    signup.age,
    signup.gender,
    signup.heightCm,
    signup.weightKg,
    signup.goalType,
    signup.otpHash,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

async function incrementOtpAttempts(email) {
  const result = await pool.query(
    `UPDATE pending_signups
     SET attempts = attempts + 1
     WHERE email = $1
     RETURNING attempts`,
    [email],
  );

  return result.rows[0]?.attempts ?? 0;
}

async function deletePendingSignup(email) {
  await pool.query("DELETE FROM pending_signups WHERE email = $1", [email]);
}

async function completePendingSignup(email) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const pendingResult = await client.query(
      `SELECT *
       FROM pending_signups
       WHERE email = $1
       FOR UPDATE`,
      [email],
    );

    const pending = pendingResult.rows[0];

    if (!pending) {
      const error = new Error("Signup expired or no longer exists");
      error.statusCode = 400;
      throw error;
    }

    if (new Date(pending.expires_at) <= new Date()) {
      const error = new Error("Verification code has expired");
      error.statusCode = 400;
      throw error;
    }

    if (pending.attempts >= 5) {
      const error = new Error(
        "Too many incorrect attempts. Request a new code.",
      );
      error.statusCode = 429;
      throw error;
    }

    const userResult = await client.query(
      `INSERT INTO users (
        email,
        password_hash,
        name,
        age,
        gender,
        height_cm,
        weight_kg,
        goal_type,
        email_verified
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
      RETURNING id, email, name, age, gender, height_cm, weight_kg, goal_type, created_at`,
      [
        pending.email,
        pending.password_hash,
        pending.name,
        pending.age,
        pending.gender,
        pending.height_cm,
        pending.weight_kg,
        pending.goal_type,
      ],
    );

    const user = userResult.rows[0];

    const calorieGoal = calculateSuggestedCalories({
      weight: Number(pending.weight_kg),
      height: Number(pending.height_cm),
      age: Number(pending.age),
      gender: pending.gender,
      goal: pending.goal_type,
    });

    if (calorieGoal == null) {
      throw new Error("Unable to calculate the user's calorie goal");
    }

    await client.query(
      `INSERT INTO user_goals (
    user_id,
    calorie_goal,
    protein_goal,
    carb_goal,
    fat_goal
  )
  VALUES ($1, $2, $3, $4, $5)`,
      [user.id, calorieGoal, 120, 250, 70],
    );

    await client.query("DELETE FROM pending_signups WHERE email = $1", [email]);

    await client.query("COMMIT");
    return userResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  createUser,
  findByEmail,
  findPendingSignup,
  savePendingSignup,
  incrementOtpAttempts,
  deletePendingSignup,
  completePendingSignup,
};
