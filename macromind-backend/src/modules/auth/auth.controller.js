const authService = require("./auth.service");

async function signup(req, res, next) {
  try {
    const user = await authService.signup(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const user = await authService.login(req.body);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;

    const accessToken = authService.refreshAccessToken(refreshToken);

    res.json({
      success: true,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  login,
  refresh,
};
