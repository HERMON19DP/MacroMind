const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const authRepository = require("./auth.repository");
const emailService = require("./email.service");

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

function createError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function generateOtp() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

function generateAccessToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

function createAuthResponse(user) {
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      age: user.age,
      height_cm: user.height_cm,
      weight_kg: user.weight_kg,
      goal_type: user.goal_type,
      target_weight_kg: user.target_weight_kg,
      activity_level: user.activity_level,
      goal_rate_kg_week: user.goal_rate_kg_week,
      target_date: user.target_date,
      gender: user.gender,
    },
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}

function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw createError("Refresh token is required", 400);
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  return jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
}

function validateSignup(data) {
  const email = normalizeEmail(data.email);
  const name = String(data.name || "").trim();
  const password = String(data.password || "");
  const age = Number(data.age);
  const heightCm = Number(data.heightCm ?? data.height);
  const weightKg = Number(data.weightKg ?? data.weight);
  const goalType = String(data.goalType ?? data.goal ?? "").trim();
  const gender = String(data.gender ?? "")
    .trim()
    .toLowerCase();
  const targetWeightKg = Number(data.targetWeightKg ?? data.targetWeight);
  const activityLevel = String(data.activityLevel || "lightly_active").trim();
  const goalRateKgWeek =
    data.goalRateKgWeek == null || data.goalRateKgWeek === ""
      ? null
      : Number(data.goalRateKgWeek);

  const isMaintain = goalType === "Maintain weight";

  if (!["male", "female"].includes(gender)) {
    throw createError("Select your gender");
  }

  if (!name || name.length > 255) {
    throw createError("Enter a valid name");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
    throw createError("Enter a valid email address");
  }

  if (password.length < 8 || password.length > 72) {
    throw createError("Password must be between 8 and 72 characters");
  }

  if (!Number.isInteger(age) || age < 13 || age > 120) {
    throw createError("Enter a valid age between 13 and 120");
  }

  if (!Number.isFinite(heightCm) || heightCm < 50 || heightCm > 300) {
    throw createError("Enter a valid height in centimeters");
  }

  if (!Number.isFinite(weightKg) || weightKg < 10 || weightKg > 500) {
    throw createError("Enter a valid weight in kilograms");
  }

  if (!["Lose weight", "Gain weight", "Maintain weight"].includes(goalType)) {
    throw createError("Select a valid health goal");
  }

  const validActivityLevels = [
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extra_active",
  ];

  if (!validActivityLevels.includes(activityLevel)) {
    throw createError("Select a valid activity level");
  }

  let targetWeight = null;
  let goalRate = null;

  if (!isMaintain) {
    if (
      !Number.isFinite(targetWeightKg) ||
      targetWeightKg < 10 ||
      targetWeightKg > 500
    ) {
      throw createError("Enter a valid target weight between 10 and 500 kg");
    }

    if (
      (goalType === "Gain weight" && targetWeightKg <= weightKg) ||
      (goalType === "Lose weight" && targetWeightKg >= weightKg)
    ) {
      throw createError(
        "Your target weight must be higher for weight gain and lower for weight loss",
      );
    }

    if (![0.25, 0.5, 1].includes(goalRateKgWeek)) {
      throw createError("Select a valid weekly weight-change rate");
    }

    targetWeight = targetWeightKg;
    goalRate = goalRateKgWeek;
  }

  const targetDate =
    targetWeight !== null
      ? new Date(
          Date.now() +
            Math.ceil(Math.abs(targetWeight - weightKg) / goalRate) *
              7 *
              24 *
              60 *
              60 *
              1000,
        )
          .toISOString()
          .slice(0, 10)
      : null;

  return {
    email,
    name,
    password,
    age,
    gender,
    heightCm,
    weightKg,
    goalType,
    targetWeightKg: targetWeight,
    goalRateKgWeek: goalRate,
    activityLevel,
    targetDate,
  };
}

