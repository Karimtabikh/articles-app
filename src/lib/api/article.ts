const API_ENDPOINT = "http://localhost:3000/articles";

export const create = async (data: { title: string; description: string }) => {
  return fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};
