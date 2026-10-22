const authService = require("./auth.service");

async function signup(req, res, next) {
  try {
    const result = await authService.signup(req.body);

    res.status(202).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function verifyOtp(req, res, next) {
  try {
    const result = await authService.verifyOtp(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function resendOtp(req, res, next) {
  try {
    const result = await authService.resendOtp(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const accessToken = authService.refreshAccessToken(req.body.refreshToken);

    res.json({
      success: true,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

async function checkEmail(req, res, next) {
  try {
    const result = await authService.checkEmailAvailability(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  verifyOtp,
  resendOtp,
  login,
  refresh,
  checkEmail,
};
