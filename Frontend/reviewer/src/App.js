const BASE_URL = "http://127.0.0.1:5000/";

export const reviewCode = async (code, language, source, filename = null) => {
  const response = await fetch(`${BASE_URL}/api/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, language, source, filename }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
};

export const getReview = async (id) => {
  const response = await fetch(`${BASE_URL}/api/review/${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Review not found.");
  }

  return data;
};

export const getHistory = async () => {
  const response = await fetch(`${BASE_URL}/api/history`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not fetch history.");
  }

  return data;
};