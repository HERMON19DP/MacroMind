const express = require("express");
const fs = require("fs");
const router = express.Router();
const auth = require("../../middleware/auth");
const upload = require("../../config/multer");
const photoService = require("./photo.service");
const dailyAnalysisQuota = require("./dailyAnalysisQuota.service");

router.post("/photo", auth, upload.single("image"), async (req, res, next) => {
  let reserved = false;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }

    await dailyAnalysisQuota.reserveAnalysis(req.user.id);
    reserved = true;

    const analysis = await photoService.analyzePhoto(req.file.path);

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
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error("Failed to remove uploaded image:", cleanupError);
      }
    }
  }
});

module.exports = router;
