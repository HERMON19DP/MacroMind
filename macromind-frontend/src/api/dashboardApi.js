import api from "./axios";

export async function getTodayDashboard() {
  const response = await api.get("/dashboard/today");
  return response.data;
}

export async function getWeekDashboard() {
  const response = await api.get("/dashboard/week");
  return response.data;
}