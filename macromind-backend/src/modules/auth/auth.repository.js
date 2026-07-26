const pool = require("../../config/db");

async function createUser(user) {
  const query = `
    INSERT INTO users
    (email, password_hash, name)
    VALUES ($1, $2, $3)
    RETURNING id, email, name, created_at
  `;

  const values = [
    user.email,
    user.passwordHash,
    user.name
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}

async function findByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0];
}

module.exports = {
  createUser,
  findByEmail
};