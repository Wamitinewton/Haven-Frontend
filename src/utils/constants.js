export const API_BASE_URL =
  "https://haven-drauhuadfhf9bjby.southafricanorth-01.azurewebsites.net/api";
const BACKEND_HOST =
  "haven-drauhuadfhf9bjby.southafricanorth-01.azurewebsites.net";
const wsProtocol = "wss:";

export const WS_BASE_URL = `${wsProtocol}//${BACKEND_HOST}/ws/chat`;

export const TOKEN_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_EMAIL: "/auth/verify-email",
    REQUEST_PASSWORD_RESET: "/auth/request-password-reset",
    VERIFY_PASSWORD_RESET_OTP: "/auth/verify-password-reset-otp",
    RESET_PASSWORD: "/auth/reset-password",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
    CHANGE_PASSWORD: "/auth/change-password",
    VERIFY_PASSWORD_CHANGE: "/auth/verify-password-change",
    DELETE_ACCOUNT: "/auth/delete-account",
  },
  USER: {
    ME: "/users/me",
    PROFILE: "/users/profile",
    STATISTICS: "/users/statistics",
    AVATARS: "/users/avatars",
  },
  CHAT: {
    START_SESSION: "/chat/sessions",
    GET_SESSIONS: "/chat/sessions",
    GET_SESSION_DETAILS: (sessionId) => `/chat/sessions/${sessionId}`,
    END_SESSION: (sessionId) => `/chat/sessions/${sessionId}/end`,
    RATE_SESSION: (sessionId) => `/chat/sessions/${sessionId}/feedback`,
  },
  INSIGHTS: {
    GET_INSIGHTS: "/insights",
    GENERATE_INSIGHT: "/insights/generate",
    GET_INSIGHT_BY_ID: (id) => `/insights/${id}`,
    MARK_AS_READ: (id) => `/insights/${id}/read`,
    PROVIDE_FEEDBACK: (id) => `/insights/${id}/feedback`,
  },
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  CHAT: "/chat",
  CHAT_SESSION: "/chat/:sessionId",
  INSIGHTS: "/insights",
};
