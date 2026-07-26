import api from "./axios";

export async function getGoals() {
  const response = await api.get("/users/goals");
  return response.data;
}