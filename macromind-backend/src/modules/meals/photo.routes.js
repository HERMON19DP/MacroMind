const express = require("express");
const fs = require("fs");

const router = express.Router();

const auth = require("../../middleware/auth");
const upload = require("../../config/multer");
const photoService = require("./photo.service");

router.post(
  "/photo",
  auth,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const analysis = await photoService.analyzePhoto(req.file.path);

      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      next(error);
    }
  },
);

module.exports = router;