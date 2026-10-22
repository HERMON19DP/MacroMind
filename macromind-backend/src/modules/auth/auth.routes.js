const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const authController = require("./auth.controller");

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many signup requests. Please try again later.",
  },
});

const otpVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many verification attempts. Please try again later.",
  },
});

const otpResendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests. Please try again later.",
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many token refresh requests. Please try again later.",
  },
});

router.post("/check-email", signupLimiter, authController.checkEmail);

router.post("/signup", signupLimiter, authController.signup);

router.post("/verify-otp", otpVerificationLimiter, authController.verifyOtp);

router.post("/resend-otp", otpResendLimiter, authController.resendOtp);

router.post("/login", loginLimiter, authController.login);

router.post("/refresh", refreshLimiter, authController.refresh);

module.exports = router;
