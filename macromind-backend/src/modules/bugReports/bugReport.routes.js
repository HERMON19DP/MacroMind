const express = require("express");
const auth = require("../../middleware/auth");
const upload = require("./bugReport.upload");
const bugReportService = require("./bugReport.service");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const bugReportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many bug reports. Please try again later.",
  },
});

router.post(
  "/",
  bugReportLimiter,
  auth,
  (req, res, next) => {
    upload.array("screenshots", 3)(req, res, (error) => {
      if (error) {
        if (error instanceof require("multer").MulterError) {
          if (error.code === "LIMIT_FILE_SIZE") {
            error.message = "Each screenshot must be 5 MB or smaller.";
          } else if (error.code === "LIMIT_FILE_COUNT") {
            error.message = "You can attach up to 3 screenshots.";
          }

          error.statusCode = 400;
        }

        return next(error);
      }

      next();
    });
  },
  async (req, res, next) => {
    try {
      const result = await bugReportService.createBugReport(
        req.user.id,
        req.body,
        req.files || [],
      );

      res.status(201).json({
        success: true,
        message: result.emailSent
          ? "Report submitted successfully."
          : "Report saved successfully, but the email notification could not be sent.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
