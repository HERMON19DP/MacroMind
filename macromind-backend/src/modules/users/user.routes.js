const express = require("express");

const auth = require("../../middleware/auth");
const userService = require("./user.service");
const calorieCalculator = require("./calorieCalculator");

const router = express.Router();

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

router.put("/me", auth, async (req, res, next) => {
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