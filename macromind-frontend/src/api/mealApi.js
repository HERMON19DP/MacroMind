import api from "./axios";

export async function getRecentMeals() {
  const response = await api.get("/meals/recent");

  return response.data;
}

export async function analyzeMeal(mealType, text) {
  const response = await api.post("/meals/analyze", {
    mealType,
    text,
  });

  return response.data;
}

export async function deleteMeal(id) {
  const response = await api.delete(`/meals/${id}`);

  return response.data;
}
