import { jwtDecode } from "jwt-decode";

export const saveAccessToken = (token) => {
  localStorage.setItem("access_token", token);
};

export const getParsedAccessToken = () => {
  const token = localStorage.getItem("access_token");

  if (!token) return {};
  const parsedToken = jwtDecode(token);
  return {
    username: parsedToken.preferred_username,
    roles: parsedToken.realm_access.roles,
  };
};