async function sendOtpForSignup(signup) {
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  await authRepository.savePendingSignup({
    ...signup,
    otpHash,
  });

  try {
    await emailService.sendVerificationOtp(signup.email, otp);
  } catch (error) {
    console.error("OTP email delivery failed:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    });

    await authRepository.deletePendingSignup(signup.email);

    throw createError(
      "Unable to send the verification email. Check the backend logs.",
      503,
    );
  }
}

async function checkEmailAvailability(data) {
  const email = normalizeEmail(data.email);

  if (
    !email ||
    email.length > 255 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    throw createError("Enter a valid email address");
  }

  const existingUser = await authRepository.findByEmail(email);

  if (existingUser) {
    throw createError("An account with this email already exists", 409);
  }

  return {
    available: true,
    message: "Email is available",
  };
}

async function signup(data) {
  const signupData = validateSignup(data);

  const existingUser = await authRepository.findByEmail(signupData.email);

  if (existingUser) {
    throw createError("An account with this email already exists", 409);
  }

  const pending = await authRepository.findPendingSignup(signupData.email);

  if (
    pending &&
    Date.now() - new Date(pending.last_sent_at).getTime() < RESEND_COOLDOWN_MS
  ) {
    throw createError(
      "Please wait 60 seconds before requesting another code",
      429,
    );
  }

  const passwordHash = await bcrypt.hash(signupData.password, 12);

  await sendOtpForSignup({
    ...signupData,
    passwordHash,
  });

  return {
    email: signupData.email,
    expiresInSeconds: OTP_EXPIRY_MS / 1000,
    message: "Verification code sent. Check your email.",
  };
}

async function verifyOtp(data) {
  const email = normalizeEmail(data.email);
  const otp = String(data.otp || "").trim();

  if (!/^\d{6}$/.test(otp)) {
    throw createError("Enter the six-digit verification code");
  }

  const pending = await authRepository.findPendingSignup(email);

  if (!pending) {
    throw createError(
      "Signup expired or no longer exists. Please register again.",
      400,
    );
  }

  if (new Date(pending.expires_at) <= new Date()) {
    await authRepository.deletePendingSignup(email);
    throw createError(
      "Verification code has expired. Please register again.",
      400,
    );
  }

  if (pending.attempts >= MAX_OTP_ATTEMPTS) {
    await authRepository.deletePendingSignup(email);
    throw createError(
      "Too many incorrect attempts. Please register again.",
      429,
    );
  }

  const isMatch = await bcrypt.compare(otp, pending.otp_hash);

  if (!isMatch) {
    const attempts = await authRepository.incrementOtpAttempts(email);

    if (attempts >= MAX_OTP_ATTEMPTS) {
      await authRepository.deletePendingSignup(email);
      throw createError(
        "Too many incorrect attempts. Please register again.",
        429,
      );
    }

    throw createError(
      `Incorrect verification code. ${MAX_OTP_ATTEMPTS - attempts} attempt(s) remaining.`,
      400,
    );
  }

  const user = await authRepository.completePendingSignup(email);
  return createAuthResponse(user);
}

async function resendOtp(data) {
  const email = normalizeEmail(data.email);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError("Enter a valid email address");
  }

  const pending = await authRepository.findPendingSignup(email);

  if (!pending) {
    throw createError(
      "Signup expired or no longer exists. Please register again.",
      400,
    );
  }

  const elapsed = Date.now() - new Date(pending.last_sent_at).getTime();

  if (elapsed < RESEND_COOLDOWN_MS) {
    const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
    throw createError(
      `Please wait ${waitSeconds} seconds before requesting another code`,
      429,
    );
  }

  await sendOtpForSignup({
    email: pending.email,
    name: pending.name,
    passwordHash: pending.password_hash,
    age: pending.age,
    gender: pending.gender,
    heightCm: pending.height_cm,
    weightKg: pending.weight_kg,
    goalType: pending.goal_type,
    targetWeightKg: pending.target_weight_kg,
    activityLevel: pending.activity_level,
    goalRateKgWeek: pending.goal_rate_kg_week,
    targetDate: pending.target_date,
  });

  return {
    email,
    expiresInSeconds: OTP_EXPIRY_MS / 1000,
    message: "A new verification code has been sent.",
  };
}

async function login(data) {
  const email = normalizeEmail(data.email);
  const user = await authRepository.findByEmail(email);

  // Google-only users may not have a password hash.
  if (!user || !user.password_hash) {
    throw createError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(
    String(data.password || ""),
    user.password_hash,
  );

  if (!isMatch) {
    throw createError("Invalid credentials", 401);
  }

  return createAuthResponse(user);
}

module.exports = {
  signup,
  verifyOtp,
  resendOtp,
  login,
  refreshAccessToken,
  checkEmailAvailability,
};
