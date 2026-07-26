const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./src/modules/auth/auth.routes");
const userRoutes = require("./src/modules/users/user.routes");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

const aiRoutes = require("./src/modules/ai/ai.routes");

const mealRoutes = require("./src/modules/meals/meal.routes");

const dashboardRoutes = require("./src/modules/dashboard/dashboard.routes");

const userGoalRoutes = require("./src/modules/users/userGoals.routes");

const photoRoutes = require("./src/modules/meals/photo.routes");

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/meals", mealRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/users", userGoalRoutes);

app.use("/api/meals", photoRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MacroMind API is running",
  });
});

module.exports = app;
