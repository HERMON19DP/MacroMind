const express = require("express");

const router = express.Router();

const auth =
  require("../../middleware/auth");

const service =
  require("./userGoals.service");

router.get(
  "/goals",
  auth,
  async (req, res, next) => {

    try {

      const goals =
        await service.getGoals(
          req.user.id
        );

      res.json({
        success: true,
        data: goals
      });

    } catch (error) {
      next(error);
    }

  }
);

router.put(
  "/goals",
  auth,
  async (req, res, next) => {

    try {

      const goals =
        await service.updateGoals(
          req.user.id,
          req.body
        );

      res.json({
        success: true,
        data: goals
      });

    } catch (error) {
      next(error);
    }

  }
);

module.exports = router;