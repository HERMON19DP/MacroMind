const express = require("express");

const auth = require(
  "../../middleware/auth"
);

const router = express.Router();

router.get(
  "/me",
  auth,
  (req, res) => {

    res.json({
      success: true,
      user: req.user
    });

  }
);

module.exports = router;