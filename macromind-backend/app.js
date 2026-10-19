const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./src/modules/auth/auth.routes");
const userRoutes = require("./src/modules/users/user.routes");
const errorHandler = require("./src/middleware/errorHandler");
const aiRoutes = require("./src/modules/ai/ai.routes");
const mealRoutes = require("./src/modules/meals/meal.routes");
const dashboardRoutes = require("./src/modules/dashboard/dashboard.routes");
const userGoalRoutes = require("./src/modules/users/userGoals.routes");
const photoRoutes = require("./src/modules/meals/photo.routes");
const weightRoutes = require("./src/modules/weight/weight.routes");
const bugReportRoutes = require("./src/modules/bugReports/bugReport.routes");
const rateLimit = require("express-rate-limit");

const app = express();
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(helmet());
app.use(cors());
app.use(express.json());
// Global rate limit for all API endpoints
app.use("/api", globalApiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userGoalRoutes);
app.use("/api/meals", photoRoutes);
app.use("/api/weight", weightRoutes);
app.use("/api/bug-reports", bugReportRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MacroMind API is running",
  });
});

module.exports = app;
