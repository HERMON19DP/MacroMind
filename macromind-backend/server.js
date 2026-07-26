require("dotenv").config();

const app = require("./app");
const pool = require("./src/config/db");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await pool.query("SELECT NOW()");

    console.log("✅ Database Connection Verified");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup Failed:", error);
    process.exit(1);
  }
}

startServer();