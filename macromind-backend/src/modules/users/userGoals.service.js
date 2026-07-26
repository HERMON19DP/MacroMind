const repository =
  require("./userGoals.repository");

async function getGoals(userId) {

  return await repository.getGoals(
    userId
  );
}

async function updateGoals(
  userId,
  goals
) {

  return await repository.upsertGoals(
    userId,
    goals
  );
}

module.exports = {
  getGoals,
  updateGoals
};