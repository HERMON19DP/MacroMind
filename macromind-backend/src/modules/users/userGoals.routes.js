const express = require("express");
const auth = require("../../middleware/auth");
const service = require("./userGoals.service");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const goalsUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many goal updates. Please try again later.",
  },
});

const GOAL_RULES = {
  calorieGoal: { min: 1200, max: 4000 },
  proteinGoal: { min: 0, max: 500 },
  carbGoal: { min: 0, max: 1000 },
  fatGoal: { min: 0, max: 500 },
};

function validateGoals(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Request body must be a JSON object.";
  }

  const fields = Object.keys(body);

  if (fields.length === 0) {
    return "Provide at least one goal to update.";
  }

  for (const field of fields) {
    if (!Object.hasOwn(GOAL_RULES, field)) {
      return `Unknown goal field: ${field}.`;
    }

    const value = body[field];
    const { min, max } = GOAL_RULES[field];

    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      !Number.isInteger(value)
    ) {
      return `${field} must be a finite integer.`;
    }

    if (value < min || value > max) {
      return `${field} must be between ${min} and ${max}.`;
    }
  }

  return null;
}

router.get("/goals", auth, async (req, res, next) => {
  try {
    const goals = await service.getGoals(req.user.id);

    res.json({
      success: true,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/goals", auth, goalsUpdateLimiter, async (req, res, next) => {
  try {
    const validationError = validateGoals(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const goals = await service.updateGoals(req.user.id, req.body);

    return res.json({
      success: true,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
