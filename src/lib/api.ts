// lib/api.ts
import Cookies from "js-cookie";

export const apiFetch = (url: string, options: RequestInit = {}) => {
  const token = Cookies.get("auth_token");

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
};