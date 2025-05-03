import { jwtDecode } from "jwt-decode";

export const saveAccessToken = (token) => {
  localStorage.setItem("access_token", token);
};

export const getParsedAccessToken = () => {
  const token = localStorage.getItem("access_token");

  if (!token) return;
  const parsedToken = jwtDecode(token);

  const expirationDate = new Date(parsedToken.exp * 1000);
  if (expirationDate <= new Date()) {
    localStorage.removeItem("access_token");
    return;
  }

  return {
    username: parsedToken.preferred_username,
    roles: parsedToken.realm_access.roles,
    expires_at: expirationDate.toLocaleString(),
  };
};
