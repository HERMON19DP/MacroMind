const express = require("express");

const router = express.Router();

const aiService = require("./ai.service");

router.post("/test", async (req, res, next) => {

  try {

    const response =
      await aiService.testGemini(
        req.body.prompt
      );

    res.json({
      success: true,
      response
    });

  } catch (error) {
    next(error);
  }

});

module.exports = router;