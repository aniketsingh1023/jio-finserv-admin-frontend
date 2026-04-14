export const setToken = (token: string) => {
  localStorage.setItem("adminToken", token);
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
};

export const removeToken = () => {
  localStorage.removeItem("adminToken");
};