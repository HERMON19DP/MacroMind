import api from "./axios";

export async function submitBugReport({ title, description, screenshots }) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);

  screenshots.forEach((file) => {
    formData.append("screenshots", file);
  });

  const response = await api.post("/bug-reports", formData);

  return response.data;
}
