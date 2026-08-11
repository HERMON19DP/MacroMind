const repository = require("./user.repository");

async function getProfile(userId) {
  return await repository.getById(userId);
}

async function updateProfile(userId, data) {
  return await repository.updateProfile(userId, data);
}

module.exports = {
  getProfile,
  updateProfile,
};