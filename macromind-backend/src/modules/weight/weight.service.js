const repository = require("./weight.repository");
const userRepository = require("../users/user.repository");

const RANGE_DAYS = { week: 7, month: 30, "3months": 90 };

function formatShort(date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatLong(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function getWeightData(userId, range) {
  const days = RANGE_DAYS[range] || RANGE_DAYS.month;

  const [rangeLogs, recentLogs, earliestLog, user] = await Promise.all([
    repository.getLogsInRange(userId, days),
    repository.getRecentLogs(userId, 10),
    repository.getEarliestLog(userId),
    userRepository.getById(userId),
  ]);

  const chart = rangeLogs.map((log) => ({
    date: formatShort(log.logged_at),
    weight: Number(log.weight_kg),
  }));

  const latest = recentLogs[0];
  const current = latest ? Number(latest.weight_kg) : user?.weight_kg ? Number(user.weight_kg) : null;
  const target = user?.target_weight_kg ? Number(user.target_weight_kg) : null;
  const starting = earliestLog
    ? Number(earliestLog.weight_kg)
    : user?.weight_kg
      ? Number(user.weight_kg)
      : current;

  const totalLost =
    current != null && starting != null ? Number((starting - current).toFixed(1)) : null;
  const toGoal = current != null && target != null ? Number((current - target).toFixed(1)) : null;

  return {
    chart,
    logs: recentLogs.map((log) => ({
      id: log.id,
      date: formatLong(log.logged_at),
      weight: Number(log.weight_kg),
    })),
    summary: {
      current,
      target,
      totalLost,
      toGoal,
    },
  };
}

async function logWeight(userId, weightKg) {
  const log = await repository.upsertLog(userId, weightKg);
  await userRepository.updateCurrentWeight(userId, weightKg);
  return log;
}

module.exports = {
  getWeightData,
  logWeight,
};