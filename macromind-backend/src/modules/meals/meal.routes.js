const express = require("express");

const router = express.Router();

const auth = require("../../middleware/auth");

const mealService = require("./meal.service");

router.post("/analyze", auth, async (req, res, next) => {
  try {
    const result = await mealService.analyzeAndSaveMeal({
      userId: req.user.id,
      mealType: req.body.mealType,
      text: req.body.text,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/recent", auth, async (req, res, next) => {
  try {
    const meals = await mealService.getRecentMeals(req.user.id);

    res.json({
      success: true,
      data: meals,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:mealId", auth, async (req, res, next) => {
  try {
    const meal = await mealService.deleteMeal(req.params.mealId, req.user.id);

    res.json({
      success: true,
      data: meal,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
