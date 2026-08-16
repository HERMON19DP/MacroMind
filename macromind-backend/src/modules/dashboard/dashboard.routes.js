const express = require("express");

const router = express.Router();

const auth = require("../../middleware/auth");

const dashboardService = require("./dashboard.service");

router.get("/today", auth, async (req, res, next) => {
  try {
    const summary = await dashboardService.getTodaySummary(
      req.user.id,
      req.query.date,
    );
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
});

router.get("/week", auth, async (req, res, next) => {
  try {
    const data = await dashboardService.getWeeklySummary(req.user.id);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
