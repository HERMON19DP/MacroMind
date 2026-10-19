const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const mealService = require("./meal.service");
const { validateOptionalDate } = require("../../utils/dateValidation");
const dailyAnalysisQuota = require("./dailyAnalysisQuota.service");
const pool = require("../../config/db");

router.get("/analysis-quota", auth, async (req, res, next) => {
  try {
    const result = await pool.query(
      `
      SELECT COALESCE((
        SELECT analysis_count
        FROM daily_analysis_usage
        WHERE user_id = $1
          AND usage_date =
            (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date
      ), 0) AS used
      `,
      [req.user.id],
    );

    const used = Number(result.rows[0].used);

    res.json({
      success: true,
      data: {
        used,
        limit: 3,
        remaining: Math.max(0, 3 - used),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/analyze", auth, async (req, res, next) => {
  let reserved = false;

  try {
    if (typeof req.body.text !== "string" || !req.body.text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Meal text is required.",
      });
    }

    await dailyAnalysisQuota.reserveAnalysis(req.user.id);
    reserved = true;

    const analysis = await mealService.analyzeMeal(req.body.text);

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    if (reserved) {
      try {
        await dailyAnalysisQuota.releaseAnalysis(req.user.id);
      } catch (releaseError) {
        console.error("Failed to release analysis quota:", releaseError);
      }
    }

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
    const date = validateOptionalDate(req.query.date);

    const meals = await mealService.getRecentMeals(req.user.id, date);
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
