const express = require("express");
const auth = require("../../middleware/auth");
const userService = require("./user.service");
const calorieCalculator = require("./calorieCalculator");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const profileUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many profile updates. Please try again later.",
  },
});

router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/me", auth, profileUpdateLimiter, async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/suggested-calories", auth, async (req, res, next) => {
  try {
    const { weight, height, age, gender, goal, activityLevel, goalRateKgWeek } =
      req.body;

    const profile = await userService.getProfile(req.user.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    const suggestedCalories = calorieCalculator.calculateSuggestedCalories({
      weight: Number(weight),
      height: Number(height),
      age: Number(age),
      gender,
      goal,
      activityLevel: activityLevel || profile.activity_level,
      goalRateKgWeek:
        goalRateKgWeek == null || goalRateKgWeek === ""
          ? profile.goal_rate_kg_week == null
            ? undefined
            : Number(profile.goal_rate_kg_week)
          : Number(goalRateKgWeek),
    });

    if (suggestedCalories == null) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to calculate suggested calories from the provided profile",
      });
    }

    res.json({
      success: true,
      suggestedCalories,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
