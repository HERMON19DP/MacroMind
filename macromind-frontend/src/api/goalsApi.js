import api from "./axios";

export async function getGoals() {
  const response = await api.get("/users/goals");
  return response.data;
}

export async function updateGoals(goals) {
  const response = await api.put("/users/goals", goals);
  return response.data;
}