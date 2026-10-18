import api from "./axios";

export async function signupUser(data) {
  const response = await api.post("/auth/signup", data);
  return response.data;
}

export async function verifyOtp(data) {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
}

export async function resendOtp(data) {
  const response = await api.post("/auth/resend-otp", data);
  return response.data;
}

export async function loginUser(data) {
  const response = await api.post("/auth/login", data);
  return response.data;
}
