const express = require("express");

const auth = require("../../middleware/auth");
const weightService = require("./weight.service");

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  try {
    const range = req.query.range || "month";
    const data = await weightService.getWeightData(req.user.id, range);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const weight = Number(req.body.weight);

    if (!weight || weight <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid weight is required",
      });
    }

    const log = await weightService.logWeight(req.user.id, weight);

    res.json({
      success: true,
      data: log,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;