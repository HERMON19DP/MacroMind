import api from "./axios";

export async function loginUser(data) {
  const response = await api.post("/auth/login", data);

  return response.data;
}
