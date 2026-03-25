// In production, API calls go through Vercel rewrites (/api/...) so cookies are first-party.
// In development, they go directly to the backend URL.
const BASE_URL = import.meta.env.VITE_BASE_URL || "/api";

export const PROJECT = {
  CREATE: `${BASE_URL}/projects/create`,
  GET_ALL: `${BASE_URL}/projects/all`,
  GET_PROJECT: (projectId) => `${BASE_URL}/projects/get-project/${projectId}`,
  UPDATE: (projectId) => `${BASE_URL}/projects/update/${projectId}`,
  DELETE: (projectId) => `${BASE_URL}/projects/delete/${projectId}`,
  ADD_USER: `${BASE_URL}/projects/add-user`,
  REMOVE_USER: `${BASE_URL}/projects/remove-user`,
  UPDATE_FILE_TREE: `${BASE_URL}/projects/update-file-tree`,
};

export const AUTH = {
  REGISTER: `${BASE_URL}/user/register`,
  LOGIN: `${BASE_URL}/user/login`,
  LOGOUT: `${BASE_URL}/user/logout`,
  VERIFY_EMAIL: `${BASE_URL}/user/verify-email`,
  FORGOT_PASSWORD: `${BASE_URL}/user/forgot-password`,
  RESET_PASSWORD: `${BASE_URL}/user/reset-password`,
  PROFILE: `${BASE_URL}/user/profile`,
  GOOGLE_LOGIN: `${BASE_URL}/user/google-login`,
  REFRESH: `${BASE_URL}/user/refresh`,
  GET_ALL_USERS: `${BASE_URL}/user/all`,
};
