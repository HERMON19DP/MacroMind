const express = require("express");

const auth = require("../../middleware/auth");
const userService = require("./user.service");

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

module.exports = router;