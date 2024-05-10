import type { Article } from "@/types";

const API_ENDPOINT = "http://localhost:3000/articles";

export const create = async (formData: FormData) => {
  return fetch(API_ENDPOINT, {
    method: "POST",
    headers: {},
    body: formData,
  });
};

export const get = async (): Promise<Article[]> => {
  const res = await fetch(`${API_ENDPOINT}`);
  return res.json();
};
