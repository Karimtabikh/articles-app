const API_ENDPOINT = "http://localhost:3000/articles";

export const create = async (formData: FormData) => {
  return fetch(API_ENDPOINT, {
    method: "POST",
    headers: {},
    body: formData,
  });
};
