import api from "./axios";

export async function getWeightData(range = "month") {
  const response = await api.get(`/weight?range=${range}`);
  return response.data;
}

export async function logWeight(weight) {
  const response = await api.post("/weight", { weight });
  return response.data;
}