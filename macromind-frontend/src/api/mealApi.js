import api from "./axios";

export async function getRecentMeals(date) {
  const response = await api.get("/meals/recent", {
    params: date ? { date } : {},
  });
  return response.data;
}

export async function analyzeMeal(text) {
  const response = await api.post("/meals/analyze", { text });
  return response.data;
}

export async function analyzeMealPhoto(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/meals/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export async function saveMeal({ mealType, mealText, analysis }) {
  const response = await api.post("/meals/save", {
    mealType,
    mealText,
    analysis,
  });
  return response.data;
}

export async function deleteMeal(id) {
  const response = await api.delete(`/meals/${id}`);
  return response.data;
}
