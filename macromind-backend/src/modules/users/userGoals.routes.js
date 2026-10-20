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
    const goals = await service.updateGoals(req.user.id, req.body);

    res.json({
      success: true,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
