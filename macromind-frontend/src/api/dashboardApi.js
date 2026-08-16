import api from "./axios";

export async function getTodayDashboard(date) {
  const response = await api.get("/dashboard/today", {
    params: date ? { date } : {},
  });
  return response.data;
}

export async function getWeekDashboard() {
  const response = await api.get("/dashboard/week");
  return response.data;
}
