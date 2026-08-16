const express = require("express");

const router = express.Router();

const auth = require("../../middleware/auth");

const mealService = require("./meal.service");

router.post("/analyze", auth, async (req, res, next) => {
  try {
    const analysis = await mealService.analyzeMeal(req.body.text);

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/save", auth, async (req, res, next) => {
  try {
    const result = await mealService.saveAnalyzedMeal({
      userId: req.user.id,
      mealType: req.body.mealType,
      mealText: req.body.mealText,
      analysis: req.body.analysis,
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
    const meals = await mealService.getRecentMeals(req.user.id, req.query.date);
    res.json({ success: true, data: meals });
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
