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

router.post("/suggested-calories", auth, (req, res) => {
  const { weight, height, age, gender, goal } = req.body;

  const suggestedCalories = calorieCalculator.calculateSuggestedCalories({
    weight: Number(weight),
    height: Number(height),
    age: Number(age),
    gender,
    goal,
  });

  res.json({
    success: true,
    suggestedCalories,
  });
});

module.exports = router;
