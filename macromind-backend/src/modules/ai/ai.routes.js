const express = require("express");
const aiService = require("./ai.service");
const auth = require("../../middleware/auth");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const aiTestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many AI test requests. Please try again later.",
  },
});

router.post("/test", auth, aiTestLimiter, async (req, res, next) => {
  try {
    const response = await aiService.testGemini(req.body.prompt);

    res.json({
      success: true,
      response,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
